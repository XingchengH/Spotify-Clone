import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import User from "../models/user.model.js";
import Artist from "../models/artist.model.js";

// Get all songs with populated artist
// GET /songs?search=&language=&genre=
export const getAllSongs = async (req, res) => {
  try {
    const { search, genre, language } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      filter.$or = [
        { title: regex },
        { "artist.name": regex } // If using `.populate()`
      ];
    }

    if (genre) {
      filter.genre = genre;
    }

    if (language) {
      filter.language = language;
    }

    const songs = await Song.find(filter).populate("artist");
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching songs", error });
  }
};

// Featured Songs: 6 random songs with populated artist via aggregation
export const getFeaturedSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $project: {
          _id: 1,
          title: 1,
          imgUrl: 1,
          audioUrl: 1,
          artist: {
            _id: 1,
            name: 1,
            imgUrl: 1,
          },
        },
      },
    ]);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

// Made for You Songs
export const getMadeForYouSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 4 } },
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $project: {
          _id: 1,
          title: 1,
          imgUrl: 1,
          audioUrl: 1,
          artist: {
            _id: 1,
            name: 1,
            imgUrl: 1,
          },
        },
      },
    ]);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

// Trending Songs
export const getTrendingSongs = async (req, res, next) => {
  try {
    const songs = await Song.aggregate([
      { $sample: { size: 6 } },
      {
        $lookup: {
          from: "artists",
          localField: "artist",
          foreignField: "_id",
          as: "artist",
        },
      },
      { $unwind: "$artist" },
      {
        $project: {
          _id: 1,
          title: 1,
          imgUrl: 1,
          audioUrl: 1,
          artist: {
            _id: 1,
            name: 1,
            imgUrl: 1,
          },
        },
      },
    ]);
    res.json(songs);
  } catch (err) {
    next(err);
  }
};

// Add new song
export const addSong = async (req, res, next) => {
  try {
    const {
      title,
      artist,
      imgUrl,
      audioUrl,
      duration,
      genre,
      language,
      albumId,
    } = req.body;

    const song = new Song({
      title,
      artist,
      imgUrl: imgUrl || "",
      audioUrl,
      duration,
      genre,
      language,
      albumId: albumId || null,
    });

    await song.save();

    if (albumId) {
      await Album.findByIdAndUpdate(albumId, {
        $push: { songs: song._id },
      });
    }

    res.status(201).json(song);
  } catch (error) {
    res.status(500).json({ message: "Failed to add song", error });
  }
};
