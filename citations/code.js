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
		state = {},										//current state
		token,											//token mendeley auth
		fSelectItem = false;							//flag click on item in library
		

	function onMessage (e) {
		var message = JSON.parse(e.data);
		if (message.MendeleyToken) {
			token = message.MendeleyToken;
			getData("library");
		}
	};

	window.Asc.plugin.init = function () {
		if (window.attachEvent)
			window.attachEvent('onmessage', onMessage);
		else
			window.addEventListener('message', onMessage, false);
		loadStylesAndLocales('citeproc-js-simple/locales/locales.json', '#select_locale');
		loadStylesAndLocales('citeproc-js-simple/styles/styles.json', '#select_style');
		var ref_but = document.getElementById('refresh_button');
		ref_but.onclick = function() {
			document.getElementById('loader').style.display ='block';
			document.getElementById('loader').style.position = 'absolute';
			getData("library");
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
			myscroll.create_div("bibliography_prev",{
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
		window.Asc.plugin.resizeWindow(800, 600, 800, 600, 0, 0);	//resize plugin window		
		window.onresize = function() {
			if (!is_init) return;
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner_2);
			myscroll.updateScroll(conteiner_2);
		};
		restoreState();
		if (!flagRestore) {
			auth();
		}
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

	function getData(data) {
		if (!token)
			auth();
		var url = (data == "library") ? 'https://api.mendeley.com/documents/?view=client&sort=created&order=desc&limit=500' : 'https://api.mendeley.com/documents/'+data+'?view=all';
		$.ajax({
			method: 'GET',
			beforeSend: function(request) {
				request.setRequestHeader("Authorization", 'Bearer ' + token);
			},
			url: url
		}).success(function (oResponse) {
			sucsess(oResponse)
		}).error(function(e){       
			failed(e);
		});		
	};

	function auth() {
		document.getElementById('loader').style.display ='block';
		document.getElementById('loader').style.position = 'absolute';
		/*
			You can reed about authorization https://dev.mendeley.com/reference/topics/authorization_auth_code.html
			Befour using this plugin, you need register your application in https://dev.mendeley.com/myapps.html
			To register, you must specify the following parameters:
				1) Application name
				2) Description
				3) Redirect URL (should point to the address of your page + address, by which index2.html is located in the folder of this plugin)
					For example: https://address_of_your_page/sdkjs-plugins/citations/index2.html
			After registering your application, you will be given an ID, which will need to be specified in the "clientId" field
		*/
		// For example, here are my settings for a locally working document server
		// The value for application ID you received when registering your application. You can check the ID of your application using the My Applications page in the Mendeley Developer Portal.
		var client_id = 7452;
		// The URL value for Redirection URL you set when registering your application. You can check or change the redirection URL of your application using the My Applications page in the Mendeley Developer Portal. Remember to URL encode this value.
		var redirect_uri = 'http://127.0.0.1:8001/sdkjs-plugins/citations/index2.html';
		// state = Date.now();
		var _url = 'https://api.mendeley.com/oauth/authorize?';
		_url += 'client_id=' + client_id;
		_url +='&redirect_uri=' + encodeURIComponent(redirect_uri);
		_url += '&response_type=token&scope=all'
		// _url += '&state=' + state;

		var dualScreenLeft = (window.screenLeft != undefined) ? window.screenLeft : screen.left;
		var dualScreenTop = (window.screenTop != undefined) ? window.screenTop : screen.top;

		var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
		var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

		var w = 800;
		var h = 600;
		var left = ((width / 2) - (w / 2)) + dualScreenLeft;
		var top = ((height / 2) - (h / 2)) + dualScreenTop;
		var _windowPos = "width=" + w + ",height=" + h + ",left=" + left + ",top=" + top;

		window.open(_url, "_blank", "resizable=yes,status=0,toolbar=0,location=0,menubar=0,directories=0,scrollbars=0," + _windowPos);
	};

	function sucsess(result) {
		if (result && result.length > 0) {
			library = result;
			pasteData();
		} else if (typeof result === 'object') {
			fSelectItem = false;
			createCitate(result);
		}
		document.getElementById('loader').style.display ='none';
	};

	function failed(error) {
		console.info(error.responseJSON);
		document.getElementById('loader').style.display ='none';
		if (fSelectItem) {
			removeLastSelect();
		}
		if (error.status == 401 || error.status == 400) {
			auth();
		}
	};
	
	function removeLastSelect() {
		var id = arrSelected.pop();
		for (var i in library) {
			if (library[i].title === id) {
				id = library[i].id;
				break;
			}
		}
		$("#"+id).removeClass("selected");
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
				id: data[i].id,
				on: {
					click: function(){
						if (token) {
							$(this).toggleClass("selected");
							if ($(this).hasClass("selected")) {
								for (key in library) {
									if (this.innerText === library[key].title) {
										getData(library[key].id);
										fSelectItem = true;
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
						} else {
							auth();
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
			document.getElementById('link_prev').value = cluster.replace(/&#38;/g,'&');	
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
			bibliography: bibliography,
			token: token
		};
		localStorage.setItem('Citate_State', JSON.stringify(state));
	};

	function restoreState() {
		state = JSON.parse(localStorage.getItem('Citate_State'));
		if (state && state !== {}) {
			flagRestore = true;
			citations = state.citations;
			library = state.library;
			selectedStyle = state.selectedStyle;
			locale = state.locale;
			arrSelected = state.arrSelected;
			token = state.token;
			createPreview(citations);
			renderLibrary(library);
		} else {
			state = {};
			library = {};
			arrSelected = [];
			citations = {};
			bibliography = [];
			token = '';
			document.getElementById('link_prev').value = '';
			conteiner_2.innerHTML = '';
			conteiner.innerHTML = '';
		}
	};

	function pasteInDocument(id) {
		var value;
		if (id == 0) {
			value = document.getElementById('link_prev').value;
			window.Asc.plugin.executeMethod("PasteText",[value]);
		} else if (id == 1) {
			value = conteiner_2.innerHTML.replace(/\t/g,"<span style='mso-tab-count:1'></span>").split('\n');
			for (key in value) {
				value[key] = '<p>' + value[key] + '</p>';
			}
			window.Asc.plugin.executeMethod("PasteHtml",[ value.join('')]);
		}
	};

	window.Asc.plugin.button = function(id) {
		if (id == 0 || id == 1) {
			saveState();
			pasteInDocument(id);
			this.executeCommand("close", "");
		} else if (id == 2) {
			localStorage.removeItem("Citate_State");
			restoreState();
			flagRestore = false;
			auth();
		} else {
			saveState();
			this.executeCommand("close", "");
		}
	};

	window.Asc.plugin.onTranslate = function() {
		var label_preview = document.getElementById("label_preview");
		if (label_preview)
			label_preview.innerHTML = window.Asc.plugin.tr("Link preview");
		var bibliography_prev = document.getElementById("bibliography_prev");
		if (bibliography_prev)
			bibliography_prev.innerHTML = window.Asc.plugin.tr("Bibliography preview");
	};

})(window, undefined);