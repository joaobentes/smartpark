/**
 * ParkingSpot.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * @param paymentType : 0 - credit card
 */

module.exports = {

    attributes: {
	latitude: {
	    type: 'string'
	},
	longitude: {
	    type: 'string'
	},
	parkingType: {
	    type: 'string'
	},
	paymentType: {
	    type: 'integer'	    
	},
	isAvailable: {
	    type: 'boolean'  
	},
	availableFrom: {
	    type: 'date'
	},
	availableTo: {
	    type: 'date'
	}
    }
    
};

