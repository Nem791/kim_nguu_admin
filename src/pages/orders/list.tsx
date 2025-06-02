import React, { useMemo } from "react";
import {
  type HttpError,
  useExport,
  useNavigation,
  useTranslate,
  useUpdate,
} from "@refinedev/core";
import {
  DateField,
  ExportButton,
  NumberField,
  useDataGrid,
} from "@refinedev/mui";
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import { OrderStatus } from "../../components/order"; // Assuming OrderStatus can handle "Pending", "Ready", "Cancelled"
import type {
  IReservation,
  IReservationFilterVariables,
} from "../../interfaces"; // Ensure these interfaces are defined
import { RefineListView } from "../../components";
import { Box } from "@mui/material";

// Define IReservation and IReservationFilterVariables in your interfaces file (e.g., src/interfaces/index.ts)
/*
// Example: src/interfaces/index.ts
export interface IReservation {
  id: string; // Mapped from _id by data provider
  name: string;
  phone: string;
  email?: string;
  area?: "HÀ NỘI" | "TP. HỒ CHÍ MINH" | "HẢI PHÒNG";
  restaurant?: string;
  date: string; // e.g., "2025-06-01"
  hour: string; // e.g., "16"
  minute: string; // e.g., "30"
  guestCount: number;
  message?: string;
  status: "Pending" | "Ready" | "Cancelled";
  orderNumber?: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

export interface IReservationFilterVariables {
  q?: string; // For a general text search
  status?: IReservation["status"];
  // Add other filter fields as needed
}
*/

