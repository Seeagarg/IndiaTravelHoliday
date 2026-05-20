import React, { useEffect } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import styles from './Admin.module.css';
import { getCookie, removeCookie } from '../../utills/cookieManager';
import { Toaster } from 'react-hot-toast';

const AdminLayout = () => {
  const navigate = useNavigate();
  const token = getCookie('adminToken');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const handleLogout = () => {
    removeCookie('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  if (!token) return null;

  return (
    <div className={styles.adminContainer}>
      {/* Mobile Header */}
      <div className={styles.mobileHeader}>
        <div className={styles.logo} style={{ marginBottom: 0 }}>Tours Admin</div>
        <button className={styles.hamburger} onClick={toggleSidebar}>
          {isSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && <div className={styles.overlay} onClick={closeSidebar}></div>}

      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>Tours Admin</div>
        <nav className={styles.nav}>
          <NavLink 
            to="/admin" 
            end
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            Dashboard
          </NavLink>
          <NavLink 
            to="/admin/locations" 
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            Manage Locations
          </NavLink>
          <NavLink 
            to="/admin/tours" 
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            Manage Tours
          </NavLink>
          <NavLink 
            to="/admin/reviews" 
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            Manage Reviews
          </NavLink>
          <NavLink 
            to="/admin/analytics-report" 
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            Manage Analytics
          </NavLink>
          <NavLink 
            to="/admin/user-queries" 
            onClick={closeSidebar}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeNavLink : ''}`}
          >
            User Queries
          </NavLink>
        </nav>
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button 
            onClick={() => { handleLogout(); closeSidebar(); }} 
            className={styles.navLink}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%' }}
          >
            Logout
          </button>
          <Link to="/" className={styles.navLink}>Back to Site</Link>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
