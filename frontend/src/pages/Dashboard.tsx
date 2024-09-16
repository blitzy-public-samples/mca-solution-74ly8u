import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from '@reduxjs/toolkit';
import { ApplicationList } from '../components/ApplicationList';
import { StatisticsWidget } from '../components/StatisticsWidget';
import { RecentActivityFeed } from '../components/RecentActivityFeed';
import { fetchApplications } from '../store/applicationSlice';
import { getApplicationStatistics } from '../services/api';

// HUMAN ASSISTANCE NEEDED
// This component may need additional error handling and loading states
// Please review and enhance as necessary
const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const dispatch = useDispatch();
  const applications = useSelector((state: any) => state.applications.list);

  useEffect(() => {
    dispatch(fetchApplications());
    
    const fetchStatistics = async () => {
      try {
        const stats = await getApplicationStatistics();
        setStatistics(stats);
      } catch (error) {
        console.error('Failed to fetch application statistics:', error);
        // TODO: Handle error state
      }
    };

    fetchStatistics();

    // TODO: Fetch recent activity
    // This is a placeholder, replace with actual API call
    setRecentActivity([
      { id: 1, type: 'application_submitted', timestamp: new Date().toISOString() },
      { id: 2, type: 'application_approved', timestamp: new Date().toISOString() },
    ]);
  }, [dispatch]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {statistics && <StatisticsWidget statistics={statistics} />}
      <ApplicationList applications={applications} />
      <RecentActivityFeed activities={recentActivity} />
    </div>
  );
};

export default Dashboard;