import React, { useState } from 'react';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([
    { id: 1, name: 'Karthik Sundaram', phone: '+91 98765 43210', email: 'karthik@example.com', lastVisit: '2026-10-10', totalOrders: 45, status: 'active' },
    { id: 2, name: 'Meenakshi V.', phone: '+91 98765 43211', email: 'meenakshi@example.com', lastVisit: '2026-10-09', totalOrders: 32, status: 'active' },
    { id: 3, name: 'Dr. A. Natarajan', phone: '+91 98765 43212', email: 'natarajan@example.com', lastVisit: '2026-10-08', totalOrders: 28, status: 'active' },
    { id: 4, name: 'S. Vignesh', phone: '+91 98765 43213', email: 'vignesh@example.com', lastVisit: '2026-10-07', totalOrders: 52, status: 'active' },
    { id: 5, name: 'Revathi Balan', phone: '+91 98765 43214', email: 'revathi@example.com', lastVisit: '2026-10-06', totalOrders: 18, status: 'active' }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteCustomerId, setDeleteCustomerId] = useState(null);

  const handleAddCustomer = (newCustomer) => {
    setCustomers([...customers, {
      id: Date.now(),
      ...newCustomer,
      totalOrders: 0,
      status: 'active'
    }]);
    setShowAddForm(false);
  };

  const handleUpdateCustomer = (updatedCustomer) => {
    setCustomers(customers.map(customer =>
      customer.id === editCustomerId ? { ...customer, ...updatedCustomer } : customer
    ));
    setShowEditForm(false);
    setEditCustomerId(null);
  };

  const handleDeleteCustomer = (id) => {
    setDeleteCustomerId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setCustomers(customers.filter(customer => customer.id !== deleteCustomerId));
    setShowDeleteConfirm(false);
    setDeleteCustomerId(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteCustomerId(null);
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="customer-management">
            <div className="customer-management-header">
              <h1>Customer Management</h1>
              <div className="customer-management-meta">
                <div className="meta-item">
                  <span className="meta-label">Terminal:</span>
                  <span className="meta-value">CHD-CTR-01</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Storefront:</span>
                  <span className="meta-value">Chidambaram Heritage Unit</span>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="customer-stats">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Customers</h3>
                  <p className="stat-value">{customers.length}</p>
                </div>
                <div className="stat-card">
                  <h3>Active Customers</h3>
                  <p className="stat-value">{customers.filter(c => c.status === 'active').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Orders (All Time)</h3>
                  <p className="stat-value">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</p>
                </div>
              </div>
            </div>

            {/* Add Customer Button */}
            <div className="add-customer-btn">
              <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
                Add New Customer
              </button>
            </div>

            {/* Customers List */}
            <div className="customers-list">
              <h2>Customer List</h2>
              <div className="customers-grid">
                {customers.map(customer => (
                  <div key={customer.id} className={`customer-card ${customer.status === 'active' ? 'customer-active' : 'customer-inactive'}`}>
                    <div className="customer-header">
                      <h3 className="customer-name">{customer.name}</h3>
                      <span className="customer-status-badge {customer.status}">
                        {customer.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div className="customer-content">
                      <div className="customer-contact">
                        <p><strong>Phone:</strong> {customer.phone}</p>
                        <p><strong>Email:</strong> {customer.email}</p>
                      </div>
                      <div className="customer-meta">
                        <span className="meta-item">
                          <span className="meta-label">Last Visit:</span>
                          <span className="meta-value">{customer.lastVisit}</span>
                        </span>
                        <span className="meta-item">
                          <span className="meta-label">Total Orders:</span>
                          <span className="meta-value">{customer.totalOrders}</span>
                        </span>
                      </div>
                    </div>
                    <div className="customer-actions">
                      <button onClick={() => {
                        setEditCustomerId(customer.id);
                        setShowEditForm(true);
                      }} className="btn btn-secondary btn-sm">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCustomer(customer.id)} className="btn btn-danger btn-sm">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Customer Form */}
            {showAddForm && (
              <div className="customer-form">
                <h2>Add New Customer</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Simulate form submission
                  alert('Customer added successfully!');
                  setShowAddForm(false);
                }}>
                  <div className="form-group">
                    <label>Customer Name:</label>
                    <input type="text" required placeholder="Full name" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input type="tel" required placeholder="+91 98765 43210" />
                  </div>
                  <div className="form-group">
                    <label>Email Address:</label>
                    <input type="email" required placeholder="customer@example.com" />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => setShowAddForm(false)} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Customer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit Customer Form */}
            {showEditForm && editCustomerId !== null && (
              <div className="customer-form">
                <h2>Edit Customer</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  // Simulate form submission
                  alert('Customer updated successfully!');
                  setShowEditForm(false);
                  setEditCustomerId(null);
                }}>
                  <div className="form-group">
                    <label>Customer Name:</label>
                    <input
                      type="text"
                      defaultValue={customers.find(c => c.id === editCustomerId)?.name || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number:</label>
                    <input
                      type="tel"
                      defaultValue={customers.find(c => c.id === editCustomerId)?.phone || ''}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address:</label>
                    <input
                      type="email"
                      defaultValue={customers.find(c => c.id === editCustomerId)?.email || ''}
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={() => {
                      setShowEditForm(false);
                      setEditCustomerId(null);
                    }} className="btn btn-secondary">
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Customer
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
              <div className="delete-confirm-modal">
                <div className="modal-content">
                  <h2>Remove Customer Confirmation</h2>
                  <p>
                    "Are you sure you want to permanently remove "{customers.find(c => c.id === deleteCustomerId)?.name || 'Customer'}"? This action cannot be undone."
                  </p>
                  <div className="modal-actions">
                    <button onClick={handleDeleteCancel} className="btn btn-secondary">
                      Keep Customer
                    </button>
                    <button onClick={handleDeleteConfirm} className="btn btn-danger">
                      Remove Customer
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default CustomerManagement;