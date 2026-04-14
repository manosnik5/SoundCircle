import { Playlist } from "../models/playlist.model.js";
import { Song } from "../models/song.model.js";
import cloudinary from "../lib/cloudinary.js";

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      resource_type: "auto",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading playlist image:", error);
    throw new Error("Error uploading playlist image");
  }
};

const ensurePlaylistOwner = (playlist, ownerId) => {
  if (!playlist) {
    const err = new Error("Playlist not found");
    err.statusCode = 404;
    throw err;
  }
  if (playlist.ownerId !== ownerId) {
    const err = new Error("Forbidden - not owner");
    err.statusCode = 403;
    throw err;
  }
};

export const createPlaylist = async (req, res, next) => {
  try {
    const title = req.body?.title;
    const description = req.body?.description;

    if (!title || typeof title !== "string") {
      return res.status(400).json({ message: "Playlist title is required" });
    }

    const playlistData = {
      title: title.trim(),
      description: description?.trim() || "",
      ownerId: req.auth.userId,
      songs: [],
    };

    if (req.files?.imageFile) {
      playlistData.imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

    const playlist = await Playlist.create(playlistData);

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const getUserPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ ownerId: req.auth.userId }).populate("songs");
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

export const getPlaylistById = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId).populate("songs");
    ensurePlaylistOwner(playlist, req.auth.userId);
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const updatePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    ensurePlaylistOwner(playlist, req.auth.userId);

    const title = req.body?.title;
    const description = req.body?.description;

    if (title) playlist.title = title.trim();
    if (description !== undefined) playlist.description = description.trim();

    if (req.files?.imageFile) {
      playlist.imageUrl = await uploadToCloudinary(req.files.imageFile);
    }

    await playlist.save();
    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

export const deletePlaylist = async (req, res, next) => {
  try {
    const playlist = await Playlist.findById(req.params.playlistId);
    ensurePlaylistOwner(playlist, req.auth.userId);

    await playlist.deleteOne();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const addSongToPlaylist = async (req, res, next) => {
  try {
    const { songId } = req.body;
    if (!songId) {
      return res.status(400).json({ message: "Song id is required" });
    }

    const playlist = await Playlist.findById(req.params.playlistId);
    ensurePlaylistOwner(playlist, req.auth.userId);

    const song = await Song.findById(songId);
    if (!song) {
      return res.status(404).json({ message: "Song not found" });
    }

    const alreadyAdded = playlist.songs.some((id) => id.toString() === songId);
    if (!alreadyAdded) {
      playlist.songs.push(song._id);
      await playlist.save();
    }

    const updatedPlaylist = await Playlist.findById(req.params.playlistId).populate("songs");
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};

export const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const playlist = await Playlist.findById(playlistId);
    ensurePlaylistOwner(playlist, req.auth.userId);

    playlist.songs = playlist.songs.filter((id) => id.toString() !== songId);
    await playlist.save();

    const updatedPlaylist = await Playlist.findById(playlistId).populate("songs");
    res.status(200).json(updatedPlaylist);
  } catch (error) {
    next(error);
  }
};
