"use client";

import { useAppContext } from "@/context/app-context";
import { fetcher } from "@/lib/fetcher";
import { AuthInfo } from "@/types";
import { useMutation } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import Header from "@/components/header";

const CreateAccount = () => {
  const inputClass = `bg-gray-100 placeholder:text-gray-700 rounded-lg border-none outline-none ring ring-gray-300 focus:ring-2 transition focus:ring-gray-600 px-4 py-3 w-3/4 mx-auto block`;

  const btnClass = `border-none outline-none text-white rounded-lg px-4 py-3 bg-sky-500 w-3/4 mx-auto block hover:bg-sky-400 transition`;

  const { setScreen } = useAppContext()!;

  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    username: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: async (credentials: AuthInfo) => {
      return await fetcher("/api/user/create-account", "POST", credentials);
    },

    onSuccess: () => setScreen("login"),

    onError: (error) => setError(error.message),
  });

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value, name } = e.target;

      setUserInfo((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const onSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const { username, password } = userInfo;

      mutation.mutate({ username, password });
    },
    [mutation, userInfo]
  );

  return (
    <>
      <Header loading={mutation.isPending} />
      <main>
        <div className="w-96 mx-auto mt-20">
          <h2 className="text-3xl mb-10 font-medium text-center">
            Create your account
          </h2>
          <p className="text-red-600 mb-4 text-center">{error}</p>
          <form className="space-y-5" onSubmit={onSubmit}>
            <input
              name="username"
              value={userInfo.username}
              onChange={onInputChange}
              className={inputClass}
              type="text"
              placeholder="Username"
              disabled={mutation.isPending}
              required
            />
            <input
              name="password"
              value={userInfo.password}
              onChange={onInputChange}
              className={inputClass}
              type="password"
              placeholder="Password"
              disabled={mutation.isPending}
              minLength={8}
              required
            />
            <button
              className={btnClass}
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Creating..." : "Create account"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateAccount;
