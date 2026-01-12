import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
  try {
    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

    // Must extract raw headers
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };

    // Convert raw body buffer to string
    const payload = req.body.toString("utf8");

    // Verify signature
    const evt = await wh.verify(payload, headers);
    const { data, type } = evt;

    

    if (type === "user.created") {
      const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
      recentSearchedCities: "",
    };
      await User.create(userData);
    }

    if (type === "user.updated") {
      const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: `${data.first_name} ${data.last_name}`,
      image: data.image_url,
      recentSearchedCities: "",
    };
      await User.findByIdAndUpdate(data.id, userData);
    }

    if (type === "user.deleted") {
      await User.findByIdAndDelete(data.id);
    }

    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("Webhook Error:", error.message);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
