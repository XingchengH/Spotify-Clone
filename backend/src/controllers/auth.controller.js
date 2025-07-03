import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  const { username, email, password } = req.body;
  const lowercaseEmail = email.toLowerCase();

  const exists = await User.findOne({ email: lowercaseEmail });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const user = new User({ username, email: lowercaseEmail, password });
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

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({
    token,
    user: { id: user._id, username: user.username, email: user.email },
  });
};

export { login, register };
