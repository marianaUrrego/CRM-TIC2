import { ROWS_PER_PAGE_OPTIONS } from "../customer.constants";
import type { PaginationItem } from "../customer.types";

type CustomerPaginationProps = {
  totalEntries: number;
  startIndex: number;
  endIndex: number;
  rowsPerPage: number;
  currentPage: number;
  totalPages: number;
  paginationItems: PaginationItem[];
  onRowsPerPageChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onPageChange: (page: number) => void;
};

export default function CustomerPagination({
  totalEntries,
  startIndex,
  endIndex,
  rowsPerPage,
  currentPage,
  totalPages,
  paginationItems,
  onRowsPerPageChange,
  onPageChange,
}: CustomerPaginationProps) {
  return (
    <div className="customers-pagination">
      <div className="customers-pagination__info">
        <span>
          Showing data {startIndex + 1} to {endIndex} of {totalEntries} entries
        </span>

        <label className="customers-pagination__rows">
          <span>Rows per page</span>

          <select value={rowsPerPage} onChange={onRowsPerPageChange}>
            {ROWS_PER_PAGE_OPTIONS.map((option) => (
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
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
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
                currentPage === item
                  ? "customers-pagination__button--active"
                  : ""
              }`}
              onClick={() => onPageChange(item)}
            >
              {item}
            </button>
          )
        )}

        <button
          type="button"
          className="customers-pagination__button"
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          ›
        </button>
      </div>
    </div>
  );
}