(function(window, undefined){
	
	var is_init = false,								//init scrollable div flag
		library,										//user library
		conteiner,										//conteiner for library list
		conteiner_2, 									//conteiner for bibliography 
		myscroll,										//custom scroll
		selectedStyle = {name: '', value: ''},			//selected style
		locale = {preferredLocale: '', locale: ''},		//selected locale
		citations = {},									//obj citations
		bibliography,									//array bibliography
		flagRestore = false,							//flag for restore state
		state;											//current state
		
	window.Asc.plugin.init = function (text) {	
		loadStylesAndLocales('citeproc-js-simple/locales/locales.json', '#select_locale');
		loadStylesAndLocales('citeproc-js-simple/styles/styles.json', '#select_style');
		var ref_but = document.getElementById('refresh_button');
		ref_but.onclick = function() {
			document.getElementById('loader').style.display ='block';
			document.getElementById('loader').style.position = 'absolute';
			auth();
		};
		var inpSearch = document.getElementById('inp_search');
		inpSearch.oninput = function(e) {
			pasteData(e.target.value);
		};
		if (!is_init) {
			myscroll = window.Asc.ScrollableDiv;
			myscroll.create_div("table_list",{
				maxWidth: "208px",
				minWidth: "208px",
				width: "",
				height: "",
				left: "20px",
				right: "",
				top: "53px",
				bottom: "16px"
			});
			myscroll.create_div("bibliography_prew",{
				maxWidth: "",
				maxWidth: "",
				width: "",
				height: "",
				left: "234px",
				right: "25px",
				top: "115px",
				bottom: "20px",
				border: '1px solid rgba(200, 200, 200, 0.5)'
			});
			myscroll.addEventListener();
			conteiner = document.getElementById('conteiner_id1');
			conteiner_2 = document.getElementById('conteiner_id2');
			is_init = true;
		}
		window.Asc.plugin.resizeWindow(800, 600, 800, 600, 0, 0);				//resize plugin window		
		window.onresize = function() {
			if (!is_init) return;
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner_2);
			myscroll.updateScroll(conteiner_2);
		};
		restoreState();
		auth();
	};

	function loadStylesAndLocales(dir,elem) {
		window.Asc.plugin.loadModule(dir, function(result){
			result = JSON.parse(result);
			var tmp = {},
				res = [];
			for (key in result) {
				tmp['id'] = key;
				tmp['text'] = result[key];
				res.push(JSON.parse(JSON.stringify(tmp)));
			}
			$(elem).select2({
				data: res,				
				// allowClear: true
			}).on('select2:select', function (e) {
				var data = e.params.data;
				loadSelected(data.id);
				if (data.id.indexOf('.xml') !== -1) {
					locale.preferredLocale = data.text.replace('.xml','');
				} else {
					selectedStyle.name = data.text.replace('.csl','');
				}
			});
			if (!flagRestore) {
				var val = $(elem + " option:selected").val();
				loadSelected(val);
				if (val.indexOf('.xml') !== -1) {
					locale.preferredLocale = val.replace('.xml','');
				} else {
					selectedStyle.name = val.replace('.csl','');
				}
			} else {
				if (elem == '#select_locale' && locale.preferredLocale) {
					$(elem).val(locale.preferredLocale + '.xml');
					$(elem).trigger('change');
				} else if (elem == '#select_style' && selectedStyle.name) {
					$(elem).val(selectedStyle.name + '.csl');
					$(elem).trigger('change');
					flagRestore = false;
				}
			}
		});
	};

	function loadSelected(file) {
		if (file.indexOf('.xml') == -1) {
			window.Asc.plugin.loadModule('citeproc-js-simple/styles/' + file, function(result){
				selectedStyle.value = result;
				if(JSON.stringify(citations) !== '{}') {
					createPreview(citations);
				}
			});
		} else {
			window.Asc.plugin.loadModule('citeproc-js-simple/locales/' + file, function(result){
				locale.locale = result;
				if(JSON.stringify(citations) !== '{}') {
					createPreview(citations);
				}
			});
		}
	};

	function auth() {
		const SETTINGS = {
			clientId: 5468,
			redirectUrl: 'http://127.0.0.1:8001/sdkjs-plugins/citates/index.html'
		};
		implicitGrantFlow = MendeleySDK.Auth.implicitGrantFlow(SETTINGS);
		// implicitGrantFlow.authenticate();			//force autentification
		// var token = implicitGrantFlow.getToken();	//get token
		MendeleySDK.API.setAuthFlow(implicitGrantFlow);
		// MendeleySDK.API.profiles.me().then(sucsess,failed);	//get user accaunt info
		if (!flagRestore) {
			MendeleySDK.API.documents.retrieve("?view=client&sort=created&order=desc&limit=500").then(sucsess,failed);
		}
	};

	function sucsess(result) {
		// if (result.id) MendeleySDK.API.documents.retrieve(`?view=client&sort=created&order=desc&limit=500`).then(sucsess,failed); // require user library
		//MendeleySDK.API.documents.retrieve(`984e8e01-0fc0-3405-ae36-a17833c9286c?view=all`).then(sucsess,failed);  	//require iformations about document
		//MendeleySDK.API.documents.retrieve(`?limit=500&uuid=${result.id}`).then(sucsess,failed);	// another metod to require user library
		if (result && result.length > 0) {
			library = result;
			pasteData();
			document.getElementById('loader').style.display ='none';
		} else if (typeof result === 'object') {
			createCitate(result);
		}
	};

	function failed(error) {
		console.error(error);
		document.getElementById('loader').style.display ='none';
	};

	function pasteData(value) {
		if (JSON.stringify(library) !== '{}') {
			if (value || value === '')
			{
				var found = filter(library,value);
				if (JSON.stringify(found) === '{}')
				{
					$('label.item_list').remove();
					$('<label>', {
						class: 'item_list',
						style: 'cursor:default',
						text: 'No results found',
					}).appendTo('#conteiner_id1');
				} else {
					renderLibrary(found);
				}
			} else {
				renderLibrary(library);
			}
		} else {
			$('label.item_list').remove();
			$('<label>', {
				class: 'item_list',
				style: 'cursor:default',
				text: 'Library is empty',
			}).appendTo('#conteiner_id1');
		}
	};

	function filter (lib, val) {
		//maybe to search by the field shown?
		var newLib = {};
		for (k in lib) {
			for (prop in lib[k]) {
				if(prop == 'authors') {
					for (i in lib[k][prop]) {
						for (j in lib[k][prop][i]){
							if (lib[k][prop][i][j].toLowerCase().indexOf(val) != -1) {
								newLib[k] = lib[k];
								k = '' + k++;
								break;
							}
						}
					}
				} else if(prop == 'identifiers') {
					for (i in lib[k][prop]) {
						if (lib[k][prop][i].toLowerCase().indexOf(val) != -1) {
							newLib[k] = lib[k];
							k = '' + k++;
							break;
						}
					}					
				} else if ((lib[k][prop]+'').toLowerCase().indexOf(val) != -1) {
					newLib[k] = lib[k];
					k = '' + k++;
					break;
				}
			}
		}
		return newLib;
	};

	function renderLibrary(data) {
		$('label.item_list').remove();
		conteiner.innerHTML='';
		for (var i in data)
		{
			$('<label>', {
				class: 'item_list',
				text: data[i].title,
				on: {
					click: function(){
						$(this).toggleClass("selected");
						if ($(this).hasClass("selected")) {
							for (key in library) {
								if (this.innerText === library[key].title) {
									MendeleySDK.API.documents.retrieve(library[key].id + "?view=all").then(sucsess,failed);
								}
							}
							state.arrSelected.push(this.innerHTML);
						} else {
							for (key in citations) {
								if (citations[key].title === this.innerText) {
									delete citations[key];
									createPreview(citations);
								}
							}
							var val = this.innerHTML;
							state.arrSelected = state.arrSelected.filter(function(item) {
								return val != item;
							});
						}
					},
					mouseover: function(){
						$(this).addClass('mouseover');
					},
					mouseout: function(){
						$(this).removeClass('mouseover');
					}
				}
			})
			.appendTo('#conteiner_id1');
			if (flagRestore || state.arrSelected) {
				for (key in state.arrSelected) {
					if (document.getElementsByClassName('item_list')[i].innerHTML === state.arrSelected[key]) {
						document.getElementsByClassName('item_list')[i].classList.toggle('selected');
					}
				}
			}
		}
		myscroll.updateScroll(conteiner);
		myscroll.updateScroll(conteiner);
	};

	function createCitate(item) {
		var key = ['authored','confirmed','file_attached','hidden','private_publication','read','starred','created','last_modified','profile_id'];
		for (i = 0; i < key.length; i++) {
			delete item[key[i]];
		}
		var citate = {};
		for (key in item) {
			if (typeof item[key] !== 'object') {
				if (key === 'year') {
					citate.issued = {};
					var tmp = [];
					tmp.push(['' + item[key]]);
					citate.issued['date-parts'] = tmp;
					continue;
				}
				if (key === 'pages') {
					citate['page'] = item[key];
					continue;
				}
				if (key === 'source') {
					citate['container-title'] = item[key];
					continue;
				}
				citate[key] = item[key];
			}
			if (key === 'websites') {
				citate.URL = item[key][0];
			}
			if (key === 'identifiers') {
				for (val in item[key]) {
					citate[val.toUpperCase()] = item[key][val];
				}
			}
			if (key === 'authors') {
				var tmp = [];
				for (val in item[key]) {			
				tmp.push({given: item[key][val]['first_name'], family: item[key][val]['last_name']});
				}
				citate['author'] = tmp;
			}
		}
		citations[citate.id] = citate;
		createPreview(citations);
	};

	function createPreview(citations) {
		new Citeproc(locale.preferredLocale, citations, selectedStyle.value, locale.locale, function (citeproc) {
			citeproc.updateItems(Object.keys(citations));
			var arrayCitations = [];
			for (key in citations)
			{
				arrayCitations.push(citations[key]);
			}
			var cluster = citeproc.makeCitationCluster(arrayCitations);		
			conteiner_2.innerHTML = cluster;
			cluster = $(conteiner_2).text();
			document.getElementById('link_prew').value = cluster.replace(/&#38;/g,'&');	
			if (!flagRestore) {			
				bibliography = citeproc.makeBibliography();
			} else {
				bibliography = state.bibliography;
			}
			for (i in bibliography[1]) {
				conteiner_2.innerHTML = bibliography[1][i];
				if($('.csl-left-margin').length > 0) {
					bibliography[1][i] = $('.csl-left-margin').text().replace(/\n/g,'').trim() + "\t" + $('.csl-right-inline').text().replace(/\n/g,'').trim();
					continue;
				}
				bibliography[1][i] = $(conteiner_2).text().replace(/\n/g,'').trim();
			}			
			$(conteiner_2).addClass('csl-entry');
			conteiner_2.innerHTML = bibliography[1].join('\n');
		});
		myscroll.updateScroll(conteiner_2);
		myscroll.updateScroll(conteiner_2);
	};

	function saveState() {
		bibliography[1] = conteiner_2.innerHTML.split('\n');
		state = {
			citations: citations,
			library: library,
			selectedStyle: selectedStyle,
			locale: locale,
			arrSelected: state.arrSelected,
			bibliography: bibliography
		};
		localStorage.setItem('Citate_State', JSON.stringify(state));
	};

	function restoreState() {
		state = localStorage.getItem('Citate_State');
		if (state && state !== {}) {
			state = JSON.parse(localStorage.getItem('Citate_State'));
			flagRestore = true;
			citations = state.citations;
			library = state.library;
			selectedStyle = state.selectedStyle;
			locale = state.locale;
			createPreview(citations);
			renderLibrary(library);
		} else {
			state = {};
		}
	};

	function pasteInDocument(id) {
		var value;
		if (id == 0) {
			value = document.getElementById('link_prew').value;
			window.Asc.plugin.executeMethod("PasteHtml",[value]);
		} else if (id == 1) {
			value = conteiner_2.innerHTML.replace(/\t/g,"<span style='mso-tab-count:1'></span>").split('\n');
			for (key in value) {
				value[key] = '<p>' + value[key] + '</p>';
			}
			window.Asc.plugin.executeMethod("PasteHtml",[ value.join('')]);
		}
	};

	window.Asc.plugin.button = function(id)
	{
		saveState();
		pasteInDocument(id);
		this.executeCommand("close", "");
	};

})(window, undefined);