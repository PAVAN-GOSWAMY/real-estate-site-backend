import { PaginationMeta } from "../responses/api-response";

export function calculatePagination(
  totalRecords: number,
  currentPage: number,
  pageSize: number
): PaginationMeta {
  const totalPages = Math.ceil(totalRecords / pageSize);
  
  return {
    current_page: currentPage,
    page_size: pageSize,
    total_records: totalRecords,
    total_pages: totalPages,
    has_next: currentPage < totalPages,
    has_previous: currentPage > 1,
  };
}
