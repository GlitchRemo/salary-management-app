import Link from "next/link";
import { listEmployees } from "@/server/modules/employee/employee.service";
import { Country, Department } from "@/app/generated/prisma/enums";
import type { EmployeeFilters } from "@/server/modules/employee/employee.types";
import { SearchBar } from "@/components/molecules/SearchBar";
import { EnumFilterSelect } from "@/components/atoms/EnumFilterSelect";
import { COUNTRY_OPTIONS, DEPARTMENT_OPTIONS } from "@/app/constants";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; country?: string; department?: string }>;
}) {
  const { search, country: countryParam, department: departmentParam } = await searchParams;
  const country = countryParam && (Object.values(Country) as string[]).includes(countryParam)
    ? (countryParam as Country)
    : undefined;
  const department = departmentParam && (Object.values(Department) as string[]).includes(departmentParam)
    ? (departmentParam as Department)
    : undefined;
  const filters: EmployeeFilters = {
    ...(search && { search }),
    ...(country && { country }),
    ...(department && { department }),
  };
  const employees = await listEmployees(filters);

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Employees
      </Typography>
      <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center", flexWrap: "wrap" }}>
        <SearchBar />
        <EnumFilterSelect
          param="country"
          label="Country"
          allLabel="All countries"
          options={COUNTRY_OPTIONS}
          ariaLabel="Filter by country"
        />
        <EnumFilterSelect
          param="department"
          label="Department"
          allLabel="All departments"
          options={DEPARTMENT_OPTIONS}
          ariaLabel="Filter by department"
        />
      </Box>
      <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: "primary.main" }}>
                <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Name</TableCell>
                <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Email</TableCell>
                <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Department</TableCell>
                <TableCell sx={{ color: "primary.contrastText", fontWeight: 600 }}>Country</TableCell>
                <TableCell align="right" sx={{ color: "primary.contrastText", fontWeight: 600 }}>Base Salary</TableCell>
                <TableCell align="right" sx={{ color: "primary.contrastText", fontWeight: 600 }}>Bonus</TableCell>
                <TableCell align="right" sx={{ color: "primary.contrastText", fontWeight: 600 }}>Total</TableCell>
                <TableCell sx={{ color: "primary.contrastText", width: 48 }} />
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.country}</TableCell>
                  <TableCell align="right">
                    {emp.currency} {emp.baseSalary.toLocaleString()}
                  </TableCell>
                  <TableCell align="right">
                    {emp.currency} {emp.bonus.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {emp.currency} {emp.totalCompensation.toLocaleString()}
                  </TableCell>
                  <TableCell align="right" sx={{ width: 48, pr: 1 }}>
                    <Link
                      href={`/employees/${emp.id}`}
                      aria-label={`View details for ${emp.name}`}
                      style={{ display: "flex", alignItems: "center", color: "inherit" }}
                    >
                      <ChevronRightIcon fontSize="small" color="action" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {employees.length === 0 && (
          <Typography sx={{ color: "text.secondary", textAlign: "center", py: 4 }}>
            No employees found.
          </Typography>
        )}
      </Paper>
    </>
  );
}
