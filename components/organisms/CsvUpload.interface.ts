import type { ImportResult } from "@/server/modules/employee/employee.types";

export interface CsvUploadProps {
  onImport: (formData: FormData) => Promise<ImportResult>;
}
