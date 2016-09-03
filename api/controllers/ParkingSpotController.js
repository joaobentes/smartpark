/**
 * ParkingSpotController
 *
 * @description :: Server-side logic for managing Parkingspots
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var request = require('request');

module.exports = {

    getAvailableSpots: function(req, res) {
	var url = sails.config.linkopingApi.urls.all + "/" + sails.config.linkopingApi.key + "/" + "0";

	request.get(url, function(erroe, response, body) {
	    
	    var resultData = JSON.parse(body);
	    var reliableLots = _.filter(resultData.ParkingAreaNewList, function(lot) {
		return !_.isUndefined(lot.ParkingSpacesAvailable);
	    });
	    
	    console.log(_.pluck(reliableLots, "ParkingSpacesAvailable"));
	    
	    var availableParkingSpots = {
		publicSpots: [],
		privateSpots: []
	    };
	    
	    _.each(reliableLots, function(spot) {
		// Basic response object
		// New field: 
		// parkingCategory (0-public, 1-private free, 2-private request)
		// timeAvailability (startTime - endTime);
		publicSpot = {
		    name: spot.Name,
		    id: spot.Id,
		    lat: spot.Latitude,
		    lon: spot.Longitude,
		    parkingSpacesAvailable: spot.ParkingSpacesAvailable,
		    parkingSpaces: spot.ParkingSpaces,
		    parkingType: spot.ParkingTypes,
		    parkingAreaType: spot.ParkingAreaTypes,
		    paymentTypes: spot.PaymentTypes,
		    chargeDescription: spot.ChargeDescription,
		};
		
		availableParkingSpots.publicSpots.push(publicSpot);
	    });

	    console.log(availableParkingSpots);
	    
	    return res.ok(availableParkingSpots);
	});
    }
};

