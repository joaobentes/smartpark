var mqtt = require("mqtt");
var client  = mqtt.connect('tcp://138.68.139.166');

function updateSpotAvailability(id, status) {
    ParkingSpot.update({id: id}, {isAvailable: status})
	.exec(function(err, spot){
	    if(err) {
		console.log(err)
	    } else {
		console.log("Availability of " + spot.id + " set as " + spot.isAvailable)
	    };
	});

}

module.exports = function mqtt(sails) {

    return {
	
	initialize: function(cb) {

	    sails.on('hook:orm:loaded', function() {

		console.log("Mqtt on");
		
		// Subscribe to the presence channel
		client.on('connect', function () {
		    console.log("Sub to channels");
		    client.subscribe('spot/occupied');
		    client.subscribe('spot/available');
		    client.publish('spot/occupied', '123');
		    client.publish('spot/available', '123');
		});

		console.log(client);

		client.on('message', function (topic, message) {
		    console.log('Always on');
		    console.log(topic);
		    console.log(message.toString());
		    if(topic === 'spot/occupied') {
			console.log("Mqtt");
			console.log(mesasge.toString());
			//updateSpotAvailability(message.toString(), false);
		    } else if (topic == 'spot/available') {
			console.log("Mqtt");
			console.log(mesasge);
			//updateSpotAvailability(message.toString(), true);
		    } else {
			console.log('Unknow message');
		    }
		    client.end();
		});
		
		return cb();
		
	    });
	}
    };
}
