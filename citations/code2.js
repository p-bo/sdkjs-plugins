(function(){
	const SETTINGS = {
		clientId: 5468,
		redirectUrl: 'http://127.0.0.1:8001/sdkjs-plugins/citations/index2.html'
	};
	implicitGrantFlow = MendeleySDK.Auth.implicitGrantFlow(SETTINGS);
})();