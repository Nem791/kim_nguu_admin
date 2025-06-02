import { useTranslate, useNavigation, useTable } from "@refinedev/core";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import type { IReservation } from "../../../interfaces";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { OrderStatus } from "../../order"; // Reuse for reservation status visual

dayjs.extend(relativeTime);

export const ReservationTimeline: React.FC = () => {
  const theme = useTheme();
  const { show } = useNavigation();

  const {
    tableQuery: tableQueryResult,
    current,
    setCurrent,
    pageCount,
  } = useTable<IReservation>({
    resource: "reservations",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    initialPageSize: 7,
    syncWithLocation: false,
  });

  const { data } = tableQueryResult;

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
      pb="24px"
    >
      <List sx={{ padding: 0 }}>
        {data?.data?.map((reservation, i) => {
          const isLast = i === data.data.length - 1;
          return (
            <ListItem
              divider={!isLast}
              key={reservation.id ?? reservation._id}
              secondaryAction={dayjs(reservation.createdAt).fromNow()}
              onClick={() =>
                show("reservations", reservation.id ?? reservation._id)
              }
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemAvatar
                sx={{
                  width: "98px",
                  marginRight: "16px",
                }}
              >
                <OrderStatus status={reservation.status} />
              </ListItemAvatar>
              <ListItemText primary={`#${reservation.orderNumber}`} />
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ display: "flex", justifyContent: "center", mt: "24px" }}>
        <Pagination
          count={pageCount}
          page={current}
          onChange={(e, page) => setCurrent(page)}
          siblingCount={1}
          boundaryCount={1}
          size="small"
          color="primary"
        />
      </Box>
    </Box>
  );
};
