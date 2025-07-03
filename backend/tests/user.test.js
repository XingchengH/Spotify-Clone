import request from "supertest";
import app from "../server.js";
import User from "../models/user.model";
import Song from "../models/song.model";
import bcrypt from "bcryptjs";

vi.mock("../src/middleware/auth.middleware.js"); // mock JWT auth

describe("User API Tests", () => {
 
});
