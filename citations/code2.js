(function(){
	var token = window.location.hash.split("=")[1];
	var message = {
		MendeleyToken : token
	};
	window.opener.postMessage(JSON.stringify(message),"*");
	window.close();
})();