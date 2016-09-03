function updateSpotAvailability(id, status) {
    ParkingSpot.update({id: id}, {status: status})
	.exec(function(err, spot){
	    if(err) {
		console.log(err)
	    } else {
		console.log("Availability of " + spot.id + " set as " + spot.status)
	    };
	});

}

module.exports = function mqtt(sails) {

    return {
	
	initialize: function(cb) {

	    sails.on('hook:orm:loaded', function() {

		console.log("Mqtt on");

		// Set up the client
		var mqtt = require("mqtt");

		var options = {
		    protocolId: 'MQIsdp',
		    protocolVersion: 3
		};

		var client = mqtt.connect("mqtt://localhost", options);
		
		// Subscribe to the presence channel
		client.on('connect', function () {
		    console.log("Sub to channels");
		    client.subscribe('spot/occupied');
		    client.subscribe('spot/available');
		});

		// Process message on the topics
		client.on('message', function (topic, message) {
		    console.log('Always on');
		    if(topic === 'spot/occupied') {
			console.log(message.toString());
			//updateSpotAvailability(message.toString(), 'occupied');
		    } else if (topic === 'spot/available') {
			console.log(message);
			//updateSpotAvailability(message.toString(), 'available');
		    } else {
			console.log('Unknow message');
		    }
		});

		// Get errors
		client.on('error', function(){
		    console.log("ERROR");
		    client.end();
		});
		
		return cb();
		
	    });
	}
    };
}
