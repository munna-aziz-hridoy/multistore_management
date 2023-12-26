"use client";

// react import
import React, { useContext } from "react";

// component import
import { Appbar, Sidebar, Auth } from "..";

// context import
import {
  ShopContextProvider,
  SidebarContext,
  UserContextProvider,
} from "@/context";
import { usePathname } from "next/navigation";

function Main({ children }) {
  const { collapse } = useContext(SidebarContext);

  const pathname = usePathname();

  return (
    <>
      {pathname.includes("auth") ? (
        children
      ) : (
        <Auth>
          <ShopContextProvider>
            <UserContextProvider>
              <Sidebar />
              <Appbar />
              <div
                className={`${
                  collapse ? "ml-[70px]" : "ml-[220px]"
                } transition-all duration-300 p-[30px]`}
              >
                {children}
              </div>
            </UserContextProvider>
          </ShopContextProvider>
        </Auth>
      )}
    </>
  );
}

export default Main;
