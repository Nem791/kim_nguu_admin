import { useNotification } from "@refinedev/core";
import { useReservationSocket } from "../hooks/useSocket";
import { eventBus } from "./eventBus";

export const ReservationNotifier = () => {
  const { open: notify } = useNotification();

  useReservationSocket((data) => {
    notify?.({
      type: "success",
      message: "New Reservation",
      description: `Reservation #${data.orderNumber}`,
    });

    // 🔔 Fire global event
    eventBus.emit("reservationCreated", data);
  });

  return null; // No UI, just side effects
};
