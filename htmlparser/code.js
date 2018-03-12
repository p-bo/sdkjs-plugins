(function(window, undefined){
	window.oncontextmenu = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	};

	var is_init = false;			//flag init scrollable div
	var tag_arr =['<table','<caption','<thead','<tbody','<tr','<th','<td'];	//array html tags for remove trash
	var conteiner, conteiner_2, myscroll;

	function validateUrl(url)
	{
		var p = /^(?:http:\/\/|https:\/\/)/;
		return (url.match(p)) ? true : false;
	};

	window.Asc.plugin.init = function(_url){
		window.Asc.plugin.resizeWindow(800, 600, 800, 600, 0, 0);				//resize plugin window	
		var _textbox = document.getElementById("textbox_url");
	   
		_textbox.onkeyup = function(e)
	    {
	        if (e.keyCode == 13) // click on Enter
                document.getElementById("ok_button").onclick();
	    };

		document.getElementById('refresh_button').onclick = function(){
			var _url = $('#conteiner_id1 table:first-child').attr('data-url');
			if (_url)
			{
				_textbox.value = _url.replace('http://reader.elisdn.ru/?url=','');
				_textbox.style.borderColor = "";
            	document.getElementById("input_error_id").style.display = "none";
				get_data(_url);
			}
		};

		// clear validation on input/paste
        _textbox.oninput = _textbox.onpaste = function(e)
        {
            this.style.borderColor = "";
            document.getElementById("input_error_id").style.display = "none";
        };
        // ie
        _textbox.addEventListener("paste", function(e)
        {
            this.style.borderColor = "";
            document.getElementById("input_error_id").style.display = "none";
		});
		
		document.getElementById("ok_button").onclick = function(e)
		{
			_textbox.style.borderColor = "";
            document.getElementById("input_error_id").style.display = "none";
			var _url = 'http://reader.elisdn.ru/?url='
			_url += document.getElementById("textbox_url").value;
			if (validateUrl(_url.replace('http://reader.elisdn.ru/?url=','')))
			{
				get_data(_url);
			}else{
				create_error();
				data = {
					Error: "Invalid URL."
				};	
				paste_dada(data);
				return;
			}
				
		};

		if (_url != "")
		{
			if (validateUrl(_url))
			{
				document.getElementById("textbox_url").value = _url;
				get_data("http://reader.elisdn.ru/?url="+_url);
			}else{
				document.getElementById("textbox_url").value = _url;
				create_error();
				data = {
					Error: "Invalid URL."
				};	
				paste_dada(data);
				return;
			}
			
		}
		_textbox.focus();	
		
		window.onresize = function(){
			if(!is_init)
				return;
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner);
			myscroll.updateScroll(conteiner_2);
			myscroll.updateScroll(conteiner_2);
		};
	};
	
	function get_data(_url){
		document.getElementById('loader').style.display ='block';
		document.getElementById('loader').style.position = 'absolute';
		try{
			$.ajax({
				type: 'GET',
				async: true,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'"+encodeURIComponent(_url)+"'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					if (data.query.results == null)
					{
						if(_url.indexOf('http://reader.elisdn.ru/?url=',0) != -1)
						{
							get_data(_url.substr(29));
							return;
						}

						create_error();
						data = {
							Error: "On this page no table was found or the page could not be opened.\nPlease check URL and try again."
						};
						paste_dada(data);
						document.getElementById('loader').style.display ='none';
						return;
					}
					if (JSON.stringify(data.query.results.row).indexOf('За 5 секунд HTTP-ответ от сервера не получен.') != -1)
					{
						create_error();
						data = {
							Error: "In 5 seconds the HTTP response from the server was not received.\nThe site may be temporarily overloaded or the address entered incorrectly."
						};	
						paste_dada(data);
						document.getElementById('loader').style.display ='none';
						return;
					}
					data = parse_data(data.query.results.row,_url);
					if (JSON.stringify(data) == "{}")
					{
						create_error();
						data = {
							Error: "On this page no table was found"
						};
						//return;
					}
					paste_dada(data);
					document.getElementById('loader').style.display ='none';
				},
				error: function(err){
					create_error();
					data = {
						Error: "Request is faile. Check your internet connection."
					};	
					paste_dada(data);
					document.getElementById('loader').style.display ='none';
				}
			});
		} catch(z){console.log(z);}
	};

	function parse_data(data,_url){
		var new_data='',
			count = 1;
			pos = 0,
			tables = {};
		for (let i=0;i<data.length;i++)
			for (let key in data[i])
				if (key != 'col0')
				{
					new_data += ',' +data[i][key];
				}else{
					new_data += data[i][key];
				}
		while (true) {
			var foundPos_1 = new_data.indexOf("<td class='number'>", 0);
			var foundPos_2 = new_data.indexOf("</td>", foundPos_1);
			if ((foundPos_1 == -1) || (foundPos_2 ==-1)) break;
			data = new_data.substring((foundPos_1),(foundPos_2+5));
			new_data = new_data.replace( new RegExp(data, 'g'),"");
		}
		document.getElementById('div_in_td').innerHTML = new_data;			
		new_data = document.getElementById('div_in_td').innerText;
		document.getElementById('div_in_td').innerHTML ='';
		while (true) {
			var foundPos_1 = new_data.indexOf("<table", pos);
			var foundPos_2 = new_data.indexOf("</table>", foundPos_1);
			if ((foundPos_1 == -1) || (foundPos_2 ==-1)) break;
			pos = 'table_'+ count;
			tables[pos] = new_data.substring((foundPos_1),(foundPos_2+8));
			pos = foundPos_1 + 1;
			count++;
		}
		tables = remove_trash(tables,_url);
		return tables;
	};

	function paste_dada(data){
		if(!is_init){
			myscroll = window.Asc.ScrollableDiv;
			myscroll.create_div("div_in_td",{
						width: "",
						height: "",
						left: "131px",
						right: "20px",
						top: "73px",
						bottom: "16px"
			});
			myscroll.addEventListener();

			myscroll.create_div("table_list",{
				width: "",
				height: "",
				left: "20px",
				right: "",
				top: "73px",
				bottom: "16px"
			});
			is_init = true;
		}
		conteiner = document.getElementById('conteiner_id1');
		conteiner_2  = document.getElementById('conteiner_id2');
		$('label.table_list').remove();
		conteiner.innerHTML='';
		for (var i in data)
		{
			$('<label>', {
				class: 'table_list',
				text: i,
				on: {
					click: function(event){
						//if click
						$('label').removeClass('selected');
						$('#conteiner_id1').html(data[this.innerText]);
						$(this).addClass('selected');
						myscroll.updateScroll(conteiner);
						myscroll.updateScroll(conteiner);
					},
					mouseover: function(event){
						$(this).addClass('mouseover');
					},
					mouseout: function(event){
						$(this).removeClass('mouseover');
					}
				}
			})
			.appendTo('#conteiner_id2');
		}
		myscroll.updateScroll(conteiner_2);
		myscroll.updateScroll(conteiner_2);
		$('#conteiner_id1').html(data[$('#conteiner_id2 label:first-child').text()]);
		myscroll.updateScroll(conteiner);
		myscroll.updateScroll(conteiner);
		$('#conteiner_id2 label:first-child').addClass('selected');
	};

	function remove_trash(tables,_url){
		for (let i in tables)
		{	var pos_o = 0, count = 0;
			var par_1 = '<td>',
				par_2 = '</td>';
			for (let j=0;j<tag_arr.length;j++)
			{
				var pos = 0;
				if ( (j == 5) && (tables[i].indexOf('<thead', pos) != -1 ) )
					pos = tables[i].indexOf('<thead', pos) + 6;
				while (true) {
					var foundPos_1 = tables[i].indexOf(tag_arr[j], pos);
					var foundPos_2 = tables[i].indexOf(">", foundPos_1);
					if ((foundPos_1 == -1) || (foundPos_2 ==-1)) break;
					let start = tables[i].substring(0,foundPos_1+tag_arr[j].length);
					tables[i] = start + tables[i].substring(foundPos_2);
					pos = ++foundPos_1;
				}
			}
			tables[i] = '<table data-url="' + _url + "\"" + tables[i].substr(6);
			while (count<2) {
				var foundPos_1 = tables[i].indexOf(par_1, pos_o);
				var foundPos_2 = tables[i].indexOf(par_2, foundPos_1);
				if ((foundPos_1 == -1) || (foundPos_2 ==-1))
				{
					 count++;
					 par_1 = '<th>';
					 par_2 = '</th>';
					 pos_o = 0;
					 continue;
				}
				document.getElementById('div_in_td').innerHTML = tables[i].substring(foundPos_1,foundPos_2);			
				let temp = document.getElementById('div_in_td').innerText;
				document.getElementById('div_in_td').innerHTML ='';
				let start = tables[i].substring(0,foundPos_1+4);
				tables[i] = start + temp + tables[i].substring(foundPos_2);
				pos_o = ++foundPos_1;
			}
		}
		return tables;
	};

	function paste_in_document(){
		var data = $('#conteiner_id1').html();
		data = data.replace(/<thead>/g,'<tbody>');
		data = data.replace(/<\/thead>/g,'</tbody>');
		window.Asc.plugin.executeMethod("PasteHtml", [data]);
	};

	function create_error(){
		document.getElementById("textbox_url").style.borderColor = "#d9534f";
		document.getElementById("input_error_id").style.display = "block";
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
		if (id == 0)
		{
		   paste_in_document();
		   //window.Asc.plugin.executeMethod("PasteHtml", ["<table><tr><td><a href=\"https://finance.yahoo.com/quote/AAPL?p=AAPL\";\">1</a></td></tr></table>"]);
		   this.executeCommand("close", "");
		}
		else
		{
			this.executeCommand("close", "");
		}
	};

	window.Asc.plugin.onExternalMouseUp = function()
	{
		var evt = document.createEvent("MouseEvents");
		evt.initMouseEvent("mouseup", true, true, window, 1, 0, 0, 0, 0,
			false, false, false, false, 0, null);
		document.dispatchEvent(evt);
	};

})(window, undefined);