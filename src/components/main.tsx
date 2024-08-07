"use client";

import React, { useRef, useState } from "react";
import Header from "@/components/header";
import Post from "@/components/post";
import { useAppContext } from "@/context/app-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";
import { PostInfo } from "@/types";
import { CalculationPost, CalculationReply } from "@prisma/client";

const Main = ({ errorMessage }: { errorMessage: string | undefined }) => {
  const {
    authenticated,
    startDiscussion,
    setStartDiscussion,
    username,
    userId,
  } = useAppContext()!;

  const [startingNumber, setStartingNumber] = useState(0);
  const [error, setError] = useState("");

  const timerIdRef = useRef<NodeJS.Timeout | null>(null);

  const queryClient = useQueryClient();

  const getAllQuery = useQuery({
    queryKey: ["get-all-calc"],
    queryFn: async () => fetcher("/api/calculation/get-all", "GET", {}),
  });

  const mutation = useMutation({
    mutationFn: async (postInfo: PostInfo) =>
      fetcher("/api/calculation/start", "POST", postInfo),

    onSuccess: async () =>
      await queryClient.invalidateQueries({ queryKey: ["get-all-calc"] }),

    onError: (error) => {
      setError(error.message);

      if (timerIdRef.current) {
        clearTimeout(timerIdRef.current);
      }

      timerIdRef.current = setTimeout(() => {
        setError("");
      }, 2500);
    },

    onMutate: () => setError(""),

    onSettled: () => setStartDiscussion(false),
  });

  return (
    <>
      {errorMessage ||
        (error && (
          <div className="bg-red-100 text-red-600 flex items-center justify-center py-5 w-full">
            {errorMessage || error}
          </div>
        ))}
      <Header loading={mutation.isPending} />
      <main className="px-10">
        <div className="my-7">
          {authenticated && startDiscussion && (
            <form
              onSubmit={(e) => {
                e.preventDefault();

                const postInfo = {
                  username,
                  userId,
                  startingNumber,
                };

                mutation.mutate(postInfo);
              }}
              className="space-x-4"
            >
              <input
                className={`outline-none px-5 text-black placeholder:text-gray-400 py-3 border-2 rounded-lg ${
                  mutation.isPending && "cursor-not-allowed opacity-55"
                }`}
                value={startingNumber}
                type="number"
                onChange={(e) => setStartingNumber(parseInt(e.target.value))}
                placeholder="Enter the number"
                disabled={mutation.isPending}
                required
              />
              <button
                className={`border-none outline-none text-white rounded-lg px-4 py-3 bg-sky-500 hover:bg-sky-400 transition ${
                  mutation.isPending && "cursor-not-allowed opacity-55"
                }`}
                type="submit"
                disabled={mutation.isPending}
              >
                Start
              </button>
            </form>
          )}
        </div>
        <div className="rounded-lg h-[83vh] overflow-y-scroll [scrollbar-width:none]">
          {getAllQuery.isFetching ? (
            <h2 className="text-4xl font-semibold animate-pulse mt-40">
              Fetching discussions...
            </h2>
          ) : getAllQuery.data.calculationPost.length ? (
            (getAllQuery.data.calculationPost as CalculationPost[]).map(
              (post) => {
                const { calculationReply } = getAllQuery.data;

                const allReplies = calculationReply as CalculationReply[];

                // Filtering the replies according to the post.
                const replies = allReplies.filter(
                  (reply) => reply.postId === post.id
                );

                return (
                  <div key={post.id}>
                    <Post
                      loading={mutation.isPending}
                      calculatedNumber={post.startingNumber}
                      owner={post.postOwner}
                      postId={post.id}
                      calculation={""}
                      replyTo={""}
                      canReply={username !== post.postOwner}
                    />
                    {replies.length ? (
                      replies.map((reply) => (
                        <Post
                          key={reply.id}
                          postId={post.id}
                          loading={mutation.isPending}
                          calculatedNumber={reply.result}
                          owner={reply.replyOwner}
                          calculation={reply.calculation}
                          replyTo={reply.replyTo}
                          canReply={username !== reply.replyOwner}
                        />
                      ))
                    ) : (
                      <></>
                    )}
                  </div>
                );
              }
            )
          ) : (
            <h2 className="text-4xl font-semibold mt-40">
              No discussion found...
            </h2>
          )}
        </div>
      </main>
    </>
  );
};

export default Main;
