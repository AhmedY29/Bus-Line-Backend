import { createTrip, deleteTrip, getOneTrip, getTrips, getTripsByDriverId, updateTrip } from '../controllers/trip.controller';
import { Router } from 'express';

const router = Router();


// // Trip management
router.post('/', createTrip);
router.get('/driver-trips', getTripsByDriverId);
router.get('/', getTrips);
router.get('/:tripId', getOneTrip);
router.patch('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

export default router;