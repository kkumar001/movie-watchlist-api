import express from 'express';
import { addToWatchlist, removeFromWatchlist, updateWatchlistItem } from '../controllers/watchlistController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequestMiddleware } from '../middleware/validateRequestMiddleware';
import { addToWatchlistSchema, updateWatchlistItemSchema } from '../validators/watchlistValidators';

const router = express.Router();

router.use(authMiddleware);

router.post('/', validateRequestMiddleware(addToWatchlistSchema), addToWatchlist);
router.put('/:id', validateRequestMiddleware(updateWatchlistItemSchema), updateWatchlistItem);
router.delete('/:id', removeFromWatchlist);

export default router;