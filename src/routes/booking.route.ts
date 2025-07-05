import { cancelBooking, createBooking, getBookByTrip, getBooking, getBookingRelatedUser, getBookings, getBookingsByDriverId, getBookingsByStudentId, getBookingsPendingByDriverId, getPassengersByDriverId, updateBooking } from '../controllers/booking.controller';
import { Router } from 'express';


const router = Router();


// Bookings for regular users
router.post('/', createBooking);
router.get('/',getBookings);
// Student
router.get('/booking-student',getBookingsByStudentId);

// Driver 
router.get('/booking-driver',getBookingsByDriverId);
router.get('/booking-pending',getBookingsPendingByDriverId);
router.get('/booking-passengers',getPassengersByDriverId);
// -- Driver --
router.get('/:bookingId', getBooking);
router.get('/myBooking/:userId', getBookingRelatedUser);
router.patch('/:bookingId/cancel', cancelBooking);

// Admin/Driver booking management
router.get('/trip/:tripId', getBookByTrip);
router.patch('/:bookingId', updateBooking);


export default router;