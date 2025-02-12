import './Paginator.css'
import React, { useEffect, useState } from 'react'

const Paginator = (props) => {
  const { onPageChange, onPageSizeChange, totalRecords, page, setPage } = props
  const [pageSize, setPageSize] = useState(totalRecords)
  useEffect(() => {
    setPageSize(totalRecords);
  }, [totalRecords])

  return (
    <div className='paginator'>
      <div className='navigators'>
        <button onClick={() => {
          if (page > 0) {
            setPage(page - 1)
            onPageChange(page - 1)
            console.log(page)
          }
        }}
        >Previous
        </button>
        <button onClick={() => {
          if (page < Math.ceil(totalRecords / pageSize) - 1) {
            setPage(page + 1)
            onPageChange(page + 1)
            console.log(page)
          }
        }}
        >Next
        </button>
      </div>
      <label>
        Page Size:
        <input
          type='number' value={pageSize} onChange={e => {
            let pageNo = event.target.value;
            if( pageNo <= totalRecords && pageNo > 0) {
              setPageSize(e.target.value)
              onPageSizeChange(e.target.value)
            } else {
              e.preventDefault()
            }
          }}
        />
      </label>
    </div>
  )
}

export default Paginator
