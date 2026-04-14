import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  updatePlaylist,
  deletePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.use(protectRoute);
router.get("/", getUserPlaylists);
router.post("/", createPlaylist);
router.get("/:playlistId", getPlaylistById);
router.put("/:playlistId", updatePlaylist);
router.delete("/:playlistId", deletePlaylist);
router.post("/:playlistId/songs", addSongToPlaylist);
router.delete("/:playlistId/songs/:songId", removeSongFromPlaylist);

export default router;
