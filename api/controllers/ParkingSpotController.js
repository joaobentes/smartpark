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
			    lat: spot.Latitude,
			    lng: spot.Longitude,
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
			    'Parking Types: ' + _.flatten(publicSpot.parkingType)  + '\n' +
			    'Area Types: ' + _.flatten(publicSpot.parkingAreaType)  + '\n' +
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
		    }).exec(function (err, spots) {
			if(err){
			    cb(err);
			} else {
			    console.log(spots);
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