export const ReservationList = () => {
  // Renamed from OrderList
  const t = useTranslate();
  const { mutate } = useUpdate(); // No need to specify resource here if default is set or using <Refine resource="reservations">

  const { dataGridProps, filters, sorters } = useDataGrid<
    IReservation,
    HttpError,
    IReservationFilterVariables
  >({
    resource: "reservations", // Explicitly set resource for clarity
    initialPageSize: 10,
    // Example of syncWithLocation: true if you want filters/sorters in URL
    // syncWithLocation: true,
  });

  const columns = useMemo<GridColDef<IReservation>[]>(
    () => [
      {
        field: "orderNumber",
        headerName: t("reservations.fields.orderNumber", "Res. ID"),
        description: t("reservations.fields.orderNumber", "Reservation ID"),
        width: 150,
        renderCell: function render({ row }) {
          return (
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              width="100%"
              pl={1}
            >
              <Typography>#{row.orderNumber}</Typography>
            </Box>
          );
        },
      },

      {
        field: "status",
        headerName: t("reservations.fields.status", "Status"),
        width: 120,
        renderCell: function render({ row }) {
          // Assuming OrderStatus component can take "Pending", "Ready", "Cancelled"
          return <OrderStatus status={row.status} />;
        },
      },
      {
        field: "name",
        headerName: t("reservations.fields.name", "Customer Name"),
        width: 180,
      },
      {
        field: "reservationDateTime",
        headerName: t(
          "reservations.fields.reservationTime",
          "Reservation Time"
        ),
        width: 220,
        renderCell: function render({ row }) {
          const dateTimeString = `${row.date}T${row.hour.padStart(
            2,
            "0"
          )}:${row.minute.padStart(2, "0")}:00`;

          return (
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              width="100%"
              pl={1} // Optional: consistent left padding
            >
              <DateField
                value={dateTimeString}
                format="MMM D, YYYY / hh:mm a"
              />
            </Box>
          );
        },
      },
      {
        field: "guestCount",
        headerName: t("reservations.fields.guestCount", "Guests"),
        type: "number",
        width: 100,
        align: "right",
        headerAlign: "right",
      },
      {
        field: "phone",
        headerName: t("reservations.fields.phone", "Phone"),
        width: 150,
      },
      {
        field: "email",
        headerName: t("reservations.fields.email", "Email"),
        width: 200,
      },
      {
        field: "area",
        headerName: t("reservations.fields.area", "Area"),
        width: 150,
      },
      {
        field: "restaurant",
        headerName: t("reservations.fields.restaurant", "Restaurant"),
        width: 180,
      },
      {
        field: "message",
        headerName: t("reservations.fields.message", "Message"),
        width: 250,
        sortable: false,
      },
      {
        field: "createdAt",
        headerName: t("reservations.fields.createdAt", "Created At"),
        width: 220,
        renderCell: function render({ row }) {
          return (
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              width="100%"
              pl={1}
            >
              <DateField value={row.createdAt} format="MMM D, YYYY / hh:mm a" />
            </Box>
          );
        },
      },
      {
        field: "updatedAt",
        headerName: t("reservations.fields.updatedAt", "Updated At"),
        width: 220,
        renderCell: function render({ row }) {
          return (
            <Box
              display="flex"
              alignItems="center"
              height="100%"
              width="100%"
              pl={1}
            >
              <DateField value={row.updatedAt} format="MMM D, YYYY / hh:mm a" />
            </Box>
          );
        },
      },
      {
        field: "actions",
        type: "actions",
        headerName: t("table.actions", "Actions"),
        sortable: false,
        headerAlign: "right",
        align: "right",
        getActions: ({ id, row }) => [
          // `row` is available here
          <GridActionsCellItem
            key={1}
            icon={<CheckOutlinedIcon color="success" />}
            sx={{ padding: "2px 6px" }}
            label={t("buttons.accept", "Accept")}
            showInMenu
            disabled={row.status === "Ready" || row.status === "Cancelled"} // Optional: disable if already Ready or Cancelled
            onClick={() => {
              mutate({
                resource: "reservations",
                id,
                values: {
                  status: "Ready",
                },
              });
            }}
          />,
          <GridActionsCellItem
            key={2}
            icon={<CloseOutlinedIcon color="error" />}
            sx={{ padding: "2px 6px" }}
            label={t("buttons.reject", "Reject")}
            showInMenu
            disabled={row.status === "Cancelled" || row.status === "Ready"} // Optional: disable if already Cancelled or Ready
            onClick={() =>
              mutate({
                resource: "reservations",
                id,
                values: {
                  status: "Cancelled",
                },
              })
            }
          />,
        ],
      },
    ],
    [t, mutate]
  );

  const { show } = useNavigation();

  const { isLoading, triggerExport } = useExport<IReservation>({
    resource: "reservations", // Explicitly set resource
    sorters,
    filters,
    pageSize: 50, // Export page size
    maxItemCount: 500, // Max items to export in one go
    mapData: (item) => {
      // Construct the reservation time string for export
      const reservationTime = `${item.date} ${item.hour.padStart(
        2,
        "0"
      )}:${item.minute.padStart(2, "0")}`;
      return {
        // Map all fields as requested
        id: item.id,
        orderNumber: item.orderNumber,
        status: item.status,
        name: item.name,
        phone: item.phone,
        email: item.email,
        area: item.area,
        restaurant: item.restaurant,
        reservationTime: reservationTime, // Combined date and time
        guestCount: item.guestCount,
        message: item.message,
        createdAt: new Date(item.createdAt).toLocaleString(), // Or use a specific format
        updatedAt: new Date(item.updatedAt).toLocaleString(),
      };
    },
  });

  return (
    <RefineListView
      headerButtons={
        <ExportButton
          variant="outlined"
          onClick={triggerExport}
          loading={isLoading}
          size="medium"
          sx={{ height: "40px" }}
        />
      }
      //   You can also pass a title to RefineListView if needed
      //   title={<Typography variant="h5">Reservations</Typography>}
    >
      <DataGrid
        {...dataGridProps}
        columns={columns}
        onRowClick={({ id }) => {
          show("reservations", id.toString()); // Ensure id is string for URL
        }}
        pageSizeOptions={[10, 20, 50, 100]}
        autoHeight // Recommended for simplicity if not dealing with extreme row counts
        sx={{
          "& .MuiDataGrid-row": {
            cursor: "pointer",
          },
          // Fix for header height if actions make it taller
          "& .MuiDataGrid-columnHeader, & .MuiDataGrid-cell": {
            alignSelf: "center",
          },
          "& .MuiDataGrid-columnHeaderTitleContainer": {
            justifyContent: "flex-start", // Ensures header title is aligned with content
          },
        }}
      />
    </RefineListView>
  );
};
