import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { SummaryCard } from "@/components/atoms/SummaryCard";
import { ChartCard } from "@/components/atoms/ChartCard";
import { PayrollBarChart, BudgetAllocationChart, SalaryRangeChart } from "@/components/organisms/DashboardCharts";
import { TopEarnersTable } from "@/components/organisms/TopEarnersTable";
import { CountrySelector } from "@/components/molecules/CountrySelector";
import { COUNTRY_OPTIONS } from "@/app/constants";
import {
  getSummaryStatsForCountry,
  getPayrollByDepartmentForCountry,
  getAverageSalaryByDepartmentForCountry,
  getBudgetAllocationByDepartment,
  getSalaryRangeByDepartment,
  getTopEarnersByCountry,
} from "@/server/modules/analytics/analytics.service";
import { Country } from "@/app/generated/prisma/enums";
import { formatSalary } from "@/lib/formatSalary";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ country?: string }>;
}) {
  const { country: countryParam } = await searchParams;
  const country =
    countryParam && (Object.values(Country) as string[]).includes(countryParam)
      ? (countryParam as Country)
      : Country.US;

  const countryLabel = COUNTRY_OPTIONS.find((c) => c.value === country)?.label ?? country;

  const [summary, payrollByDept, avgByDept, budget, salaryRange, topEarners] = await Promise.all([
    getSummaryStatsForCountry(country),
    getPayrollByDepartmentForCountry(country),
    getAverageSalaryByDepartmentForCountry(country),
    getBudgetAllocationByDepartment(country),
    getSalaryRangeByDepartment(country),
    getTopEarnersByCountry(country),
  ]);

  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          Dashboard — {countryLabel}
        </Typography>
        <CountrySelector selectedCountry={country} />
      </Box>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Employee Count" value={summary.employeeCount.toLocaleString()} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title={`Total Payroll (${summary.currency})`}
            value={formatSalary(summary.totalPayroll, summary.currency)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard
            title={`Average Salary (${summary.currency})`}
            value={formatSalary(
              Math.round(summary.averageSalary),
              summary.currency,
            )}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard title="Currency" value={summary.currency} />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <PayrollBarChart
            title="Payroll by Department"
            data={payrollByDept.map((r) => ({ label: r.department, value: r.totalPayroll }))}
            seriesLabel={`Total Payroll (${summary.currency})`}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <PayrollBarChart
            title="Average Salary by Department"
            data={avgByDept.map((r) => ({ label: r.department, value: r.averageSalary }))}
            seriesLabel={`Avg Salary (${summary.currency})`}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <BudgetAllocationChart data={budget} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <SalaryRangeChart data={salaryRange} />
        </Grid>
      </Grid>

      <ChartCard title="Top Earners">
        <TopEarnersTable earners={topEarners} currency={summary.currency} />
      </ChartCard>
    </>
  );
}
