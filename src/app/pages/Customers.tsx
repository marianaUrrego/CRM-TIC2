import { useCallback, useEffect, useRef, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header";

import { useCustomers } from "../../features/customers/hooks/useCustomers";
import { useCustomerTable } from "../../features/customers/hooks/useCustomerTable";

import CustomerTable from "../../features/customers/components/CustomerTable";
import CustomerPagination from "../../features/customers/components/CustomerPagination";
import CustomerFormModal from "../../features/customers/components/CustomerFormModal";
import CustomerDetailsModal from "../../features/customers/components/CustomerDetailsModal";

import type {
  Customer,
  CustomerFormField,
  CustomerFormState,
  CustomerStatus,
  FormErrors,
} from "../../features/customers/customer.types";

import { INITIAL_CUSTOMER_FORM } from "../../features/customers/customer.constants";

import {
  normalizeCustomerPayload,
  sanitizeCustomerFieldValue,
  validateCustomerField,
  validateCustomerForm,
} from "../../features/customers/customer.validation";

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

  const {
    search,
    setSearch,
    currentPage,
    rowsPerPage,
    filteredCustomers,
    paginatedCustomers,
    paginationItems,
    totalEntries,
    totalPages,
    startIndex,
    endIndex,
    handleRowsPerPageChange,
    handlePageChange,
  } = useCustomerTable({ customers });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null
  );
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
              onPageChange={handlePageChange}
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