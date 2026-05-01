import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // console.log("TOKEN:", token);
  // console.log("SECRET:", process.env.JWT_SECRET);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden - Invalid or expired token" });
  }
};

export const requireAuth = (req, res, next) => {
  try {
    if (!req.user?.isAdmin) {
      return res.status(403).json({ message: "Forbidden - User is not admin" });
    }
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
