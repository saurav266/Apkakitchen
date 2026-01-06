import { io } from "socket.io-client";

export const socket = io("/", {
  withCredentials: true,     // 🔥 REQUIRED for auth cookie
  autoConnect: false,
  transports: ["websocket"],
  reconnection: true,
});
