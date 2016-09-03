/**
 * Booking.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * @params : status(approved, under approvement, rejected, finished)
 */

module.exports = {

    attributes: {
	user: {
	    model: 'user'
	},
	parkingSpot: {
	    model: 'ParkingSpot'  
	},
	status: {
	    type: 'string'
	},
	startTime: {
	    type: 'date'
	},
	endTime: {
	    type: 'date'
	}
    }
};
