import React, { useState } from 'react';
import { useSelector } from '@reduxjs/toolkit';
import { selectSelectedApplication } from '../store/applicationSlice';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import { DocumentViewer } from './DocumentViewer';

// HUMAN ASSISTANCE NEEDED
// The confidence level for this component is below 0.8. 
// Additional review and refinement may be required for production readiness.

const ApplicationDetail: React.FC<{ applicationId: string }> = ({ applicationId }) => {
  const application = useSelector(selectSelectedApplication);
  const [isEditing, setIsEditing] = useState(false);

  if (!application) {
    return <div>Loading application details...</div>;
  }

  const handleEdit = () => {
    setIsEditing(true);
    // Implement edit functionality
  };

  const handleSave = () => {
    setIsEditing(false);
    // Implement save functionality
  };

  return (
    <div className="application-detail">
      <h2>Application Details</h2>
      
      <section className="merchant-info">
        <h3>Merchant Information</h3>
        <p>Business Name: {application.businessName}</p>
        <p>Industry: {application.industry}</p>
        <p>Years in Business: {application.yearsInBusiness}</p>
      </section>

      <section className="owner-info">
        <h3>Owner Information</h3>
        <p>Name: {application.ownerName}</p>
        <p>Email: {application.ownerEmail}</p>
        <p>Phone: {application.ownerPhone}</p>
      </section>

      <section className="funding-details">
        <h3>Funding Details</h3>
        <p>Requested Amount: {formatCurrency(application.requestedAmount)}</p>
        <p>Approved Amount: {formatCurrency(application.approvedAmount)}</p>
        <p>Interest Rate: {formatPercentage(application.interestRate)}</p>
        <p>Term Length: {application.termLength} months</p>
        <p>Application Date: {formatDate(application.applicationDate)}</p>
        <p>Status: {application.status}</p>
      </section>

      <section className="documents">
        <h3>Application Documents</h3>
        <DocumentViewer documents={application.documents} />
      </section>

      {isEditing ? (
        <button onClick={handleSave}>Save Changes</button>
      ) : (
        <button onClick={handleEdit}>Edit Application</button>
      )}
    </div>
  );
};

export default ApplicationDetail;