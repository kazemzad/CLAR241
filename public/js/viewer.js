var images = new Array;
var index = 0;
var carolinaBlue = '#56A0D3';

$(document).ready(function() {
	getArray();

	$('body').keydown(function(event) {
		//Up arrow click
		if(event.keyCode == 38) {
			index++;
			console.log('Index is now ' + index);
			nextImage();
		}
		//down arrow click
		if(event.keyCode == 40) {
			if(index <= '0') return;
			index--;
			nextImage();
			console.log('Index is now ' + index);
		}
	});

	/*
		Send the edit to the server along with the id
		Then remove the edit button and the input form,
		and replace with the text
	*/
	$(document).on('click', '.editButton', function(event) {
		var event = $(event.target);
		var parent = event.parent();
		var input = event.parent().children('.editInput');
		var inputVal = input.val();
		event.remove();
		input.remove();
		parent.val(inputVal);
		parent.find('p').html(inputVal);
		var label = parent.find('.label').text().toLowerCase();
		label = label.substring(0,label.length-2);
		console.log('Label is ' + label);
		edit(label,inputVal);
	});

	$(document).on('click', '.editDescriptionButton', function(event) {
		var event = $(event.target);
		var parent = event.parent();
		var textarea = $('#textarea').val();
		event.remove();
		$('#textarea').remove();
		parent.val(textarea);
		parent.find('p').html(textarea);
		edit('description',textarea);
	});

	$(document).on('click', 'span.label', function() {
		var parent = $(event.target).parent().parent();
		var placeholder = parent.find('p').text();
		var label = $(event.target).text().trim().toLowerCase();
		label = label.substring(0,label.length-1);
		parent.find('p').text('');
		console.log('Label is ' + label);
		if(label == 'description') {
			var existingInput = parent.find('#textarea');
			if(typeof(existingInput) != 'undefined') {
				console.log('Textarea detected!');
				//return;
			}
			parent.append('<textarea id="textarea"></textarea>');
			parent.find('#textarea').val(placeholder);
			parent.append('<button class="editDescriptionButton">Submit</button>');
		}
		else {
			var existingInput = parent.find('.editInput');
			if(typeof(existingInput) != 'undefined') {
				console.log('Input detected!');
				//return;
			}
			var input = $('<input class="editInput" type="text"></input>');
			input.val(placeholder);
			parent.append(input);
			parent.append('<button class="editButton" name="Change" value="Change">Submit</button>');	
		}	
		
	});


});

function edit(label, value) {
	var id = images[index]._id;
	console.log('Inside edit with label ' + label + ' and value ' + value + ' and id ' + id);
	$.ajax({
		type: 'POST',
		url: '/edit',
		dataType: 'json',
		data: {label: label, value: value, id: id},
		success: function(data) {
			console.log('Successfully sent edit request for ' + id);
		},
		error: function() {
			console.log('Error sending edit request.');
		}
	});
}

function getArray() {
	$.ajax({
		type: 'GET',
		url: '/images',
		success: function(data) {
			images = data.array;
			console.log('Array 0 is ' + images[0]);
			nextImage();
		},
		error: function() {
			console.log('Error retrieving images.');
		}
	});
}

function nextImage() {
	clearData();
	var data = images[index];
	console.log('Data is' + data);
	var unitContainer = $('#unitContainer');
	var photo = $('#photo');
	var info = $('#info');
	
	photo.attr('src', 'images/exam3/' + data.filename);
	$('.name').append('<p>' + data.name + '</p>');
	$('.material').append('<p>' + data.material + '</p>');
	$('.period').append('<p>' + data.period + '</p>');
	$('.date').append('<p>' + data.date + '</p>');
	$('.description').append('<p>' + data.description + '</p>');
	$('.site').append('<p>' + data.site + '</p>');
}

function clearData() {
	$('.name').html('<span class="label"><b>Name: </b></span>');
	$('.date').html('<span class="label"><b>Date: </b></span>');
	$('.material').html('<span class="label"><b>Material: </b></span>');
	$('.period').html('<span class="label"><b>Period: </b></span>');
	$('.site').html('<span class="label"><b>Site: </b></span>');
	$('.description').html('<span class="label"><b>Description: </b></span>');
}