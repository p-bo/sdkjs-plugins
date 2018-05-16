(function(window, undefined){

	var data = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty', 'twenty one', 'twenty two', 'twenty three', 'twenty four', 'twenty five', 'twenty six', 'twenty seven', 'twenty eight']
	
	
	window.Asc.plugin.init = function () {

		for (i in data) {
			$('<li>',{
				text: data[i],
				hover: function () {
					$(this).toggleClass('hover');
				},
				click: function () {
					$('.selected').removeClass("selected");					
					$(this).addClass('selected');
					input.value = this.innerHTML;
					menu.style.display = 'none';
				}
			}).appendTo(menu);
		}
		var arr = document.getElementsByTagName('li');
		$(arr[0]).addClass('selected');
		input.value = arr[0].innerHTML;
		
		Ps.initialize(menu, {
			theme : 'custom-theme'
		});
		updateScroll();
		updateScroll();
		function updateScroll()
		{
			var menu = document.getElementById('menu');
			Ps.update(menu);
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
			if (menu.style.display == 'none' || menu.style.display == '') {
				menu.style.display = 'block';
				menu.scrollTop = 0;
				updateScroll();
				updateScroll();
			} else {
				menu.style.display = 'none';				
			}
		};

		input.onkeyup = function (event) {
			if (event.key.length > 1) {
				// handle arrow up/down and enter
				return;
			}
			$('.selected').removeClass("selected");
			menu.style.display = 'block';
			menu.scrollTop = 0;
			updateScroll();
			updateScroll();
			var value = event.currentTarget.value.toLowerCase() || event.key;
			for (var i = 0; i < arr.length; i++) {
				if (arr[i].innerHTML.toLowerCase().substr(0, value.length) == value) {
					menu.scrollTop = arr[i].offsetTop;
					input.value = arr[i].innerHTML;
					var end = input.value.length;
					var start = value.length;
					if (input.setSelectionRange) {
						input.focus(); input.setSelectionRange(start, end); /* WebKit */
					} else if (input.createTextRange) {
						/* IE */
						var range = input.createTextRange(); 
						range.collapse(true);
						range.moveEnd('character', end);
						range.moveStart('character', start);
						range.select(); 
					} else if (input.selectionStart) {
						input.selectionStart = start; input.selectionEnd = end; 
					}
					$(arr[i]).addClass("selected");
					updateScroll();
					updateScroll();
					break;
				}
			}
		}
	};

})(window, undefined);