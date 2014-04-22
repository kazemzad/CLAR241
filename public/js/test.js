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
	//so now i want to have just input forms
	//and then show this

	$('#submitButton').click(function() {
		displaySolution();
	});

});


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
	clearSolutions();
	var data = images[index];
	console.log('Data is' + data);
	var testContainer = $('#testContainer');
	var photo = $('#photo');
	var info = $('#info');
	
	photo.attr('src', 'images/' + data.filename);
	$('.name').append('<p>' + data.name + '</p>');
	$('.material').append('<p>' + data.material + '</p>');
	$('.period').append('<p>' + data.period + '</p>');
	$('.date').append('<p>' + data.date + '</p>');
	$('.description').append('<p>' + data.description + '</p>');
	$('.site').append('<p>' + data.site + '</p>');
}

function displaySolution() {
	var data = images[index];
	console.log('Data is' + data);
	var solutionContainer = $('#solutionContainer');
	solutionContainer.css('display', 'block');
	var photo = $('#photo');
	var info = $('#info');
	
	photo.attr('src', 'images/' + data.filename);
	$('.nameSol .info').append('<p>' + data.name + '</p>');
	$('.materialSol .info').append('<p>' + data.material + '</p>');
	$('.periodSol .info').append('<p>' + data.period + '</p>');
	$('.dateSol .info').append('<p>' + data.date + '</p>');
	$('.descriptionSol .info').append('<p>' + data.description + '</p>');
	$('.siteSol .info').append('<p>' + data.site + '</p>');
}

function clearData() {
	console.log('In clear data');
	$('.submission').val('');
	$('.name').html('<span class="label"><b>Name: </b></span>');
	$('.date').html('<span class="label"><b>Date: </b></span>');
	$('.material').html('<span class="label"><b>Material: </b></span>');
	$('.period').html('<span class="label"><b>Period: </b></span>');
	$('.site').html('<span class="label"><b>Site: </b></span>');
	$('.description').html('<span class="label"><b>Description: </b></span>');
}

function clearSolutions() {
	console.log('Clearing sol.');
	$('#solutionContainer').css('display', 'none');
	$('.info').html('');
	/*$('.nameSol .info').html('');
	$('.materialSol .info').html('');
	$('.periodSol .info').html('');
	$('.dateSol .info').html('');
	$('.descriptionSol .info').html('');
	$('.siteSol .info').html('');*/
}