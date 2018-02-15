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
		companies ={				//obj companies
			arr_symbols: [],		//array symbols
			arr_names: [],			//array names
			arr_type: [],			//array type
			arr_disp: []			//arry disp
		};	
	window.Asc.plugin.init = function(text){	
		inp_search = document.getElementById("inp_search");
		btn_search = document.getElementById("btn_search");
		inp_search.onblur = function(){
			$('div.data_div').remove();
		};
		
	};
	
	$(document).ready(function(){
		$('#inp_search').keyup(function(){
			if (inp_search.value != ""){
				get_companies(inp_search.value);
			}else{
				$('div.data_div').remove();
			}
		});
	});

	function get_companies(req_text){
		$('div.data_div').remove();
		req_text = decodeURIComponent(req_text.replace(/ /g, '%20')).trim();
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
				create_variants(companies);
			
			},
			error: function(err){
				alert(err);
				//handle an error
			}
		});
	};

	function create_variants(companies)
	{
		$('div.data_div').remove();
		for (var i=companies.arr_names.length-1; i>=0;i--)
		{
			$('<div>', {
				id: 'data_div'+i,
				class: 'data_div',
				on: {
					mousedown: function(event){
						$('div.data_div').remove();
						get_data(this.firstChild.firstChild.innerText);
					},
					mouseover: function(event){
						$(this).addClass('mouseover');
					},
					mouseout: function(event){
						$(this).removeClass('mouseover');
					}
				},
				append:	$('<div>',
						{
							class: 'div_name',
							append:
							$('<label>',
							{
								text: companies.arr_symbols[i],
								id: 'label1' + i,
								class: 'label_search',
								css: {
									fontWeight: "bold",
									color: "#1c7dcc"
								}
							})
							.add($('<label>', 
							{ 
								text: companies.arr_names[i],
								id: 'label2' + i,
								class: 'label_search'
							}))
						})
						.add($('<div>',
						{
							class: 'div_type',
							append:
							$('<label>',
							{
								text: companies.arr_type[i] +' -',
								id: 'label3' + i,
								class: 'label_search'
							})
							.add($('<label>', 
							{ 
								text: ' ' + companies.arr_disp[i],
								id: 'label4' + i,
								class: 'label_search'
							}))
						}))
			})
			.insertAfter('#input_field');
		}
	};
	

	function get_data(req_text){
		req_text = decodeURIComponent(req_text.replace(/ /g, '%20')).trim()
		$.ajax({
			type: 'GET',
			async: true,
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+ req_text +"%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
			success: function(data){
				console.log(data);
				// handle response
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