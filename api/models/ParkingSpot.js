/**
 * ParkingSpot.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * @param state ("requestable","available","not offerred", "booked")
 * @param isOccupied ("true", "false")
 * @param isAvailable ("true", "false")
 */

module.exports = {

    attributes: {
	name: {
	    type: 'string'
	},
	owner: {
	    model: 'user'
	},
	pi: {
	    model: 'pi'  
	},
	latitude: {
	    type: 'string'
	},
	longitude: {
	    type: 'string'
	},
	state: {
	    type: 'string'  
	},
	isRequestable: {
	    type: 'boolean'
	},
	isOccupied: {
	    type: 'boolean'  
	},
	availableTo: {
	    type: 'date'
	}
    }
};

