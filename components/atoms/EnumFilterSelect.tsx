"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { EnumFilterSelectProps } from "./EnumFilterSelect.interface";


export function EnumFilterSelect({
  param,
  label,
  allLabel,
  options,
  ariaLabel,
}: EnumFilterSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const value = searchParams.get(param) ?? "";

  function handleChange(newValue: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set(param, newValue);
    } else {
      params.delete(param);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  const labelId = `${param}-filter-label`;

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        labelId={labelId}
        value={value}
        label={label}
        onChange={(e) => handleChange(e.target.value)}
        inputProps={{ "aria-label": ariaLabel }}
      >
        <MenuItem value="">{allLabel}</MenuItem>
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
