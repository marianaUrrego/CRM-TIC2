import { useEffect, useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  X,
  MoreVertical,
  Eye,
  Pencil,
  CircleAlert,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthService } from "../../services/auth.service";

type CustomerStatus = "active" | "pending" | "inactive";

type Customer = {
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
};

type CustomerFormState = {
  full_name: string;
  email: string;
  phone_number: string;
  company: string;
  status: CustomerStatus;
  country: string;
  address: string;
};

type FormErrors = Partial<Record<keyof CustomerFormState, string>>;

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const initialForm: CustomerFormState = {
  full_name: "",
  email: "",
  phone_number: "",
  company: "",
  status: "active",
  country: "",
  address: "",
};

const countries = [
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
];

export default function Customers() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CustomerFormState>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isCountryOpen, setIsCountryOpen] = useState(false);
const [countrySearch, setCountrySearch] = useState("");

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);

  const actionsRef = useRef<HTMLDivElement | null>(null);
  const countryDropdownRef = useRef<HTMLDivElement | null>(null);

useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      countryDropdownRef.current &&
      !countryDropdownRef.current.contains(event.target as Node)
    ) {
      setIsCountryOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);
const filteredCountries = useMemo(() => {
  const term = countrySearch.trim().toLowerCase();

  if (!term) return countries;

  return countries.filter((country) =>
    country.toLowerCase().includes(term)
  );
}, [countrySearch]);

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCustomers(token);
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionsRef.current &&
        !actionsRef.current.contains(event.target as Node)
      ) {
        setOpenMenuId(null);
        setOpenStatusMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCustomers = async (tokenParam?: string) => {
    try {
      setLoading(true);
      setError("");

      const { token: storedToken } = AuthService.getAuthData();
      const token = tokenParam || storedToken;

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/customers`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data: Customer[] = await response.json();
      setCustomers(data);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Could not load customers.");
    } finally {
      setLoading(false);
    }
  };

  const validateField = (
    name: keyof CustomerFormState,
    value: string
  ): string => {
    const trimmedValue = value.trim();

    switch (name) {
      case "full_name":
        if (!trimmedValue) return "Full name is required.";
        if (trimmedValue.length < 3) return "Full name must have at least 3 characters.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmedValue)) {
          return "Full name can only contain letters and spaces.";
        }
        return "";

      case "email":
        if (!trimmedValue) return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
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
        if (trimmedValue.length < 2) return "Company must have at least 2 characters.";
        return "";

      case "country":
        if (!trimmedValue) return "Country is required.";
        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmedValue)) {
          return "Country can only contain letters and spaces.";
        }
        return "";

      case "address":
        if (!trimmedValue) return "Address is required.";
        if (trimmedValue.length < 5) return "Address must have at least 5 characters.";
        return "";

      case "status":
        if (!trimmedValue) return "Status is required.";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const errors: FormErrors = {
      full_name: validateField("full_name", form.full_name),
      email: validateField("email", form.email),
      phone_number: validateField("phone_number", form.phone_number),
      company: validateField("company", form.company),
      status: validateField("status", form.status),
      country: validateField("country", form.country),
      address: validateField("address", form.address),
    };

    const cleanedErrors = Object.fromEntries(
      Object.entries(errors).filter(([, value]) => value)
    ) as FormErrors;

    setFormErrors(cleanedErrors);

    return Object.keys(cleanedErrors).length === 0;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    let nextValue = value;

    if (name === "full_name" || name === "country") {
      nextValue = value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g, "");
    }

    if (name === "phone_number") {
      nextValue = value.replace(/\D/g, "").slice(0, 15);
    }

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    setFormErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof CustomerFormState, nextValue),
    }));
  };

const handleOpenModal = () => {
  setForm(initialForm);
  setFormErrors({});
  setCountrySearch("");
  setIsCountryOpen(false);
  setError("");
  setIsModalOpen(true);
};

const handleCloseModal = () => {
  setIsModalOpen(false);
  setForm(initialForm);
  setFormErrors({});
  setCountrySearch("");
  setIsCountryOpen(false);
};

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setSaving(true);
      setError("");

      const { token } = AuthService.getAuthData();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          full_name: form.full_name.trim(),
          email: form.email.trim().toLowerCase(),
          company: form.company.trim(),
          country: form.country.trim(),
          address: form.address.trim(),
        }),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create customer");
      }

      const newCustomer: Customer = await response.json();
      setCustomers((prev) => [newCustomer, ...prev]);
      handleCloseModal();
    } catch (err) {
      console.error("Error creating customer:", err);
      setError("Could not save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
      const { token } = AuthService.getAuthData();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/customers/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to delete customer");
      }

      setCustomers((prev) => prev.filter((customer) => customer.id !== id));
      setOpenMenuId(null);
      setOpenStatusMenuId(null);
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Could not delete customer.");
    }
  };

  const handleStatusChange = async (id: string, status: CustomerStatus) => {
    try {
      const { token } = AuthService.getAuthData();

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_URL}/customers/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to update customer status");
      }

      const updatedCustomer: Customer = await response.json();

      setCustomers((prev) =>
        prev.map((customer) =>
          customer.id === updatedCustomer.id ? updatedCustomer : customer
        )
      );

      setOpenMenuId(null);
      setOpenStatusMenuId(null);
    } catch (err) {
      console.error("Error updating customer status:", err);
      setError("Could not update customer status.");
    }
  };

  const filteredCustomers = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return customers;

    return customers.filter((customer) => {
      return (
        customer.full_name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        customer.company.toLowerCase().includes(term)
      );
    });
  }, [customers, search]);

  const getStatusLabel = (status: CustomerStatus) => {
    if (status === "active") return "Active";
    if (status === "pending") return "Pending";
    return "Inactive";
  };

  return (
    <div className="customers-page">
      <Header />

      <main className="customers-main">
        <section className="customers-panel">
          <div className="customers-panel__top">
            <div>
              <h2 className="customers-panel__title">Customer Database</h2>
              <p className="customers-panel__subtitle">
                Manage and view all customer information
              </p>
            </div>

            <button
              type="button"
              className="customers-panel__add-btn"
              onClick={handleOpenModal}
            >
              <Plus size={18} />
              <span>Add Customer</span>
            </button>
          </div>

          <div className="customers-search">
            <Search size={20} className="customers-search__icon" />
            <input
              type="text"
              placeholder="Search by name, email, or company..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {error && <p className="customers-feedback customers-feedback--error">{error}</p>}

          <div className="customers-table-wrapper">
            <table className="customers-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="customers-table__empty">
                      Loading customers...
                    </td>
                  </tr>
                ) : filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="customers-table__empty">
                      No customers yet.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td className="customers-table__name">{customer.full_name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.company}</td>
                      <td>
                        <span
                          className={`customers-status-badge customers-status-badge--${customer.status}`}
                        >
                          {getStatusLabel(customer.status)}
                        </span>
                      </td>
                      <td className="customers-actions-cell">
                        <div
                          className="customers-actions"
                          ref={openMenuId === customer.id ? actionsRef : null}
                        >
                          <button
                            type="button"
                            className="customers-actions__trigger"
                            onClick={() => {
                              setOpenMenuId((prev) =>
                                prev === customer.id ? null : customer.id
                              );
                              setOpenStatusMenuId(null);
                            }}
                          >
                            <MoreVertical size={18} />
                          </button>

                          {openMenuId === customer.id && (
                            <div className="customers-actions__menu">
                              <button type="button" className="customers-actions__item">
                                <Eye size={18} />
                                <span>View Details</span>
                              </button>

                              <button type="button" className="customers-actions__item">
                                <Pencil size={18} />
                                <span>Edit</span>
                              </button>

                              <div className="customers-actions__status-wrapper">
                                <button
                                  type="button"
                                  className="customers-actions__item"
                                  onClick={() =>
                                    setOpenStatusMenuId((prev) =>
                                      prev === customer.id ? null : customer.id
                                    )
                                  }
                                >
                                  <CircleAlert size={18} />
                                  <span>Change Status</span>
                                  <span className="customers-actions__arrow">›</span>
                                </button>

                                {openStatusMenuId === customer.id && (
                                  <div className="customers-actions__submenu">
                                    <button
                                      type="button"
                                      className="customers-actions__submenu-item customers-actions__submenu-item--active"
                                      onClick={() =>
                                        handleStatusChange(customer.id, "active")
                                      }
                                    >
                                      <CheckCircle2 size={18} />
                                      <span>Active</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="customers-actions__submenu-item customers-actions__submenu-item--pending"
                                      onClick={() =>
                                        handleStatusChange(customer.id, "pending")
                                      }
                                    >
                                      <Clock3 size={18} />
                                      <span>Pending</span>
                                    </button>

                                    <button
                                      type="button"
                                      className="customers-actions__submenu-item customers-actions__submenu-item--inactive"
                                      onClick={() =>
                                        handleStatusChange(customer.id, "inactive")
                                      }
                                    >
                                      <XCircle size={18} />
                                      <span>Inactive</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <button
                                type="button"
                                className="customers-actions__item"
                                onClick={() => handleDeleteCustomer(customer.id)}
                              >
                                <span>Delete</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {isModalOpen && (
        <div
          className="customers-modal-backdrop"
          onClick={handleCloseModal}
          aria-hidden="true"
        >
          <div
            className="customers-modal customers-modal--styled"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customers-modal__header customers-modal__header--styled">
              <h3>Add New Customer</h3>

              <button
                type="button"
                className="customers-modal__close"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <form className="customers-modal__form customers-modal__form--grid" onSubmit={handleSubmit}>
              <div className="customers-modal__field">
                <label htmlFor="full_name">Full Name *</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  value={form.full_name}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.full_name && (
                  <span className="customers-field-error">{formErrors.full_name}</span>
                )}
              </div>

              <div className="customers-modal__field">
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@company.com"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.email && (
                  <span className="customers-field-error">{formErrors.email}</span>
                )}
              </div>

              <div className="customers-modal__field">
                <label htmlFor="phone_number">Phone Number *</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  inputMode="numeric"
                  maxLength={15}
                  placeholder="3001234567"
                  value={form.phone_number}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.phone_number && (
                  <span className="customers-field-error">{formErrors.phone_number}</span>
                )}
              </div>

              <div className="customers-modal__field">
                <label htmlFor="company">Company *</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Company Inc."
                  value={form.company}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.company && (
                  <span className="customers-field-error">{formErrors.company}</span>
                )}
              </div>

              <div className="customers-modal__field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

<div className="customers-modal__field">
  <label htmlFor="country">Country *</label>

  <div className="customers-country" ref={countryDropdownRef}>
    <button
      type="button"
      className={`customers-country__trigger ${
        isCountryOpen ? "customers-country__trigger--open" : ""
      }`}
      onClick={() => {
        setIsCountryOpen((prev) => !prev);
        setCountrySearch(form.country || "");
      }}
    >
      <span className={form.country ? "" : "customers-country__placeholder"}>
        {form.country || "Search country..."}
      </span>
      <span className="customers-country__arrow">▾</span>
    </button>

    {isCountryOpen && (
      <div className="customers-country__dropdown">
        <div className="customers-country__search-wrap">
          <input
            type="text"
            className="customers-country__search"
            placeholder="Search country..."
            value={countrySearch}
            onChange={(event) => {
              const value = event.target.value.replace(
                /[^A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]/g,
                ""
              );
              setCountrySearch(value);
            }}
            autoFocus
          />
        </div>

        <div className="customers-country__list">
          {filteredCountries.length > 0 ? (
            filteredCountries.map((country) => (
              <button
                key={country}
                type="button"
                className={`customers-country__option ${
                  form.country === country
                    ? "customers-country__option--selected"
                    : ""
                }`}
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    country,
                  }));

                  setFormErrors((prev) => ({
                    ...prev,
                    country: validateField("country", country),
                  }));

                  setCountrySearch(country);
                  setIsCountryOpen(false);
                }}
              >
                {country}
              </button>
            ))
          ) : (
            <div className="customers-country__empty">No countries found.</div>
          )}
        </div>
      </div>
    )}
  </div>

  {formErrors.country && (
    <span className="customers-field-error">{formErrors.country}</span>
  )}
</div>

              <div className="customers-modal__field customers-modal__field--full">
                <label htmlFor="address">Address *</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  placeholder="123 Business Ave, Suite 100"
                  value={form.address}
                  onChange={handleInputChange}
                  required
                />
                {formErrors.address && (
                  <span className="customers-field-error">{formErrors.address}</span>
                )}
              </div>

              <div className="customers-modal__footer">
                <button
                  type="button"
                  className="customers-modal__cancel"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="customers-modal__submit customers-modal__submit--styled"
                  disabled={saving}
                >
                  {saving ? "Creating..." : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}