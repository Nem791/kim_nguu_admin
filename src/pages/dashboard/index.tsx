import React, { useEffect, useMemo, useState } from "react";
import { useApiUrl, useList, useTranslate } from "@refinedev/core";
import dayjs from "dayjs";
import Grid from "@mui/material/Grid2";
import { NumberField } from "@refinedev/mui";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

import { DailyReservations, DeliveryMap } from "../../components/dashboard";
import { TrendIcon } from "../../components/icons";
import { Card, RefineListView } from "../../components";
import { RecentReservations } from "../../components/dashboard/recentReservations";
import { ReservationTimeline } from "../../components/dashboard/reservationTimeline";
import { IReservation } from "../../interfaces";
import { eventBus } from "../../contexts/eventBus";
import { debounce } from "lodash";

type DateFilter = "lastWeek" | "lastMonth";

const DATE_FILTERS: Record<DateFilter, { text: string; value: DateFilter }> = {
  lastWeek: { text: "lastWeek", value: "lastWeek" },
  lastMonth: { text: "lastMonth", value: "lastMonth" },
};

type IReservationChart = {
  date: string; // YYYY-MM-DD
  value: number;
};

export const DashboardPage: React.FC = () => {
  const t = useTranslate();

  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>(
    DATE_FILTERS.lastWeek.value
  );

  const dateFilterQuery = useMemo(() => {
    const now = dayjs();
    switch (selectedDateFilter) {
      case "lastWeek":
        return {
          start: now.subtract(6, "days").startOf("day"),
          end: now.endOf("day"),
        };
      case "lastMonth":
        return {
          start: now.subtract(1, "month").startOf("day"),
          end: now.endOf("day"),
        };
      default:
        return {
          start: now.subtract(7, "days").startOf("day"),
          end: now.endOf("day"),
        };
    }
  }, [selectedDateFilter]);

  const { data: reservationList, refetch } = useList<IReservation>({
    resource: "reservations",
    filters: [
      {
        field: "updatedAt",
        operator: "gte",
        value: dateFilterQuery.start,
      },
      {
        field: "updatedAt",
        operator: "lte",
        value: dateFilterQuery.end,
      },
    ],
    pagination: {
      current: 1,
      pageSize: 1000,
    },
  });

  useEffect(() => {
    const debouncedRefetch = debounce(() => {
      refetch();
    }, 500); // 500ms delay

    eventBus.on("reservationCreated", debouncedRefetch);

    return () => {
      eventBus.off("reservationCreated", debouncedRefetch);
      debouncedRefetch.cancel();
    };
  }, [refetch]);

  const dailyReservations = useMemo<IReservationChart[]>(() => {
    const map: Record<string, number> = {};

    reservationList?.data?.forEach((res) => {
      const date = dayjs(res.updatedAt).format("YYYY-MM-DD");
      map[date] = (map[date] || 0) + 1;
    });

    const rangeDays =
      dateFilterQuery.end.diff(dateFilterQuery.start, "day") + 1;

    // Fill missing dates with 0
    const chartData: IReservationChart[] = Array.from({
      length: rangeDays,
    }).map((_, i) => {
      const date = dateFilterQuery.start.add(i, "day").format("YYYY-MM-DD");
      return { date, value: map[date] || 0 };
    });

    return chartData;
  }, [reservationList?.data, dateFilterQuery]);

  const trend = useMemo(() => {
    if (dailyReservations.length < 2) return 0;
    const first = dailyReservations[0]?.value || 0;
    const last = dailyReservations[dailyReservations.length - 1]?.value || 0;
    return last - first;
  }, [dailyReservations]);

  return (
    <RefineListView
      headerButtons={() => (
        <Select
          size="small"
          value={selectedDateFilter}
          onChange={(e) => setSelectedDateFilter(e.target.value as DateFilter)}
          sx={{
            width: "160px",
            backgroundColor: (theme) => theme.palette.background.paper,
          }}
        >
          {Object.values(DATE_FILTERS).map((filter) => (
            <MenuItem key={filter.value} value={filter.value}>
              <Typography color="text.secondary" lineHeight="24px">
                {t(`dashboard.filter.date.${filter.text}`)}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      )}
    >
      <Grid container columns={24} spacing={3}>
        <Grid
          size={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
          sx={{ height: "264px" }}
        >
          <Card
            title={t("dashboard.dailyReservations.title")}
            icon={<ShoppingBagOutlinedIcon />}
            sx={{
              ".MuiCardContent-root:last-child": {
                paddingBottom: "24px",
              },
            }}
            cardContentProps={{ sx: { height: "208px" } }}
            cardHeaderProps={{
              action: (
                <TrendIcon trend={trend} text={<NumberField value={trend} />} />
              ),
            }}
          >
            <DailyReservations data={dailyReservations} />
          </Card>
        </Grid>

        {/* <Grid
          size={{ xs: 24, sm: 24, md: 24, lg: 15, xl: 15 }}
          sx={{ height: "504px" }}
        >
          <Card
            icon={<PlaceOutlinedIcon />}
            title={t("dashboard.deliveryMap.title")}
            cardContentProps={{ sx: { height: "424px" } }}
          >
            <DeliveryMap />
          </Card>
        </Grid> */}

        <Grid
          size={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
          sx={{ height: "504px" }}
        >
          <Card
            icon={<WatchLaterOutlinedIcon />}
            title={t("dashboard.timeline.title")}
          >
            <ReservationTimeline />
          </Card>
        </Grid>

        <Grid
          size={{ xs: 24, sm: 24, md: 24, lg: 24, xl: 24 }}
          sx={{ height: "800px" }}
        >
          <Card
            icon={<ShoppingBagOutlinedIcon />}
            title={t("dashboard.recentReservations.title")}
            cardContentProps={{ sx: { height: "688px" } }}
          >
            <RecentReservations />
          </Card>
        </Grid>
      </Grid>
    </RefineListView>
  );
};
