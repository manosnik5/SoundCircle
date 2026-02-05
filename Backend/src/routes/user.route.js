import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/like", protectRoute, (req, res) => {
    req.auth.userId;
    res.send("User route is working");
});

export default router;