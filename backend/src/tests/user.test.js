import request from "supertest";
import app from "../../server.js";
import User from "../models/user.model.js";
import { Song } from "../models/song.model.js";
import bcrypt from "bcryptjs";
import { jest } from "@jest/globals";

jest.mock("../src/middleware/auth.middleware.js"); // mock JWT auth

describe("User API Tests", () => {
  let user;

  beforeEach(async () => {
    user = await User.create({
      username: "test",
      email: "test@someone.com",
      password: await bcrypt.hash("someone1234", 10),
    });
  });

  it("should view user profile", async () => {
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("text@someone.com");
  });
});
