import Link from "next/link";
import { revalidatePath } from "next/cache";
import { listEmployees, importEmployees } from "@/server/modules/employee/employee.service";
import { getSessionUserId } from "@/server/modules/auth/session";
import { Country, Department } from "@/app/generated/prisma/enums";
import type { EmployeeFilters, ImportResult } from "@/server/modules/employee/employee.types";
import { SearchBar } from "@/components/molecules/SearchBar";
import { EnumFilterSelect } from "@/components/atoms/EnumFilterSelect";
import { CsvUpload } from "@/components/organisms/CsvUpload";
import { PaginationControls } from "@/components/molecules/PaginationControls";
import { PrimaryTableContainer } from "@/components/molecules/PrimaryTableContainer";
import { COUNTRY_OPTIONS, DEPARTMENT_OPTIONS } from "@/app/constants";
import { formatSalary } from "@/lib/formatSalary";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; country?: string; department?: string; page?: string }>;
}) {
  const { search, country: countryParam, department: departmentParam, page: pageParam } = await searchParams;
  const country = countryParam && (Object.values(Country) as string[]).includes(countryParam)
    ? (countryParam as Country)
    : undefined;
  const department = departmentParam && (Object.values(Department) as string[]).includes(departmentParam)
    ? (departmentParam as Department)
    : undefined;
  const page = pageParam ? Math.max(1, parseInt(pageParam, 10) || 1) : 1;
  const filters: EmployeeFilters = {
    ...(search && { search }),
    ...(country && { country }),
    ...(department && { department }),
  };
  const { employees, totalPages, page: currentPage } = await listEmployees(filters, page);

  async function handleCsvImport(formData: FormData): Promise<ImportResult> {
    "use server";
    const file = formData.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return { success: false, errors: ["Please select a CSV file"] };
    }
    const csvContent = await file.text();
    const changedById = (await getSessionUserId()) ?? "system";
    const result = await importEmployees(csvContent, changedById);
    if (result.success) {
      revalidatePath("/employees");
    }
    return result;
  }

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
        <Box sx={{ ml: "auto" }}>
          <CsvUpload onImport={handleCsvImport} />
        </Box>
      </Box>
      <PrimaryTableContainer
        columns={[
          { label: "Name" },
          { label: "Email" },
          { label: "Department" },
          { label: "Country" },
          { label: "Base Salary", align: "right" },
          { label: "Bonus", align: "right" },
          { label: "Total", align: "right" },
          { label: "", width: 48 },
        ]}
      >
        <TableBody>
          {employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.department}</TableCell>
                  <TableCell>{emp.country}</TableCell>
                  <TableCell align="right">
                    {emp.currency} {formatSalary(emp.baseSalary, emp.currency)}
                  </TableCell>
                  <TableCell align="right">
                    {emp.currency} {formatSalary(emp.bonus, emp.currency)}
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600 }}>
                    {emp.currency} {formatSalary(emp.totalCompensation, emp.currency)}
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
        {employees.length === 0 && (
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} sx={{ textAlign: "center", py: 4, color: "text.secondary" }}>
                No employees found.
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </PrimaryTableContainer>
      <PaginationControls totalPages={totalPages} currentPage={currentPage} />
    </>
  );
}
