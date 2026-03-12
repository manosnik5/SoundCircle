import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { sendFriendRequest, acceptFriendRequest, rejectFriendRequest, getPendingRequests, removeFriend } from '../controllers/friend.controller.js';

const router = express.Router();

router.post('/request', protectRoute, sendFriendRequest);
router.post('/request/:requestId/accept', protectRoute, acceptFriendRequest);
router.post('/request/:requestId/reject', protectRoute, rejectFriendRequest);
router.get('/requests/pending', protectRoute, getPendingRequests);
router.delete('/:friendId', protectRoute, removeFriend);

export default router;