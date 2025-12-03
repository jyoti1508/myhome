import User from "../models/User.js";

// Middleware to check if user is authenticated
const protect = async (req, res, next) => {
  const { userId } = req.path;

  if (!userId) {
    return res.json({ success: false, message: "not authenticated" });
  }

  const user = await User.findById(userId);
  req.user = user;
  next();
};

export default protect;
