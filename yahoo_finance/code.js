(function(window, undefined){
	
	var inp_search,							//elemet input
		btn_search,							//elemet button
		timer,								//timer
		init_info = false,					//flag init information about companies
		select,								//select for parametrs
		label,								//label for information
		button,								//button for paste
		predata,							//previous data request
		//obj companies data
		compani_data ={ask:"N/A",askSize:"N/A",averageDailyVolume3Month:"N/A",beta:"N/A",bid:"N/A",bidSize:"N/A",currencySymbol:"N/A",currency:"N/A",dividendRate:"N/A",dividendYield:"N/A",epsTrailingTwelveMonths:"N/A",exchangeName:"N/A",fiftyTwoWeekHigh:"N/A",fiftyTwoWeekLow:"N/A",marketCap:"N/A",regularMarketChange:"N/A",regularMarketChangePercent:"N/A",regularMarketDayHigh:"N/A",regularMarketDayLow:"N/A",regularMarketOpen:"N/A",regularMarketPreviousClose:"N/A",regularMarketPrice:"N/A",regularMarketTime:"N/A",regularMarketVolume:"N/A",shortName:"N/A",symbol:"N/A",targetMeanPrice:"N/A",trailingPE:"N/A"};
		
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
				$('#res_button').remove();				
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
						data = parse_data(data.query.results.row);
						var pos_1 = data.indexOf('[',0);
						var pos_2 = data.indexOf(']',pos_1);
						data = data.substring(0,pos_1) + data.substring(pos_1,pos_2).replace(/,"/g,'","') + data.substring(pos_2);
						data = JSON.parse(data);
						if (data.items.length>0) {
							create_variants(data.items);
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
		for (var i=companies.length-1; i>=0;i--)
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
								text: companies[i].symbol,
								id: 'label1' + i,
								css: {
									fontWeight: "bold",
									color: "#1c7dcc",
									cursor: "pointer"
								}
							})
							.add($('<label>', 
							{ 
								text: companies[i].name,
								id: 'label2' + i,
								css: {cursor: "pointer"}
							}))
							.add($('<label>', 
							{ 
								text:companies[i].exchDisp,
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
		for (let key in compani_data)
			compani_data[key] = 'N/A';
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
					data = parse_data(data.query.results.row);					
					data = JSON.parse(data);
					if (data.quoteSummary.result.length > 0)
					{
						get_compani_data(data.quoteSummary.result[0]);
					}else{
						create_not_found();
					}
				},
				error: function(err){
					create_not_found();
					//handle an error
				}
			});
		} catch(z){console.log(z);}

		try{
			$.ajax({
				type: 'GET',
				async: false,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv10%2Ffinance%2FquoteSummary%2F"+req_text+"%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26modules%3Dprice%252CsummaryDetail%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				//url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'https%3A%2F%2Fquery2.finance.yahoo.com%2Fv7%2Ffinance%2Fquote%3Fformatted%3Dtrue%26lang%3Den-US%26region%3DUS%26symbols%3"+req_text+"%26fields%3DmessageBoardId%252ClongName%252CshortName%252CmarketCap%252CunderlyingSymbol%252CunderlyingExchangeSymbol%252CheadSymbolAsString%252CregularMarketPrice%252CregularMarketChange%252CregularMarketChangePercent%252CregularMarketVolume%252Cuuid%252CregularMarketOpen%252CfiftyTwoWeekLow%252CfiftyTwoWeekHigh%26corsDomain%3Dfinance.yahoo.com'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					data = parse_data(data.query.results.row);					
					data = JSON.parse(data);
					if (data.quoteSummary.result.length > 0)
					{
						get_compani_data(data.quoteSummary.result[0]);
					}
				},
				error: function(err){
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
					data = parse_data(data.query.results.row);					
					data = JSON.parse(data);
					if (data.quoteResponse.result.length > 0)
					{
						get_compani_data(data.quoteResponse.result[0]);
					}
				},
				error: function(err){
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
					data = parse_data(data.query.results.row);					
					data = JSON.parse(data);
					if (data.quoteSummary.result)
					{
						get_compani_data(data.quoteSummary.result[0]);
					}
				},
				error: function(err){
					//handle an error
				}
			});
		}
		catch(z){console.log(z);}
		compani_data.regularMarketTime = new Date(compani_data.regularMarketTime*1000).toString()
	};

	function parse_data(data){
		var new_data ='';
		for (var key in data)
			if ( data[key].indexOf('":"') == -1)
			{
				new_data += ',"' +data[key];
			}else {
				new_data += ',"' +data[key].replace(/,/g,' ') +'"';
			}
		new_data = new_data.replace(/"{/g,'{');
		new_data = new_data.replace(/"",/g,'",');
		new_data = new_data.replace(/}"/g,'}');
		new_data = new_data.replace(/]"/g,']');
		new_data = new_data.replace(/":","/g,'":"","');	
		new_data = new_data.replace(/,{/,'{"');	
		return new_data;
	};

	function get_compani_data(data){
		for (var i in data)
		{
			for (var key in data[i])
				if(compani_data[key] && (JSON.stringify(data[i][key])!='{}'))
					compani_data[key] = data[i][key]['fmt'] || data[i][key]['raw'] || data[i][key]['longFmt'] || data[i][key];
			
			if((compani_data[i] && (compani_data[i] =='N/A')) && (JSON.stringify(data[i])!='{}'))
				compani_data[i] = data[i];
		}
	};

	function create_preview(data){
		if(!init_info)
			init_information();
		select.innerHTML = "";
		for (var i in data)
			select.innerHTML += ("<option value=\"" + data[i] + "\">" + i + "</option>");
		
		label.innerText = data.ask; 
	};

	function init_information(){
		init_info = true;
		select = document.createElement('select');
		select.id = 'res_select';
		label = document.createElement('label');
		label.id = 'res_label';
		label.className = 'res_label';
		select.onchange = function(){
			label.innerText = this.value;
		};
		button = document.createElement('button');
		button.id = 'res_button';
		button.className = 'btn-text-default';
		button.innerHTML = 'Paste';
		button.onclick = function(){
			window.Asc.plugin.executeMethod("PasteHtml",[$('#res_label').text()]);
		}
		document.getElementById('select').appendChild(select);
		document.getElementById('select').appendChild(button);
		document.getElementById('info').appendChild(label);
	}

	window.Asc.plugin.button = function(id)
	{
		this.executeCommand("close", "");
	};
})(window, undefined);