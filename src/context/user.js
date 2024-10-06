"use client";

import { auth } from "@/firebase.init";
import useUserInfo from "@/hooks/useUserInfo";
import React, { createContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const UserContext = createContext();

export default function UserContextProvider({ children }) {
  const [user] = useAuthState(auth);
  const { db_id, sites, loading, refetch, userInfo } = useUserInfo(user?.email);

  return (
    <UserContext.Provider value={{ db_id, sites, loading, refetch, userInfo }}>
      {children}
    </UserContext.Provider>
  );
}
