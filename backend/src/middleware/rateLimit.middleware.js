const requests = new Map();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;

export const rateLimitAuth = (req, res, next) => {
  const ip = req.ip || req.socket.remoteAddress;
  const now = Date.now();
  const entry = requests.get(ip);

  if (!entry || now > entry.resetTime) {
    requests.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return next();
  }

  if (entry.count >= MAX_REQUESTS) {
    return res.status(429).json({ message: "Too many requests, please try again later." });
  }

  entry.count += 1;
  next();
};
