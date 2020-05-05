const logger = require('./logger');
const data = require('./data');
const fs = require('fs');
const mqttHost = 'mqtt://localhost';
const mqtt = require('mqtt');
const client = mqtt.connect(mqttHost);

client.on('connect', function() {
	logger.info(`Connected to ${mqttHost}`);

	client.subscribe('#', function(err) {
		if(err)
			return logger.error(err);
		logger.info('Subscribed to all topic')
	});
});

client.on('message', function(topic, message) {
	try {
		const { latitude, longitude } = JSON.parse( message.toString() )

		let element = data[topic]
		if(!data[topic])
			data[topic] = []

		data[topic].push({
			latitude,
			longitude
		})

		fs.writeFile('data.json', JSON.stringify( data ), function (err) {
		  if (err) throw err;
		  logger.info('New data pushed')
		});
	} catch(err) {
		logger.error(err)
	}
});

