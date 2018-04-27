(function(window, undefined){
	
	var is_init = false;	//init scrollable div flag
	
	
		var implicitGrantFlow;
	var citations, load_style, locales;
	

	window.Asc.plugin.init = function (text) {	
		var ref_but = document.getElementById('refresh_button');
		ref_but.onclick = function() {
			auth();
		}
		
		
		
		// window.Asc.plugin.loadModule("citeproc-js-simple/test/citations.json", function(content){
		// 	citations = JSON.parse(content);
		// });
		// window.Asc.plugin.loadModule('citeproc-js-simple/styles/biotechniques.csl', function(content){
		// 	load_style = content;
		// });
		// window.Asc.plugin.loadModule('citeproc-js-simple/locales/locales-ru-RU.xml', function(content){
        //     locales = content;
        // });
		
		window.Asc.plugin.resizeWindow(800, 600, 800, 600, 0, 0);				//resize plugin window		
		window.onresize = function(){
			if(!is_init)
				return;
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner_2);
			myscroll.updateScroll(conteiner_2);
		};
	};

	function auth() {
		const SETTINGS = {
			clientId : 5468,
			redirectUrl : 'http://127.0.0.1:8001/sdkjs-plugins/mendeley/index.html'
		};
		implicitGrantFlow = MendeleySDK.Auth.implicitGrantFlow(SETTINGS);
		// implicitGrantFlow.authenticate();
		var token = implicitGrantFlow.getToken();
		MendeleySDK.API.setAuthFlow(implicitGrantFlow);
		MendeleySDK.API.profiles.me().then(sucsess,failed);
		
		
		// var api = MendeleySDK.API;
		// console.log(api.profiles.me());

		// console.log('next',implicitGrantFlow.getToken());
		// var authCodeFlow = MendeleySDK.Auth.authCodeFlow();
		// MendeleySDK.API.setAuthFlow(implicitGrantFlow);
		// authenticatedFlow = MendeleySDK.Auth.authenticatedFlow(implicitGrantFlow.getToken());
		// console.log(MendeleySDK.API.profiles.me());

		// MendeleySDK.API.setAuthFlow(authenticatedFlow);
		// console.log(MendeleySDK.API.profiles.me().then(res,err));
		// console.log(MendeleySDK.API.documents.retrieve('?uuid=b85a9e62-6194-306d-a6a5-6f04ba8913d8').then(res,err));
	};
	

	function next() {

		var styleDir = 'citeproc-js-simple/styles'
        var style  = 'ieee.csl';
		var preferredLocale = 'ru-RU';

		var cite = new Citeproc(preferredLocale, styleDir, style, citations, load_style, locales, function (citeproc) {
		
			citeproc.updateItems(Object.keys(citations));
			console.log('citeproc',citeproc);			
			var bibliography = citeproc.makeBibliography();
			// var citate = citeproc.getCitationLabel(citations['Item-1']);
			var result = citeproc.makeCitationCluster([citations['Item-1'],citations['Item-2'],citations['Item-3'],citations['Item-4']]);
			console.log('result',result);			
			// console.log('citate',citate);
			console.log('bibliography',bibliography);
			
        });
		
		// console.log('next',implicitGrantFlow.getToken());
		// // var authCodeFlow = MendeleySDK.Auth.authCodeFlow();
		// MendeleySDK.API.setAuthFlow(implicitGrantFlow);
		// authenticatedFlow = MendeleySDK.Auth.authenticatedFlow(implicitGrantFlow.getToken());
		// // console.log(MendeleySDK.API.profiles.me());

		// // MendeleySDK.API.setAuthFlow(authenticatedFlow);
		// // console.log(MendeleySDK.API.profiles.me().then(res,err));
		// console.log(MendeleySDK.API.documents.retrieve('?uuid=b85a9e62-6194-306d-a6a5-6f04ba8913d8').then(res,err));
		
	};
	function sucsess(result) {
		if (result.id) MendeleySDK.API.documents.retrieve(`?uuid=${result.id}`).then(sucsess,failed);
		if (result && result.lenght > 0) createLibrary(result);
	};
	function failed(error) {
		//to do
	};
	
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

	// if(!is_init){
	// 	myscroll = window.Asc.ScrollableDiv;
	// 	myscroll.create_div("div_in_td",{
	// 				width: "",
	// 				height: "",
	// 				left: "131px",
	// 				right: "20px",
	// 				top: "73px",
	// 				bottom: "16px"
	// 	});
	// 	myscroll.addEventListener();

	// 	myscroll.create_div("table_list",{
	// 		width: "",
	// 		height: "",
	// 		left: "20px",
	// 		right: "",
	// 		top: "73px",
	// 		bottom: "16px"
	// 	});
	// 	is_init = true;
	// }

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