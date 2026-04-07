export type CustomerStatus = "Active" | "Pending" | "Inactive";

export interface Customer {
  id: string;
  owner_user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: CustomerStatus;
  country: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerDto {
  owner_user_id: string;
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: CustomerStatus;
  country: string;
  address: string;
}