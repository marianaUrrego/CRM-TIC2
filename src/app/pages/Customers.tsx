import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Plus, Search} from "lucide-react";
import CustomerTable from "../../features/customers/components/CustomerTable";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useCustomers } from "../../features/customers/hooks/useCustomers";
import type {
  Customer,
  CustomerFormField,
  CustomerFormState,
  CustomerStatus,
  FormErrors,
  PaginationItem,
} from "../../features/customers/customer.types";
import {
  INITIAL_CUSTOMER_FORM,
} from "../../features/customers/customer.constants";
import {
  normalizeCustomerPayload,
  sanitizeCustomerFieldValue,
  validateCustomerField,
  validateCustomerForm,
} from "../../features/customers/customer.validation";
import CustomerPagination from "../../features/customers/components/CustomerPagination";
import CustomerFormModal from "../../features/customers/components/CustomerFormModal";
import CustomerDetailsModal from "../../features/customers/components/CustomerDetailsModal";

const getPaginationItems = (
  currentPage: number,
  totalPages: number
): PaginationItem[] => {
  const delta = 1;
  const range: PaginationItem[] = [];

  for (let page = 1; page <= totalPages; page++) {
    const isFirstPage = page === 1;
    const isLastPage = page === totalPages;
    const isNearCurrentPage =
      page >= currentPage - delta && page <= currentPage + delta;

    if (isFirstPage || isLastPage || isNearCurrentPage) {
      range.push(page);
    }
  }

  const paginationItems: PaginationItem[] = [];

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

  const handleUnauthorized = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const {
    customers,
    loading,
    error,
    setError,
    saveCustomer,
    removeCustomer,
    changeCustomerStatus,
  } = useCustomers({
    onUnauthorized: handleUnauthorized,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null
  );
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [form, setForm] = useState<CustomerFormState>(INITIAL_CUSTOMER_FORM);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [saving, setSaving] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openStatusMenuId, setOpenStatusMenuId] = useState<string | null>(null);
  const [viewingCustomer, setViewingCustomer] = useState<Customer | null>(null);

  const actionsRef = useRef<HTMLDivElement | null>(null);

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

  const validateCurrentForm = () => {
    const errors = validateCustomerForm(form);

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const field = event.target.name as CustomerFormField;
    const nextValue = sanitizeCustomerFieldValue(field, event.target.value);

    setForm((prev) =>
      ({
        ...prev,
        [field]: nextValue,
      } as CustomerFormState)
    );

    setFormErrors((prev) => {
      const fieldError = validateCustomerField(field, nextValue);
      const nextErrors = { ...prev };

      if (fieldError) {
        nextErrors[field] = fieldError;
      } else {
        delete nextErrors[field];
      }

      return nextErrors;
    });
  };

  const handleOpenModal = () => {
    setForm(INITIAL_CUSTOMER_FORM);
    setFormErrors({});
    setError("");
    setEditingCustomerId(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setForm(INITIAL_CUSTOMER_FORM);
    setFormErrors({});
    setEditingCustomerId(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateCurrentForm()) return;

    try {
      setSaving(true);
      setError("");

      const payload = normalizeCustomerPayload(form);
      const wasSaved = await saveCustomer(payload, editingCustomerId);

      if (wasSaved) {
        handleCloseModal();
      }
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this customer?"
    );

    if (!confirmed) return;

    const wasDeleted = await removeCustomer(id);

    if (wasDeleted) {
      setOpenMenuId(null);
      setOpenStatusMenuId(null);
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
    const wasUpdated = await changeCustomerStatus(id, status);

    if (wasUpdated) {
      setOpenMenuId(null);
      setOpenStatusMenuId(null);
    }
  };

  const handleToggleMenu = (customerId: string) => {
    setOpenMenuId((prev) => (prev === customerId ? null : customerId));
    setOpenStatusMenuId(null);
  };

  const handleToggleStatusMenu = (customerId: string) => {
    setOpenStatusMenuId((prev) =>
      prev === customerId ? null : customerId
    );
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

  const startIndex =
    totalEntries === 0 ? 0 : (currentPage - 1) * rowsPerPage;

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

          {error && (
            <p className="customers-feedback customers-feedback--error">
              {error}
            </p>
          )}

          <CustomerTable
            customers={paginatedCustomers}
            loading={loading}
            filteredCustomersCount={filteredCustomers.length}
            openMenuId={openMenuId}
            openStatusMenuId={openStatusMenuId}
            actionsRef={actionsRef}
            onToggleMenu={handleToggleMenu}
            onToggleStatusMenu={handleToggleStatusMenu}
            onViewCustomer={handleViewCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            onStatusChange={handleStatusChange}
          />

          {!loading && totalEntries > 0 && (
            <CustomerPagination
              totalEntries={totalEntries}
              startIndex={startIndex}
              endIndex={endIndex}
              rowsPerPage={rowsPerPage}
              currentPage={currentPage}
              totalPages={totalPages}
              paginationItems={paginationItems}
              onRowsPerPageChange={handleRowsPerPageChange}
              onPageChange={setCurrentPage}
            />
          )}
        </section>
      </main>

      {isModalOpen && (
        <CustomerFormModal
          form={form}
          formErrors={formErrors}
          isEditing={Boolean(editingCustomerId)}
          saving={saving}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
        />
      )}

      {viewingCustomer && (
        <CustomerDetailsModal
          customer={viewingCustomer}
          onClose={handleCloseView}
          onEditCustomer={(customer) => {
            handleCloseView();
            handleEditCustomer(customer);
          }}
        />
      )}
    </div>
  );
}