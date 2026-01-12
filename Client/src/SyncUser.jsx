import { useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import axios from "axios";

const SyncUser = () => {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded || !user) return;
    
    console.log("🔥 CLERK USER:", user.id);

    axios
      .post("http://localhost:3000/api/users/sync-user", {
        clerkId: user.id,
        email: user.primaryEmailAddress.emailAddress,
        username: user.fullName,
        image: user.imageUrl,
      })
      .then(() => console.log("✅ User synced to MongoDB"))
      .catch((err) =>
        console.error("❌ Sync user failed:", err.response?.data || err)
      );
  }, [isLoaded, user]);

  return null;
};

export default SyncUser;
