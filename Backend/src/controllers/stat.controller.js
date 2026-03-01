import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import { User } from "../models/user.model.js";

export const getStats = async (req, res, next) => {
    try {
        const [totalSongs, totalAlbums, totalUsers, uniqueArtists] = await Promise.all([
            Song.countDocuments(),
            Album.countDocuments(),
            User.countDocuments(),
            
            // Get unique artists from songs only
            Song.distinct("artist")
        ]);

        res.status(200).json({
            totalSongs,
            totalAlbums,
            totalUsers,
            totalArtists: uniqueArtists.length, // distinct returns array
        });
        
    } catch (error) {
        next(error);
    }
}