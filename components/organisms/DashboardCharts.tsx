"use client";

import Typography from "@mui/material/Typography";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ChartCard } from "@/components/atoms/ChartCard";
import type {
  PayrollBarChartProps,
  BudgetAllocationChartProps,
  SalaryRangeChartProps,
  SalaryDistributionChartProps,
} from "./DashboardCharts.types";

// --- PayrollBarChart ---

export function PayrollBarChart({ title, data, seriesLabel }: PayrollBarChartProps) {
  return (
    <ChartCard title={title}>
      <BarChart
        xAxis={[{ scaleType: "band", data: data.map((d) => d.label) }]}
        series={[{ data: data.map((d) => d.value), label: seriesLabel }]}
        height={280}
      />
    </ChartCard>
  );
}

// --- BudgetAllocationChart ---

export function BudgetAllocationChart({ data }: BudgetAllocationChartProps) {
  const pieData = data.map((r, i) => ({
    id: i,
    value: r.totalPayroll,
    label: r.department,
  }));

  return (
    <ChartCard title="Budget Allocation by Department">
      {pieData.length === 0 ? (
        <Typography color="text.secondary">No data for selected country.</Typography>
      ) : (
        <PieChart
          series={[{ data: pieData, valueFormatter: (item) => `${item.value.toLocaleString()}` }]}
          height={280}
        />
      )}
    </ChartCard>
  );
}

// --- SalaryRangeChart ---

export function SalaryRangeChart({ data }: SalaryRangeChartProps) {
  const departments = data.map((r) => `${r.department} (${r.currency})`);

  return (
    <ChartCard title="Salary Range by Department">
      {data.length === 0 ? (
        <Typography color="text.secondary">No data for selected country.</Typography>
      ) : (
        <BarChart
          xAxis={[{ scaleType: "band", data: departments }]}
          series={[
            { data: data.map((r) => r.min), label: "Min" },
            { data: data.map((r) => r.average), label: "Average" },
            { data: data.map((r) => r.max), label: "Max" },
          ]}
          height={280}
        />
      )}
    </ChartCard>
  );
}

// --- SalaryDistributionChart ---

export function SalaryDistributionChart({ data }: SalaryDistributionChartProps) {
  const departments = data.map((r) => r.department);

  return (
    <ChartCard title="Employees Below Average Salary by Department">
      {data.length === 0 ? (
        <Typography color="text.secondary">No data for selected country.</Typography>
      ) : (
        <BarChart
          xAxis={[{ scaleType: "band", data: departments }]}
          series={[
            {
              data: data.map((r) => r.belowAveragePercent),
              label: "Below Average",
              stack: "distribution",
              valueFormatter: (v) => `${v?.toFixed(1)}%`,
            },
            {
              data: data.map((r) => r.atOrAboveAveragePercent),
              label: "At or Above",
              stack: "distribution",
              valueFormatter: (v) => `${v?.toFixed(1)}%`,
            },
          ]}
          yAxis={[{ min: 0, max: 100, valueFormatter: (v: number) => `${v}%` }]}
          height={280}
        />
      )}
    </ChartCard>
  );
}
