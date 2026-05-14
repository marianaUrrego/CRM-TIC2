import type { ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";
import { CUSTOMER_STATUS_OPTIONS } from "../customer.constants";
import type { CustomerFormState, FormErrors } from "../customer.types";

type CustomerFormModalProps = {
  form: CustomerFormState;
  formErrors: FormErrors;
  isEditing: boolean;
  saving: boolean;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onInputChange: (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
};

export default function CustomerFormModal({
  form,
  formErrors,
  isEditing,
  saving,
  onClose,
  onSubmit,
  onInputChange,
}: CustomerFormModalProps) {
  return (
    <div
      className="customers-modal-backdrop"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="customers-modal customers-modal--styled"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="customers-modal__header customers-modal__header--styled">
          <h3>{isEditing ? "Edit Customer" : "Add New Customer"}</h3>

          <button
            type="button"
            className="customers-modal__close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <form
          className="customers-modal__form customers-modal__form--grid"
          onSubmit={onSubmit}
        >
          <div className="customers-modal__field">
            <label htmlFor="full_name">Full Name *</label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="John Doe"
              value={form.full_name}
              onChange={onInputChange}
              required
            />
            {formErrors.full_name && (
              <span className="customers-field-error">
                {formErrors.full_name}
              </span>
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              required
            />
            {formErrors.phone_number && (
              <span className="customers-field-error">
                {formErrors.phone_number}
              </span>
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
              onChange={onInputChange}
              required
            />
            {formErrors.company && (
              <span className="customers-field-error">
                {formErrors.company}
              </span>
            )}
          </div>

          <div className="customers-modal__field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={onInputChange}
            >
              {CUSTOMER_STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
              onChange={onInputChange}
              required
            />
            {formErrors.country && (
              <span className="customers-field-error">
                {formErrors.country}
              </span>
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
              onChange={onInputChange}
              required
            />
            {formErrors.address && (
              <span className="customers-field-error">
                {formErrors.address}
              </span>
            )}
          </div>

          <div className="customers-modal__footer">
            <button
              type="button"
              className="customers-modal__cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="customers-modal__submit customers-modal__submit--styled"
              disabled={saving}
            >
              {saving
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                ? "Update Customer"
                : "Create Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}