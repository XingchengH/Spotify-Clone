import { deleteFromS3 } from "../lib/s3.js";
import { Album } from "../models/album.model.js";
import Artist from "../models/artist.model.js";
import { Song } from "../models/song.model.js";

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

export const addAlbum = async (req, res) => {
  try {
    const { title, artist: artistName, releaseYear } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({ message: "Image file is required" });
    }

    let artistDoc = await Artist.findOne({ name: artistName });
    if (!artistDoc) {
      artistDoc = await Artist.create({
        name: artistName,
        genre: [],
        language: "",
        imgUrl: "",
      });
    }

    const newAlbum = await Album.create({
      title,
      artist: artistDoc._id,
      releaseYear,
      imgUrl: imageFile.location,
    });

    const populatedAlbum = await Album.findById(newAlbum._id).populate(
      "artist"
    );
    res.status(201).json(populatedAlbum);
  } catch (error) {
    console.log("Error adding album", error);
    res.status(500).json({ message: "Failed to add album", error });
  }
};

export const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findById(req.params.albumId);
    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    await deleteFromS3(album.imgUrl);
    await Song.updateMany({ albumId: album._id }, { $unset: { albumId: "" } });
    await Album.findByIdAndDelete(req.params.albumId);

    res.status(200).json({ message: "Album deleted successfully" });
  } catch (error) {
    console.log("Error deleting album", error);
    res.status(500).json({ message: "Failed to delete album", error });
  }
};
