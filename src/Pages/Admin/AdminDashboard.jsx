import React, { useState, useEffect } from 'react';
import styles from './Admin.module.css';
import axios from 'axios';
import { dashboardSummary_api } from '../../Services/Api';
import { getCookie } from '../../utills/cookieManager';

const AdminDashboard = () => {
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = getCookie('adminToken');
      
      if (!token) {
        console.warn("No admin token found in cookies, skipping stats fetch.");
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching dashboard summary with token starting with:", token.substring(0, 10) + "...");
        const response = await axios.get(dashboardSummary_api, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.data) {
          setStatsData(response.data.data || response.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        if (error.response?.status === 403) {
          console.error("Authentication failed. Please re-login.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Tours', value: statsData?.totalTours || '0' },
    { title: 'Active Locations', value: statsData?.totalDestinations || '0' },
    { title: 'Total Reviews', value: statsData?.totalReviews || '0' },
    { title: 'Pending Reviews', value: statsData?.pendingReviews || '0' },
    { title: 'Total Bookings', value: statsData?.totalBookings || '0' },
    { title: 'User Queries', value: statsData?.totalUserQueries || '0' },
  ];

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.title}>
          <h1>Dashboard Overview</h1>
          <p>Welcome back, Admin!</p>
        </div>
        <div className={styles.actions}>
          <button className={styles.btnPrimary} onClick={() => window.location.reload()}>Refresh Stats</button>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {loading ? (
          <p style={{ color: '#94a3b8', padding: '20px' }}>Loading statistics...</p>
        ) : (
          stats.map((stat, idx) => (
            <div key={idx} className={styles.statCard}>
              <div className={styles.statTitle}>{stat.title}</div>
              <div className={styles.statValue}>{stat.value}</div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
