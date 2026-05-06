import type { CustomerFormState, CustomerStatus } from "./customer.types";

export const INITIAL_CUSTOMER_FORM: CustomerFormState = {
  full_name: "",
  email: "",
  phone_number: "",
  company: "",
  status: "active",
  country: "",
  address: "",
};

export const ALLOWED_COUNTRIES = [
  "Argentina",
  "Australia",
  "Brazil",
  "Canada",
  "Chile",
  "China",
  "Colombia",
  "Costa Rica",
  "Ecuador",
  "France",
  "Germany",
  "India",
  "Italy",
  "Japan",
  "Mexico",
  "Panama",
  "Peru",
  "Portugal",
  "Spain",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Venezuela",
] as const;

export const ROWS_PER_PAGE_OPTIONS = [8, 10, 25, 50] as const;

export const CUSTOMER_REFRESH_INTERVAL_MS = 5000;

export const CUSTOMER_STATUS_LABELS: Record<CustomerStatus, string> = {
  active: "Active",
  pending: "Pending",
  inactive: "Inactive",
};

export const CUSTOMER_STATUS_OPTIONS: Array<{
  value: CustomerStatus;
  label: string;
}> = [
  {
    value: "active",
    label: "Active",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "inactive",
    label: "Inactive",
  },
];