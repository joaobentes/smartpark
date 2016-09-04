/**
 * ParkingSpotController
 *
 * @description :: Server-side logic for managing Parkingspots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

function parseParkingAreaTypes(parkingAreaTypes){
    var parsedData = '';
    _.each(parkingAreaTypes, function(type){
	if(parsedData != ''){
	    parsedData += ', ';
	}
	switch(type){
	case 1: parsedData += 'Gata (avgift)'; break;
	case 2: parsedData += 'Yta (mark eller p-hus)'; break;
	case 3: parsedData += 'Tidsbegränsad (fri parkering)'; break;
	}
    });
    return parsedData;
}

function parseParkingTypes(parkingTypes){
    var parsedData = '';
    _.each(parkingTypes, function(type){
	if(parsedData != ''){
	    parsedData += ', ';
	}
	switch(type){
	case 1: parsedData += 'Avgiftplats'; break;
	case 2: parsedData += 'Förhyrd'; break;
	case 3: parsedData += 'El'; break;
	case 4: parsedData += 'Handikapp'; break;
	case 5: parsedData += 'MC'; break;
	case 6: parsedData += 'Buss'; break;
	case 7: parsedData +=  'Övrig'; break;
	}
    });
    return parsedData;
}

module.exports = {

    getSpotsByUser: function(req, res){

	async.waterfall([
	    function getParkingSpots(cb){
		var ownerId = req.allParams().ownerId;
		ParkingSpot.find({owner: ownerId})
		    .exec(function(err, spots) {
			if(err) {
			    cb(err);
			} else {
			    cb(null, spots);   
			}
		    });
	    },
	    function getBookedSpots(spots, cb){
		var bookedSpots = _.filter(spots, function(spot){
		    return spot.status == 'booked'; 
		});
		var spotIds = _.pluck(bookedSpots, 'id');
		Booking.find({
		    where: {
			parkingSpot: spotIds,
			status: {'!': 'finished'}
		    }
		}).populateAll().exec(function(err, bookings){
		    if(err){
			cb(err);
		    } else {
			cb(null, spots, bookings);	
		    }
		});
	    },
	    function mapBookedSpots(spots, bookings, cb){
		var bookedSpots = [];
		_.each(bookings, function(booking){
		    var newSpot = {};
		    newSpot = booking.parkingSpot;
		    newSpot.booking = {
			user: booking.user.name,
			endTime: booking.endTime
		    };
		    bookedSpots.push(newSpot);
		});
		cb(null, spots, bookedSpots);
	    },
	    function getNonBookedSpots(spots, bookedSpots, cb){
		var nonBookedSpots = _.filter(spots, function(spot){
		    return spot.state != 'booked'; 
		});
		var spots = _.union(bookedSpots, nonBookedSpots);
		cb(null, spots)
	    }
	], function(err, spots) {
	    if(err) {return res.serverError(err);}
	    return res.ok(spots);
	});
    },

    getAvailableSpots: function(req, res) {

	var url = sails.config.linkopingApi.urls.all + "/" + sails.config.linkopingApi.key + "/" + "0";

	request.get(url, function(erroe, response, body) {
	    
	    var resultData = JSON.parse(body);
	    var reliableLots = _.filter(resultData.ParkingAreaNewList, function(lot) {
		return !_.isUndefined(lot.ParkingSpacesAvailable);
	    });
	    
	    async.series({
		publicSpots: function(cb) {
		    publicSpots = [];
		    _.each(reliableLots, function(spot) {
			// Basic response object
			// New field: 
			// timeAvailability (startTime - endTime);
			publicSpot = {
			    name: spot.Name,
			    id: spot.Id,
			    latitude: spot.Latitude,
			    longitude: spot.Longitude,
			    parkingSpacesAvailable: spot.ParkingSpacesAvailable,
			    parkingSpaces: spot.ParkingSpaces,
			    parkingType: spot.ParkingTypes,
			    parkingAreaType: spot.ParkingAreaTypes,
			    paymentTypes: spot.PaymentTypes,
			    chargeDescription: spot.ChargeDescription,
			};
			
			publicSpot.info = 'Name: ' + publicSpot.name  + '  \n' +
			    'Available: ' + publicSpot.parkingSpacesAvailable  + '/' +
			    publicSpot.parkingSpaces + '\n' +
			    'Parking Types: ' + parseParkingTypes(publicSpot.parkingType)  + '\n' +
			    'Area Types: ' + parseParkingAreaTypes(publicSpot.parkingAreaType)  + '\n' +
			    'Description: ' +  publicSpot.chargeDescription;
			
			publicSpots.push(publicSpot);
		    });
		    
		    cb(null, publicSpots);
		},
		privateSpots: function(cb) {
		    privateSpots = [];
		    ParkingSpot.find({
			or : [
			    {state: "requestable"},
			    {state: "available"}
			]
		    }).populate("owner").exec(function (err, spots) {
			if(err){
			    cb(err);
			} else {
			    cb(null, spots);
			}
		    });
		}
	    }, function(err, result) {
		if(err) {
		    return res.send(err);
		} else {
		    return res.ok(result);   
		}
	    });
	});
    }
};

