import React, { useState } from 'react';

const SalesReports = () => {
  const [reportPeriod, setReportPeriod] = useState('2025-10-01 to 2025-10-26');
  const [metrics] = useState({
    grossRevenue: '₹3,42,850.00',
    revenueChange: '+18.4% vs. previous month',
    totalTiffinVolume: '1,420 Orders',
    avgTicketSize: '₹241.40',
    settlementSplit: {
      upi: '68%',
      upiAmount: '₹2.33L',
      cash: '₹82.2K',
      card: '₹27.4K'
    },
    peakRushWindow: '07:30 – 09:30 AM',
    morningBreakfastTokens: '480 Tokens'
  });

  const hourlyData = [
    { time: '06:00 AM', tickets: 42 },
    { time: '07:30 AM', tickets: 248 },
    { time: '08:30 AM', tickets: 232 },
    { time: '10:30 AM', tickets: 65 },
    { time: '01:00 PM', tickets: 154 },
    { time: '05:30 PM', tickets: 188 },
    { time: '08:00 PM', tickets: 118 }
  ];

  const topDishes = [
    { id: 1, name: 'Golden Ghee Roast Masala Dosa', category: 'Dosa Tawa', volume: '420 orders', revenue: '₹67,200' },
    { id: 2, name: 'Kumbakonam Degree Filter Kaapi', category: 'Beverages', volume: '980 cups', revenue: '₹63,700' },
    { id: 3, name: 'Podi Thatte Idli', category: 'Steam Special', volume: '390 plates', revenue: '₹42,900' },
    { id: 4, name: 'South Indian Raja Thali', category: 'Meals', volume: '150 thalis', revenue: '₹42,000' },
    { id: 5, name: 'Special Onion Rava Dosa', category: 'Dosa Tawa', volume: '210 plates', revenue: '₹31,500' }
  ];

  const dailyMetrics = [
    { day: 'Monday', revenue: '₹26,850', tiffinVolume: '298 orders', peakHour: '₹3,840' },
    { day: 'Tuesday', revenue: '₹28,420', tiffinVolume: '312 orders', peakHour: '₹4,120' },
    { day: 'Wednesday', revenue: '₹31,280', tiffinVolume: '348 orders', peakHour: '₹4,780' },
    { day: 'Thursday', revenue: '₹29,560', tiffinVolume: '326 orders', peakHour: '₹4,950' },
    { day: 'Friday', revenue: '₹32,480', tiffinVolume: '356 orders', peakHour: '₹5,280' },
    { day: 'Saturday', revenue: '₹30,940', tiffinVolume: '342 orders', peakHour: '₹4,920' },
    { day: 'Sunday', revenue: '₹31,320', tiffinVolume: '338 orders', peakHour: '₹5,040' }
  ];

  return (
    <div className="site-shell">
      <div className="page-container">
        <section className="section--cream">
          <div className="sales-reports">
            {/* Header */}
            <div className="sales-reports-header">
              <h1>Sales Reports</h1>
              <div className="header-meta">
                <div className="meta-item">
                  <span className="meta-label">Terminal:</span>
                  <span className="meta-value">CHD-CTR-01</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Unit:</span>
                  <span className="meta-value">Chidambaram Heritage Unit</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Shift:</span>
                  <span className="meta-value">Today | Shift A (06:00 - 15:00)</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Manager:</span>
                  <span className="meta-value">S. Ramanathan Counter Manager</span>
                </div>
              </div>
            </div>

            {/* Daypart Chart Visualization */}
            <div className="daypart-chart">
              <h3>Revenue by Daypart & Daily Pattern</h3>
              <div className="daypart-chart-grid">
                {dailyMetrics.map((day, index) => (
                  <div key={index} className="daypart-day">
                    <div className="daypart-day-header">
                      <div className="daypart-day-name">{day.day}</div>
                      <div className="daypart-revenue">{day.revenue}</div>
                    </div>
                    <div className="daypart-bars">
                      <div
                        className="daypart-bar"
                        style={{ height: `${(day.revenue.replace('₹', '').replace(/,/g, '') / 100000) * 100}%` }}
                      ></div>
                    </div>
                    <div className="daypart-metrics">
                      <div className="daypart-metric">
                        <span className="metric-label">Orders:</span>
                        <span className="metric-value">{day.tiffinVolume}</span>
                      </div>
                      <div className="daypart-metric">
                        <span className="metric-label">Peak Hour:</span>
                        <span className="metric-value">{day.peakHour}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="daypart-legend">
                <div className="legend-item">
                  <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                  <span>Revenue (₹x 100K)</span>
                </div>
              </div>
            </div>

            {/* Hourly Rush Intensity Chart */}
            <div className="hourly-rush-chart">
              <h3>Hourly Rush Intensity</h3>
              <div className="hourly-chart-container">
                <div className="hourly-chart-axis">
                  {hourlyData.map((data, index) => (
                    <div key={index} className="hourly-axis-item">
                      <span className="axis-time">{data.time}</span>
                      <div className="axis-line"></div>
                      <span className="axis-value">{data.tickets}</span>
                    </div>
                  ))}
                </div>
                <div className="hourly-bars">
                  {hourlyData.map((data, index) => (
                    <div
                      key={index}
                      className="hourly-bar"
                      style={{ height: `${(data.tickets / 250) * 100}%` }}
                    >
                      <span className="bar-value">{data.tickets}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hourly-legend">
                <div className="legend-item">
                  <span className="legend-label">Tickets:</span>
                  <span className="legend-value">Max 250</span>
                </div>
              </div>
            </div>

            {/* Top Revenue Generating Dishes */}
            <div className="top-dishes-section">
              <h3>Top Revenue Generating Dishes (Ranked by Oct Yield)</h3>
              <div className="top-dishes-table">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Dish Name</th>
                      <th>Category</th>
                      <th>Volume</th>
                      <th>Gross Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topDishes.map(dish => (
                      <tr key={dish.id}>
                        <td>{dish.id}</td>
                        <td>{dish.name}</td>
                        <td>{dish.category}</td>
                        <td>{dish.volume}</td>
                        <td>{dish.revenue}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="table-footer">
                  <p>Combined top 5 items represent 72.2% of overall counter turnover.</p>
                  <a href="#" className="view-all-link">View All 48 Dishes</a>
                </div>
              </div>
            </div>

            {/* Tax & Surcharge Ledger */}
            <div className="tax-ledger">
              <h3>Tax & Surcharge Ledger</h3>
              <div className="ledger-table">
                <div className="ledger-row">
                  <span className="ledger-label">GSTIN:</span>
                  <span className="ledger-value">33AAACN4921K1ZM</span>
                </div>
                <div className="ledger-row">
                  <span className="ledger-label">Gross Taxable Turnover:</span>
                  <span className="ledger-value">₹3,42,850.00 (Non-AC Dining + Takeaway Combined)</span>
                </div>
                <div className="ledger-row">
                  <span className="ledger-label">CGST (2.5%):</span>
                  <span className="ledger-value">₹8,571.25 — Central Share Cleared</span>
                </div>
                <div className="ledger-row">
                  <span className="ledger-label">SGST (2.5%):</span>
                  <span className="ledger-value">₹8,571.25 — Tamil Nadu Share Cleared</span>
                </div>
                <div className="ledger-row total-tax">
                  <span className="ledger-label">Total Tax Collected:</span>
                  <span className="ledger-value">₹17,142.50</span>
                </div>
                <div className="ledger-row">
                  <span className="ledger-label">Status:</span>
                  <span className="ledger-value">Reconciled with Cash Drawer</span>
                </div>
                <div className="ledger-row">
                  <span className="ledger-label">Due Date:</span>
                  <span className="ledger-value">Nov 20, 2025</span>
                </div>
              </div>
            </div>

            {/* Export & Print Options */}
            <div className="export-options">
              <h3>Export & Print Options</h3>
              <div className="export-buttons">
                <button className="btn btn-secondary">
                  Export CSV
                </button>
                <button className="btn btn-secondary">
                  Export Excel
                </button>
                <button className="btn btn-secondary">
                  Print GST Report
                </button>
                <button className="btn btn-secondary">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SalesReports;