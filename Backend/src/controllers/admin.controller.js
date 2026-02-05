import {Song} from "../models/song.model.js";
import {Album} from "../models/album.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
    try{
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            resource_type: "auto",
        })
        return result.secure_url;
    }catch(error){
        console.error("Error uploading to Cloudinary:", error);
        throw new Error("Failed to upload file to Cloudinary");
    }
}

export const createSong = async (req, res, next) => {
    try{
        if(!req.files || !req.files.audioFile || !req.files.imageFile){
            return res.status(400).json({message: "Audio file and Image file are required." });
        }

        const { title, artist, albumId, duration } = req.body;
        const audioFile = req.files.audioFile;
        const imageFile = req.files.imageFile;

        const audioUrl = await uploadToCloudinary(audioFile);
        const imageUrl = await uploadToCloudinary(imageFile);

        const song = new Song({
            title,
            artist,
            imageUrl,
            audioUrl,
            duration,
            albumId: albumId || null
        })

        await song.save();

        if(albumId){
            await Album.findByIdAndUpdate(albumId, {
                $push: { songs: song._id }
            });
        }

        res.status(201).json({ message: "Song created successfully", song });
    }catch(error){
        console.error("Error creating song:", error);
        next(error);
    }
}

export const deleteSong = async (req, res, next) => {
    try {
        const { id } = req.params;

        const song = await Song.findById(id);

        if (!song) {
            return res.status(404).json({ message: "Song not found" });
        }

        if (song.albumId) {
            await Album.findByIdAndUpdate(song.albumId, {
                $pull: { songs: song._id }
            })
        }

        await Song.findByIdAndDelete(id);

        res.status(200).json({ message: "Song deleted successfully" });
    }catch(error){
        console.error("Error deleting song:", error);
        next(error);
    }
}