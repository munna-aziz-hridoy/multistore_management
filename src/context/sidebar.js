"use client";

import React, { createContext, useEffect, useState } from "react";

export const SidebarContext = createContext();

export default function SidebarContextProvider({ children }) {
  const [collapse, setCollapse] = useState(false);
  const [delay, setDelay] = useState(true);

  useEffect(() => {
    if (collapse) {
      setDelay(false);
    } else {
      setTimeout(() => {
        setDelay(true);
      }, 300);
    }
  }, [collapse]);

  const sidebarToggle = () => {
    setCollapse((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ collapse, setCollapse, sidebarToggle, delay }}
    >
      {children}
    </SidebarContext.Provider>
  );
}
