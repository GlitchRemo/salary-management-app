import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { ReactNode } from "react";

type Column = {
  label: string;
  align?: "left" | "right";
  width?: number | string;
};

type PrimaryTableContainerProps = {
  columns: Column[];
  children: ReactNode;
};

export function PrimaryTableContainer({ columns, children }: PrimaryTableContainerProps) {
  return (
    <Paper elevation={0} variant="outlined" sx={{ borderRadius: 2, overflow: "hidden" }}>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "primary.main" }}>
              {columns.map((col, i) => (
                <TableCell
                  key={i}
                  align={col.align}
                  sx={{
                    color: "primary.contrastText",
                    fontWeight: 700,
                    ...(col.width !== undefined && { width: col.width }),
                  }}
                >
                  {col.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          {children}
        </Table>
      </TableContainer>
    </Paper>
  );
}
