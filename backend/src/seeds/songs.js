import mongoose from "mongoose";
import { Song } from "../models/song.model.js";
import { config } from "dotenv";
import Artist from "../models/artist.model.js";

config();

const songs = [
  // A-Lin Songs (1–5)
  {
    title: "给我一个理由忘记",
    artist: "A-Lin",
    genre: "Pop",
    language: "Mandarin",
    imgUrl: "/cover-images/1.jpg",
    audioUrl: "/audios/1.mp3",
    duration: 240,
  },
  {
    title: "失恋无罪",
    artist: "A-Lin",
    genre: "Pop",
    language: "Mandarin",
    imgUrl: "/cover-images/2.jpg",
    audioUrl: "/audios/2.mp3",
    duration: 230,
  },
  {
    title: "P.S.我爱你",
    artist: "A-Lin",
    genre: "Pop",
    language: "Mandarin",
    imgUrl: "/cover-images/3.jpg",
    audioUrl: "/audios/3.mp3",
    duration: 245,
  },
  {
    title: "以前，以后",
    artist: "A-Lin",
    genre: "Pop",
    language: "Mandarin",
    imgUrl: "/cover-images/4.jpg",
    audioUrl: "/audios/4.mp3",
    duration: 250,
  },
  {
    title: "有一种悲伤",
    artist: "A-Lin",
    genre: "Pop",
    language: "Mandarin",
    imgUrl: "/cover-images/5.jpg",
    audioUrl: "/audios/5.mp3",
    duration: 238,
  },

  // Taylor Swift Songs (6–10)
  {
    title: "Love Story",
    artist: "Taylor Swift",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/6.jpg",
    audioUrl: "/audios/6.mp3",
    duration: 230,
  },
  {
    title: "You Belong With Me",
    artist: "Taylor Swift",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/7.jpg",
    audioUrl: "/audios/7.mp3",
    duration: 212,
  },
  {
    title: "Blank Space",
    artist: "Taylor Swift",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/8.jpg",
    audioUrl: "/audios/8.mp3",
    duration: 231,
  },
  {
    title: "Shake It Off",
    artist: "Taylor Swift",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/9.jpg",
    audioUrl: "/audios/9.mp3",
    duration: 219,
  },
  {
    title: "Cardigan",
    artist: "Taylor Swift",
    genre: "Indie Pop",
    language: "English",
    imgUrl: "/cover-images/10.jpg",
    audioUrl: "/audios/10.mp3",
    duration: 242,
  },

  // Christina Grimmie Songs (11–15)
  {
    title: "With Love",
    artist: "Christina Grimmie",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/11.jpg",
    audioUrl: "/audios/11.mp3",
    duration: 233,
  },
  {
    title: "Liar Liar",
    artist: "Christina Grimmie",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/12.jpg",
    audioUrl: "/audios/12.mp3",
    duration: 225,
  },
  {
    title: "Must Be Love",
    artist: "Christina Grimmie",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/13.jpg",
    audioUrl: "/audios/13.mp3",
    duration: 214,
  },
  {
    title: "Cliché",
    artist: "Christina Grimmie",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/14.jpg",
    audioUrl: "/audios/14.mp3",
    duration: 207,
  },
  {
    title: "Invisible",
    artist: "Christina Grimmie",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/15.jpg",
    audioUrl: "/audios/15.mp3",
    duration: 236,
  },

  // Adele Songs (16–20)
  {
    title: "Hello",
    artist: "Adele",
    genre: "Soul",
    language: "English",
    imgUrl: "/cover-images/16.jpg",
    audioUrl: "/audios/16.mp3",
    duration: 295,
  },
  {
    title: "Rolling in the Deep",
    artist: "Adele",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/17.jpg",
    audioUrl: "/audios/17.mp3",
    duration: 228,
  },
  {
    title: "Someone Like You",
    artist: "Adele",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/18.jpg",
    audioUrl: "/audios/18.mp3",
    duration: 285,
  },
  {
    title: "Set Fire to the Rain",
    artist: "Adele",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/19.jpg",
    audioUrl: "/audios/19.mp3",
    duration: 242,
  },
  {
    title: "Easy On Me",
    artist: "Adele",
    genre: "Pop",
    language: "English",
    imgUrl: "/cover-images/20.jpg",
    audioUrl: "/audios/20.mp3",
    duration: 224,
  },
];

const seedSongs = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    await Song.deleteMany({});
    await Artist.deleteMany({});

    const artistName = [...new Set(songs.map((s) => s.artist))];
    const artistDocs = await Artist.insertMany(
      artistName.map((name) => ({
        name,
        imgUrl: `/artists/${name.toLowerCase().replace(/\s+/g, "-")}.jpg`,
        genre: [],
        language: "",
      }))
    );

    const getArtistId = (name) => artistDocs.find((a) => a.name === name)?._id;

    const songDocs = songs.map((s) => ({
      ...s,
      artist: getArtistId(s.artist),
    }));

    await Song.insertMany(songDocs);

    console.log("Songs and artists seeded successfully!");
  } catch (err) {
    console.log("error seeding songs", err);
  } finally {
    mongoose.connection.close();
  }
};

seedSongs();
