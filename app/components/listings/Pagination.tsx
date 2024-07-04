import React from "react";

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex justify-center mt-8">
      {page > 1 && (
        <button onClick={() => onPageChange(page - 1)} className="mr-2">
          Previous
        </button>
      )}
      <span className="mx-2">{`Page ${page} of ${totalPages}`}</span>
      {page < totalPages && (
        <button onClick={() => onPageChange(page + 1)}>Next</button>
      )}
    </div>
  );
};

export default Pagination;
