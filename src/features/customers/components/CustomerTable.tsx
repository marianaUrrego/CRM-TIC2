import type { RefObject } from "react";
import type { Customer, CustomerStatus } from "../customer.types";
import CustomerStatusBadge from "./CustomerStatusBadge";
import CustomerActionsMenu from "./CustomerActionsMenu";

type CustomerTableProps = {
  customers: Customer[];
  loading: boolean;
  filteredCustomersCount: number;
  openMenuId: string | null;
  openStatusMenuId: string | null;
  actionsRef: RefObject<HTMLDivElement | null>;
  onToggleMenu: (customerId: string) => void;
  onToggleStatusMenu: (customerId: string) => void;
  onViewCustomer: (customer: Customer) => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customerId: string) => void;
  onStatusChange: (customerId: string, status: CustomerStatus) => void;
};

export default function CustomerTable({
  customers,
  loading,
  filteredCustomersCount,
  openMenuId,
  openStatusMenuId,
  actionsRef,
  onToggleMenu,
  onToggleStatusMenu,
  onViewCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onStatusChange,
}: CustomerTableProps) {
  return (
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
          ) : filteredCustomersCount === 0 ? (
            <tr>
              <td colSpan={5} className="customers-table__empty">
                No customers yet.
              </td>
            </tr>
          ) : (
            customers.map((customer) => (
              <tr key={customer.id}>
                <td className="customers-table__name">{customer.full_name}</td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td>
                  <CustomerStatusBadge status={customer.status} />
                </td>
                <td className="customers-actions-cell">
                  <CustomerActionsMenu
                    customer={customer}
                    isMenuOpen={openMenuId === customer.id}
                    isStatusMenuOpen={openStatusMenuId === customer.id}
                    actionsRef={actionsRef}
                    onToggleMenu={onToggleMenu}
                    onToggleStatusMenu={onToggleStatusMenu}
                    onViewCustomer={onViewCustomer}
                    onEditCustomer={onEditCustomer}
                    onDeleteCustomer={onDeleteCustomer}
                    onStatusChange={onStatusChange}
                  />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}