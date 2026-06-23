"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import MuiPagination from "@mui/material/Pagination";
import Box from "@mui/material/Box";

interface PaginationControlsProps {
  totalPages: number;
  currentPage: number;
}

export function PaginationControls({ totalPages, currentPage }: PaginationControlsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  function handleChange(_: React.ChangeEvent<unknown>, page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", String(page));
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }

  if (totalPages <= 1) return null;

  return (
    <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
      <MuiPagination
        count={totalPages}
        page={currentPage}
        onChange={handleChange}
        color="primary"
      />
    </Box>
  );
}
