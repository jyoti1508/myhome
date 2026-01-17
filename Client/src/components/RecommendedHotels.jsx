import React, { useEffect, useState } from "react";
import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
  const [recommended, setRecommended] = useState([]);

  useEffect(() => {
    if (!rooms || rooms.length === 0) {
      setRecommended([]);
      return;
    }

    // 🟢 agar search hi nahi kiya → kuch bhi mat dikhao
    if (!searchedCities || searchedCities.length === 0) {
      setRecommended([]);
      return;
    }

    // 🟢 sirf LAST searched city
    const lastCity = searchedCities[searchedCities.length - 1];

    const filtered = rooms.filter(
      room =>
        room.hotel?.city?.toLowerCase() === lastCity.toLowerCase()
    );

    setRecommended(filtered);
  }, [rooms, searchedCities]);

   return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
      <Title
        title="Recommended Hotels"
        subTitle="Discover our handpicked selection of exeptional properties around the world."
      />

      <div className="flex flex-wrap items-center justify-center gap-6 mt-20 w-full">
        {searchedCities.length > 0 && recommended.length === 0 ? (
          <p className="mt-10 text-gray-500 text-lg text-center w-full">
            No Hotel found at this location
          </p>
        ) : (
          recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))
        )}
      </div>
    </div>
  );
};

export default RecommendedHotels;
