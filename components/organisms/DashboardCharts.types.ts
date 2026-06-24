import type {
  BudgetAllocationByDepartment,
  SalaryRangeByDepartment,
  SalaryDistributionByDepartment,
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

export type SalaryDistributionChartProps = {
  data: SalaryDistributionByDepartment[];
};
