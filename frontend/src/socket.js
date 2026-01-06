import { io } from "socket.io-client";

export const socket = io("https://apkakitchen.com", {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  transports: ["websocket"],
});
