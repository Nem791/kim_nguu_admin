import React, { useEffect, useMemo } from "react";
import { useTranslate, useNavigation, useUpdate } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import Typography from "@mui/material/Typography";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import type { IReservation } from "../../../interfaces";
import { eventBus } from "../../../contexts/eventBus";
import { debounce } from "lodash";

export const RecentReservations: React.FC = () => {
  const t = useTranslate();
  const { show } = useNavigation();

  const { mutate } = useUpdate({
    resource: "reservations",
  });

  const { dataGridProps, tableQuery } = useDataGrid<IReservation>({
    resource: "reservations",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    initialPageSize: 10,
    syncWithLocation: false,
  });

  useEffect(() => {
    // Debounce the refetch function
    const debouncedRefetch = debounce(() => {
      tableQuery.refetch();
    }, 300); // Adjust debounce delay (ms) as needed

    const handleNewReservation = () => {
      debouncedRefetch();
    };

    // Subscribe to reservation event
    eventBus.on("reservationCreated", handleNewReservation);

    return () => {
      // Cleanup listener and cancel pending debounce
      eventBus.off("reservationCreated", handleNewReservation);
      debouncedRefetch.cancel(); // Prevents memory leaks
    };
  }, [tableQuery]);

  const columns = useMemo<GridColDef<IReservation>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: t("reservations.fields.orderNumber", "Res. ID"),
        flex: 1,
        minWidth: 80,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => <Typography>#{row.orderNumber}</Typography>,
      },
      {
        field: "name",
        headerName: t("reservations.fields.name", "Name"),
        flex: 2,
        minWidth: 120,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => <Typography>{row.name}</Typography>,
      },
      {
        field: "phone",
        headerName: t("reservations.fields.phone", "Phone"),
        flex: 2,
        minWidth: 140,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => <Typography>{row.phone}</Typography>,
      },
      {
        field: "date",
        headerName: t("reservations.fields.date", "Date & Time"),
        flex: 2,
        minWidth: 160,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Typography>
            {row.date} – {row.hour}:{row.minute}
          </Typography>
        ),
      },
      {
        field: "guestCount",
        headerName: t("reservations.fields.guestCount", "Guests"),
        flex: 1,
        minWidth: 80,
        type: "number",
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => <Typography>{row.guestCount}</Typography>,
      },
      {
        field: "status",
        headerName: t("reservations.fields.status", "Status"),
        flex: 1,
        minWidth: 100,
        align: "center",
        headerAlign: "center",
        renderCell: ({ row }) => (
          <Typography variant="body2">{row.status}</Typography>
        ),
      },
    ],
    [t, mutate]
  );

  return (
    <DataGrid
      {...dataGridProps}
      columns={columns}
      onRowClick={(row) => show("reservations", row.id)}
      columnHeaderHeight={40}
      pageSizeOptions={[10, 25, 50]}
      sx={{
        height: "100%",
        border: "none",
        "& .MuiDataGrid-row": {
          cursor: "pointer",
        },
        "& .MuiDataGrid-cell, & .MuiDataGrid-columnHeaderTitle": {
          justifyContent: "center",
          textAlign: "center",
        },
        "& .MuiDataGrid-cell": {
          padding: "12px",
        },
      }}
    />
  );
};
