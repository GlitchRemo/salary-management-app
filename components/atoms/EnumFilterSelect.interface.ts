export interface FilterOption {
  value: string;
  label: string;
}

export interface EnumFilterSelectProps {
  param: string;
  label: string;
  allLabel: string;
  options: FilterOption[];
  ariaLabel: string;
}
