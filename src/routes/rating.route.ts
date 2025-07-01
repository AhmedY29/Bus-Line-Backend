import { Router } from 'express';

const router = Router();


// Review management
router.post('/', createReview);
router.get('/driver/:driverId', getDriverReviews);
router.get('/:reviewId', getReview);
router.patch('/:reviewId', updateReview);
router.delete('/:reviewId', deleteReview);

export default router;