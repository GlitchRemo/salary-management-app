import { listEmployees } from "@/server/modules/employee/employee.service";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";

export default async function EmployeesPage() {
  const employees = await listEmployees();

  return (
    <>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
        Employees
      </Typography>
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
