"use client";

import { useEffect } from "react";
import CreateAccount from "@/components/create-account";
import Login from "@/components/login";
import Main from "@/components/main";
import { useAppContext } from "@/context/app-context";
import { fetcher } from "@/lib/fetcher";
import { useQuery } from "@tanstack/react-query";

import React from "react";

const HomePage = () => {
  const { screen, setAuthenticated, setUsername, setUserId } = useAppContext()!;

  const getMeQuery = useQuery({
    queryKey: ["getMe"],
    queryFn: async () => await fetcher("/api/user/me", "GET", {}),
    enabled: screen === "home",
  });

  useEffect(() => {
    if (getMeQuery.data) {
      const { authenticated, username, userId } = getMeQuery.data;

      setAuthenticated(authenticated);
      setUsername(username);
      setUserId(userId);
    }
  }, [getMeQuery.data, setAuthenticated, setUsername, setUserId]);

  if (getMeQuery.isLoading || getMeQuery.isFetching) {
    return (
      <h1 className="text-3xl md:text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse font-medium">
        Loading the data...
      </h1>
    );
  }

  if (screen === "login") {
    return <Login />;
  } else if (screen === "createAccount") {
    return <CreateAccount />;
  } else {
    return <Main errorMessage={getMeQuery.error?.message} />;
  }
};

export default HomePage;
