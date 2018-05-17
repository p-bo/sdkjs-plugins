(function(){

	var data,
	btn_flag = false,
	arr;

		function initializeScrolldata (dat) {
			data = dat;
			for (i in data) {
				$('<li>',{
					id: i,
					class: 'liii',
					text: data[i],
					hover: function () {
						$(this).toggleClass('hoverrr');
					},
					click: function () {
						$('.selecteddd').removeClass("selecteddd");					
						$(this).addClass('selecteddd');
						custom_input.value = this.innerHTML;
						$('.arrow_hover').removeClass('arrow_hover');
						custom_menu.style.display = 'none';
					}
				}).appendTo(custom_menu);
			}
			arr = document.getElementsByTagName('li');
			$(arr[0]).addClass('selecteddd');
			custom_input.value = arr[0].innerHTML;
		};
		
		Ps.initialize(custom_menu, {
			theme : 'custom-theme'
		});
		// updateScroll();
		// updateScroll();

		function updateScroll()
		{
			var custom_menu = document.getElementById('custom_menu');
			Ps.update(custom_menu);
			if($('.ps__scrollbar-y').height() === 0){
				$('.ps__scrollbar-y').css('visibility', 'hidden');
				$('.ps__scrollbar-y').css('border-width', '0px');
			}
			else{
				$('.ps__scrollbar-y').css('visibility', 'visible');				
				$('.ps__scrollbar-y').css('border-width', '1px');
			}
			if($('.ps__scrollbar-x').width() === 0){
				$('.ps__scrollbar-x').css('visibility', 'hidden');
				$('.ps__scrollbar-x').css('border-width', '0px');
			}
			else{
				$('.ps__scrollbar-x').css('visibility', 'visible');
				$('.ps__scrollbar-x').css('border-width', '1px');
			}
		};

		m_button.onclick = function () {
			if (custom_menu.style.display == 'none' || custom_menu.style.display == '') {
				custom_menu.style.display = 'block';
				custom_menu.scrollTop = 0;
				updateScroll();
				updateScroll();
				custom_input.focus();
				setRange(custom_input.value.length, custom_input.value.length);
			} else {
				$('.arrow_hover').removeClass('arrow_hover');
				if ($('.selecteddd').length > 0) {
					custom_input.value = $('.selecteddd').text();
				}
				custom_menu.style.display = 'none';				
			}
			btn_flag = true;
		};

		custom_input.onclick = function() {
			btn_flag = true;
		};

		custom_input.onkeydown = function(event) {
			if (event.keyCode == 38 || event.keyCode == 9)
			{
				cancelEvent(event);				
			}
		};

		custom_input.onkeyup = function(event) {
			if (event.key.length > 1 && event.keyCode != 40 && event.keyCode != 38 && event.keyCode != 8 && event.keyCode != 46) {
				return;
			}
			if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 8 || event.keyCode == 46) {
				custom_menu.style.display = 'block';
				return;
			}
			$('.selecteddd').removeClass("selecteddd");
			$('.arrow_hover').removeClass('arrow_hover');
			custom_menu.style.display = 'block';
			custom_menu.scrollTop = 0;
			updateScroll();
			updateScroll();
			var value = event.currentTarget.value.toLowerCase() || event.key;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].innerHTML.toLowerCase().substr(0, value.length) == value) {
					custom_menu.scrollTop = arr[i].offsetTop;
					custom_input.value = arr[i].innerHTML;
					setRange(value.length, custom_input.value.length)
					$(arr[i]).addClass("selecteddd");
					updateScroll();
					updateScroll();
					break;
				}
			}
		};

		window.addEventListener('keyup', function(event) {
			if (custom_menu.style.display == 'block') {
				switch (event.keyCode) {
					case 13:
						if ($('.arrow_hover').length > 0) {
							custom_input.value = $('.arrow_hover').text();
							$('.selecteddd').removeClass("selecteddd");
							$('.arrow_hover').addClass('selecteddd');
						} else if ($('.selecteddd').length > 0) {
							custom_input.value = $('.selecteddd').text();
						}
						custom_menu.style.display = 'none';
						$('.arrow_hover').removeClass('arrow_hover');
						break;
	
					case 40:				
						if ($('.arrow_hover').length == 0) {
							if ($('.selecteddd').length == 0) {
								$($(custom_menu).children('li')[0]).addClass('arrow_hover');
							} else if ($('.selecteddd')[0].id != $(custom_menu).children('li').last()[0].id) {
								$('.selecteddd').next().addClass('arrow_hover');
								custom_menu.scrollTop = $('.arrow_hover')[0].offsetTop;
							}
						} else if ($('.arrow_hover')[0].id != $(custom_menu).children('li').last()[0].id) {
							$('.arrow_hover').next().addClass('arrow_hover');
							$('.arrow_hover')[0].classList.remove('arrow_hover');
							custom_menu.scrollTop = $('.arrow_hover')[0].offsetTop;
						}
						break;
	
					case 38:
						if ($('.arrow_hover').length == 0) {
							if ($('.selecteddd').length == 0) {
								$($(custom_menu).children('li')[0]).addClass('arrow_hover');
							} else if ($('.arrow_hover').length == 0) {
								if ($('.selecteddd')[0].id != $(custom_menu).children('li')[0].id) {
									$('.selecteddd').prev().addClass('arrow_hover');
								}
							} 
						} else {
							if ($('.arrow_hover')[0].id != $(custom_menu).children('li')[0].id) {
								$('.arrow_hover').prev().addClass('arrow_hover');
								$('.arrow_hover')[1].classList.remove('arrow_hover');
								custom_menu.scrollTop = $('.arrow_hover')[0].offsetTop;
							}
						}
						break;

					case 9:
						setRange(custom_input.value.length, custom_input.value.length);
				}
			}
		}, false);

		window.addEventListener('click', function(event) {
			if (!btn_flag) {
				if ($('.selecteddd').length > 0) {
					custom_input.value = $('.selecteddd').text();
				}
				$('.arrow_hover').removeClass('arrow_hover');
				custom_menu.style.display = 'none';
			}
			btn_flag = false;
		}, false);

		function setRange(start, end) {
			if (custom_input.setSelectionRange) {
				custom_input.focus(); custom_input.setSelectionRange(start, end); /* WebKit */
			} else if (custom_input.createTextRange) {
				/* IE */
				var range = custom_input.createTextRange(); 
				range.collapse(true);
				range.moveEnd('character', end);
				range.moveStart('character', start);
				range.select(); 
			} else if (custom_input.selectionStart) {
				custom_input.selectionStart = start; custom_input.selectionEnd = end; 
			}
		}


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