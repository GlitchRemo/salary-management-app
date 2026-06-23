import Link from "next/link";
import { notFound } from "next/navigation";
import { findEmployeeById } from "@/server/modules/employee/employee.repository";
import { toEmployeeDto } from "@/server/modules/employee/employee.mapper";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EmployeeDetailsPage({ params }: Props) {
  const { id } = await params;
  const employee = await findEmployeeById(id);

  if (!employee) {
    notFound();
  }

  const dto = toEmployeeDto(employee);

  const fields = [
    { label: "Email", value: dto.email },
    { label: "Department", value: dto.department },
    { label: "Country", value: dto.country },
    { label: "Currency", value: dto.currency },
    { label: "Base Salary", value: `${dto.currency} ${dto.baseSalary.toLocaleString()}` },
    { label: "Bonus", value: `${dto.currency} ${dto.bonus.toLocaleString()}` },
    { label: "Last Updated", value: new Date(dto.updatedAt).toLocaleDateString() },
  ];

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Link
          href="/employees"
          aria-label="Back to employees"
          style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "inherit", textDecoration: "none" }}
        >
          <ArrowBackIcon fontSize="small" />
          <Typography variant="body2">Back</Typography>
        </Link>
      </Box>
      <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 3 }}>
        {dto.name}
      </Typography>
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, p: 3 }}>
        <Box
          sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}
        >
          {fields.map(({ label, value }) => (
            <Box key={label}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ textTransform: "uppercase", fontWeight: 600, letterSpacing: 0.5 }}
              >
                {label}
              </Typography>
              <Typography variant="body1" sx={{ mt: 0.5 }}>
                {value}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </>
  );
}
