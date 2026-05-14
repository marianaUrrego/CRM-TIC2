import { CUSTOMER_STATUS_LABELS } from "../customer.constants";
import type { CustomerStatus } from "../customer.types";

type CustomerStatusBadgeProps = {
  status: CustomerStatus;
};

export default function CustomerStatusBadge({
  status,
}: CustomerStatusBadgeProps) {
  return (
    <span className={`customers-status-badge customers-status-badge--${status}`}>
      {CUSTOMER_STATUS_LABELS[status]}
    </span>
  );
}