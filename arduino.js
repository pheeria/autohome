

var http = require('http');
var retVal = '';
callback = function(response) {
  var str = '';
  retVal = '';
  response.on('data', function (chunk) {
    str += chunk;
  });
 
  response.on('end', function () {
    retVal = str;
  });
}

var options = {
		  host: 'juenjuen.local',
		  path: ''
		};
				
exports.analogRead = function(pin) {
	options.path = '/arduino/analog/' + pin;	
	http.request(options, callback).end(); 
	return retVal;
}

exports.digitalRead = function(pin) {
	options.path = '/arduino/digital/' + pin;	
	return http.request(options, callback).end(); 
}

exports.digitalWrite = function(pin, value) {
	options.path = '/arduino/digital/' + pin + '/' + value;
	http.request(options, callback).end();
}