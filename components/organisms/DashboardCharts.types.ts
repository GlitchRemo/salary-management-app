import type {
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
} from "@/server/modules/analytics/analytics.types";

export type BarChartEntry = {
  label: string;
  value: number;
};

export type PayrollBarChartProps = {
  title: string;
  data: BarChartEntry[];
  seriesLabel: string;
};

export type BudgetAllocationChartProps = {
  data: BudgetAllocationByDepartment[];
};

export type SalaryRangeChartProps = {
  data: SalaryRangeByDepartment[];
};
