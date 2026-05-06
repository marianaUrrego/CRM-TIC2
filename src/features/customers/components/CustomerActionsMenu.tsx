import type { RefObject } from "react";
import {
  MoreVertical,
  Eye,
  Pencil,
  CircleAlert,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";
import type { Customer, CustomerStatus } from "../customer.types";

type CustomerActionsMenuProps = {
  customer: Customer;
  isMenuOpen: boolean;
  isStatusMenuOpen: boolean;
  actionsRef: RefObject<HTMLDivElement | null>;
  onToggleMenu: (customerId: string) => void;
  onToggleStatusMenu: (customerId: string) => void;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onStatusChange: (customerId: string, status: CustomerStatus) => void;
};

export default function CustomerActionsMenu({
  customer,
  isMenuOpen,
  isStatusMenuOpen,
  actionsRef,
  onToggleMenu,
  onToggleStatusMenu,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onStatusChange,
}: CustomerActionsMenuProps) {
  return (
    <div className="customers-actions" ref={isMenuOpen ? actionsRef : null}>
      <button
        type="button"
        className="customers-actions__trigger"
        onClick={() => onToggleMenu(customer.id)}
      >
        <MoreVertical size={18} />
      </button>

      {isMenuOpen && (
        <div className="customers-actions__menu">
          <button
            type="button"
            className="customers-actions__item"
            onClick={() => onViewCustomer(customer)}
          >
            <Eye size={18} />
            <span>View Details</span>
          </button>

          <button
            type="button"
            className="customers-actions__item"
            onClick={() => onEditCustomer(customer)}
          >
            <Pencil size={18} />
            <span>Edit</span>
          </button>

          <div className="customers-actions__status-wrapper">
            <button
              type="button"
              className="customers-actions__item"
              onClick={() => onToggleStatusMenu(customer.id)}
            >
              <CircleAlert size={18} />
              <span>Change Status</span>
              <span className="customers-actions__arrow">›</span>
            </button>

            {isStatusMenuOpen && (
              <div className="customers-actions__submenu">
                <button
                  type="button"
                  className="customers-actions__submenu-item customers-actions__submenu-item--active"
                  onClick={() => onStatusChange(customer.id, "active")}
                >
                  <CheckCircle2 size={18} />
                  <span>Active</span>
                </button>

                <button
                  type="button"
                  className="customers-actions__submenu-item customers-actions__submenu-item--pending"
                  onClick={() => onStatusChange(customer.id, "pending")}
                >
                  <Clock3 size={18} />
                  <span>Pending</span>
                </button>

                <button
                  type="button"
                  className="customers-actions__submenu-item customers-actions__submenu-item--inactive"
                  onClick={() => onStatusChange(customer.id, "inactive")}
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
            onClick={() => onDeleteCustomer(customer.id)}
          >
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  );
}