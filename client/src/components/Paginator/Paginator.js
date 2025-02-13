import "./Paginator.css";
import React, { useState } from "react";

const Paginator = (props) => {
  const { onPageChange, onPageSizeChange, totalRecords } = props;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  return (
    <div className="paginator">
      <div className="navigators">
        <button
          onClick={() => {
            if (page > 0) {
              setPage(page - 1);
              onPageChange(page - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          onClick={() => {
            if (page < Math.floor(totalRecords / pageSize)) {
              setPage(page + 1);
              onPageChange(page + 1);
            }
          }}
        >
          Next
        </button>
      </div>
      <label>
        Page Size:
        <input
          type="number"
          value={pageSize}
          onChange={(e) => {
            setPageSize(e.target.value);
            onPageSizeChange(e.target.value);
          }}
        />
      </label>
    </div>
  );
};

export default Paginator;
