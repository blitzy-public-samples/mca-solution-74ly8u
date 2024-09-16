import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@reduxjs/toolkit';
import { fetchApplications, selectApplications } from '../store/applicationSlice';
import { formatCurrency, formatDate } from '../utils/formatters';

// HUMAN ASSISTANCE NEEDED
// The following component may need additional refinement for production readiness.
// Pagination, sorting, and filtering implementations might need to be adjusted based on specific requirements.

const ApplicationList: React.FC = () => {
  const dispatch = useDispatch();
  const applications = useSelector(selectApplications);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedApplications = [...applications].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedApplications.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleRowClick = (applicationId: string) => {
    // Implement navigation to application details page
    console.log(`Navigate to application details for ID: ${applicationId}`);
  };

  return (
    <div className="application-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID</th>
            <th onClick={() => handleSort('businessName')}>Business Name</th>
            <th onClick={() => handleSort('requestedAmount')}>Requested Amount</th>
            <th onClick={() => handleSort('submissionDate')}>Submission Date</th>
            <th onClick={() => handleSort('status')}>Status</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((application) => (
            <tr key={application.id} onClick={() => handleRowClick(application.id)}>
              <td>{application.id}</td>
              <td>{application.businessName}</td>
              <td>{formatCurrency(application.requestedAmount)}</td>
              <td>{formatDate(application.submissionDate)}</td>
              <td>{application.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(applications.length / itemsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => paginate(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ApplicationList;