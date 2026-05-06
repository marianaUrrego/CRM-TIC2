import { X } from "lucide-react";
import type { Customer } from "../customer.types";
import CustomerStatusBadge from "./CustomerStatusBadge";

type CustomerDetailsModalProps = {
  customer: Customer;
  onClose: () => void;
  onEditCustomer: (customer: Customer) => void;
};

export default function CustomerDetailsModal({
  customer,
  onClose,
  onEditCustomer,
}: CustomerDetailsModalProps) {
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
          <h3>Customer Details</h3>

          <button
            type="button"
            className="customers-modal__close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="customers-modal__form customers-modal__form--grid">
          <div className="customers-modal__field">
            <label>Name</label>
            <p>{customer.full_name}</p>
          </div>

          <div className="customers-modal__field">
            <label>Email</label>
            <p>{customer.email}</p>
          </div>

          <div className="customers-modal__field">
            <label>Phone</label>
            <p>{customer.phone_number}</p>
          </div>

          <div className="customers-modal__field">
            <label>Company</label>
            <p>{customer.company}</p>
          </div>

          <div className="customers-modal__field">
            <label>Status</label>
            <p>
              <CustomerStatusBadge status={customer.status} />
            </p>
          </div>

          <div className="customers-modal__field customers-modal__field--full">
            <label>Address</label>
            <p>{customer.address}</p>
          </div>

          <div className="customers-modal__footer">
            <button
              type="button"
              className="customers-modal__cancel"
              onClick={onClose}
            >
              Close
            </button>

            <button
              type="button"
              className="customers-modal__submit customers-modal__submit--styled"
              onClick={() => onEditCustomer(customer)}
            >
              Edit Customer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}