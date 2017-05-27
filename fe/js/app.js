(function (window) {
	'use strict';

	$(document).ready(function() {
		all();
	});

	function all() {
		$.ajax({
			url: './api/todos',
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				var items = [];
				var itemLeftCount = 0;
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
	}

	function filter(id) {
		var urlParam = '';
		if(id == 0) {
			urlParam = '/active';
		} else if(id == 1) {
			urlParam = '/completed';
		}
		$.ajax({
			url: './api/todos' + urlParam,
			method: 'GET',
			dataType: 'json',
			success: function(data) {
				var items = [];
				for(var i = 0; i < data.length; i++) {
					var className = '';
					var inputChecked = '';
					if(data[i].completed == 1) {
						className = ' class="completed"';
						inputChecked = ' checked';
					}
					items.push("<li" + className + " data-id=" + data[i].id + ">" + "<div class='view'><input class='toggle' type='checkbox'" + inputChecked + ">\
								<label>" + data[i].todo + "</label><button class='destroy'></button></div></li>");
				}
				$('.todo-list').html(items);
			}
		})
	}

	$('#btnAll').click(function() {
		$('.filters > li > a.selected').removeClass();
		$('#btnAll').attr('class', 'selected');
		all();
	});

	$('#btnActive').click(function() {
		$('.filters > li > a.selected').removeClass();
		$('#btnActive').attr('class', 'selected');
		filter(0);
	});

	$('#btnCompleted').click(function() {
		$('.filters > li > a.selected').removeClass();
		$('#btnCompleted').attr('class', 'selected');
		filter(1);
	});

	$('.new-todo').keypress(function(e) {
		if(e.keyCode == 13) {
			$(this).trigger('enterKey');
		}
	});
	$('.new-todo').bind('enterKey', function(e) {
		var text = $.trim($(this).val());
		if(text == "") {
			alert("내용을 입력해 주세요.");
		} else {
			$.ajax({
				url: './api/todos/',
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				data: JSON.stringify({
					todo: text,
					completed: 0
				}),
				dataType: 'json',
				success: function(data) {
					var item = '';
					var count = parseInt($('.todo-count > strong').text());
					$('.todo-count > strong').text(count + 1);
					
					item = "<li data-id=" + data.id + ">" + "<div class='view'><input class='toggle' type='checkbox'>\
								<label>" + data.todo + "</label><button class='destroy'></button></div></li>";
					if($('.todo-list').children().length == 0) {
						$('.todo-list').append(item);
					} else {
						$(item).insertBefore($('.todo-list').children().first());
					}
					$('.new-todo').val("");
				}
			})
		}
	});

	$('.todo-list').on('click', '.toggle', function() {
		var updateId = $(this).parent().parent().data('id');
		var parent = $(this).parent().parent();
		
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
					if($('#btnActive').attr('class') == 'selected') {
						$(parent).remove();
					} else {
						$(parent).addClass("completed");
					}
					$('.todo-count > strong').text(count - 1);
				} else {
					if($('#btnCompleted').attr('class') == 'selected') {
						$(parent).remove();
					} else {
						$(parent).removeClass("completed");
					}
					$('.todo-count > strong').text(count + 1);
				}
			}
		})
	});

	$('.todo-list').on('click', '.destroy', function() {
		var deleteId = $(this).parent().parent().data('id');
		var parent = $(this).parent().parent();

		console.log($(parent).attr('class'));
		$.ajax({
			url: './api/todos/' + deleteId,
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			success: function(data) {
				if($(parent).attr('class') != 'completed') {
					var count = parseInt($('.todo-count > strong').text());
					$('.todo-count > strong').text(count - 1);
				}
				$(parent).remove();
			}
		})
	});

	$('.clear-completed').click(function() {
		$.ajax({
			url: './api/todos/',
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			dataType: 'json',
			success: function(data) {
				$('.todo-list > li.completed').remove();
			}
		})
	});
})(window);
