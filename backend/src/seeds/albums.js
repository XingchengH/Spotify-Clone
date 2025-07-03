import mongoose from "mongoose";
import { config } from "dotenv";
import { Album } from "../models/album.model.js";
import { Song } from "../models/song.model.js";
import Artist from "../models/artist.model.js";

config();

const albums = [
  {
    title: "A-LIN同名专辑",
    artist: "A-Lin",
    imgUrl: "/albums/1.jpg",
    releaseYear: 2017,
    songRange: [0, 5],
  },
  {
    title: "Fearless",
    artist: "Taylor Swift",
    imgUrl: "/albums/2.jpg",
    releaseYear: 2008,
    songRange: [5, 10],
  },
  {
    title: "With Love",
    artist: "Christina Grimmie",
    imgUrl: "/albums/3.jpg",
    releaseYear: 2013,
    songRange: [10, 15],
  },
  {
    title: "25",
    artist: "Adele",
    imgUrl: "/albums/4.jpg",
    releaseYear: 2015,
    songRange: [15, 20],
  },
];

const seedAlbums = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  try {
    await Album.deleteMany({});

    // Fetch all artists to map their names to ObjectIds
    const allArtists = await Artist.find();

    // Create a map for quick lookup
    const artistNameToId = {};
    allArtists.forEach((artist) => {
      artistNameToId[artist.name] = artist._id;
    });

    const allSongs = await Song.find();
    const createdAlbums = [];

    for (const album of albums) {
      // Map album.artist string to ObjectId
      const artistId = artistNameToId[album.artist];
      if (!artistId) {
        throw new Error(
          `Artist not found for album artist name: ${album.artist}`
        );
      }

      const songsForAlbum = allSongs.slice(...album.songRange);

      const newAlbum = await Album.create({
        title: album.title,
        artist: artistId, // Use ObjectId here
        imgUrl: album.imgUrl,
        releaseYear: album.releaseYear,
        songs: songsForAlbum.map((s) => s._id),
      });

      await Song.updateMany(
        { _id: { $in: songsForAlbum.map((s) => s._id) } },
        { albumId: newAlbum._id }
      );

      createdAlbums.push(newAlbum);
    }

    console.log("Albums seeded and songs updated");
  } catch (err) {
    console.error("Error seeding albums:", err);
  } finally {
    await mongoose.disconnect();
  }
};

seedAlbums();
