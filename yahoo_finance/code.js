(function(window, undefined){
	
	window.oncontextmenu = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	};
	
	var inp_search,							//elemet input
		btn_search,							//elemet button
		timer,								//timer
		init_info = false,					//flag init information about companies
		select,								//select for parametrs
		label,								//label for information
		predata,							//previous data request
		companies ={						//obj companies
			_symbols: [],					//array symbols
			_names: [],						//array names
			_type: [],						//array type
			_disp: []},						//arry disp
		//obj companies data
		compani_data ={regularMarketPrice:"N/A",targetMeanPrice:"N/A",epsTrailingTwelveMonths:"N/A",regularMarketChangePercent:"N/A",regularMarketPreviousClose:"N/A",regularMarketOpen:"N/A",bid:"N/A",bidSize:"N/A",ask:"N/A",askSize:"N/A",regularMarketDayLow:"N/A",regularMarketDayHigh:"N/A",fiftyTwoWeekLow:"N/A",fiftyTwoWeekHigh:"N/A",regularMarketVolume:"N/A",averageDailyVolume3Month:"N/A",marketCap:"N/A",beta:"N/A",trailingPE:"N/A",dividendRate:"N/A",dividendYield:"N/A"},
		_data_req =["regularMarketTime\\\":","currency\\\":\\\"","currencySymbol\\\":\\\"","symbol\\\":\\\"","shortName\\\":\\\"","exchangeName\\\":\\\"","regularMarketChange","epsTrailingTwelveMonths","targetMeanPrice"];
	
		window.Asc.plugin.init = function(text){	
			inp_search = document.getElementById("inp_search");
			btn_search = document.getElementById("btn_search");
			inp_search.onblur = function(){
				$('div.data_div').remove();
				$('div.data_name').remove();
			};
			btn_search.onclick = function(){
				$('div.data_div').remove();
				$('div.data_name').remove();
				get_data(inp_search.value);
				create_preview(compani_data);
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
				$('#res_select').remove();
				$('#res_label').remove();
				init_info = false;
			}
		});
	});

	function get_companies(req_text){
		predata = req_text;
		$('div.data_div').remove();
		$('div.data_name').remove();
		var pos = req_text.indexOf("^");
		if (pos!= -1)
			req_text = req_text.substring(0,pos) + "%255E" + req_text.substring(pos+1); 
		try{
			$.ajax({
				type: 'GET',
				async: true,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Ffinance.yahoo.com%2F_finance_doubledown%2Fapi%2Fresource%2Fsearchassist%3BsearchTerm%3D"+req_text+"%3F'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
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
		}
		catch(z){console.log(z);}
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
						create_preview(compani_data);
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
								css: {
									fontWeight: "bold",
									color: "#1c7dcc",
									cursor: "pointer"
								}
							})
							.add($('<label>', 
							{ 
								text: companies._names[i],
								id: 'label2' + i,
								css: {cursor: "pointer"}
							}))
							.add($('<label>', 
							{ 
								text:companies._disp[i],
								id: 'label3' + i,
								css: {
									fontWeight: "bold",
									cursor: "pointer"
								}
							}))
						})
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
	};

	function get_data(req_text){
		var pos = req_text.indexOf("^");
		if (pos != -1)
			req_text = req_text.substring(0,pos) + "%255E" + req_text.substring(pos+1); 
		try{
			$.ajax({
				type: 'GET',
				async: false,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+req_text+"%3Flang%3Den-US%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				//url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+req_text+"%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					//console.log(data);
					data = JSON.stringify(data.query.results.row);
					if(data.indexOf("result\\\":[]") !=-1)
						return;
					data = data.substring(data.indexOf("result")+5);
					for (var i in compani_data)
						if(data.indexOf(i) !== -1)
							get_compani_data(data,i,1);
					for(var i = 0; i<6;i++)
						if(data.indexOf(_data_req[i]) !== -1)
						{
							get_compani_data(data,_data_req[i],2);
						}else {
							compani_data[_data_req[i]] = "N/A";
						}
					get_compani_data(data,_data_req[6],3);
					//console.log(compani_data);
				},
				error: function(err){
					alert("err data req");
					//handle an error
				}
			});
		} catch(z){console.log(z);}

		try{
			$.ajax({
				type: 'GET',
				async: false,
				//url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+req_text+"%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv7%2Ffinance%2Fquote%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26symbols%3"+req_text+"%26fields%3DmessageBoardId%252ClongName%252CshortName%252CmarketCap%252CunderlyingSymbol%252CunderlyingExchangeSymbol%252CheadSymbolAsString%252CregularMarketPrice%252CregularMarketChange%252CregularMarketChangePercent%252CregularMarketVolume%252Cuuid%252CregularMarketOpen%252CfiftyTwoWeekLow%252CfiftyTwoWeekHigh%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					data = JSON.stringify(data.query.results.row);
					if(data.indexOf("result\\\":[]") !=-1)
						return;
					data = data.substring(data.indexOf("result")+5);
					for (var i in compani_data)
						if(data.indexOf(i) !== -1)
							get_compani_data(data,i,1);
					console.log(compani_data);
				},
				error: function(err){
					create_not_found();
					//alert("err data req");
					//handle an error
				}
			});
		}
		catch(z){console.log(z);}

		try{
			$.ajax({
				type: 'GET',
				async: false,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery1.finance.yahoo.com%2Fv7%2Ffinance%2Fquote%3Fsymbols%3D"+req_text+"'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					data = JSON.stringify(data.query.results.row);
					if(data.indexOf("result\\\":[]") !=-1)
						return;
					data = data.substring(data.indexOf("result")+5);
					if(data.indexOf(_data_req[7]) !== -1)
						get_compani_data(data,_data_req[7],4);
					//console.log(compani_data);
				},
				error: function(err){
					create_not_found();
					//alert("err data req");
					//handle an error
				}
			});
		}catch(z){console.log(z);}

		try{
			$.ajax({
				type: 'GET',
				async: false,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+req_text+"%3Fmodules%3DsummaryProfile%252CfinancialData%252CrecommendationTrend%252CupgradeDowngradeHistory%252Cearnings%252CdefaultKeyStatistics%252CcalendarEvents%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					data = JSON.stringify(data.query.results.row);
					if(data.indexOf("result\\\":null,") !=-1)
						return;
					data = data.substring(data.indexOf("result")+5);
					if(data.indexOf(_data_req[8]) !== -1)
						get_compani_data(data,_data_req[8],5);
					console.log(compani_data);
				},
				error: function(err){
					create_not_found();
					//alert("err data req");
					//handle an error
				}
			});
		}
		catch(z){console.log(z);}
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

	function get_compani_data(data,par_1,flag){
		var temp,
			foundPos_1 = data.indexOf(par_1, 0),
			foundPos_2 = data.indexOf(",", foundPos_1);
			temp = data.substring(foundPos_1,foundPos_2);
		switch(flag){
			case 1:
				if(temp.indexOf("{}") == -1)
					compani_data[par_1] = data.substring(foundPos_1+par_1.length+12,foundPos_2-1);
			break;
			case 2:
				temp = data.substring(foundPos_1-3,foundPos_2);
				if(temp.indexOf("\":0") == -1)
				{
					compani_data[par_1] = data.substring(foundPos_1+par_1.length,foundPos_2-1);
					if(par_1 == "regularMarketTime\\\":")
						compani_data[par_1] = new Date(+compani_data[par_1]*1000).toString();
				}else{compani_data[par_1] = "N/A";}
			break;
			case 3:
				foundPos_1 = data.indexOf(par_1, foundPos_1+1);
				foundPos_2 = data.indexOf(",", foundPos_1);
				temp = data.substring(foundPos_1,foundPos_2);
				if(temp.indexOf("{}") == -1)
				{
					compani_data[par_1] = data.substring(foundPos_1+par_1.length+12,foundPos_2-1);
				}else{compani_data[par_1] = "N/A";}
			break;
			case 4:
				if(temp.indexOf(":0,") == -1)
				{
					compani_data[par_1] = data.substring(foundPos_1+par_1.length+3,foundPos_2-1);
				}else{compani_data[par_1]="N/A";}
			break;
			case 5:
				if(temp.indexOf("{}") == -1)
				{
					compani_data[par_1] = data.substring(foundPos_1+par_1.length+12,foundPos_2-1);
				}else{compani_data[par_1]="N/A";}
			break;
		}
	};

	function create_preview(data){
		if(!init_info)
			init_information();
		select.innerHTML = "";
		for (var i in data)
		{	
			select.innerHTML += ("<option value=\"" + data[i] + "\">" + i.replace(/\\\"/g,"").replace(/:/,"") + "</option>");
		}
		
		label.innerText = data.regularMarketPrice; 
	};

	function init_information(){
		init_info = true;
		select = document.createElement('select');
		select.id = "res_select";
		label = document.createElement('label');
		label.id = "res_label";
		label.className = "res_label";
		select.onchange = function(){
			label.innerText = this.value;
		};
		document.getElementById('info').appendChild(select);
		document.getElementById('info').appendChild(label);
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