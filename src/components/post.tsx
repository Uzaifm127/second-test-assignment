import { useAppContext } from "@/context/app-context";
import { fetcher } from "@/lib/fetcher";
import { Operation, ReplyInfo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const options = ["Addition", "Subtract", "Multiply", "Divide"].map(
  (element) => ({ id: uuidv4(), operation: element })
);

const Post = ({
  loading,
  calculatedNumber,
  owner,
  postId,
  calculation,
  replyTo,
  canReply,
  createdAt,
}: {
  loading: boolean;
  calculatedNumber: number;
  owner: string;
  postId: string;
  calculation: string;
  replyTo: string;
  canReply: boolean;
  createdAt: Date;
}) => {
  const timestamp = `${createdAt.getDate()}.${
    createdAt.getMonth() + 1
  }.${createdAt.getFullYear()} ○ ${createdAt.toLocaleTimeString()}`;

  const btnDisableClass = "cursor-not-allowed pointer-events-none opacity-55";

  const { authenticated, username } = useAppContext()!;

  const [rightArgument, setRightArgument] = useState(1);
  const [operation, setOperation] = useState<Operation>("addition");
  const [replying, setReplying] = useState(false);
  const [error, setError] = useState(false);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (replyInfo: ReplyInfo) =>
      fetcher("/api/calculation/respond", "POST", replyInfo),

    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["get-all-calc"] });

      setReplying(false);
    },
  });

  return (
    <>
      <div
        className={`border-2 my-4 px-3 py-2 sm:px-4 sm:py-3 w-80 sm:w-96 xl:w-1/3 rounded-lg ${
          calculation && "bg-gray-100 ml-5 sm:ml-10"
        }`}
      >
        <div className="ml-auto text-gray-500">{timestamp}</div>
        {calculation && (
          <div className="mb-1">
            ReplyTo{" "}
            <span className="text-blue-700 cursor-pointer mr-2">
              @{replyTo}
            </span>{" "}
            for{" "}
            <span className="ml-2 text-lg text-gray-500">
              {calculation.split(" ")[0]}
            </span>
          </div>
        )}

        <div className="flex items-center gap-x-4">
          <div>
            <Image
              className="rounded-full w-10"
              src="/user-icon-placeholder.png"
              width={256}
              height={256}
              alt={"user"}
            />
          </div>
          <div>
            <h4 className="text-lg font-medium">{owner}</h4>
            <p className="text-gray-500">
              {calculation
                ? `${calculation} = ${calculatedNumber}`
                : calculatedNumber}
            </p>
          </div>
          {authenticated && canReply && (
            <button
              className={`border-none outline-none text-white rounded-lg px-3 py-2 bg-sky-500 hover:bg-sky-400 transition ml-auto ${
                (mutation.isPending || loading) && btnDisableClass
              }`}
              onClick={() => setReplying((prev) => !prev)}
              type="button"
              disabled={mutation.isPending || loading}
            >
              {replying ? "Collapse" : "Reply"}
            </button>
          )}
        </div>
      </div>

      {replying && (
        <form
          className={`border-2 px-4 py-2 w-1/3 rounded-lg ${
            calculation && "ml-10"
          }`}
          onSubmit={(e) => {
            e.preventDefault();

            let result: number;
            let calculation: string;

            if (operation === "divide" && rightArgument === 0) {
              setError(true);
              return;
            } else {
              setError(false);
            }

            switch (operation) {
              case "addition":
                result = calculatedNumber + rightArgument;
                calculation = `${calculatedNumber} + ${rightArgument}`;
                break;

              case "subtract":
                result = calculatedNumber - rightArgument;
                calculation = `${calculatedNumber} - ${rightArgument}`;
                break;

              case "multiply":
                result = calculatedNumber * rightArgument;
                calculation = `${calculatedNumber} x ${rightArgument}`;
                break;

              case "divide":
                result = calculatedNumber / rightArgument;
                calculation = `${calculatedNumber} ÷ ${rightArgument}`;
                break;
            }

            const replyInfo: ReplyInfo = {
              postId,
              owner: username,
              replyTo: owner,
              calculation,
              result,
            };

            mutation.mutate(replyInfo);
          }}
        >
          <div className="flex justify-start items-center gap-x-4">
            <input
              className="border rounded-lg p-1 outline-none w-14"
              type="text"
              value={calculatedNumber}
              disabled
            />

            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as Operation)}
              className={`cursor-pointer outline-none border p-1 rounded-lg ${
                mutation.isPending || loading
                  ? btnDisableClass
                  : "cursor-pointer"
              }`}
              disabled={mutation.isPending || loading}
            >
              {options.map((element) => (
                <option
                  className="cursor-pointer"
                  key={element.id}
                  value={element.operation.toLowerCase()}
                >
                  {element.operation}
                </option>
              ))}
            </select>

            <input
              className={`border rounded-lg p-1 outline-none w-20 ${
                (mutation.isPending || loading) && btnDisableClass
              }`}
              type="number"
              value={rightArgument}
              onChange={(e) => setRightArgument(parseInt(e.target.value))}
              required
              disabled={mutation.isPending || loading}
            />

            <button
              className={`px-4 py-2 hover:bg-gray-200 transition rounded-lg ${
                (mutation.isPending || loading) && btnDisableClass
              }`}
              type="submit"
              disabled={mutation.isPending || loading}
            >
              Calculate
            </button>
          </div>
          <p className="text-red-600">
            {error ? "Right argument can't be 0" : ""}
          </p>
        </form>
      )}
    </>
  );
};

export default Post;
