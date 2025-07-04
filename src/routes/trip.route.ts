import { createTrip, deleteTrip, getOneTrip, getTrips, updateTrip } from '../controllers/trip.controller';
import { Router } from 'express';

const router = Router();


// // Trip management
router.post('/', createTrip);
router.get('/', getTrips);
router.get('/:tripId', getOneTrip);
router.patch('/:tripId', updateTrip);
router.delete('/:tripId', deleteTrip);

export default router;