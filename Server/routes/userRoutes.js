import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  getUserData,
  storeRecentSearchCities,
} from "../controllers/userController.js";

import User from "../models/User.js";

const router = express.Router();

router.post("/sync-user", async (req, res) => {
  try {

     console.log("SYNC USER BODY 👉", req.body);

    const { clerkId, email, name, image } = req.body;

    if (!clerkId || !email) {
      return res.status(400).json({
        success: false,
        message: "Missing clerkId or email",
      });
    }

    let user = await User.findOne({ clerkId });

    if (!user) {
      user = await User.create({
        clerkId,
        email,
        username: name,
        image,
      });
       console.log("✅ USER CREATED");
    }

    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Sync failed" });
  }
});

// router.get("/", protect, getUserData);
// router.post("/store-recent-search", protect, storeRecentSearchCities);

export default router;
