"use client";

import { useRouter } from "next/navigation";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { COUNTRY_OPTIONS } from "@/app/constants";

type CountrySelectorProps = {
  selectedCountry: string;
};

export function CountrySelector({ selectedCountry }: CountrySelectorProps) {
  const router = useRouter();

  return (
    <FormControl size="small" sx={{ minWidth: 180 }}>
      <InputLabel id="dashboard-country-label">Country</InputLabel>
      <Select
        labelId="dashboard-country-label"
        value={selectedCountry}
        label="Country"
        onChange={(e) => router.push(`/dashboard?country=${e.target.value}`)}
      >
        {COUNTRY_OPTIONS.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
