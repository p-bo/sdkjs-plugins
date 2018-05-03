(function(window, undefined){
	
	var is_init = false,			//init scrollable div flag
		library,					//user library
		conteiner,					//conteiner for library list
		conteiner_2, 				//conteiner for bibliography 
		myscroll,					//custom scroll
		implicitGrantFlow,			//mendeley auth flow
		citations,					//citations 
		style,						//name selected style
		selectedStyle,				//selected style
		locale,						//selected locale
		preferredLocale,			//label locale
		citations = {};				//obj citations;
		
		var test;
	

	window.Asc.plugin.init = function (text) {	
		window.Asc.plugin.loadModule("citeproc-js-simple/test/citations.json", function(content){
			test = JSON.parse(content);
		});
		loadStylesAndLocales('citeproc-js-simple/locales/locales.json', '#select_locale');
		loadStylesAndLocales('citeproc-js-simple/styles/styles.json', '#select_style');
		auth();
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
				if (data.id.indexOf('.xml') == -1) {
					style = data.text.replace('.csl','');;
				} else {
					preferredLocale = data.text.replace('.xml','');;
				}
			});
			var val = $(elem + " option:selected").val();
			loadSelected(val);
			if (val.indexOf('.xml') == -1) {
				style = val.replace('.csl','');
			} else {
				preferredLocale = val.replace('.xml','');
			}
		});
	};

	function loadSelected(file) {
		if (file.indexOf('.xml') == -1) {
			window.Asc.plugin.loadModule('citeproc-js-simple/styles/' + file, function(result){
				selectedStyle = result;
			});
		} else {
			window.Asc.plugin.loadModule('citeproc-js-simple/locales/' + file, function(result){
				locale = result;
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
		MendeleySDK.API.documents.retrieve(`?view=client&sort=created&order=desc&limit=500`).then(sucsess,failed);
	};

	function sucsess(result) {
		// if (result.id) MendeleySDK.API.documents.retrieve(`?view=client&sort=created&order=desc&limit=500`).then(sucsess,failed); 
		//MendeleySDK.API.documents.retrieve(`984e8e01-0fc0-3405-ae36-a17833c9286c?view=all`).then(sucsess,failed);  
		//MendeleySDK.API.documents.retrieve(`?limit=500&uuid=${result.id}`).then(sucsess,failed);
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
								k++;
								break;
							}
						}
					}
				} else if(prop == 'identifiers') {
					for (i in lib[k][prop]) {
						if (lib[k][prop][i].toLowerCase().indexOf(val) != -1) {
							newLib[k] = lib[k];
							k++;
							break;
						}
					}
				} else if ((lib[k][prop]+'').toLowerCase().indexOf(val) != -1) {
					newLib[k] = lib[k];
					k++;
					break;
				}
			}
		}
		return newLib;
	}

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
									MendeleySDK.API.documents.retrieve(library[key].id + `?view=all`).then(sucsess,failed);
								}
							}
						} else {
							for (key in citations) {
								if (citations[key].title === this.innerText) {
									delete citations[key];
								}
							}
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
					// citate.issued['date-parts'][0][0] = '' + item[key];
					continue;
				}
				if (key === 'pages') {
					citate['page'] = item[key];
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
				tmp.push({given: item[key][val]['first_name'] + ' ' + item[key][val]['last_name']});
				}
				citate[key] = tmp;
			}
		}
		citations[citate.id] = citate;
		createPreview(citations);
	};

	function createPreview(citations) {
		var styleDir = 'citeproc-js-simple/styles';

		var cite = new Citeproc(preferredLocale, styleDir, style, citations, selectedStyle, locale, function (citeproc) {
		
			citeproc.updateItems(Object.keys(citations));
			// console.log('citeproc',citeproc);			
			var bibliography = citeproc.makeBibliography();
			// var citate = citeproc.getCitationLabel(test['Item-1']);
			// var result = citeproc.makeCitationCluster([test['Item-1'],test['Item-2'],test['Item-3'],test['Item-4']]);
			// console.log('result',result);			
			// console.log('citate',citate);
			console.log('citations',citations);
			
			console.log('bibliography',bibliography);
			
        });
	}


	function checkInternetExplorer(){
		var rv = -1;
		if (window.navigator.appName == 'Microsoft Internet Explorer') {
			const ua = window.navigator.userAgent;
			const re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		} else if (window.navigator.appName == 'Netscape') {
			const ua = window.navigator.userAgent;
			const re = new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})');

			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		}
		return rv !== -1;
	};

	function cancelEvent(e){
		if (e && e.preventDefault) {
			e.stopPropagation(); // DOM style (return false doesn't always work in FF)
			e.preventDefault();
		}
		else {
			window.event.cancelBubble = true;//IE stopPropagation
		}
	};

	window.Asc.plugin.button = function(id)
	{
		if(id==0)
		{
			alert(this.text)
		}
		if((id==-1) || (id==1))
		{
			this.executeCommand("close", "");
		}
	};

})(window, undefined);