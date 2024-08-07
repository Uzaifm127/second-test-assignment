import { Dispatch, SetStateAction } from "react";

export interface PostInfo {
  username: string;
  userId: string;
  startingNumber: number;
}

export interface ReplyInfo {
  owner: string;
  postId: string;
  replyTo: string;
  calculation: string;
  result: number;
}

export type Operation = "addition" | "subtract" | "multiply" | "divide";

// Context API types
export type Screen = "login" | "createAccount" | "home";

export interface AppContextTypes {
  screen: Screen;
  setScreen: Dispatch<SetStateAction<Screen>>;
  authenticated: boolean;
  setAuthenticated: Dispatch<SetStateAction<boolean>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  userId: string;
  setUserId: Dispatch<SetStateAction<string>>;
  startDiscussion: boolean;
  setStartDiscussion: Dispatch<SetStateAction<boolean>>;
}

// Authentication types
export interface AuthInfo {
  username: string;
  password: string;
}
