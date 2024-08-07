import { useAppContext } from "@/context/app-context";
import { fetcher } from "@/lib/fetcher";
import { Screen } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useCallback } from "react";

const Header = ({ loading }: { loading: boolean }) => {
  const btnClass = `px-4 py-2 hover:bg-gray-200 transition rounded-lg ${
    loading && "cursor-not-allowed opacity-55 pointer-events-none"
  }`;

  const {
    setScreen,
    authenticated,
    setStartDiscussion,
    startDiscussion,
    username,
  } = useAppContext()!;

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => fetcher("/api/user/logout", "POST", {}),

    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["getMe"] }),
  });

  const onBtnClick = useCallback(
    (screen: Screen) => {
      setScreen(screen);
    },
    [setScreen]
  );

  return (
    <header>
      <nav className="flex items-center gap-x-4 mx-5 py-2">
        <button
          onClick={() => {
            onBtnClick("home");
          }}
          className={btnClass}
          type="button"
          disabled={loading}
        >
          Home
        </button>
        {!authenticated ? (
          <>
            <button
              onClick={() => {
                onBtnClick("login");
              }}
              className={btnClass}
              type="button"
              disabled={loading}
            >
              Login
            </button>
            <button
              onClick={() => {
                onBtnClick("createAccount");
              }}
              className={btnClass}
              type="button"
              disabled={loading}
            >
              Create
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => {
                mutation.mutate();
              }}
              className={btnClass}
              type="button"
              disabled={loading}
            >
              Logout
            </button>
            <button
              onClick={() => setStartDiscussion((prev) => !prev)}
              className={`border-none outline-none text-white rounded-lg px-4 py-3 bg-sky-500 hover:bg-sky-400 transition ${
                loading && "cursor-not-allowed opacity-55"
              }`}
              type="button"
              disabled={loading}
            >
              {startDiscussion ? "Cancel" : "Start discussion"}
            </button>
          </>
        )}
        <div className="ml-auto font-medium text-xl">{username}</div>
      </nav>
    </header>
  );
};

export default Header;
