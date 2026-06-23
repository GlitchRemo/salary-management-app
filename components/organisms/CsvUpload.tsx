"use client";

import { useActionState, useRef } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import type { ImportResult } from "@/server/modules/employee/employee.types";
import type { CsvUploadProps } from "./CsvUpload.interface";

export function CsvUpload({ onImport }: CsvUploadProps) {
  const [result, formAction, isPending] = useActionState(
    (_prev: ImportResult | null, formData: FormData) => onImport(formData),
    null,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Box>
      <Box component="form" action={formAction}>
        <input
          ref={inputRef}
          type="file"
          name="file"
          accept=".csv"
          style={{ display: "none" }}
          aria-label="CSV file input"
          onChange={(e) => {
            if (e.target.files?.length) {
              e.target.form?.requestSubmit();
            }
          }}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFileIcon />}
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
        >
          {isPending ? "Importing…" : "Import CSV"}
        </Button>
      </Box>
      {result?.success === true && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Successfully imported {result.imported} employee{result.imported !== 1 ? "s" : ""}
        </Alert>
      )}
      {result?.success === false && (
        <Alert severity="error" sx={{ mt: 2 }}>
          <Box component="ul" sx={{ m: 0, pl: 2 }}>
            {result.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </Box>
        </Alert>
      )}
    </Box>
  );
}
