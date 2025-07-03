// src/tests/user.test.js

import { jest } from "@jest/globals";

// Mock the auth middleware to inject a fake user ID
await jest.unstable_mockModule("../middleware/auth.middleware.js", () => ({
  __esModule: true,
  default: (req, res, next) => {
    req.user = {
      id: req.headers["x-test-user-id"] || "mockUserId",
      username: "test",
    };
    next();
  },
}));

// Dynamically import after mocking
const requestModule = await import("supertest");
const appModule = await import("../../app.js");
const userModelModule = await import("../models/user.model.js");
const songModelModule = await import("../models/song.model.js");
const artistModelModule = await import("../models/artist.model.js");
const bcryptModule = await import("bcryptjs");

const request = requestModule.default;
const app = appModule.default;
const User = userModelModule.default;
const { Song } = songModelModule;
const Artist = artistModelModule.default;
const bcrypt = bcryptModule.default;

describe("User API Tests", () => {
  let user, song, artist;

  beforeEach(async () => {
    // Create an artist
    artist = await Artist.create({
      name: "Test Artist",
      genre: "Pop",
      imageUrl: "http://example.com/image.jpg",
    });

    // Create a user
    user = await User.create({
      username: "test",
      email: "test@someone.com",
      password: await bcrypt.hash("someone1234", 10),
    });

    // Create a song with required fields
    song = await Song.create({
      title: "Test Song",
      artist: artist._id,
      duration: 240,
      audioUrl: "http://example.com/audio.mp3",
    });
  });

  it("should view user profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("x-test-user-id", user._id.toString());

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("test");
  });

  it("should update user profile", async () => {
    const updatedData = {
      username: "updatedUser",
      email: "updated@someone.com",
      password: "updatedPassword123",
    };

    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set("x-test-user-id", user._id.toString())
      .send(updatedData);

    expect(res.status).toBe(200);
    expect(res.body.username).toBe("updatedUser");
    expect(res.body.email).toBe("updated@someone.com");

    const updatedUser = await User.findById(user._id);
    const isPasswordCorrect = await bcrypt.compare(
      "updatedPassword123",
      updatedUser.password
    );

    expect(isPasswordCorrect).toBe(true);
  });

  it("should like a song", async () => {
    const res = await request(app)
      .post("/api/users/toggleLike")
      .set("x-test-user-id", user._id.toString())
      .send({ songId: song._id.toString(), liked: false });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.likedSongs)).toBe(true);

    const updatedUser = await User.findById(user._id).populate("likedSongs");
    const likedSongIds = updatedUser.likedSongs.map((s) => s._id.toString());

    expect(likedSongIds).toContain(song._id.toString());
  });

  it("should get all liked songs", async () => {
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { likedSongs: song._id },
    });

    const res = await request(app)
      .get("/api/users/likedSongs")
      .set("x-test-user-id", user._id.toString());

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(song._id.toString());
    expect(res.body[0].title).toBe("Test Song");
  });
});
