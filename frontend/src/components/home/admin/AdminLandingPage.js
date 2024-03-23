import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminDashboard.css'; 


const AdminDashboard = () => {
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };
  return (
    <div className="admin-dashboard">
    <header className="admin-header">
      <h1>Admin Dashboard</h1>
      <h1>{username}</h1>
      <button className="logout" onClick={handleLogout}>
        Logout
      </button>
    </header>
      <nav className="admin-sidebar">
      <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/users">Users</Link>
          </li>
          <li>
            <Link to="/admin/products">Products</Link>
          </li>
          <li>
            <Link to="/admin/orders">Orders</Link>
          </li>
        </ul>
      </nav>
      <main className="admin-content">
        <h2>Dashboard Overview</h2>
        <div className="admin-summary">
          <div className="admin-stat">
            <h3>Total Users</h3>
            <p>1000</p>
          </div>
          <div className="admin-stat">
            <h3>Total Products</h3>
            <p>500</p>
          </div>
          <div className="admin-stat">
            <h3>Total Orders</h3>
            <p>300</p>
          </div>
        </div>

        <h2>User Management</h2>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>

          </tbody>
        </table>

        <h2>Product Management</h2>


        <h2>Order Management</h2>
      </main>
    </div>
  );
};

export default AdminDashboard;
