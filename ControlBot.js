/****************************************************************
 * Coders: Erhan YILMAZ, Olzhas ASKAR                        	*
 * Application: Smart Home Automation with Telegram Bot API and	*
 * Raspberry Pi 												*
 * Date: 29-05-2016												*
 * Version: 1.0													*
 * *************************************************************/


var config = require('./config.json');
var logger = require('./logger.js') ;
var telegram = require('telegram-bot-api');
var gpio = require('rpi-gpio');
var arduino = require('./arduino.js');

var api = new telegram({
	token: config.token,
	updates: {
		enabled: true,
		get_interval: 1000
	}
});

gpio.setup(config.bedroom, gpio.DIR_OUT);
gpio.setup(config.living, gpio.DIR_OUT);

logger.newEntry('SERVER', 'Smart Home Automation System launched successfully!');
/////////////////////////////////////////////////////////

var chatId;
var chatName;
var txt = "";
var command = "";
var setValue = false;

function switchOnOff(pin) {		
	gpio.write(pin, setValue, function(err) {
			if (err) logger.newEntry('SYSTEM', err);
		});		
	txt = 'Yes, Bro!';		
}

function writeResponse(msg) {
	api.sendMessage({
				chat_id: chatId,
				text: msg
			}, function(err, message)
			{
				if(err)logger.newEntry('SYSTEM', err);
			});
}

function selectRoom() {
	if (command.indexOf("bed") > -1)
		switchOnOff(config.bedroom);
	else if (command.indexOf("living") > -1)
		switchOnOff(config.living);	
	else if (command.indexOf("bath") > -1){
		arduino.digitalWrite(5, Number(setValue));
		txt = 'Yes, Bro!';
	}		
}
  
api.on('message', function(message)
{
	chatId = message.chat.id;			
	chatName = message.chat.first_name;	
	command =  message.text.toLowerCase();	
	if(chatId == config.ErhanID || chatId == config.OlzhasID)
	{	
		if (command.indexOf("on") > -1)
			setValue = true;
		else if (command.indexOf("off") > -1)
			setValue = false;		
		else if(command.indexOf("temp") > -1)
			txt = arduino.analogRead(3);
		else	
			txt = "Unknown command, Bro";
		
		selectRoom();
	}
	else			
		txt = 'No way you are entering here, Bro!';		
		
	
	logger.newEntry(chatName, command);
	writeResponse(txt);	
});
