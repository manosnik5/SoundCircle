import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getAllFriends, getMessages, searchUsers } from "../controllers/user.controller.js";

const router = Router();

router.get("/", protectRoute, getAllFriends)
router.get('/search', protectRoute, searchUsers);
router.get("/messages/:userId", protectRoute, getMessages)

export default router;