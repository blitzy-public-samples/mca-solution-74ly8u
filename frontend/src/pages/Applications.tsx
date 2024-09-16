import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from '@reduxjs/toolkit';
import ApplicationList from '../components/ApplicationList';
import ApplicationDetail from '../components/ApplicationDetail';
import { fetchApplications, updateApplicationStatus } from '../store/applicationSlice';

const Applications: React.FC = () => {
  const [selectedApplication, setSelectedApplication] = useState<number | null>(null);
  const dispatch = useDispatch();
  const applications = useSelector((state: RootState) => state.applications.list);
  const loading = useSelector((state: RootState) => state.applications.loading);

  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  const handleApplicationSelect = (applicationId: number) => {
    setSelectedApplication(applicationId);
  };

  const handleStatusUpdate = (applicationId: number, newStatus: string) => {
    dispatch(updateApplicationStatus({ applicationId, newStatus }));
  };

  return (
    <div className="applications-page">
      <h1>MCA Applications</h1>
      {loading ? (
        <p>Loading applications...</p>
      ) : (
        <div className="applications-container">
          <ApplicationList
            applications={applications}
            onSelectApplication={handleApplicationSelect}
          />
          {selectedApplication !== null && (
            <ApplicationDetail
              application={applications.find(app => app.id === selectedApplication)}
              onUpdateStatus={handleStatusUpdate}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Applications;