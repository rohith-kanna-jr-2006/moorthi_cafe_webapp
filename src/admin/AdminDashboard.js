import React from 'react';

const AdminDashboard = () => {
  // Demo data for the dashboard
  const dashboardData = {
    revenue: '₹24,850',
    revenueChange: '+14.2% vs yesterday evening',
    paymentSplit: {
      upi: '₹18,400',
      cash: '₹6,450'
    },
    orders: {
      total: '142 Orders',
      breakdown: '118 Ready 18 Prep 6 Pend'
    },
    tokenRange: 'Token #42 - #48',
    avgPrepTime: '11 mins',
    stationNotes: 'Tawa Queue: 4 Dosas Steamers: Clear',
    alerts: [
      {
        id: 1,
        icon: 'hourglass_bottom',
        message: 'Elaneer Payasam evening low (4 left)',
        severity: 'warning'
      },
      {
        id: 2,
        message: 'Rava Upma Batter: 15% Restock',
        severity: 'warning'
      }
    ],
    quickActions: [
      { label: 'Add New Food Item', icon: 'add_circle', to: '/admin/add-edit-food' },
      { label: 'View Live Counter Queue', icon: 'kitchen', to: '#' },
      { label: 'Download Day-End Report', icon: 'file_download', to: '#' },
      { label: 'Emergency Kitchen Pause', icon: 'pause_circle', to: '#' }
    ],
    topItems: [
      { name: 'Ghee Roast Dosa', plates: '78 plates sold', revenue: '₹8,580', badge: 'High Demand' },
      { name: 'Kumbakonam Kaapi', plates: '146 cups served', revenue: '₹5,110', badge: 'Speedy Flow' },
      { name: 'Podi Thatte Idli', plates: '54 plates sold', revenue: '₹4,320', badge: 'Steady' },
      { name: 'Chidambaram Thali', plates: '32 thalis served', revenue: '₹4,800', badge: 'Lunch Shift' }
    ],
    kitchenLoad: [
      { equipment: 'Dosa Griddle / Cast Iron Tawa', usage: '85%', status: '4 active pans in blast • Wait time ~8m' },
      { equipment: 'Idli Steamers & Vada Kadai', usage: '60%', status: 'Steamer chamber 2 ready • Medu Vada frying' },
      { equipment: 'Coffee Decoction Urn', usage: '90%', status: 'Brew cycle 4 dripping • High footfall at front counter' },
      { equipment: 'Oil Kadai Temp', usage: '178°C', status: 'In Target Range' }
    ],
    recentOrders: [
      {
        id: '#48 #MC-9048',
        diner: 'Karthik Sundaram table_restaurant Table 04 (Dine-in)',
        items: '2x Special Ghee Roast Masala Dosa 1x Degree Filter Coffee • Less Sweet',
        amount: '₹290',
        status: 'Pending',
        time: '18:42',
        action: ''
      },
      {
        id: '#47 #MC-9047',
        diner: 'Meenakshi V. takeout_dining Parcel / Takeaway',
        items: '3x Podi Thatte Idli (Hot Ghee) 2x Medu Vada (Extra Sambhar pouch)',
        amount: '₹340',
        status: 'Preparing',
        time: '18:38',
        action: ''
      },
      {
        id: '#46 #MC-9046',
        diner: 'Dr. A. Natarajan table_restaurant Table 08 (Family)',
        items: '2x Chidambaram Special Mini Thali 1x Onion Rava Dosa • Crisp',
        amount: '₹520',
        status: 'Ready for Pickup',
        time: '18:31',
        action: ''
      },
      {
        id: '#45 #MC-9045',
        diner: 'S. Vignesh takeout_dining Parcel / Takeaway',
        items: '4x Classic Kumbakonam Filter Coffee 2x South Indian Mysore Pak (250g)',
        amount: '₹380',
        status: 'Completed',
        time: '18:24',
        action: 'check_circle'
      },
      {
        id: '#44 #MC-9044',
        diner: 'Revathi Balan table_restaurant Table 02 (Dine-in)',
        items: '1x Heritage Filter Kaapi 1x Crispy Medu Vada (With Mint Chutney)',
        amount: '₹95',
        status: 'Completed',
        time: '18:19',
        action: 'check_circle'
      }
    ]
  };

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="admin-dashboard">
            {/* Header with identity and navigation */}
            <div className="admin-dashboard-header">
              <div className="admin-identity">
                <div className="identity-item">
                  <span className="identity-label">Console:</span>
                  <span className="identity-value">Moorthi Cafe Counter & Kitchen Console</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Terminal:</span>
                  <span className="identity-value">CHD-CTR-01</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Unit:</span>
                  <span className="identity-value">Chidambaram Heritage Unit</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Location:</span>
                  <span className="identity-value">Chidambaram Central Counter</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Kitchen state:</span>
                  <span className="identity-value">Kitchen Online / Active</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Shift:</span>
                  <span className="identity-value">Today | Shift A (06:00 - 15:00)</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Manager:</span>
                  <span className="identity-value">S. Ramanathan Counter Manager</span>
                </div>
                <div className="identity-item mode-note">
                  <span className="identity-label">Mode:</span>
                  <span className="identity-value">verified_user Terminal Sandbox Mode Illustrative Prototype Figures & Orders • Not Live Transactions</span>
                </div>
                <div className="identity-item">
                  <span className="identity-label">Sync:</span>
                  <span className="identity-value">KDS Sync: 0.8s</span>
                </div>
              </div>

              <div className="admin-navigation">
                {/* Navigation items would go here - using text representation for now */}
                <div className="nav-item">dashboard</div>
                <div className="nav-item">Orders</div>
                <div className="nav-item">Menu</div>
                <div className="nav-item">Categories</div>
                <div className="nav-item">Add/Edit Food</div>
                <div className="nav-item">Customers</div>
                <div className="nav-item">Sales Reports</div>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="admin-summary-cards">
              <div className="summary-card">
                <h3>Revenue</h3>
                <p className="summary-value">{dashboardData.revenue}</p>
                <p className="summary-change trending-up">{dashboardData.revenueChange}</p>
              </div>

              <div className="summary-card payment-split">
                <h3>Payment Split</h3>
                <p className="summary-value">UPI: <strong>{dashboardData.paymentSplit.upi}</strong> Cash: <strong>{dashboardData.paymentSplit.cash}</strong></p>
              </div>

              <div className="summary-card">
                <h3>Orders</h3>
                <p className="summary-value">{dashboardData.orders.total}</p>
                <p className="summary-breakdown">{dashboardData.orders.breakdown}</p>
              </div>

              <div className="summary-card">
                <h3>Token Range</h3>
                <p className="summary-value">{dashboardData.tokenRange}</p>
              </div>

              <div className="summary-card">
                <h3>Avg Preparation</h3>
                <p className="summary-value"><strong>{dashboardData.avgPrepTime}</strong></p>
              </div>

              <div className="summary-card station-notes">
                <h3>Station Notes</h3>
                <p className="summary-value">{dashboardData.stationNotes}</p>
              </div>

              <div className="summary-card alerts">
                <h3>Alerts</h3>
                {dashboardData.alerts.map(alert => (
                  <div key={alert.id} className={`alert-item alert-${alert.severity}`}>
                    {alert.icon && <span className="alert-icon">{alert.icon}</span>}
                    <span className="alert-message">{alert.message}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="admin-quick-actions">
              <h3>Quick Actions</h3>
              <div className="quick-actions-grid">
                {dashboardData.quickActions.map(action => (
                  <div key={action.label} className="quick-action-card">
                    <span className="quick-action-icon">{action.icon}</span>
                    <Link to={action.to} className="quick-action-label">{action.label}</Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Items */}
            <div className="admin-top-items">
              <h3>Top Items</h3>
              <div className="top-items-grid">
                {dashboardData.topItems.map(item => (
                  <div key={item.name} className="top-item-card">
                    <div className="top-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.plates}</p>
                      <p>{item.revenue}</p>
                      <span className="item-badge">{item.badge}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kitchen Load */}
            <div className="admin-kitchen-load">
              <h3>Kitchen Load</h3>
              <div className="kitchen-load-grid">
                {dashboardData.kitchenLoad.map(item => (
                  <div key={item.equipment} className="kitchen-load-item">
                    <div className="kitchen-equipment">
                      <h4>{item.equipment}</h4>
                    </div>
                    <div className="kitchen-usage">
                      <span className="usage-percentage">{item.usage}</span>
                    </div>
                    <div className="kitchen-status">
                      <p>{item.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div className="admin-recent-orders">
              <h3>Recent Orders</h3>
              <div className="orders-table">
                <table>
                  <thead>
                    <tr>
                      <th>Token / ID</th>
                      <th>Diner & Details</th>
                      <th>Items Ordered</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.recentOrders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.diner}</td>
                        <td>{order.items}</td>
                        <td>{order.amount}</td>
                        <td>{order.status}</td>
                        <td>{order.time}</td>
                        <td>{order.action}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;