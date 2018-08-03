(function(window, undefined){

	var url = "";
	var isWindowPlayer = false;
	var player = null;
	
	
	function validateYoutubeUrl(url)
	{
        var p = /^(https?:\/\/rutube.ru\/video\/)/;
		return (url.match(p)) ? true : false;
	};

	function parse_data(data) {
		var temp = '';
		for(i in data.query.results.row) {
			temp += data.query.results.row[i];
		}
		var start = temp.indexOf('//pic');
		var end = temp.indexOf('size=l', start) + 6;
		return temp.slice(start, end);
	};

	window.Asc.plugin.init = function(text)
	{
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
		    var _url = document.getElementById("textbox_url").value.trim();

		    if (!validateYoutubeUrl(_url))
            {
                document.getElementById("textbox_url").style.borderColor = "#d9534f";
                document.getElementById("input_error_id").style.display = "block";
                return;
			}
			var id = _url.slice(_url.indexOf('video/') + 6);
			id = id.slice(0, id.indexOf('/'));

			if (!isWindowPlayer)
			{
				var _table     = document.getElementsByTagName("table")[0];
				var _row       = _table.insertRow(_table.rows.length);
				var video = '<iframe id="rutubeFrame" width="100%" height="100%" src="http://rutube.ru/play/embed/' + id + '?quality=1&platform=someplatform" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowfullscreen></iframe>'
				_row.innerHTML = "<td colspan=\"2\" style=\"background-color:transparent;height:100%;\"><div id=\"content\" style=\"width:100%;height:100%;\">"+video+"</div></td>";
				player = RutubeCore( 'rutubeFrame' );
				content = document.getElementById('content');
				isWindowPlayer = true;

				window.Asc.plugin.resizeWindow(620, 480, 390, 400, 0, 0);
			} else if (player) {
				player.pause();
				player.change(id);
			}
		};

		url = text;
		if (url == "")
		{
			this.resizeWindow(350, 90, 350, 90, 350, 90);
		}
		else
		{
			document.getElementById("textbox_url").value = url;
			document.getElementById("textbox_button").onclick();
		}
		
		_textbox.focus();
	};
	
	window.Asc.plugin.button = function(id)
	{
		try
		{
			if (player && player.pause)
				player.pause();
		}
		catch (err)
		{
		}

		if (id == 0)
		{
	        url = document.getElementById("textbox_url").value.trim();

            if (!validateYoutubeUrl(url))
            {
                document.getElementById("textbox_url").style.borderColor = "#d9534f";
                document.getElementById("input_error_id").style.display = "block";
                return;
            }

			var _id = url.slice(url.indexOf('video/') + 6);
			_id = _id.slice(0, _id.indexOf('/'));
			var _url = 'http://rutube.ru/api/oembed/?url='+ url +'format=json';
			try {
				$.ajax({
					type: 'GET',
					async: false,
					url: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20csv%20where%20url%3D'"+encodeURIComponent(_url)+"'&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys",
					success: function(data){
						_url = 'https:' + parse_data(data);
					},
					error: function(err){
						//handle err
					}
				});
			} catch (err) {}
			

			if (_id)
			{
			    var _info = window.Asc.plugin.info;

                var _method = (_info.objectId === undefined) ? "asc_addOleObject" : "asc_editOleObject";

                _info.width = _info.width ? _info.width : 100;
                _info.height = _info.height ? _info.height : 70;

                // TODO: load image & get size
                _info.widthPix = (_info.mmToPx * _info.width) >> 0;
                _info.heightPix = (_info.mmToPx * _info.height) >> 0;

                _info.imgSrc = _url;
                _info.data = url;

                var _code = "Api." + _method + "(" + JSON.stringify(_info) + ");";
                this.executeCommand("close", _code);
			}
			this.executeCommand("close", _code);
		}
		else
		{
			this.executeCommand("close", "");
		}
	};

	window.Asc.plugin.onEnableMouseEvent = function(isEnabled)
	{
		var _frames = document.getElementsByTagName("iframe");
		if (_frames && _frames[0])
		{
			_frames[0].style.pointerEvents = isEnabled ? "none" : "";
		}
	};
	
})(window, undefined);