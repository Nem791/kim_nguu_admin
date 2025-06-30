import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  withCredentials: true, // if using cookies
});

export default socket;
