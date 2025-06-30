import { useEffect } from "react";
import socket from "../socket";

export const useReservationSocket = (onNewReservation: (data: any) => void) => {
  useEffect(() => {
    const handler = (data: any) => {
      onNewReservation(data);
    };

    socket.on("new-reservation", handler);

    return () => {
      socket.off("new-reservation", handler);
    };
  }, [onNewReservation]);
};
