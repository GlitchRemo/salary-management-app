import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { PrimaryTableContainer } from "./PrimaryTableContainer";

const columns = [
  { label: "Name" },
  { label: "Salary", align: "right" as const },
];

describe("PrimaryTableContainer", () => {
  it("renders all column headers", () => {
    render(
      <PrimaryTableContainer columns={columns}>
        <TableBody />
      </PrimaryTableContainer>,
    );
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Salary")).toBeInTheDocument();
  });

  it("renders children (table body content)", () => {
    render(
      <PrimaryTableContainer columns={columns}>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>100,000</TableCell>
          </TableRow>
        </TableBody>
      </PrimaryTableContainer>,
    );
    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("100,000")).toBeInTheDocument();
  });
});
