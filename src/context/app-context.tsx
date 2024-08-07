"use client";

import { AppContextTypes, Screen } from "@/types";
import { createContext, ReactNode, useContext, useState } from "react";

const AppContext = createContext<AppContextTypes | undefined>(undefined);

export const ContextProvider = ({ children }: { children: ReactNode }) => {
  const [screen, setScreen] = useState<Screen>("home");
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [startDiscussion, setStartDiscussion] = useState(false);

  const value = {
    screen,
    setScreen,
    authenticated,
    setAuthenticated,
    username,
    setUsername,
    userId,
    setUserId,
    startDiscussion,
    setStartDiscussion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  if (!AppContext) {
    throw new Error("AppContext is undefined");
  }

  return useContext(AppContext);
};
