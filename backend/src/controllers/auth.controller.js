import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 2 * 60 * 60 * 1000, // 2 hours
};

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const isAdmin = email === process.env.ADMIN_EMAIL;
  const lowercaseEmail = email.toLowerCase();

  const exists = await User.findOne({ email: lowercaseEmail });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = new User({ username, email: lowercaseEmail, password, isAdmin });
  await user.save();
  res.status(201).json({ message: "User created" });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  const user = await User.findOne({ email: lowercaseEmail });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, isAdmin: user.email === process.env.ADMIN_EMAIL },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.cookie("token", token, COOKIE_OPTIONS);
  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

const me = async (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: "No session" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ token, user: decoded });
  } catch {
    res.clearCookie("token");
    res.status(401).json({ message: "Session expired" });
  }
};

const logout = (req, res) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.json({ message: "Logged out" });
};

export { login, register, me, logout };
