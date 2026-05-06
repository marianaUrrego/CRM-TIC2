import { useCallback, useEffect, useState } from "react";
import { AuthService } from "../../../services/auth.service";
import {
  CustomerService,
  isUnauthorizedError,
} from "../../../services/customer.service";
import { CUSTOMER_REFRESH_INTERVAL_MS } from "../customer.constants";
import type {
  Customer,
  CustomerFormState,
  CustomerStatus,
} from "../customer.types";

type UseCustomersOptions = {
  onUnauthorized?: () => void;
  autoRefresh?: boolean;
};

export const useCustomers = ({
  onUnauthorized,
  autoRefresh = true,
}: UseCustomersOptions = {}) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = useCallback(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      onUnauthorized?.();
      return null;
    }

    return token;
  }, [onUnauthorized]);

  const handleRequestError = useCallback(
    (err: unknown, fallbackMessage: string) => {
      if (isUnauthorizedError(err)) {
        onUnauthorized?.();
        return;
      }

      console.error(fallbackMessage, err);
      setError(fallbackMessage);
    },
    [onUnauthorized]
  );

  const fetchCustomers = useCallback(
    async (tokenParam?: string): Promise<boolean> => {
      try {
        setError("");

        const token = tokenParam || getToken();

        if (!token) {
          return false;
        }

        const data = await CustomerService.getCustomers(token);
        setCustomers(data);

        return true;
      } catch (err) {
        handleRequestError(err, "Could not load customers.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [getToken, handleRequestError]
  );

  const saveCustomer = useCallback(
    async (
      payload: CustomerFormState,
      editingCustomerId?: string | null
    ): Promise<boolean> => {
      try {
        setError("");

        const token = getToken();

        if (!token) {
          return false;
        }

        if (editingCustomerId) {
          await CustomerService.updateCustomer(editingCustomerId, payload, token);
        } else {
          await CustomerService.createCustomer(payload, token);
        }

        await fetchCustomers(token);

        return true;
      } catch (err) {
        handleRequestError(err, "Could not save customer.");
        return false;
      }
    },
    [fetchCustomers, getToken, handleRequestError]
  );

  const removeCustomer = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setError("");

        const token = getToken();

        if (!token) {
          return false;
        }

        await CustomerService.deleteCustomer(id, token);
        await fetchCustomers(token);

        return true;
      } catch (err) {
        handleRequestError(err, "Could not delete customer.");
        return false;
      }
    },
    [fetchCustomers, getToken, handleRequestError]
  );

  const changeCustomerStatus = useCallback(
    async (id: string, status: CustomerStatus): Promise<boolean> => {
      try {
        setError("");

        const token = getToken();

        if (!token) {
          return false;
        }

        await CustomerService.updateCustomerStatus(id, status, token);
        await fetchCustomers(token);

        return true;
      } catch (err) {
        handleRequestError(err, "Could not update customer status.");
        return false;
      }
    },
    [fetchCustomers, getToken, handleRequestError]
  );

  useEffect(() => {
    if (!autoRefresh) return;

    setLoading(true);
    fetchCustomers();

    const interval = setInterval(() => {
      fetchCustomers();
    }, CUSTOMER_REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [autoRefresh, fetchCustomers]);

  return {
    customers,
    loading,
    error,
    setError,
    fetchCustomers,
    saveCustomer,
    removeCustomer,
    changeCustomerStatus,
  };
};