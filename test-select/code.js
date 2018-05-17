(function(window, undefined){

	// var data = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty one', 'twenty two', 'twenty three', 'twenty four', 'twenty five', 'twenty six', 'twenty seven', 'twenty eight']
	// var btn_flag = false;
	// var arr;
	
	window.Asc.plugin.init = function () {
		$.getScript("custom_select/custom_select.js", function(){
			alert("Сценарий загружен, но необязательно выполнен.");
		 });
		// initializeScrolldata(data);

		// function initializeScrolldata (data) {
		// 	for (i in data) {
		// 		$('<li>',{
		// 			id: i,
		// 			text: data[i],
		// 			hover: function () {
		// 				$(this).toggleClass('hover');
		// 			},
		// 			click: function () {
		// 				$('.selected').removeClass("selected");					
		// 				$(this).addClass('selected');
		// 				input.value = this.innerHTML;
		// 				$('.arrow_hover').removeClass('arrow_hover');
		// 				menu.style.display = 'none';
		// 			}
		// 		}).appendTo(menu);
		// 	}
		// 	arr = document.getElementsByTagName('li');
		// 	$(arr[0]).addClass('selected');
		// 	input.value = arr[0].innerHTML;
		// };
		
		// Ps.initialize(menu, {
		// 	theme : 'custom-theme'
		// });
		// updateScroll();
		// updateScroll();

		// function updateScroll()
		// {
		// 	var menu = document.getElementById('menu');
		// 	Ps.update(menu);
		// 	if($('.ps__scrollbar-y').height() === 0){
		// 		$('.ps__scrollbar-y').css('visibility', 'hidden');
		// 		$('.ps__scrollbar-y').css('border-width', '0px');
		// 	}
		// 	else{
		// 		$('.ps__scrollbar-y').css('visibility', 'visible');				
		// 		$('.ps__scrollbar-y').css('border-width', '1px');
		// 	}
		// 	if($('.ps__scrollbar-x').width() === 0){
		// 		$('.ps__scrollbar-x').css('visibility', 'hidden');
		// 		$('.ps__scrollbar-x').css('border-width', '0px');
		// 	}
		// 	else{
		// 		$('.ps__scrollbar-x').css('visibility', 'visible');
		// 		$('.ps__scrollbar-x').css('border-width', '1px');
		// 	}
		// };

		// m_button.onclick = function () {
		// 	if (menu.style.display == 'none' || menu.style.display == '') {
		// 		menu.style.display = 'block';
		// 		menu.scrollTop = 0;
		// 		updateScroll();
		// 		updateScroll();
		// 		input.focus();
		// 		setRange(input.value.length, input.value.length);
		// 	} else {
		// 		$('.arrow_hover').removeClass('arrow_hover');
		// 		if ($('.selected').length > 0) {
		// 			input.value = $('.selected').text();
		// 		}
		// 		menu.style.display = 'none';				
		// 	}
		// 	btn_flag = true;
		// };

		// input.onclick = function() {
		// 	btn_flag = true;
		// };

		// input.onkeydown = function(event) {
		// 	if (event.keyCode == 38 || event.keyCode == 9)
		// 	{
		// 		cancelEvent(event);				
		// 	}
		// };

		// input.onkeyup = function(event) {
		// 	if (event.key.length > 1 && event.keyCode != 40 && event.keyCode != 38 && event.keyCode != 8 && event.keyCode != 46) {
		// 		return;
		// 	}
		// 	if (event.keyCode == 38 || event.keyCode == 40 || event.keyCode == 8 || event.keyCode == 46) {
		// 		menu.style.display = 'block';
		// 		return;
		// 	}
		// 	$('.selected').removeClass("selected");
		// 	$('.arrow_hover').removeClass('arrow_hover');
		// 	menu.style.display = 'block';
		// 	menu.scrollTop = 0;
		// 	updateScroll();
		// 	updateScroll();
		// 	var value = event.currentTarget.value.toLowerCase() || event.key;
		// 	for (var i = 0; i < arr.length; i++) {
		// 		if (arr[i].innerHTML.toLowerCase().substr(0, value.length) == value) {
		// 			menu.scrollTop = arr[i].offsetTop;
		// 			input.value = arr[i].innerHTML;
		// 			setRange(value.length, input.value.length)
		// 			$(arr[i]).addClass("selected");
		// 			updateScroll();
		// 			updateScroll();
		// 			break;
		// 		}
		// 	}
		// };

		// window.addEventListener('keyup', function(event) {
		// 	if (menu.style.display == 'block') {
		// 		switch (event.keyCode) {
		// 			case 13:
		// 				if ($('.arrow_hover').length > 0) {
		// 					input.value = $('.arrow_hover').text();
		// 					$('.selected').removeClass("selected");
		// 					$('.arrow_hover').addClass('selected');
		// 				} else if ($('.selected').length > 0) {
		// 					input.value = $('.selected').text();
		// 				}
		// 				menu.style.display = 'none';
		// 				$('.arrow_hover').removeClass('arrow_hover');
		// 				break;
	
		// 			case 40:				
		// 				if ($('.arrow_hover').length == 0) {
		// 					if ($('.selected').length == 0) {
		// 						$($(menu).children('li')[0]).addClass('arrow_hover');
		// 					} else if ($('.selected')[0].id != $(menu).children('li').last()[0].id) {
		// 						$('.selected').next().addClass('arrow_hover');
		// 						menu.scrollTop = $('.arrow_hover')[0].offsetTop;
		// 					}
		// 				} else if ($('.arrow_hover')[0].id != $(menu).children('li').last()[0].id) {
		// 					$('.arrow_hover').next().addClass('arrow_hover');
		// 					$('.arrow_hover')[0].classList.remove('arrow_hover');
		// 					menu.scrollTop = $('.arrow_hover')[0].offsetTop;
		// 				}
		// 				break;
	
		// 			case 38:
		// 				if ($('.arrow_hover').length == 0) {
		// 					if ($('.selected').length == 0) {
		// 						$($(menu).children('li')[0]).addClass('arrow_hover');
		// 					} else if ($('.arrow_hover').length == 0) {
		// 						if ($('.selected')[0].id != $(menu).children('li')[0].id) {
		// 							$('.selected').prev().addClass('arrow_hover');
		// 						}
		// 					} 
		// 				} else {
		// 					if ($('.arrow_hover')[0].id != $(menu).children('li')[0].id) {
		// 						$('.arrow_hover').prev().addClass('arrow_hover');
		// 						$('.arrow_hover')[1].classList.remove('arrow_hover');
		// 						menu.scrollTop = $('.arrow_hover')[0].offsetTop;
		// 					}
		// 				}
		// 				break;

		// 			case 9:
		// 				setRange(input.value.length, input.value.length);
		// 		}
		// 	}
		// }, false);

		// window.addEventListener('click', function(event) {
		// 	if (!btn_flag) {
		// 		if ($('.selected').length > 0) {
		// 			input.value = $('.selected').text();
		// 		}
		// 		$('.arrow_hover').removeClass('arrow_hover');
		// 		menu.style.display = 'none';
		// 	}
		// 	btn_flag = false;
		// }, false);

		// function setRange(start, end) {
		// 	if (input.setSelectionRange) {
		// 		input.focus(); input.setSelectionRange(start, end); /* WebKit */
		// 	} else if (input.createTextRange) {
		// 		/* IE */
		// 		var range = input.createTextRange(); 
		// 		range.collapse(true);
		// 		range.moveEnd('character', end);
		// 		range.moveStart('character', start);
		// 		range.select(); 
		// 	} else if (input.selectionStart) {
		// 		input.selectionStart = start; input.selectionEnd = end; 
		// 	}
		// }
	};

	// function cancelEvent(e){
	// 	if (e && e.preventDefault) {
	// 		e.stopPropagation(); // DOM style (return false doesn't always work in FF)
	// 		e.preventDefault();
	// 	}
	// 	else {
	// 		window.event.cancelBubble = true;//IE stopPropagation
	// 	}
	// };

	// function checkInternetExplorer(){
	// 	var rv = -1;
	// 	if (window.navigator.appName == 'Microsoft Internet Explorer') {
	// 		const ua = window.navigator.userAgent;
	// 		const re = new RegExp('MSIE ([0-9]{1,}[\.0-9]{0,})');
	// 		if (re.exec(ua) != null) {
	// 			rv = parseFloat(RegExp.$1);
	// 		}
	// 	} else if (window.navigator.appName == 'Netscape') {
	// 		const ua = window.navigator.userAgent;
	// 		const re = new RegExp('Trident/.*rv:([0-9]{1,}[\.0-9]{0,})');

	// 		if (re.exec(ua) != null) {
	// 			rv = parseFloat(RegExp.$1);
	// 		}
	// 	}
	// 	return rv !== -1;
	// };

})(window, undefined);