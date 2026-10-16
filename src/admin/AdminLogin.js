import React from 'react';
import { Link } from 'react-router-dom';

const AdminLogin = () => {
  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="admin-login-container">
            <h1>Admin Login</h1>
            <p className="admin-login-description">Welcome, Head Cashier & Operations Manager</p>

            <div className="admin-login-details">
              <p><strong>Station ID:</strong> CHID-CTR-01</p>
              <p><strong>Shift Supervisor:</strong> Moorthi S.</p>
            </div>

            <p className="admin-login-security">"Authorized personnel only • Counter #CH-01"</p>

            <div className="admin-login-actions">
              <Link to="/admin/dashboard" className="btn btn-primary">
                Proceed to Billing Dashboard
              </Link>
              <Link to="/admin/dashboard" className="btn btn-secondary">
                Sign In to Management Console
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLogin;