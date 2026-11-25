import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { getAdminProfile } from "./api";

function useAdmin() {
  const [state, setState] = useState({ loading: true, admin: null });

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ loading: false, admin: null });
        return;
      }
      const profile = await getAdminProfile(user.uid).catch(() => null);
      setState({ loading: false, admin: profile });
    });
  }, []);

  return state;
}

export default useAdmin;
