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
		arrSelected = [],								//array selected items in library
		state;											//current state
		
	window.Asc.plugin.init = function () {
		loadStylesAndLocales('citeproc-js-simple/locales/locales.json', '#select_locale');
		loadStylesAndLocales('citeproc-js-simple/styles/styles.json', '#select_style');
		var ref_but = document.getElementById('refresh_button');
		ref_but.onclick = function() {
			document.getElementById('loader').style.display ='block';
			document.getElementById('loader').style.position = 'absolute';
			GetLibrary();
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
		if (!library) {
			document.getElementById('loader').style.display ='block';
			document.getElementById('loader').style.position = 'absolute';
			GetLibrary();
		}
	};

	function loadStylesAndLocales(dir, elem) {
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
					locale.preferredLocale = data.text;
				} else {
					selectedStyle.name = data.text;
				}
			});
			if (!flagRestore) {
				var val = $(elem + " option:selected").val();
				loadSelected(val);
				if (val.indexOf('.xml') !== -1) {
					locale.preferredLocale = val.substr(0, val.length-4);
				} else {
					selectedStyle.name = val.substr(0, val.length-4);
				}
			} else {
				if (elem == '#select_locale' && locale.preferredLocale) {
					if (locale.preferredLocale !== res[0].text) {
						$(elem).val(locale.preferredLocale + '.xml');
						$(elem).trigger('change');
					}
				} else if (elem == '#select_style' && selectedStyle.name) {
					if (selectedStyle.name !== res[0].text) {
						$(elem).val(selectedStyle.name + '.csl');
						$(elem).trigger('change');
						flagRestore = false;
					}
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

	function GetLibrary () {
		// You can reed about zotero api https://www.zotero.org/support/dev/web_api/v3/basics
		// zotero Api key (users can create API keys via their Zotero account settings) https://www.zotero.org/settings/keys/new
		const Api_key = 'VA4Ter0BUiJBowsAiJd2qSTj';	// My api key for example
		var limit = 100; // The maximum number of results to return with a single request. Required for export formats. (1-100)
		var start = 0;	// The index of the first result. Combine with the limit parameter to select a slice of the available results.
		var userID = "5988850" // Your userID for use in API calls https://www.zotero.org/settings/keys
		var groupID = "459003" // Group id 
		// url for requst user library
		var url = "https://api.zotero.org/users/"+userID+"/items?limit="+limit+"&start="+start+"&format=csljson";
		// if you need to use a public library use a url like this
		// https://api.zotero.org/groups/groupID/items?format=csljson&limit=8&start=0
		var xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Zotero-API-Key', Api_key);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200  && !closed) {
				try
				{
					if (this.response &&this.response != "") {
						GetData(JSON.parse(this.response).items);
					}
				}
				catch (err)
				{}
			} else if (this.readyState == 4 && this.status !== 200) {
				failed(this.response);
			}
		};
		xhr.send(null);
	};

	function GetData(result) {
		if (result && result.length > 0) {
			for (var i = 0; i < result.length; i++) {
				if (result[i].title == "PDF" && result[i].type == "article") {
					result.splice(i,1);
				}
			}
			library = result;
			pasteData();
			document.getElementById('loader').style.display ='none';
		} else if (typeof result === 'object') {
			createCitate(result);
		}
	};

	function failed(error) {
		console.info(error);
		console.info("See NetWork tab.");
		document.getElementById('loader').style.display ='none';
	};

	function pasteData(value) {
		if (JSON.stringify(library) !== '{}') {
			if (value || value === '')
			{
				var found = filter(library, value);
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
									GetData(library[key])
								}
							}
							arrSelected.push(this.innerHTML);
						} else {
							for (key in citations) {
								if (citations[key].title === this.innerText) {
									delete citations[key];
									createPreview(citations);
								}
							}
							var val = this.innerHTML;
							arrSelected = arrSelected.filter(function(item) {
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
		}
		if (flagRestore || arrSelected.length != 0) {
			var tempArr = document.getElementsByClassName('item_list');
			for (key in arrSelected) {
				for (i in tempArr) {
					if (tempArr[i].innerHTML === arrSelected[key]) {
						tempArr[i].classList.toggle('selected');
					}
				}
			}
		}
		myscroll.updateScroll(conteiner);
		myscroll.updateScroll(conteiner);
	};

	function createCitate(citate) {
		citations[citate.id] = citate;
		createPreview(citations);
	};

	function createPreview(citations) {
		new Citeproc(citations, selectedStyle.value, locale.locale, function (citeproc) {
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
			arrSelected: arrSelected,
			bibliography: bibliography
		};
		localStorage.setItem('Citate_State_Zotero_Plugin', JSON.stringify(state));
	};

	function restoreState() {
		state = localStorage.getItem('Citate_State_Zotero_Plugin');
		if (state && state !== {}) {
			state = JSON.parse(localStorage.getItem('Citate_State_Zotero_Plugin'));
			flagRestore = true;
			citations = state.citations;
			library = state.library;
			selectedStyle = state.selectedStyle;
			locale = state.locale;
			arrSelected = state.arrSelected;
			createPreview(citations);
			renderLibrary(library);
		} else {
			state = {};
			arrSelected = [];
			citations = {};
			bibliography = [];
			library = null;
			document.getElementById('link_prew').value = '';
			conteiner_2.innerHTML = '';
			conteiner.innerHTML = '';
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
		if (id == 2) {
			localStorage.removeItem("Citate_State_Zotero_Plugin");
			restoreState();
		} else if (id == 3){
			saveState();
			this.executeCommand("close", "");			
		} else if (id == -1) {
			localStorage.removeItem("Citate_State_Zotero_Plugin");
			restoreState();
			this.executeCommand("close", "");
		} else {
			saveState();
			pasteInDocument(id);
			this.executeCommand("close", "");
		}
	};

	window.Asc.plugin.onTranslate = function()
	{
		var label_prewiev = document.getElementById("label_prewiev");
		if (label_prewiev)
			label_prewiev.innerHTML = window.Asc.plugin.tr("Link prewiev");
		var bibliography_prew = document.getElementById("bibliography_prew");
		if (bibliography_prew)
			bibliography_prew.innerHTML = window.Asc.plugin.tr("Bibliography prewiev");
	};

})(window, undefined);