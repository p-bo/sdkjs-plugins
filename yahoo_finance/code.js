(function(window, undefined){
	
	window.oncontextmenu = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	};
	
	var inp_search,					//elemet input
		btn_search,					//elemet button
		pre_data,					//pre data for request
		companies ={				//obj companies
			arr_symbols: [],		//array symbols
			arr_names: [],			//array names
			arr_type: [],			//array type
			arr_disp: []			//arry disp
		};	
	window.Asc.plugin.init = function(text){	
		inp_search = document.getElementById("inp_search");
		btn_search = document.getElementById("btn_search");
		// inp_search.onkeyup = function(){
		// 	get_data(inp_search.innerText);
		// }
	};
	
	$(document).ready(function(){
		$('#inp_search').keyup(function(){
			if ((pre_data != inp_search.value) && (inp_search.value != ""))
				get_companies(inp_search.value);
		});
	});
	
	function get_companies(req_text){
		pre_data = req_text;
		req_text = decodeURIComponent(req_text.replace(/ /g, '%20')).trim()
		$.ajax({
			type: 'GET',
			async: true,
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Ffinance.yahoo.com%2F_finance_doubledown%2Fapi%2Fresource%2Fsearchassist%3BsearchTerm%3D"+ req_text +"%3F'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
			success: function(data){
				data = JSON.stringify(data.query.results.row);
				data = data.substring(data.indexOf("items"));
				companies.arr_symbols = get_params(data,"\"symbol","\",");
				companies.arr_names = get_params(data,"\"name","\",");
				companies.arr_type = get_params(data,"\"typeDisp","\\\"}");
				companies.arr_disp = get_params(data,"\"exchDisp","\",");
				console.log(companies);
			},
			error: function(err){
				alert(err);
				//handle an error
			}
		});
	};

	function get_params(data,par_1,par_2){
		var pos = 0;
		var arr = [];
		while (true) {
			var foundPos_1 = data.indexOf(par_1, pos);
			var foundPos_2 = data.indexOf(par_2, foundPos_1);
			if (foundPos_1 == -1) break;
			let temp = data.substring((foundPos_1+par_1.length+5),(foundPos_2));
			arr.push(temp);
			pos = foundPos_1 + 1;
		}
		return arr;
	};


	window.Asc.plugin.button = function(id)
	{
		this.executeCommand("close", "");
	};
	
	window.onresize = function() {
		//to do
	};

	window.Asc.plugin.onExternalMouseUp = function()
	{
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0,
			false, false, false, false, 0, null);
		document.dispatchEvent(evt);
	};

})(window, undefined);