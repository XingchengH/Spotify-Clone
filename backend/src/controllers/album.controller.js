import { Album } from "../models/album.model.js";
import Artist from "../models/artist.model.js";

export const getAllAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find().populate("artist").populate("songs");
    res.status(201).json({ albums });
  } catch (err) {
    next(err);
  }
};

export const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findById(albumId)
      .populate("artist")
      .populate({
        path: "songs",
        populate: {
          path: "artist",
          model: "Artist",
        },
      });
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.status(201).json(album);
  } catch (err) {
    next(err);
  }
};
