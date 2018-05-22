(function(window, undefined){

	window.Asc.plugin.init = function () {
		// If you modify this array, also update default language / dialect below.
		var langs =
		[['Afrikaans',      ['af-ZA']],
		['አማርኛ',        	['am-ET']],
		['Azərbaycanca',    ['az-AZ']],
		['বাংলা',            ['bn-BD', 'বাংলাদেশ'],
							['bn-IN', 'ভারত']],
		['Bahasa Indonesia',['id-ID']],
		['Bahasa Melayu',   ['ms-MY']],
		['Català',          ['ca-ES']],
		['Čeština',         ['cs-CZ']],
		['Dansk',           ['da-DK']],
		['Deutsch',         ['de-DE']],
		['English',         ['en-AU', 'Australia'],
							['en-CA', 'Canada'],
							['en-IN', 'India'],
							['en-KE', 'Kenya'],
							['en-TZ', 'Tanzania'],
							['en-GH', 'Ghana'],
							['en-NZ', 'New Zealand'],
							['en-NG', 'Nigeria'],
							['en-ZA', 'South Africa'],
							['en-PH', 'Philippines'],
							['en-GB', 'United Kingdom'],
							['en-US', 'United States']],
		['Español',         ['es-AR', 'Argentina'],
							['es-BO', 'Bolivia'],
							['es-CL', 'Chile'],
							['es-CO', 'Colombia'],
							['es-CR', 'Costa Rica'],
							['es-EC', 'Ecuador'],
							['es-SV', 'El Salvador'],
							['es-ES', 'España'],
							['es-US', 'Estados Unidos'],
							['es-GT', 'Guatemala'],
							['es-HN', 'Honduras'],
							['es-MX', 'México'],
							['es-NI', 'Nicaragua'],
							['es-PA', 'Panamá'],
							['es-PY', 'Paraguay'],
							['es-PE', 'Perú'],
							['es-PR', 'Puerto Rico'],
							['es-DO', 'República Dominicana'],
							['es-UY', 'Uruguay'],
							['es-VE', 'Venezuela']],
		['Euskara',         ['eu-ES']],
		['Filipino',        ['fil-PH']],
		['Français',        ['fr-FR']],
		['Basa Jawa',       ['jv-ID']],
		['Galego',          ['gl-ES']],
		['ગુજરાતી',          ['gu-IN']],
		['Hrvatski',        ['hr-HR']],
		['IsiZulu',         ['zu-ZA']],
		['Íslenska',        ['is-IS']],
		['Italiano',        ['it-IT', 'Italia'],
							['it-CH', 'Svizzera']],
		['ಕನ್ನಡ',            ['kn-IN']],
		['ភាសាខ្មែរ',         ['km-KH']],
		['Latviešu',        ['lv-LV']],
		['Lietuvių',        ['lt-LT']],
		['മലയാളം',       ['ml-IN']],
		['मराठी',            ['mr-IN']],
		['Magyar',          ['hu-HU']],
		['ລາວ',             ['lo-LA']],
		['Nederlands',      ['nl-NL']],
		['नेपाली भाषा',       ['ne-NP']],
		['Norsk bokmål',    ['nb-NO']],
		['Polski',          ['pl-PL']],
		['Português',       ['pt-BR', 'Brasil'],
							['pt-PT', 'Portugal']],
		['Română',          ['ro-RO']],
		['සිංහල',            ['si-LK']],
		['Slovenščina',     ['sl-SI']],
		['Basa Sunda',      ['su-ID']],
		['Slovenčina',      ['sk-SK']],
		['Suomi',           ['fi-FI']],
		['Svenska',         ['sv-SE']],
		['Kiswahili',       ['sw-TZ', 'Tanzania'],
							['sw-KE', 'Kenya']],
		['ქართული',        ['ka-GE']],
		['Հայերեն',         ['hy-AM']],
		['தமிழ்',          ['ta-IN', 'இந்தியா'],
							['ta-SG', 'சிங்கப்பூர்'],
							['ta-LK', 'இலங்கை'],
							['ta-MY', 'மலேசியா']],
		['తెలుగు',          ['te-IN']],
		['Tiếng Việt',      ['vi-VN']],
		['Türkçe',          ['tr-TR']],
		['اُردُو',            ['ur-PK', 'پاکستان'],
							['ur-IN', 'بھارت']],
		['Ελληνικά',        ['el-GR']],
		['български',       ['bg-BG']],
		['Русский',         ['ru-RU']],
		['Српски',          ['sr-RS']],
		['Українська',      ['uk-UA']],
		['한국어',           ['ko-KR']],
		['中文',             ['cmn-Hans-CN', '普通话 (中国大陆)'],
							['cmn-Hans-HK', '普通话 (香港)'],
							['cmn-Hant-TW', '中文 (台灣)'],
							['yue-Hant-HK', '粵語 (香港)']],
		['日本語',           ['ja-JP']],
		['हिन्दी',             ['hi-IN']],
		['ภาษาไทย',         ['th-TH']]];
		
		var key_code = [8,9,13,32,37,38,39,40,46];
		for (var i = 48; i < 90; i++) {
			key_code.push(i);
		}
		for (var i = 96; i < 111; i++) {
			key_code.push(i);
		}
		for (var i = 186; i < 222; i++) {
			key_code.push(i);
		}

		function updateCountry() {
			if ($(custom_menu2).children('li').length > 0) {
				$(custom_menu2).children('li').remove();
			}
			var list = langs[$('.selecteddd')[0].id];
			for (var i = 1; i < list.length; i++) {
				$('<li>',{
					id: list[i][0],
					class: 'liii',
					text: list[i][1],
					hover: function () {
						$(this).toggleClass('hoverrr');
					},
					click: function () {
						$('#custom_menu2 .selecteddd').removeClass("selecteddd");					
						$(this).addClass('selecteddd');
						custom_input2.value = this.innerHTML;
						$('#custom_menu2 .arrow_hover').removeClass('arrow_hover');
						custom_menu2.style.display = 'none';						
					}
				}).appendTo(custom_menu2);
			}	
			list_dialect = $(custom_menu2).children('li');
			custom_input2.value = list_dialect[0].innerHTML;
			$(list_dialect[0]).addClass('selecteddd');
			dialect.style.visibility = list[1].length == 1 ? 'hidden' : 'visible';
		};

		var final_transcript = '',
		recognizing = false,
		ignore_onend,
		start_timestamp;

		if (!('webkitSpeechRecognition' in window)) {
			upgrade();
		} else {
			start_button.style.display = 'inline-block';
			var recognition = new webkitSpeechRecognition();
			recognition.continuous = true;
			recognition.interimResults = true;

			recognition.onstart = function() {
				disabledSelect();
				recognizing = true;
				showInfo('info_speak_now');
				start_img.src = 'mic_src/mic-animate.png';
			};

			recognition.onerror = function(event) {
				if (event.error == 'no-speech') {
					start_img.src = 'mic_src/mic.png';
					showInfo('info_no_speech');
					ignore_onend = true;
				}
				if (event.error == 'audio-capture') {
					start_img.src = 'mic_src/mic.png';
					showInfo('info_no_microphone');
					ignore_onend = true;
				}
				if (event.error == 'not-allowed') {
					if (event.timeStamp - start_timestamp < 100) {
						showInfo('info_blocked');
					} else {
						showInfo('info_denied');
					}
					ignore_onend = true;
				}
			};

			recognition.onend = function() {
				recognizing = false;
				undisabledSelect()
				if (ignore_onend) {
					return;
				}
				start_img.src = 'mic_src/mic.png';
				if (!final_transcript) {
					showInfo('info_start');
					return;
				}
				showInfo('info_start');
				// console.log(final_transcript.split('\n'));
				// showInfo('');
				// if (window.getSelection) {
				// 	window.getSelection().removeAllRanges();
				// 	// var range = document.createRange();
				// 	// range.selectNode(document.getElementById('final_span'));
				// 	// window.getSelection().addRange(range);
				// }
			};

			recognition.onresult = function(event) {
				var interim_transcript = '';
				final_transcript = '';
				if (typeof(event.results) == 'undefined') {
					recognition.onend = null;
					recognition.stop();
					upgrade();
					return;
				}
				for (var i = event.resultIndex; i < event.results.length; ++i) {
					if (event.results[i].isFinal) {
						final_transcript += event.results[i][0].transcript;
					} else {
						interim_transcript += event.results[i][0].transcript;
					}
				}
				final_transcript = capitalize(final_transcript);
				// final_span.innerHTML = linebreak(final_transcript);
				if (event.results[0].isFinal) {
					window.Asc.plugin.executeMethod("PasteHtml",[linebreak(final_transcript)]);
				}
				interim_span.innerHTML = linebreak(interim_transcript);
			};
		};

		function upgrade() {
			start_button.style.visibility = 'hidden';
			disabledSelect();
			showInfo('info_upgrade');
		};

		const paragraph = '<!--StartFragment--><p style="margin-top:0pt;margin-bottom:9.999977952755906pt;border:none;mso-border-left-alt:none;mso-border-top-alt:none;mso-border-right-alt:none;mso-border-bottom-alt:none;mso-border-between:none" class="docData;DOCY;v5;1177;BAiAAgAABoQCAAAD3AIAAAXqAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABUAAAAAE8AAAABGAAAAAEGAAAAAAkGAAAAABoGAAAAABsGAAAAAAItAAAABQoAAAABAAAAAAgAAAAABQoAAAABAAAAAAgAAAAABQoAAAABAAAAAAgAAAAACgAAAAAAAAAAEQAAAACrAQAAAOIAAAAAAQABBhIAAAACBQAAAAADBQAAAAAEBQAAAAAFAQEGAQAHAQAIAQAJBhsAAAAKBTfBAQALAQEcAQAMBQAAAAAdAQANBQliBQAOBg4AAAAAAQEBA////wIGAAAAABkBARsGfQAAAAAUAAAAAAMAAAABBQAAAAACBeZEAAADAQABFAAAAAADAAAAAQUAAAAAAgXmRAAAAwEAAhQAAAAAAwAAAAEFAAAAAAIF5kQAAAMBAAMUAAAAAAMAAAABBQAAAAACBeZEAAADAQALFAAAAAADAAAAAQUAAAAAAgXmRAAAAwEAAboAAAAAAQABAQACAQADAQAEBgoAAABBAHIAaQBhAGwABQYKAAAAQQByAGkAYQBsAAcGCgAAAEEAcgBpAGEAbAAGBgoAAABBAHIAaQBhAGwACAQWAAAACgEADAEADgUAAAAADwEAEAEAEQEAEgUAAAAAFAEAFQEAFgQWAAAAFwEAGAEAGQYKAAAAZQBuAC0AVQBTABoGCgAAAGEAcgAtAFMAQQAbBgoAAABlAG4ALQBVAFMAHAYCAAAAAAAeAQACAAAAAA==">&nbsp;</p><!--EndFragment-->'; 
		const two_line = /\n\n/g;
		const one_line = /\n/g;
		function linebreak(s) {
			if (s.indexOf('\n') !== -1) {
				s = s.substr(1);
			}
			return s.replace(two_line, paragraph).replace(one_line, paragraph);
		};

		const first_char = /\S/;
		function capitalize(s) {
			return s.replace(first_char, function(m) { return m.toUpperCase(); });
		};

		start_button.onclick = function(event) {
			if (recognizing) {
				recognition.stop();
				return;
			}
			final_transcript = '';
			recognition.lang = $('#custom_menu2 .selecteddd')[0].id;
			recognition.start();
			ignore_onend = false;
			// final_span.innerHTML = '';
			interim_span.innerHTML = '';
			start_img.src = 'mic_src/mic-slash.png';
			showInfo('info_allow');
			start_timestamp = event.timeStamp;
		};

		function showInfo(s) {
			if (s) {
				for (var child = info.firstChild; child; child = child.nextSibling) {
					if (child.style) {
						child.style.display = child.id == s ? 'inline' : 'none';
					}
				}
				info.style.visibility = 'visible';
			} else {
				info.style.visibility = 'hidden';
			}
		};

		var btn_flag = false,
		list_lang, 
		list_dialect;
	
		initializeScrolldata(langs);
		function initializeScrolldata (data) {
			for (var i = 0; i < data.length; i++) {
				$('<li>',{
					id: i,
					class: 'liii',
					text: data[i][0],
					hover: function () {
						$(this).toggleClass('hoverrr');
					},
					click: function () {
						$('#custom_menu .selecteddd').removeClass("selecteddd");					
						$(this).addClass('selecteddd');
						custom_input.value = this.innerHTML;
						$('#custom_menu .arrow_hover').removeClass('arrow_hover');
						custom_menu.style.display = 'none';
						updateCountry();						
					}
				}).appendTo(custom_menu);
			}
			list_lang = $(custom_menu).children('li');
			$(list_lang[10]).addClass('selecteddd');
			custom_input.value = list_lang[10].innerHTML;
			updateCountry();
			showInfo('info_start');
		};
		
		Ps.initialize(custom_menu, {
			theme : 'custom-theme'
		});
		Ps.initialize(custom_menu2, {
			theme : 'custom-theme'
		});

		function updateScroll()
		{
			Ps.update(custom_menu);
			Ps.update(custom_menu2);
			if($('.ps__scrollbar-y').height() === 0){
				$('.ps__scrollbar-y').css('visibility', 'hidden');
				$('.ps__scrollbar-y').css('border-width', '0px');
			}
			else{
				$('.ps__scrollbar-y').css('visibility', 'visible');				
				$('.ps__scrollbar-y').css('border-width', '1px');
			}
			if($('.ps__scrollbar-x').width() === 0){
				$('.ps__scrollbar-x-rail').css('display', 'none');
			}
			else{
				$('.ps__scrollbar-x-rail').css('display', 'block');				
			}
		};

		m_button.onclick = function () {
			if (custom_menu.style.display == 'none' || custom_menu.style.display == '') {
				custom_menu.style.display = 'block';
				custom_menu.scrollTop = 0;
				updateScroll();
				updateScroll();
				custom_input.focus();
				setRange(custom_input.value.length, custom_input.value.length, custom_menu, custom_input);
			} else {
				$('#custom_menu.arrow_hover').removeClass('arrow_hover');
				if ($('#custom_menu .selecteddd').length > 0) {
					custom_input.value = $('#custom_menu .selecteddd').text();
				}
				custom_menu.style.display = 'none';			
			}
			custom_menu2.style.display = 'none';
			btn_flag = true;
		};

		m_button2.onclick = function () {
			if (custom_menu2.style.display == 'none' || custom_menu2.style.display == '') {
				custom_menu2.style.display = 'block';
				custom_menu2.scrollTop = 0;
				updateScroll();
				updateScroll();
				custom_input2.focus();
				setRange(custom_input2.value.length, custom_input2.value.length, custom_menu2, custom_input2);
			} else {
				$('#custom_menu2 .arrow_hover').removeClass('arrow_hover');
				if ($('#custom_menu2 .selecteddd').length > 0) {
					custom_input2.value = $('#custom_menu2 .selecteddd').text();
				}
				custom_menu2.style.display = 'none';		
			}
			btn_flag = true;
		};

		custom_input.onclick = function() {
			custom_menu2.style.display = 'none';
			btn_flag = true;
		};
		custom_input2.onclick = function() {
			custom_menu2.style.display = 'none';
			btn_flag = true;
		};

		custom_input.onkeydown = function(event) {
			custom_menu2.style.display = 'none';
			if (event.keyCode == 38 || event.keyCode == 9)
			{
				cancelEvent(event);				
			}
		};
		custom_input2.onkeydown = function(event) {
			custom_menu.style.display = 'none';
			if (event.keyCode == 38 || event.keyCode == 9)
			{
				cancelEvent(event);				
			}
		};

		custom_input.onkeyup = function(event) {
			var flag = true;
			for (i in key_code) {
				if (event.keyCode == key_code[i]) {
					flag = false;
				}
			}
			if (flag) {
				return;
			}
			if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 8 || event.keyCode == 46 || event.keyCode == 13) {
				custom_menu.style.display = 'block';
				updateScroll();
				updateScroll();
				return;
			}
			$('#custom_menu .selecteddd').removeClass("selecteddd");
			$('#custom_menu .arrow_hover').removeClass('arrow_hover');
			custom_menu.style.display = 'block';
			custom_menu.scrollTop = 0;
			updateScroll();
			updateScroll();
			var value = event.currentTarget.value.toLowerCase() || event.key;
			for (var i = 0; i < list_lang.length; i++) {
				if (list_lang[i].innerHTML.toLowerCase().substr(0, value.length) == value) {
					custom_menu.scrollTop = list_lang[i].offsetTop;
					custom_input.value = list_lang[i].innerHTML;
					setRange(value.length, custom_input.value.length, custom_menu, custom_input);
					$(list_lang[i]).addClass("selecteddd");
					updateScroll();
					updateScroll();
					break;
				}
			}
		};

		custom_input2.onkeyup = function(event) {
			if (event.key.length > 1 && event.keyCode != 40 && event.keyCode != 38 && event.keyCode != 8 && event.keyCode != 46) {
				return;
			}
			if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 8 || event.keyCode == 46) {
				custom_menu2.style.display = 'block';
				updateScroll();
				updateScroll();
				return;
			}
			$('#custom_menu2 .selecteddd').removeClass("selecteddd");
			$('#custom_menu2 .arrow_hover').removeClass('arrow_hover');
			custom_menu2.style.display = 'block';
			custom_menu2.scrollTop = 0;
			var value = event.currentTarget.value.toLowerCase() || event.key;
			for (var i = 0; i < list_dialect.length; i++) {
				if (list_dialect[i].innerHTML.toLowerCase().substr(0, value.length) == value) {
					custom_menu2.scrollTop = list_dialect[i].offsetTop;
					custom_input2.value = list_dialect[i].innerHTML;
					setRange(value.length, custom_input2.value.length, custom_menu2, custom_input2);
					$(list_dialect[i]).addClass("selecteddd");
					break;
				}
			}
			updateScroll();
			updateScroll();
		};

		window.addEventListener('keyup', function(event) {
			var element_menu = (custom_menu.style.display == 'block') ? custom_menu : custom_menu2;
			var text_menu = (element_menu == custom_menu) ? '#custom_menu' : '#custom_menu2';
			var element_input = (element_menu == custom_menu) ? custom_input : custom_input2;

			if (element_menu.style.display == 'block') {
				switch (event.keyCode) {
					case 13:
						if ($(text_menu + ' .arrow_hover').length > 0) {
							element_input.value = $('.arrow_hover').text();
							$(text_menu + ' .selecteddd').removeClass("selecteddd");
							$(text_menu +  ' .arrow_hover').addClass('selecteddd');
						} else if ($(text_menu + ' .selecteddd').length > 0) {
							element_input.value = $(text_menu + ' .selecteddd').text();
						}
						setRange(element_input.value.length, element_input.value.length, element_menu, element_input);
						element_menu.style.display = 'none';
						$(text_menu + ' .arrow_hover').removeClass('arrow_hover');
						if (element_menu == custom_menu) {
						updateCountry();											
						}		
						break;

					case 40:				
						if ($(text_menu + ' .arrow_hover').length == 0) {
							if ($(text_menu + ' .selecteddd').length == 0) {
								$($(element_menu).children('li')[0]).addClass('arrow_hover');
							} else if ($(text_menu + ' .selecteddd')[0].id != $(element_menu).children('li').last()[0].id) {
								$(text_menu + ' .selecteddd').next().addClass('arrow_hover');
								element_menu.scrollTop = $(text_menu + ' .arrow_hover')[0].offsetTop;
							}
						} else if ($(text_menu + ' .arrow_hover')[0].id != $(element_menu).children('li').last()[0].id) {
							$(text_menu + ' .arrow_hover').next().addClass('arrow_hover');
							$(text_menu + ' .arrow_hover')[0].classList.remove('arrow_hover');
							element_menu.scrollTop = $(text_menu + ' .arrow_hover')[0].offsetTop;
						}
						break;

					case 38:
						if ($(text_menu + ' .arrow_hover').length == 0) {
							if ($(text_menu + ' .selecteddd').length == 0) {
								$($(element_menu).children('li')[0]).addClass('arrow_hover');
							} else if ($(text_menu + ' .arrow_hover').length == 0) {
								if ($(text_menu + ' .selecteddd')[0].id != $(element_menu).children('li')[0].id) {
									$(text_menu + ' .selecteddd').prev().addClass('arrow_hover');
								}
							} 
						} else {
							if ($(text_menu + ' .arrow_hover')[0].id != $(element_menu).children('li')[0].id) {
								$(text_menu + ' .arrow_hover').prev().addClass('arrow_hover');
								$(text_menu + ' .arrow_hover')[1].classList.remove('arrow_hover');
								element_menu.scrollTop = $(text_menu +  ' .arrow_hover')[0].offsetTop;
							}
						}
						break;

					case 9:
						setRange(element_input.value.length, element_input.value.length, element_menu, element_input);
						break;
				}
			}
		}, false);

		window.addEventListener('click', function(event) {
			if (!btn_flag) {
				if ($('#custom_menu .selecteddd').length > 0) {
					custom_input.value = $('#custom_menu .selecteddd').text();
				}
				$('#custom_menu .arrow_hover').removeClass('arrow_hover');
				custom_menu.style.display = 'none';

				if ($('#custom_menu2 .selecteddd').length > 0) {
					custom_input2.value = $('#custom_menu2 .selecteddd').text();
				}
				$('#custom_menu2 .arrow_hover').removeClass('arrow_hover');
				custom_menu2.style.display = 'none';
			}
			btn_flag = false;
		}, false);

		function setRange(start, end, element_menu, element_input) {
			if (element_menu.style.display == 'block')
			if (element_input.setSelectionRange) {
				element_input.focus(); element_input.setSelectionRange(start, end); /* WebKit */
			} else if (element_input.createTextRange) {
				/* IE */
				var range = element_input.createTextRange(); 
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select(); 
			} else if (element_input.selectionStart) {
				element_input.selectionStart = start; element_input.selectionEnd = end; 
			}
		};

		function disabledSelect() {
			custom_input.disabled = true;
			custom_input2.disabled = true;
			m_button.disabled = true;
			m_button2.disabled = true;
		};

		function undisabledSelect() {
			custom_input.disabled = false;
			custom_input2.disabled = false;
			m_button.disabled = false;
			m_button2.disabled = false;
		};
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

	function checkInternetExplorer(){
		var rv = -1;
		if (window.navigator.appName == 'Microsoft Internet Explorer') {
			const ua = window.navigator.userAgent;
			const re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		} else if (window.navigator.appName == 'Netscape') {
			const ua = window.navigator.userAgent;
			const re = new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})');

			if (re.exec(ua) != null) {
				rv = parseFloat(RegExp.$1);
			}
		}
		return rv !== -1;
	};

})(window, undefined);