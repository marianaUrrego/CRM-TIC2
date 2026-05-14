import {
  ALLOWED_COUNTRIES,
  CUSTOMER_STATUS_OPTIONS,
} from "./customer.constants";

import type {
  CustomerFormField,
  CustomerFormState,
  FormErrors,
} from "./customer.types";

const ONLY_LETTERS_AND_SPACES_REGEX = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeCustomerFieldValue = (
  field: CustomerFormField,
  value: string
): string => {
  if (field === "full_name" || field === "country") {
    return value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "");
  }

  if (field === "phone_number") {
    return value.replace(/\D/g, "").slice(0, 15);
  }

  return value;
};

export const getMatchedAllowedCountry = (countryValue: string): string => {
  const normalizedCountry = countryValue.trim().toLowerCase();

  return (
    ALLOWED_COUNTRIES.find(
      (country) => country.toLowerCase() === normalizedCountry
    ) || countryValue.trim()
  );
};

export const validateCustomerField = (
  field: CustomerFormField,
  value: string
): string => {
  const trimmedValue = value.trim();

  switch (field) {
    case "full_name":
      if (!trimmedValue) return "Full name is required.";

      if (trimmedValue.length < 3) {
        return "Full name must have at least 3 characters.";
      }

      if (!ONLY_LETTERS_AND_SPACES_REGEX.test(trimmedValue)) {
        return "Full name can only contain letters and spaces.";
      }

      return "";

    case "email":
      if (!trimmedValue) return "Email is required.";

      if (!EMAIL_REGEX.test(trimmedValue)) {
        return "Enter a valid email address.";
      }

      return "";

    case "phone_number":
      if (!trimmedValue) return "Phone number is required.";

      if (!/^\d+$/.test(trimmedValue)) {
        return "Phone number can only contain numbers.";
      }

      if (trimmedValue.length < 7) {
        return "Phone number must have at least 7 digits.";
      }

      if (trimmedValue.length > 15) {
        return "Phone number cannot exceed 15 digits.";
      }

      return "";

    case "company":
      if (!trimmedValue) return "Company is required.";

      if (trimmedValue.length < 2) {
        return "Company must have at least 2 characters.";
      }

      return "";

    case "country": {
      if (!trimmedValue) return "Country is required.";

      if (!ONLY_LETTERS_AND_SPACES_REGEX.test(trimmedValue)) {
        return "Country can only contain letters and spaces.";
      }

      const isValidCountry = ALLOWED_COUNTRIES.some(
        (country) => country.toLowerCase() === trimmedValue.toLowerCase()
      );

      if (!isValidCountry) {
        return "Please enter a valid country from the allowed list.";
      }

      return "";
    }

    case "address":
      if (!trimmedValue) return "Address is required.";

      if (trimmedValue.length < 5) {
        return "Address must have at least 5 characters.";
      }

      return "";

    case "status": {
      const isValidStatus = CUSTOMER_STATUS_OPTIONS.some(
        (option) => option.value === trimmedValue
      );

      if (!isValidStatus) return "Status is required.";

      return "";
    }

    default:
      return "";
  }
};

export const validateCustomerForm = (
  form: CustomerFormState
): FormErrors => {
  const errors: FormErrors = {
    full_name: validateCustomerField("full_name", form.full_name),
    email: validateCustomerField("email", form.email),
    phone_number: validateCustomerField("phone_number", form.phone_number),
    company: validateCustomerField("company", form.company),
    status: validateCustomerField("status", form.status),
    country: validateCustomerField("country", form.country),
    address: validateCustomerField("address", form.address),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, value]) => value)
  ) as FormErrors;
};

export const normalizeCustomerPayload = (
  form: CustomerFormState
): CustomerFormState => {
  return {
    ...form,
    full_name: form.full_name.trim(),
    email: form.email.trim().toLowerCase(),
    phone_number: form.phone_number.trim(),
    company: form.company.trim(),
    status: form.status,
    country: getMatchedAllowedCountry(form.country),
    address: form.address.trim(),
  };
};