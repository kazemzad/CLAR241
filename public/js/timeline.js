var dates = new Array;
var index = 0;

$(document).ready(function() {
	getDates();
	$(document).on('click', '#submitButton', function(event) {
		console.log('Click event');
		$('.timeSolution').css('display', 'inline-block');
	});

	$('body').keydown(function(event) {
		//Up arrow click
		if(event.keyCode == 38) {
			index++;
			console.log('Index is now ' + index);
			$('#timeContainer').empty();
			next();
		}
		//down arrow click
		if(event.keyCode == 40) {
			if(index <= '0') return;
			index--;
			$('#timeContainer').empty();
			next();
			console.log('Index is now ' + index);
		}
	});
});

function next() {
	var data = dates[index];
	var time = $('#timeContainer');
	var unit = $('<div class="input"></div>');
	var input = $('<input class="dateInput" type="text"></input>');
	var text = $('<div class="text"></div>');
	var solution = $('<div class="timeSolution"></div>');
	solution.append('<p>' + dates[index].time + '</p>');
	text.append('<p>' + dates[index].period + '</p>');
	unit.append(text);
	unit.append(input);
	unit.append(solution);
	time.append(unit);
	time.append('<button id="submitButton">Submit</button>');
}


function getDates() {
	$.ajax({
		type: 'GET',
		url: '/dates',
		dateType: 'json',
		success: function(data) {
			dates = data.dates;
			console.log('Dates size is ' + dates.length);
			//populatePage();
			next();
		},
		error: function() {
			console.log('Error retrieving dates.');
		}
	});
}

function populatePage() {
	var time = $('#timeContainer');
	for(var i = 0; i < dates.length; i++) {
		var unit = $('<div class="input"></div>');
		var input = $('<input class="dateInput" type="text"></input>');
		var text = $('<div class="text"></div>');
		var solution = $('<div class="timeSolution"></div>');
		solution.append('<p>' + dates[i].time + '</p>');
		text.append('<p>' + dates[i].period + '</p>');
		unit.append(text);
		unit.append(input);
		unit.append(solution);
		time.append(unit);
		console.log('Appending');
	}
	time.append('<button id="submitButton">Submit</button>');
}