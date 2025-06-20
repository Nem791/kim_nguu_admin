import {
  BarChart,
  Bar,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { ChartTooltip } from "../chartTooltip";
import dayjs from "dayjs";

type IReservationChart = {
  date: string; // e.g., "2025-06-01"
  value: number; // number of reservations that day
};

type Props = {
  data: IReservationChart[];
};

export const DailyReservations = ({ data = [] }: Props) => {
  return (
    <ResponsiveContainer width="99%">
      <BarChart
        data={data}
        barSize={15}
        margin={{ top: 30, right: 10, left: -25, bottom: 0 }}
      >
        <XAxis
          dataKey="date"
          fontSize={12}
          tickFormatter={(value) =>
            data.length > 7
              ? dayjs(value).format("MM/DD")
              : dayjs(value).format("ddd")
          }
        />
        <YAxis dataKey="value" fontSize={12} />
        <Bar type="natural" dataKey="value" fill="#2196F3" />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.2)", radius: 4 }}
          content={
            <ChartTooltip
              labelFormatter={(label) => dayjs(label).format("MMM D, YYYY")}
            />
          }
        />
      </BarChart>
    </ResponsiveContainer>
  );
};
