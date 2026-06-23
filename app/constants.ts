import type { FilterOption } from "@/components/atoms/EnumFilterSelect";

export const COUNTRY_OPTIONS: FilterOption[] = [
  { value: "US", label: "United States" },
  { value: "DE", label: "Germany" },
  { value: "GB", label: "United Kingdom" },
  { value: "BR", label: "Brazil" },
  { value: "IN", label: "India" },
];

export const DEPARTMENT_OPTIONS: FilterOption[] = [
  { value: "Engineering", label: "Engineering" },
  { value: "Product", label: "Product" },
  { value: "Finance", label: "Finance" },
  { value: "Design", label: "Design" },
];
