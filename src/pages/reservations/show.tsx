import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslate, useNavigation } from "@refinedev/core";
import { ListButton, DateField } from "@refinedev/mui";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CheckOutlinedIcon from "@mui/icons-material/CheckOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ArrowBack from "@mui/icons-material/ArrowBack";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";

import { RefineListView } from "../../components";
import type { IReservation } from "../../interfaces";

import { customDataProvider } from "../../customDataProvider";

export const ReservationShow = () => {
  const t = useTranslate();
  const { id: routeId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { list } = useNavigation();

  const [record, setRecord] = useState<IReservation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isMutating, setIsMutating] = useState(false);

  useEffect(() => {
    if (routeId) {
      setIsLoading(true);
      setError(null);
      customDataProvider
        .getOne("reservations", { id: routeId })
        .then((response) => {
          setRecord(response.data as IReservation);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching reservation:", err);
          setError(err);
          setIsLoading(false);
        });
    } else {
      setError(
        new Error(t("pages.error.info", "Reservation ID not found in URL."))
      );
      setIsLoading(false);
    }
  }, [routeId, t]);

  // Update the function to accept "Pending" as a valid status
  const handleMutate = async (newStatus: "Ready" | "Cancelled" | "Pending") => {
    if (record && record.id) {
      setIsMutating(true);
      setError(null);
      try {
        const response = await customDataProvider.update("reservations", {
          id: record.id,
          values: { status: newStatus },
        });
        setRecord(response.data as IReservation);
      } catch (err: any) {
        console.error("Error updating reservation:", err);
        setError(err);
      } finally {
        setIsMutating(false);
      }
    }
  };

  if (isLoading) {
    return <Typography>{t("actions.loading", "Loading...")}</Typography>;
  }

  if (error) {
    return (
      <Typography color="error">
        {t("pages.error.defaultMessage", "An error occurred")}: {error.message}
      </Typography>
    );
  }

  if (!record) {
    return (
      <Typography>{t("pages.error.info", "Reservation not found.")}</Typography>
    );
  }

  // A reservation can be accepted if it's new (Pending) or if it was previously cancelled.
  const canAccept =
    record.status === "Pending" || record.status === "Cancelled";

  // A reservation can be rejected if it's new (Pending) or if it's currently confirmed (Ready).
  const canReject = record.status === "Pending" || record.status === "Ready";

  // A reservation can be moved back to Pending if it has already been actioned (Ready or Cancelled).
  const canSetPending =
    record.status === "Ready" || record.status === "Cancelled";

  // --- CORRECTED UI ---

  const headerButtons = [
    <Stack key="actions" direction="row" spacing={1}>
      <Button
        disabled={!canAccept || isMutating}
        variant="outlined"
        size="small"
        color="success"
        startIcon={<CheckOutlinedIcon />}
        onClick={() => handleMutate("Ready")}
      >
        {t("buttons.accept", "Accept")}
      </Button>
      <Button
        disabled={!canReject || isMutating}
        variant="outlined"
        size="small"
        color="error"
        startIcon={<CloseOutlinedIcon />}
        onClick={() => handleMutate("Cancelled")}
      >
        {t("buttons.reject", "Reject")}
      </Button>
      {/* --- NEW BUTTON --- */}
      <Button
        disabled={!canSetPending || isMutating}
        variant="outlined"
        size="small"
        color="primary"
        startIcon={<HourglassEmptyIcon />}
        onClick={() => handleMutate("Pending")}
      >
        {t("buttons.setPending", "Set to Pending")}
      </Button>
      {/* --- END OF NEW BUTTON --- */}
    </Stack>,
  ];

  // --- END OF CORRECTION ---

  return (
    <>
      <ListButton
        variant="outlined"
        sx={{
          borderColor: "GrayText",
          color: "GrayText",
          backgroundColor: "transparent",
        }}
        startIcon={<ArrowBack />}
        onClick={() => list("reservations")}
      />
      <Divider sx={{ my: 3 }} />

      <RefineListView
        title={
          <Typography variant="h5">
            {t("reservations.reservation", "Reservation")} #{record.orderNumber}
          </Typography>
        }
        headerButtons={headerButtons}
      >
        <Grid
          container
          spacing={3}
          sx={{
            maxWidth: "1200px",
            margin: "0 auto", // Center the whole grid
          }}
        >
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {t("reservations.customerInfo", "Customer Info")}
              </Typography>
              <Box>
                <Typography component="div">
                  <strong>{t("reservations.name", "Name")}:</strong>{" "}
                  {record.name || "-"}
                </Typography>
                <Typography component="div">
                  <strong>{t("reservations.phone", "Phone")}:</strong>{" "}
                  {record.phone || "-"}
                </Typography>
                {record.email && (
                  <Typography component="div">
                    <strong>{t("reservations.email", "Email")}:</strong>{" "}
                    {record.email}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                {t("reservations.details", "Reservation Details")}
              </Typography>
              <Box>
                <Typography component="div">
                  <strong>{t("reservations.area", "Area")}:</strong>{" "}
                  {record.area || "-"}
                </Typography>
                <Typography component="div">
                  <strong>{t("reservations.restaurant", "Restaurant")}:</strong>{" "}
                  {record.restaurant || "-"}
                </Typography>
                {record.date && (
                  <Typography component="div">
                    <strong>{t("reservations.date", "Date")}:</strong>{" "}
                    <DateField value={record.date} format="DD/MM/YYYY" />
                  </Typography>
                )}
                {record.hour != null && record.minute != null && (
                  <Typography component="div">
                    <strong>{t("reservations.time", "Time")}:</strong>{" "}
                    {`${String(record.hour).padStart(2, "0")}:${String(
                      record.minute
                    ).padStart(2, "0")}`}
                  </Typography>
                )}
                <Typography component="div">
                  <strong>
                    {t("reservations.guestCount", "Guest Count")}:
                  </strong>{" "}
                  {record.guestCount ?? "-"}
                </Typography>
                {record.message && (
                  <Typography component="div">
                    <strong>{t("reservations.message", "Message")}:</strong>{" "}
                    {record.message}
                  </Typography>
                )}
                <Typography component="div">
                  <strong>{t("reservations.status", "Status")}:</strong>{" "}
                  {record.status || "-"}
                </Typography>
                {record.createdAt && (
                  <Typography
                    component="div"
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      mt: 1,
                    }}
                  >
                    <strong>
                      {t("reservations.fields.createdAt", "Created At")}:
                    </strong>{" "}
                    <DateField
                      value={record.createdAt}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </Typography>
                )}
                {record.updatedAt && (
                  <Typography
                    component="div"
                    sx={{
                      fontSize: "0.875rem",
                      color: "text.secondary",
                      mt: 0.5,
                    }}
                  >
                    <strong>
                      {t("reservations.fields.updatedAt", "Updated At")}:
                    </strong>{" "}
                    <DateField
                      value={record.updatedAt}
                      format="DD/MM/YYYY HH:mm"
                    />
                  </Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </RefineListView>
    </>
  );
};
