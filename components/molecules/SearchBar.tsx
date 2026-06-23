"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [value, setValue] = useState(searchParams.get("search") ?? "");

  function buildUrl(search: string): string {
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    router.replace(buildUrl(value.trim()));
  }

  function handleClear() {
    setValue("");
    router.replace(buildUrl(""));
  }

  return (
    <Box component="form" onSubmit={handleSubmit} aria-label="Search employees">
      <TextField
        placeholder="Search by name…"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        size="small"
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
            endAdornment: value ? (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClear}
                  aria-label="Clear search"
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        sx={{ width: 300 }}
      />
    </Box>
  );
}
