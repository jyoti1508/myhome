import Hotel from "../models/Hotel.js";
import User from "../models/User.js";

// export const registerHotel = async (req, res) => {
//   try {
//     const { name, address, contact, city } = req.body;
//     const owner = req.user._id;

//     // Check if User already Registered
//     const hotel = await Hotel.findOne({ owner });
//     if (hotel) {
//       return res.json({ success: false, message: "Hotel Already Registered" });
//     }
//     await Hotel.create({ name, address, contact, city, owner });
//     await User.findByIdAndUpdate(owner, { role: "hotelOwner" });
//     res.json({ success: true, messege: "Hotel register Successfully" });
//   } catch (error) {
//     res.json({ success: false, messege: error.message });
//   }
// };
// import Hotel from "../models/Hotel.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, city, address, contact } = req.body;
    if (!req.user)
      return res
        .status(401)
        .json({ success: false, message: "Not authenticated" });

    const newHotel = await Hotel.create({
      name,
      city,
      address,
      contact,

      owner: req.user._id,
    });

    res.json({ success: true, hotel: newHotel });
  } catch (error) {
    console.error("Hotel creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
