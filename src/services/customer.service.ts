import { API_URL } from "./api";

import type {
  Customer,
  CustomerFormState,
  CustomerStatus,
} from "../features/customers/customer.types";

const CUSTOMERS_URL = `${API_URL}/customers`;

export class ApiRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
  }
}

export const isUnauthorizedError = (error: unknown): boolean => {
  return error instanceof ApiRequestError && error.status === 401;
};

const buildAuthHeaders = (token: string, hasBody = false): HeadersInit => {
  const headers: HeadersInit = {
    Authorization: `Bearer ${token}`,
  };

  if (hasBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

const getErrorMessage = async (
  response: Response,
  fallbackMessage: string
): Promise<string> => {
  const errorData = await response.json().catch(() => null);
  return errorData?.message || fallbackMessage;
};

const handleResponse = async <T>(
  response: Response,
  fallbackMessage: string
): Promise<T> => {
  if (!response.ok) {
    const message = await getErrorMessage(response, fallbackMessage);
    throw new ApiRequestError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};

export class CustomerService {
  static async getCustomers(token: string): Promise<Customer[]> {
    const response = await fetch(CUSTOMERS_URL, {
      method: "GET",
      headers: buildAuthHeaders(token),
    });

    return handleResponse<Customer[]>(response, "Failed to fetch customers");
  }

  static async createCustomer(
    data: CustomerFormState,
    token: string
  ): Promise<Customer> {
    const response = await fetch(CUSTOMERS_URL, {
      method: "POST",
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify(data),
    });

    return handleResponse<Customer>(response, "Failed to create customer");
  }

  static async updateCustomer(
    id: string,
    data: CustomerFormState,
    token: string
  ): Promise<Customer> {
    const response = await fetch(`${CUSTOMERS_URL}/${id}`, {
      method: "PUT",
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify(data),
    });

    return handleResponse<Customer>(response, "Failed to update customer");
  }

  static async deleteCustomer(id: string, token: string): Promise<void> {
    const response = await fetch(`${CUSTOMERS_URL}/${id}`, {
      method: "DELETE",
      headers: buildAuthHeaders(token),
    });

    return handleResponse<void>(response, "Failed to delete customer");
  }

  static async updateCustomerStatus(
    id: string,
    status: CustomerStatus,
    token: string
  ): Promise<Customer> {
    const response = await fetch(`${CUSTOMERS_URL}/${id}/status`, {
      method: "PATCH",
      headers: buildAuthHeaders(token, true),
      body: JSON.stringify({ status }),
    });

    return handleResponse<Customer>(
      response,
      "Failed to update customer status"
    );
  }
}