(function(){
	/*
		You can reed about authorization https://dev.mendeley.com/reference/topics/authorization_auth_code.html
		Befour using this plugin, you need register your application in https://dev.mendeley.com/myapps.html
		To register, you must specify the following parameters:
			1) Application name
			2) Description
			3) Redirect URL (should point to the address of your page + address, by which index2.html is located in the folder of this plugin)
				For example: https://address_of_your_page/sdkjs-plugins/citations/index2.html
		After registering your application, you will be given an ID, which will need to be specified in the "clientId" field
		These parameters must also be specified in the codes.js file in the auth() function (133 line)
	*/
	// For example, here are my settings for a locally working document server
	const SETTINGS = {
		// The value for application ID you received when registering your application. You can check the ID of your application using the My Applications page in the Mendeley Developer Portal.
		clientId: 7452,
		// The URL value for Redirection URL you set when registering your application. You can check or change the redirection URL of your application using the My Applications page in the Mendeley Developer Portal. Remember to URL encode this value.
		redirectUrl: 'http://127.0.0.1:8001/sdkjs-plugins/citations/index2.html'
	};
	implicitGrantFlow = MendeleySDK.Auth.implicitGrantFlow(SETTINGS);
})();