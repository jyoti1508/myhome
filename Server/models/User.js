import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true }, // Clerk User ID (keep if needed)

    username: { type: String, required: true },
    email: { type: String, required: true },
    image: { type: String, required: true },

    role: {
      type: String,
      enum: ["user", "hotelOwner"],
      default: "user",
    },

    recentSearchedCities: {
      type: [String], // <-- now an array
      default: [], // no need to make it required
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
