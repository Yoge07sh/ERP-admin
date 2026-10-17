import { Pagination as BootstrapPagination } from "react-bootstrap";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <BootstrapPagination className="justify-content-center mt-4">
      <BootstrapPagination.Prev
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      />

      {[...Array(totalPages)].map((_, index) => {
        const pageNumber = index + 1;

        return (
          <BootstrapPagination.Item
            key={pageNumber}
            active={currentPage === pageNumber}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </BootstrapPagination.Item>
        );
      })}

      <BootstrapPagination.Next
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      />
    </BootstrapPagination>
  );
}

export default Pagination;
