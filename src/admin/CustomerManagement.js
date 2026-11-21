import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

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

  const stats = {
    totalCustomers: customers.length,
    activeCustomers: customers.filter(c => c.status === 'active').length,
    totalOrdersAllTime: customers.reduce((sum, c) => sum + c.totalOrders, 0)
  };

  return (
    <AdminLayout pageTitle="Customer Registry & Dining History" pageDescription="Registered patrons, token pickup preferences, and visit history. Manage dining habits, recurring temple-hour orders, and bespoke kitchen notes.">
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-tertiary-fixed)', color: 'var(--stitch-on-tertiary-fixed)', padding: '1rem', borderRadius: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="font-label-md text-label-md font-semibold">Illustrative Prototype Diner Registry • Strictly Confidential</span>
        </div>
      </div>

      <div className="stitch-dashboard-banner" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="stitch-banner-overline">
            <span>Patron Module</span>
            <span>•</span>
            <span>Ref: CHD-REG-2024</span>
          </div>
          <h1 className="stitch-banner-title">Customer Registry & Dining History</h1>
          <p className="stitch-banner-desc">Registered patrons, token pickup preferences, and visit history. Manage dining habits, recurring temple-hour orders, and bespoke kitchen notes.</p>
        </div>
      </div>

      <div className="stitch-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar primary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Total Customers</span>
              <span className="stitch-kpi-value">{customers.length}</span>
            </div>
            <div className="stitch-kpi-icon-box primary">
              <span className="material-symbols-outlined text-[22px]">group</span>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar secondary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Active Customers</span>
              <span className="stitch-kpi-value">{customers.filter(c => c.status === 'active').length}</span>
            </div>
            <div className="stitch-kpi-icon-box secondary">
              <span className="material-symbols-outlined text-[22px]">person</span>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar tertiary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Total Orders (All Time)</span>
              <span className="stitch-kpi-value">{customers.reduce((sum, c) => sum + c.totalOrders, 0)}</span>
            </div>
            <div className="stitch-kpi-icon-box tertiary">
              <span className="material-symbols-outlined text-[22px]">receipt</span>
            </div>
          </div>
        </div>
      </div>

      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-xl">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline text-[20px]">search</span>
            <input className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-lowest font-body-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all" id="patronSearch" placeholder="Search by customer name, phone number, or email..." type="text" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-1 rounded bg-surface-container font-label-sm text-label-sm text-on-surface-variant hover:bg-surface-container-high transition-colors">
              ⌘K
            </button>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container font-label-lg text-label-lg text-on-surface transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">tune</span>
              <span>Attributes</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-container-low hover:bg-surface-container font-label-lg text-label-lg text-on-surface transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">file_download</span>
              <span>Export CSV</span>
            </button>
            <button className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary text-on-primary font-label-lg text-label-lg shadow-sm hover:bg-primary-container transition-all">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              <span>Enroll Patron</span>
            </button>
          </div>
        </div>
      </div>

      <div className="stitch-card-panel" style={{ overflow: 'hidden' }}>
        <div className="overflow-x-auto">
          <table className="stitch-orders-table" style={{ width: '100%' }}>
            <thead className="bg-surface-container-low">
              <tr>
                <th className="py-3.5 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Patron Details</th>
                <th className="py-3.5 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Contact Info</th>
                <th className="py-3.5 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Registration</th>
                <th className="py-3.5 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Visits</th>
                <th className="py-3.5 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Total Spend (₹)</th>
                <th className="py-3.5 px-5 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Kitchen Preferences</th>
                <th className="py-3.5 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-center">Status</th>
                <th className="py-3.5 px-4 font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-high/60">
              {customers.map(customer => (
                <tr key={customer.id} className="hover:bg-surface-container-low/40 transition-colors group">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-title-md text-title-md text-on-primary-fixed font-bold shrink-0">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-title-md text-title-md text-on-surface font-semibold group-hover:text-primary transition-colors">{customer.name}</span>
                          <span className="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-sm text-label-sm font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                            Heritage Tier
                          </span>
                        </div>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">Patron ID: #CHD-{customer.id.toString().padStart(4, '0')}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md text-on-surface font-medium">{customer.phone}</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{customer.email}</span>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex flex-col">
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">{customer.lastVisit}</span>
                      <span className="font-label-sm text-label-sm text-outline">Counter In-Person</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-surface-container font-title-md text-title-md font-bold text-on-surface">
                      {customer.totalOrders}
                    </div>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <span className="font-title-md text-title-md font-bold text-primary">₹{customer.totalOrders * 346}</span>
                    <span className="block font-label-sm text-label-sm text-outline">Avg ₹346/ord</span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-1 rounded-lg bg-surface-container font-label-sm text-label-sm text-on-surface font-medium flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>local_cafe</span>
                        Degree Kaapi strong decoction
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary-container font-label-sm text-label-sm font-bold text-on-secondary-container">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-2 rounded-lg hover:bg-surface-container text-primary hover:text-primary-container transition-colors" title="View Order History & Token Slips">
                        <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="View Diet Notes">
                        <span className="material-symbols-outlined text-[20px]">notes</span>
                      </button>
                      <button className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors" title="Account Status">
                        <span className="material-symbols-outlined text-[20px]">more_vert</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
</AdminLayout>
    );
  };
}

export default CustomerManagement;