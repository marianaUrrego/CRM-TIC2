import { useEffect, useMemo, useState } from "react";
import { ROWS_PER_PAGE_OPTIONS } from "../customer.constants";
import type { Customer, PaginationItem } from "../customer.types";

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

type UseCustomerTableParams = {
  customers: Customer[];
};

export const useCustomerTable = ({ customers }: UseCustomerTableParams) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(
    ROWS_PER_PAGE_OPTIONS[0]
  );

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

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  };

  return {
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
  };
};