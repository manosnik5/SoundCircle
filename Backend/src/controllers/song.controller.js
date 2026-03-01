import { image } from "framer-motion/client";
import { Song } from "../models/song.model.js";

export const getAllSongs = async (req, res, next) => {
    try {
        const songs = await Song.find().sort({ createdAt: -1 });
        res.status(200).json(songs);
    }catch (error) {
        next(error);
    }
    
}

export const getSearchSongs = async (req, res, next) => {
    try{
        const { q } = req.query;

        if (!q || q.trim() === '') {
            return res.status(200).json([]);
        }

        const songs = await Song.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { artist: { $regex: q, $options: 'i' } }
            ]
        })
        .limit(10)
        .select('_id title artist imageUrl audioUrl duration');

        res.status(200).json(songs);

    }catch (error) {
        next(error);
    }
}

export const getFeaturedSongs = async (req, res, next) => {
    try{
        const featuredSongs = await Song.aggregate([
            {
                $sample: { size: 6 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ])

        res.status(200).json(featuredSongs);
    }catch (error) {
        next(error);
    }   
}

export const getMadeForYouSongs = async (req, res, next) => {
   try{
        const madeForYouSongs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ])

        res.status(200).json(madeForYouSongs);
    }catch (error) {
        next(error);
    }   
}

export const getTrendingSongs = async (req, res, next) => {
    try{
        const trendingSongs = await Song.aggregate([
            {
                $sample: { size: 4 }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    artist: 1,
                    imageUrl: 1,
                    audioUrl: 1,
                }
            }
        ])

        res.status(200).json(trendingSongs);
    }catch (error) {
        next(error);
    } 
}