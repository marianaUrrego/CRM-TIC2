import { useEffect, useMemo, useState } from "react";
import { Plus, Search, MoreVertical, X, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { AuthService } from "../../services/auth.service";

type CustomerStatus = "Active" | "Pending" | "Inactive";

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

const API_URL = `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api`;

const initialForm: CustomerFormState = {
  full_name: "",
  email: "",
  phone_number: "",
  company: "",
  status: "Active",
  country: "",
  address: "",
};

export default function Customers() {
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState<CustomerFormState>(initialForm);

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { token } = AuthService.getAuthData();

    if (!token) {
      navigate("/login");
      return;
    }

    fetchCustomers(token);
  }, [navigate]);

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

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenModal = () => {
    setForm(initialForm);
    setError("");
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(initialForm);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        body: JSON.stringify(form),
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
      setError("");

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
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Could not delete customer.");
    }
  };

  const handleStatusChange = async (id: string, status: CustomerStatus) => {
    try {
      setError("");

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
              <Plus size={20} />
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
                      No customers found.
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id}>
                      <td>{customer.full_name}</td>
                      <td>{customer.email}</td>
                      <td>{customer.company}</td>
                      <td>
                        <select
                          value={customer.status}
                          onChange={(e) =>
                            handleStatusChange(
                              customer.id,
                              e.target.value as CustomerStatus
                            )
                          }
                          className={`customers-status customers-status--${customer.status.toLowerCase()}`}
                        >
                          <option value="Active">Active</option>
                          <option value="Pending">Pending</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </td>
                      <td>
                        <div className="customers-actions">
                          <button
                            type="button"
                            className="customers-actions__icon"
                            title="More options"
                          >
                            <MoreVertical size={18} />
                          </button>

                          <button
                            type="button"
                            className="customers-actions__icon customers-actions__icon--danger"
                            title="Delete customer"
                            onClick={() => handleDeleteCustomer(customer.id)}
                          >
                            <Trash2 size={18} />
                          </button>
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
            className="customers-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="customers-modal__header">
              <h3>Add Customer</h3>

              <button
                type="button"
                className="customers-modal__close"
                onClick={handleCloseModal}
              >
                <X size={18} />
              </button>
            </div>

            <form className="customers-modal__form" onSubmit={handleSubmit}>
              <div className="customers-modal__field">
                <label htmlFor="full_name">Full name</label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-modal__field">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-modal__field">
                <label htmlFor="phone_number">Phone number</label>
                <input
                  id="phone_number"
                  name="phone_number"
                  type="text"
                  value={form.phone_number}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-modal__field">
                <label htmlFor="company">Company</label>
                <input
                  id="company"
                  name="company"
                  type="text"
                  value={form.company}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-modal__field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="customers-modal__field">
                <label htmlFor="country">Country</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={form.country}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="customers-modal__field">
                <label htmlFor="address">Address</label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={form.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="customers-modal__submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save customer"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}