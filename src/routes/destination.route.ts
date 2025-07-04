import { createDestination, deleteDestination, getDestinations, updateDestination } from '../controllers/destination.controller';
import { Router } from 'express';

const router = Router();


// For DRIVER AND ADMIN
router.get('/', getDestinations);
router.post('/', createDestination);
// For Admin
router.patch('/:destinationId', updateDestination);
router.delete('/:destinationId', deleteDestination);

export default router;