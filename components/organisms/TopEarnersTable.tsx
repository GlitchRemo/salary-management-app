import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { PrimaryTableContainer } from "@/components/molecules/PrimaryTableContainer";
import { formatSalary } from "@/lib/formatSalary";
import type { TopEarner } from "@/server/modules/analytics/analytics.types";

type TopEarnersTableProps = {
  earners: TopEarner[];
  currency: string;
};

const COLUMNS = [
  { label: "Name" },
  { label: "Department" },
  { label: "Base Salary", align: "right" as const },
  { label: "Bonus", align: "right" as const },
  { label: "Total Compensation", align: "right" as const },
];

export function TopEarnersTable({ earners, currency }: TopEarnersTableProps) {
  if (earners.length === 0) {
    return <Typography color="text.secondary">No earner data available.</Typography>;
  }

  return (
    <PrimaryTableContainer columns={COLUMNS}>
      <TableBody>
        {earners.map((e) => (
          <TableRow key={e.name} hover>
            <TableCell>{e.name}</TableCell>
            <TableCell>{e.department}</TableCell>
            <TableCell align="right">{formatSalary(e.baseSalary, currency)}</TableCell>
            <TableCell align="right">{formatSalary(e.bonus, currency)}</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600 }}>{formatSalary(e.totalCompensation, currency)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </PrimaryTableContainer>
  );
}
