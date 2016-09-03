/**
 * BookingController
 *
 * @description :: Server-side logic for managing bookings
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function(req, res) {
	var params = req.allParams();
	async.waterfall ([
	    function isRequestable(cb) {
		// Check if the spot is requestable or not
		ParkingSpot.findOne({id: params.parkingSpot})
		    .exec(function(err, spot){
			if(err) {cb(err); }
			cb(null, spot.owner, spot.isRequestable);
		    });
	    },
	    function createBooking(owner, isRequestable, cb){
		// Create a new booking (consider if is requestable)
		var booking = {
		    user: params.user,
		    parkingSpot: params.parkingSpot,
		    status: '',
		    startTime: params.startTime,
		    endTime: params.endTime
		}
		if(isRequestable) {
		    booking.status = 'under approvement';
		} else {
		    booking.status = 'approved'
		}
		Booking.create(booking).exec(function(err, newBooking) {
		    if(err) { cb(err); }
		    cb(null, owner, newBooking);
		});
	    },
	    function updateSpot(owner, booking, cb){
		// Update the parking spot
		if(booking.status=='approved'){
		    ParkingSpot.update({id: params.parkingSpot}, {status: 'booked'})
			.exec(function(err, spot){
			    if(err) {
				cb(err);
			    } else {
				console.log("Availability of " + spot.id + " set as " + spot.status);
				cb(null, owner, booking)
			    };
			});
		} else {
		    cb(null, owner, booking)
		}
	    },
	    function notifyOwner(owner, booking, cb) {
		// Notify user or request authorization
		console.log("Notify the user");
		
		if(booking.status === 'approved'){
		    console.log("Place booked");
		} else if (booking.status === 'under approvement'){
		    console.log("Ask user approvement");
		} else {
		    console.log("Unknow status");
		}
		
		cb(null, booking);
	    }
	], function(err, booking) {
	    if(err){ return res.serverError(err); }
	    return res.ok(booking);
	});
    }
};

