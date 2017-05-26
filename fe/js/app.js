(function (window) {
	'use strict';

	// Your starting point. Enjoy the ride!
	$( document ).ready(function() {
		$.ajax({
			url: './api/todos',
			method: 'GET',
			dataType:'json',
			success: function(data) {
				var items = [];
				var itemLeftCount = 0;
				console.log(data);
				for(var i = 0; i < data.length; i++) {
					var className = '';
					var inputChecked = '';
					if(data[i].completed == 1) {
						className = ' class="completed"';
						inputChecked = ' checked';
					} else {
						itemLeftCount++;
					}
					items.push("<li" + className + ">" + "<div class='view'><input class='toggle' type='checkbox'" + inputChecked + ">\
								<label>" + data[i].todo + "</label><button class='destroy'></button></div></li>");
				}
				$('.todo-list').html(items);
				$('.todo-count > strong').text(itemLeftCount);
			}
		})	
	});
})(window);
