"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import EditIcon from "@mui/icons-material/Edit";
import type { SalaryUpdateModalProps } from "./SalaryUpdateModal.interface";
import type { EditField } from "./SalaryUpdateModal.types";
import { formatSalary } from "@/lib/formatSalary";

const CAPTION_SX = {
  textTransform: "uppercase" as const,
  fontWeight: 600,
  letterSpacing: 0.5,
};

export function SalaryUpdateModal({ employee, onUpdate }: SalaryUpdateModalProps) {
  const router = useRouter();
  const [editField, setEditField] = useState<EditField | null>(null);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  function handleOpen(field: EditField) {
    setValue(field === "baseSalary" ? String(employee.baseSalary) : String(employee.bonus));
    setError(null);
    setServerError(null);
    setEditField(field);
  }

  function validate(): string | null {
    const num = Number(value);
    if (editField === "baseSalary") {
      if (!value || isNaN(num) || num <= 0) return "Base salary must be greater than 0";
    } else {
      if (value === "" || isNaN(num) || num < 0) return "Bonus must be zero or greater";
    }
    return null;
  }

  async function handleSubmit() {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setLoading(true);
    setServerError(null);
    try {
      const num = Number(value);
      const baseSalary = editField === "baseSalary" ? num : employee.baseSalary;
      const bonus = editField === "bonus" ? num : employee.bonus;
      await onUpdate(baseSalary, bonus);
      setEditField(null);
      router.refresh();
    } catch {
      setServerError("Failed to update salary. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const isBaseSalary = editField === "baseSalary";
  const dialogTitle = isBaseSalary ? "Edit Base Salary" : "Edit Bonus";
  const fieldLabel = isBaseSalary
    ? `Base Salary (${employee.currency})`
    : `Bonus (${employee.currency})`;
  const fieldMin = isBaseSalary ? 1 : 0;

  return (
    <>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={CAPTION_SX}>
          Base Salary
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <Typography variant="body1">
            {employee.currency} {formatSalary(employee.baseSalary, employee.currency)}
          </Typography>
          <IconButton size="small" onClick={() => handleOpen("baseSalary")} aria-label="Edit base salary">
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      <Box>
        <Typography variant="caption" color="text.secondary" sx={CAPTION_SX}>
          Bonus
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
          <Typography variant="body1">
            {employee.currency} {formatSalary(employee.bonus, employee.currency)}
          </Typography>
          <IconButton size="small" onClick={() => handleOpen("bonus")} aria-label="Edit bonus">
            <EditIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      <Dialog
        open={editField !== null}
        onClose={() => !loading && setEditField(null)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent sx={{ pt: "16px !important" }}>
          {serverError && <Alert severity="error" sx={{ mb: 2 }}>{serverError}</Alert>}
          <TextField
            label={fieldLabel}
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            error={!!error}
            helperText={error}
            slotProps={{ htmlInput: { min: fieldMin } }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditField(null)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
