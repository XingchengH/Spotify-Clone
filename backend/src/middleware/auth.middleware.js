import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  // console.log("TOKEN:", token);
  // console.log("SECRET:", process.env.JWT_SECRET); 

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("Decoded JWT:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT verification error:", err.message);
    res.status(403).json({ message: "Forbidden - Invalid or expired token" });
  }
};

export default auth;
