"use client";

import React, { createContext, useState } from "react";
import { useShops } from "@/hooks";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase.init";
import useUserInfo from "@/hooks/useUserInfo";

export const ShopContext = createContext();

export default function ShopContextProvider({ children }) {
  const [shop, setShop] = useState(null);
  const [user] = useAuthState(auth);
  const { db_id } = useUserInfo(user?.email);
  const { shops, loading, refetch, setShops } = useShops(db_id);

  return (
    <ShopContext.Provider
      value={{ shops, shop, setShop, loading, refetch, setShops }}
    >
      {children}
    </ShopContext.Provider>
  );
}
