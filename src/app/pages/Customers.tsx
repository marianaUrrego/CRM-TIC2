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

const rowsPerPageOptions = [8, 10, 25, 50];

const getPaginationItems = (currentPage: number, totalPages: number) => {
  const delta = 1;
  const range: Array<number | "..."> = [];

  for (let page = 1; page <= totalPages; page++) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const isNearCurrentPage =
      page >= currentPage - delta && page <= currentPage + delta;

    if (isFirstPage || isLastPage || isNearCurrentPage) {
      range.push(page);
    }
  }

  const paginationItems: Array<number | "..."> = [];

  range.forEach((page, index) => {
    const previousPage = range[index - 1];

    if (
      typeof page === "number" &&
      typeof previousPage === "number" &&
      page - previousPage > 1
    ) {
      paginationItems.push("...");
    }

    paginationItems.push(page);
  });

  return paginationItems;
};

export default function Customers() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [rowsPerPage, setRowsPerPage] = useState(8);
  const [form, setForm] = useState<CustomerFormState>(initialForm);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const actionsRef = useRef<HTMLDivElement | null>(null);

  const fetchCustomers = async (tokenParam?: string) => {
    try {
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

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
      return;
    }

    setLoading(true);
    fetchCustomers(token);

    const interval = setInterval(() => {
      fetchCustomers(token);
    }, 5000);

    return () => clearInterval(interval);
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
        if (trimmedValue.length < 7) return "Phone number must have at least 7 digits.";
        if (trimmedValue.length > 15) return "Phone number cannot exceed 15 digits.";
        return "";

      case "company":
        if (!trimmedValue) return "Company is required.";
        if (trimmedValue.length < 2) return "Company must have at least 2 characters.";
        return "";

      case "country": {
        if (!trimmedValue) return "Country is required.";

        if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s]+$/.test(trimmedValue)) {
          return "Country can only contain letters and spaces.";
        }

        const normalizedInput = trimmedValue.toLowerCase();
        const isValidCountry = countries.some(
          (country) => country.toLowerCase() === normalizedInput
        );

        if (!isValidCountry) {
          return "Please enter a valid country from the allowed list.";
        }

        return "";
      }

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
    setError("");
    setEditingCustomerId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
    setFormErrors({});
    setEditingCustomerId(null);
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

      const matchedCountry =
        countries.find(
          (country) => country.toLowerCase() === form.country.trim().toLowerCase()
        ) || form.country.trim();
      let response: Response;

      if (editingCustomerId) {
        // Update existing customer
        response = await fetch(`${API_URL}/customers/${editingCustomerId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...form,
            full_name: form.full_name.trim(),
            email: form.email.trim().toLowerCase(),
            company: form.company.trim(),
            country: matchedCountry,
            address: form.address.trim(),
          }),
        });
      } else {
        // Create new customer
        response = await fetch(`${API_URL}/customers`, {
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
            country: matchedCountry,
            address: form.address.trim(),
          }),
        });
      }

      if (response.status === 401) {
        navigate("/login");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || "Failed to create customer");
      }

      handleCloseModal();
      await fetchCustomers();
    } catch (err) {
      console.error("Error creating customer:", err);
      setError("Could not save customer.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomerId(customer.id);
    setForm({
      full_name: customer.full_name,
      email: customer.email,
      phone_number: customer.phone_number,
      company: customer.company,
      status: customer.status,
      country: customer.country,
      address: customer.address,
    });
    setFormErrors({});
    setError("");
    setIsModalOpen(true);
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

      setOpenMenuId(null);
      setOpenStatusMenuId(null);
      await fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Could not delete customer.");
    }
  };

  const handleViewCustomer = (customer: Customer) => {
    setViewingCustomer(customer);
    setOpenMenuId(null);
    setOpenStatusMenuId(null);
  };

  const handleCloseView = () => {
    setViewingCustomer(null);
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

      setOpenMenuId(null);
      setOpenStatusMenuId(null);
      await fetchCustomers();
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

  useEffect(() => {
  setCurrentPage(1);
}, [search, rowsPerPage]);

const totalEntries = filteredCustomers.length;
const totalPages = Math.max(1, Math.ceil(totalEntries / rowsPerPage));

useEffect(() => {
  if (currentPage > totalPages) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

const startIndex = totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage;
const endIndex = Math.min(startIndex + rowsPerPage, totalEntries);

const paginatedCustomers = useMemo(() => {
  return filteredCustomers.slice(startIndex, endIndex);
}, [filteredCustomers, startIndex, endIndex]);

const paginationItems = useMemo(() => {
  return getPaginationItems(currentPage, totalPages);
}, [currentPage, totalPages]);

const handleRowsPerPageChange = (
  event: React.ChangeEvent<HTMLSelectElement>
) => {
  setRowsPerPage(Number(event.target.value));
};

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
                  paginatedCustomers.map((customer) => (
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
                              <button type="button" className="customers-actions__item" onClick={() => handleViewCustomer(customer)}>
                                <Eye size={18} />
                                <span>View Details</span>
                              </button>

                              <button type="button" className="customers-actions__item" onClick={() => handleEditCustomer(customer)}>
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
          {!loading && totalEntries > 0 && (
            <div className="customers-pagination">
              <div className="customers-pagination__info">
                <span>
                  Showing data {startIndex + 1} to {endIndex} of {totalEntries} entries
                </span>

                <label className="customers-pagination__rows">
                  <span>Rows per page</span>
                  <select value={rowsPerPage} onChange={handleRowsPerPageChange}>
                    {rowsPerPageOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="customers-pagination__controls">
                <button
                  type="button"
                  className="customers-pagination__button"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {paginationItems.map((item, index) =>
                  item === "..." ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="customers-pagination__ellipsis"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      className={`customers-pagination__button ${
                        currentPage === item ? "customers-pagination__button--active" : ""
                      }`}
                      onClick={() => setCurrentPage(item)}
                    >
                      {item}
                    </button>
                  )
                )}

                <button
                  type="button"
                  className="customers-pagination__button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          )}
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
              <h3>{editingCustomerId ? "Edit Customer" : "Add New Customer"}</h3>

              <button
                type="button"
                className="customers-modal__close"
                onClick={handleCloseModal}
              >
                <X size={20} />
              </button>
            </div>

            <form
              className="customers-modal__form customers-modal__form--grid"
              onSubmit={handleSubmit}
            >
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
                <input
                  id="country"
                  name="country"
                  type="text"
                  placeholder="Enter country"
                  value={form.country}
                  onChange={handleInputChange}
                  required
                />
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
                  {saving ? (editingCustomerId ? "Updating..." : "Creating...") : (editingCustomerId ? "Update Customer" : "Create Customer")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {viewingCustomer && (
        <div
          className="customers-modal-backdrop"
          onClick={handleCloseView}
          aria-hidden="true"
        >
          <div
            className="customers-modal customers-modal--styled"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customers-modal__header customers-modal__header--styled">
              <h3>Customer Details</h3>

              <button
                type="button"
                className="customers-modal__close"
                onClick={handleCloseView}
              >
                <X size={20} />
              </button>
            </div>

            <div className="customers-modal__form customers-modal__form--grid">
              <div className="customers-modal__field">
                <label>Name</label>
                <p>{viewingCustomer.full_name}</p>
              </div>

              <div className="customers-modal__field">
                <label>Email</label>
                <p>{viewingCustomer.email}</p>
              </div>

              <div className="customers-modal__field">
                <label>Phone</label>
                <p>{viewingCustomer.phone_number}</p>
              </div>

              <div className="customers-modal__field">
                <label>Company</label>
                <p>{viewingCustomer.company}</p>
              </div>

              <div className="customers-modal__field">
                <label>Status</label>
                <p>
                  <span className={`customers-status-badge customers-status-badge--${viewingCustomer.status}`}>
                    {getStatusLabel(viewingCustomer.status)}
                  </span>
                </p>
              </div>

              <div className="customers-modal__field customers-modal__field--full">
                <label>Address</label>
                <p>{viewingCustomer.address}</p>
              </div>

              <div className="customers-modal__footer">
                <button type="button" className="customers-modal__cancel" onClick={handleCloseView}>
                  Close
                </button>

                <button
                  type="button"
                  className="customers-modal__submit customers-modal__submit--styled"
                  onClick={() => {
                    const c = viewingCustomer;
                    handleCloseView();
                    if (c) handleEditCustomer(c);
                  }}
                >
                  Edit Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}