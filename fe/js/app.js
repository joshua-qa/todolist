(function (window) {
	'use strict';

	$(document).ready(function() {
		$.ajax({
			url: './api/todos',
			method: 'GET',
			dataType: 'json',
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
					items.push("<li" + className + " data-id=" + data[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'" + inputChecked + ">\
								<label>" + data[i].todo + "</label><button class='destroy'></button></div></li>");
				}
				$('.todo-list').html(items);
				$('.todo-count > strong').text(itemLeftCount);
			}
		})
	});

	
	$('.todo-list').on('click', '.toggle', function() {
		var updateId = $(this).parent().parent().data('id');
		var parent = $(this).parent().parent()
		console.log("updateId : " + updateId);
		if(this.checked) {
			var flag = 1;
		} else {
			var flag = 0;
		}

		$.ajax({
			url: './api/todos/' + updateId,
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			data: JSON.stringify({completed: flag}),
			dataType: 'json',
			success: function(data) {
				var count = parseInt($('.todo-count > strong').text());
				if(flag == 1) {
					$(parent).addClass("completed");
					$('.todo-count > strong').text(count - 1);
				} else {
					$(parent).removeClass("completed");
					$('.todo-count > strong').text(count + 1);
				}
			}
		})
	});
})(window);
