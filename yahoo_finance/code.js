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
		timer,						//timer
		predata,					//previous data request
		companies ={				//obj companies
			_symbols: [],			//array symbols
			_names: [],				//array names
			_type: [],				//array type
			_disp: []},				//arry disp
		compani_data ={},			//obj companies data
		_data_req =["regularMarketPrice","regularMarketPreviousClose","regularMarketOpen","bid","bidSize","ask","askSize","dayLow","dayHigh","fiftyTwoWeekLow","fiftyTwoWeekHigh","regularMarketVolume","averageVolume","marketCap","payoutRatio","trailingPE","dividendRate"];	
	
		window.Asc.plugin.init = function(text){	
		inp_search = document.getElementById("inp_search");
		btn_search = document.getElementById("btn_search");
		inp_search.onblur = function(){
			//$('div.data_div').remove();
			//$('div.data_name').remove();
		};
		btn_search.onclick = function(){
			$('div.data_div').remove();
			$('div.data_name').remove();
			get_data(inp_search.value);
		}
	};
	
	$(document).ready(function(){
		$('#inp_search').keyup(function(){
			if ((inp_search.value != "") && (predata != inp_search.value)){
				clearTimeout(timer);
				timer = setTimeout(get_companies,200,inp_search.value);
			}else if(inp_search.value == ""){
				$('div.data_div').remove();
				$('div.data_name').remove();
			}
		});
	});

	function get_companies(req_text){
		predata = req_text;
		$('div.data_div').remove();
		$('div.data_name').remove();
		req_text = decodeURIComponent(req_text.replace(/ /g, '%20')).trim();
		$.ajax({
			type: 'GET',
			async: true,
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Ffinance.yahoo.com%2F_finance_doubledown%2Fapi%2Fresource%2Fsearchassist%3BsearchTerm%3D"+ req_text +"%3F'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
			success: function(data){
				if(data.query.results){
					data = JSON.stringify(data.query.results.row);
					data = data.substring(data.indexOf("items"));
					companies._symbols = get_params(data,"\"symbol","\",");
					companies._names = get_params(data,"\"name","\",");
					companies._type = get_params(data,"\"typeDisp","\\\"}");
					companies._disp = get_params(data,"\"exchDisp","\",");
					if (companies._names.length) {
						create_variants(companies);
					}else{
						create_not_found();
					}
				}else{
					create_not_found();
				}	
			
			},
			error: function(err){
				//handle an error
				create_not_found();
			}
		});
	};

	function create_variants(companies)
	{
		$('div.data_div').remove();
		$('div.data_name').remove();
		for (var i=companies._names.length-1; i>=0;i--)
		{
			$('<div>', {
				id: 'data_div'+i,
				class: 'data_div',
				on: {
					mousedown: function(event){
						$('div.data_div').remove();
						$('div.data_name').remove();
						inp_search.value = this.firstChild.firstChild.innerText;
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
								text: companies._symbols[i],
								id: 'label1' + i,
								class: 'label_search',
								css: {
									fontWeight: "bold",
									color: "#1c7dcc"
								}
							})
							.add($('<label>', 
							{ 
								text: companies._names[i],
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
								text: companies._type[i] +' -',
								id: 'label3' + i,
								class: 'label_search'
							})
							.add($('<label>', 
							{ 
								text: ' ' + companies._disp[i],
								id: 'label4' + i,
								class: 'label_search'
							}))
						}))
			})
			.insertAfter('#input_field');
		}
	};
	
	function create_not_found(){
		$('div.data_name').remove();
		$('<div>',{
			class: 'data_name',
			css: {
				paddingTop: '10px'
			},
			append: $('<label>',{
				text: 'Information not found. Please check your details and try again.',
				class: 'not_found'
			})
		}).insertAfter('#input_field');
	}

	function get_data(req_text){
		req_text = decodeURIComponent(req_text.replace(/ /g, '%20')).trim()
		$.ajax({
			type: 'GET',
			async: true,
			url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+ req_text +"%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
			success: function(data){
				//console.log(data);
				data = JSON.stringify(data.query.results.row);
				if(data.indexOf("result\\\":[]") !=-1)
					return;
				data = data.substring(data.indexOf("result")+5);
				for(var i = 0; i<_data_req.length;i++)
					if(data.indexOf(_data_req[i]) !== -1)
						get_compani_data(data,_data_req[i]);
				console.log(compani_data);
			},
			error: function(err){
				alert("err data req");
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

	function get_compani_data(data,par_1){
		var foundPos_1 = data.indexOf(par_1, 0),
			foundPos_2 = data.indexOf(",", foundPos_1);
		var temp = data.substring(foundPos_1,foundPos_2);
		if(temp.indexOf("{}") == -1)
		{
			compani_data[par_1] = data.substring(foundPos_1+par_1.length+12,foundPos_2-1);
		}else{
			compani_data[par_1] = "N/A";
		}
		
	}

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