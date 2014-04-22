
$(document).ready(function() {
	$('#submitButton').click(function() {
		addContent();
	});
});

function addContent() {
	var name = $('#name').val().trim();
	var filename = $('#filename').val().trim();
	var site = $('#site').val().trim();
	var period = $('#period').val().trim();
	var date = $('#date').val().trim();
	var material = $('#material').val().trim();
	var description = $('#description').val().trim();

	if(name == '' || filename == '' || site == '' || period == '' || date == '' || description == '' || material == '') {
		alert('Must fill all fields.');
		return; 
	}

	$.ajax({
		type: 'POST',
		url: '/addContent',
		dataType: 'json',
		data: {name: name, filename: filename, site: site, period: period, date: date, material: material, description: description},
		success: function(data) {
			console.log('Successfully sent.');
			clearForm(site,period,date,material);	
		},
		error: function() {
			alert('Error sending data.');
		}
	});
};

function clearForm(site,period,date,material) {
	$('#name').val('');
	$('#filename').val('');
	$('#site').val(site);
	$('#period').val(period);
	$('#date').val(date);
	$('#material').val(material);
	$('#description').val('');
}
