/**
 * ParkingSpot.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 * @param state ("requestable","available","occupied")
 */

module.exports = {

    attributes: {
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
	availableTo: {
	    type: 'date'
	}
    }
};

