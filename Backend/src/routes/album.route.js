import { Router } from "express";
import { getAllAlbums, getAlbumById, getSearchAlbums} from "../controllers/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/search", getSearchAlbums);
router.get("/:albumId", getAlbumById);

export default router;