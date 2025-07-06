import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import User from "../models/user.model.js";
import Artist from "../models/artist.model.js";
import { deleteFromS3 } from "../lib/s3.js";

// GET /songs?search=&language=&genre=
export const getAllSongs = async (req, res) => {
  try {
    const { search, genre, language } = req.query;

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i"); // case-insensitive
      // condition: Match documents where either title or artist.name matches the regex
      filter.$or = [
        { title: regex },
        { "artist.name": regex }, // If using `.populate()`
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
    const { title, artist, duration, genre, language, albumId } = req.body;

    const audioFile = req.files["audioFile"][0];
    const imageFile = req.files["imageFile"][0];

    if (!audioFile || !imageFile) {
      return res
        .status(400)
        .json({ message: "Audio and image files are required." });
    }

    const audioUrl = audioFile?.location;
    const imgUrl = imageFile?.location;

    let artistId;
    const artistDoc = await Artist.findOne({ name: artist });

    if (artistDoc) {
      artistId = artistDoc._id;
    } else {
      const newArtist = new Artist({ name: artist });
      await newArtist.save();
      artistId = newArtist._id;
    }

    const song = new Song({
      title,
      artist: artistId,
      imgUrl: imgUrl || "",
      audioUrl,
      duration: Number(duration),
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

export const deleteSong = async (req, res) => {
  try {
    const songId = req.params.id;

    await Song.findByIdAndDelete(songId);

    if (!songId) {
      return res.status(404).json({ message: "Song not found" });
    }

    if (songId.albumId) {
      await Album.findByIdAndUpdate(songId.albumId, {
        $pull: { songs: songId._id },
      });
    }

    await deleteFromS3(songId.audioUrl);
    await deleteFromS3(songId.imgUrl);

    res.status(200).json({ message: "Song deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete song", error });
  }
}