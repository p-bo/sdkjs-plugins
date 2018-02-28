(function(window, undefined){
	
	window.oncontextmenu = function(e)
	{
		if (e.preventDefault)
			e.preventDefault();
		if (e.stopPropagation)
			e.stopPropagation();
		return false;
	};

	window.Asc.plugin.init = function(_url){
		var _textbox = document.getElementById("textbox_url");
	    _textbox.onkeyup = function(e)
	    {
	        if (e.keyCode == 13) // click on Enter
                document.getElementById("textbox_button").onclick();
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
		
		document.getElementById("textbox_button").onclick = function(e)
		{
		    _url = document.getElementById("textbox_url").value;
			get_data(_url);

			//if request failed
		    if (false)
            {
                document.getElementById("textbox_url").style.borderColor = "#d9534f";
                document.getElementById("input_error_id").style.display = "block";
                return;
            }

		};

		if (_url != "")
		{
			document.getElementById("textbox_url").value = _url;
			document.getElementById("textbox_button").onclick();
		}
		_textbox.focus();
	};

	function get_data(_url){
		_url = encodeURIComponent(_url);
		try{
			$.ajax({
				type: 'GET',
				async: true,
				url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'http%3A%2F%2Freader.elisdn.ru%2F%3Furl%3D"+_url+"'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
				success: function(data){
					//console.log(data);
					change_plugin();
					//parse_data(data.query.results.row);
				},
				error: function(err){
					alert("err data req");
					//handle an error
				}
			});
		} catch(z){console.log(z);}
	};

	function parse_data(data){
		var new_data='',
			count = 1;
			pos = 0,
			tables = {};
		for (let i=0;i<data.length;i++)
			for (let key in data[i])
				new_data += data[i][key];
		while (true) {
			var foundPos_1 = new_data.indexOf("<td class='number'>", 0);
			var foundPos_2 = new_data.indexOf("</td>", foundPos_1);
			if ((foundPos_1 == -1) || (foundPos_2 ==-1)) break;
			data = new_data.substring((foundPos_1),(foundPos_2+5));
			new_data = new_data.replace( new RegExp(data, 'g'),"");
		}
		// document.body.innerHTML = new_data;			//where past
		// new_data = document.body.innerText;
		// document.body.innerHTML ='';
		while (true) {
			var foundPos_1 = new_data.indexOf("<table", pos);
			var foundPos_2 = new_data.indexOf("</table>", foundPos_1);
			if ((foundPos_1 == -1) || (foundPos_2 ==-1)) break;
			pos = 'table_'+ count;
			tables[pos] = new_data.substring((foundPos_1),(foundPos_2+8));
			pos = foundPos_1 + 1;
			count++;
		}
		console.log(tables);
		return tables;
	};

	function change_plugin(){
		
		var combo = document.createElement('combo'),
			div = document.createElement('div');
		combo.id = 'tabla_list';
		combo.className = 'combo';
		div.id = 'data_div';
		div.className = 'data_div';

		//document.getElementById('body').appendChild(combo);
		//document.getElementById('body').appendChild(div);
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
	       // var url = document.getElementById("textbox_url").value;

			//if request failed
            if (true)
            {
                document.getElementById("textbox_url").style.borderColor = "#d9534f";
                document.getElementById("input_error_id").style.display = "block";
                return;
			}
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