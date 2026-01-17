import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY || "$";
  const navigate = useNavigate();
  const { user } = useUser();
  const { getToken } = useAuth();

  const [isOwner, setIsOwner] = useState(false);
  const [ownerLoading, setOwnerLoading] = useState(true);
  const [showHotelReg, setShowHotelReg] = useState(false);
  const [searchedCities, setSearchedCities] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async()=>{
    try {
      const {data} = await axios.get('/api/rooms')
      if (data.success) {
        setRooms(data.rooms);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(data.message)
    }
  }

  const syncUser = async () => {
  const token = await getToken();

  await axios.post(
    "/api/user/sync-user",
    {
      clerkId: user.id,
      email: user.primaryEmailAddress.emailAddress,
      username: user.fullName,
      image: user.imageUrl,
    },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};


  const fetchUser = async () => {
    try {
      const token = await getToken();

      const { data } = await axios.get("/api/user", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data?.success && data?.user) {
      setIsOwner(data.user.role === "hotelOwner");
      setSearchedCities(data.user.recentSearchCities || []);
    }
    } catch (error) {
      toast.error(error.message);
    }finally {
    setOwnerLoading(false); // 🔥 IMPORTANT
  }
  };

  useEffect(() => {
  if (!user) return;

  const initUser = async () => {
    await syncUser();   // 1️⃣ MongoDB me save
    await fetchUser();  // 2️⃣ MongoDB se read
  };

  initUser();
}, [user]);

useEffect(()=>{
  fetchRooms();
}, [])


  const value = {
    currency,
    navigate,
    user,
    getToken,
    isOwner,
    setIsOwner,
    ownerLoading,
    axios,
    showHotelReg,
    setShowHotelReg,
    searchedCities,
    setSearchedCities,
    rooms,
    setRooms,
  };

  return( 
   <AppContext.Provider value={value}>
    {children}
   </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
