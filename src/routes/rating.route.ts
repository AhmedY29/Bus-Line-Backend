import { createRating, deleteRating, getDriverRatings, getRating, updateRating } from '../controllers/rating.controller';
import { Router } from 'express';

const router = Router();


// Rating management
router.post('/', createRating);
router.get('/driver/:driverId', getDriverRatings);
router.get('/:rateId', getRating);
router.patch('/:rateId', updateRating);
router.delete('/:rateId', deleteRating);

export default router;