import { verifyToken } from "@clerk/backend";
import User from "../models/User.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });
    }

    const token = authHeader.split(" ")[1];

    // Verify Clerk token
    const decoded = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    // Find user in MongoDB using Clerk ID
    const user = await User.findOne({ clerkId: decoded.sub });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found in database" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("AUTH ERROR:", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

export default protect;
