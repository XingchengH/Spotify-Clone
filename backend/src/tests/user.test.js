// src/tests/user.test.js

import { jest } from "@jest/globals";

await jest.unstable_mockModule("../middleware/auth.middleware.js", () => ({
  __esModule: true,
  default: (req, res, next) => {
    // Here `user` is undefined outside `describe()`, so use a trick:
    req.user = {
      id: req.headers["x-test-user-id"] || "mockUserId",
      username: "test",
    };
    next();
  },
}));

// 2. Dynamically import modules AFTER the mock is set up
const requestModule = await import("supertest");
const appModule = await import("../../app.js");
const userModelModule = await import("../models/user.model.js");
const bcryptModule = await import("bcryptjs");

const request = requestModule.default;
const app = appModule.default;
const User = userModelModule.default;
const bcrypt = bcryptModule.default;

// 3. Now your tests
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
      .set("x-test-user-id", user._id.toString()) // ✅ fixed
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
});
