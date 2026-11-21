import React, { useState } from 'react';
import AdminLayout from './AdminLayout';

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

  const formatCurrency = (val) => {
    const num = Number(val || 0);
    return '₹' + num.toLocaleString('en-IN');
  };

  return (
    <AdminLayout pageTitle="Culinary Sales & Revenue Analytics" pageDescription="Counter sales summaries, tiffin demand trends, and billing breakdowns">
      {/* Prototype Banner */}
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', backgroundColor: 'var(--stitch-tertiary-fixed)', color: 'var(--stitch-on-tertiary-fixed)', padding: '1rem', borderRadius: '0.5rem' }}>
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span className="font-label-md text-label-md font-semibold">Illustrative Prototype Analytics • Financial Demo</span>
        </div>
      </div>

      {/* Header */}
      <div className="stitch-dashboard-banner" style={{ marginBottom: '1.5rem' }}>
        <div>
          <div className="stitch-banner-overline">
            <span>Financial Ledger</span>
            <span>•</span>
            <span>Chidambaram Central</span>
          </div>
          <h1 className="stitch-banner-title">Culinary Sales & Revenue Analytics</h1>
          <p className="stitch-banner-desc">Counter sales summaries, tiffin demand trends, and billing breakdowns</p>
        </div>
        <div className="stitch-banner-actions">
          <button className="stitch-badge-btn">
            <span className="material-symbols-outlined text-[18px]">table_view</span>
            <span>Export CSV / Excel</span>
          </button>
          <button className="stitch-badge-btn">
            <span className="material-symbols-outlined text-[18px]">print</span>
            <span>Print GST Report</span>
          </button>
          <button className="stitch-badge-btn" style={{ textDecoration: 'none' }}>
            <span className="material-symbols-outlined text-[18px]">download</span>
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Filter & Timeline Control Bar */}
      <div className="stitch-card-panel" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5" id="presetFilters">
            <button className="px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">Today (Live Shift)</button>
            <button className="px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">This Week</button>
            <button className="px-3.5 py-1.5 rounded-md font-label-md text-label-md bg-primary-container text-on-primary font-bold shadow-sm">This Month (October 2025)</button>
            <button className="px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">Quarterly</button>
            <button className="px-3.5 py-1.5 rounded-md font-label-md text-label-md text-on-surface-variant hover:bg-surface-container transition-colors">Custom Date Range</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest text-on-surface shadow-sm">
              <span className="material-symbols-outlined text-primary text-[18px]">calendar_today</span>
              <span className="font-title-md text-title-md font-medium">01 Oct 2025 – 26 Oct 2025</span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">expand_more</span>
            </div>
            <div className="h-6 w-px bg-surface-container-high"></div>
            <div className="flex items-center gap-1.5 text-on-surface-variant font-label-sm text-label-sm px-2">
              <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
              <span>Audited Book</span>
            </div>
          </div>
        </div>
      </div>

      {/* High-Level Metric Cards (Bento 4-Column Layout) */}
      <div className="stitch-kpi-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar primary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Gross Revenue</span>
              <span className="stitch-kpi-value">₹3,42,850.00</span>
            </div>
            <div className="stitch-kpi-icon-box primary">
              <span className="material-symbols-outlined text-[22px]">payments</span>
            </div>
          </div>
          <div className="stitch-kpi-meta">
            <span className="flex items-center text-secondary font-label-md text-label-md font-bold bg-secondary-container/60 px-2 py-0.5 rounded">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              +18.4%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">vs. previous month</span>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar tertiary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Total Tiffin Volume</span>
              <span className="stitch-kpi-value">1,420 <span className="font-title-md text-title-md text-on-surface-variant">Orders</span></span>
            </div>
            <div className="stitch-kpi-icon-box tertiary">
              <span className="material-symbols-outlined text-[22px]">ramen_dining</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Avg Ticket Size</span>
            <span className="font-title-md text-title-md font-bold text-on-surface">₹241.40</span>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar secondary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Settlement Split</span>
              <span className="stitch-kpi-value">UPI Driven 68%</span>
            </div>
            <div className="stitch-kpi-icon-box secondary">
              <span className="material-symbols-outlined text-[22px]">qr_code_scanner</span>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="h-2 w-full rounded-full bg-surface-container flex overflow-hidden">
                <div className="bg-secondary h-full" style={{ width: '68%' }} title="UPI: 68%"></div>
                <div className="bg-tertiary h-full" style={{ width: '24%' }} title="Cash: 24%"></div>
                <div className="bg-primary-container h-full" style={{ width: '8%' }} title="Cards: 8%"></div>
              </div>
              <div className="flex justify-between items-center text-label-sm font-label-sm text-on-surface-variant">
                <span className="text-secondary font-bold">UPI: ₹2.33L</span>
                <span className="text-tertiary font-bold">Cash: ₹82.2K</span>
                <span className="text-primary font-bold">Card: ₹27.4K</span>
              </div>
            </div>
          </div>
        </div>
        <div className="stitch-kpi-card">
          <div className="stitch-kpi-bar primary"></div>
          <div className="stitch-kpi-header">
            <div>
              <span className="stitch-kpi-label">Peak Rush Window</span>
              <span className="stitch-kpi-value">07:30 – 09:30 AM</span>
            </div>
            <div className="stitch-kpi-icon-box primary">
              <span className="material-symbols-outlined text-[22px]">alarm_on</span>
            </div>
          </div>
          <div className="stitch-kpi-footer-bar">
            <span className="font-body-sm text-body-sm text-on-surface-variant">Morning Breakfast Tokens</span>
            <span className="px-2 py-0.5 rounded bg-primary-fixed font-label-md text-label-md font-bold text-on-primary-fixed">480 Tokens</span>
          </div>
        </div>
      </div>

      {/* Analytical Visualizations Grid */}
      <div className="stitch-content-grid">
        {/* Chart 1: Revenue by Daypart & Trend (8 Cols) */}
        <div className="stitch-grid-col-8 stitch-card-panel">
          <div className="stitch-panel-header">
            <div className="stitch-panel-title-group">
              <div className="stitch-panel-icon-box">
                <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              </div>
              <div>
                <h2 className="stitch-panel-title">Revenue by Daypart & Daily Pattern</h2>
                <p className="stitch-panel-subtitle">Shift-wise revenue distribution and 7-day trend analysis</p>
              </div>
            </div>
            <Link to="/admin/sales-reports" style={{ textDecoration: 'none' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', color: 'var(--stitch-primary)', fontSize: '0.8125rem', fontWeight: 700, textDecoration: 'none' }}>
                <span>View Full Report</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </span>
            </Link>
          </div>

          <div className="stitch-table-wrapper" style={{ height: '320px', overflow: 'hidden' }}>
            <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 700 220">
              <defs>
                <linearGradient id="morningGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#0a6c44" stopOpacity="0.25"></stop>
                  <stop offset="100%" stopColor="#0a6c44" stopOpacity="0.0"></stop>
                </linearGradient>
                <linearGradient id="eveningGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#9f3e07" stopOpacity="0.2"></stop>
                  <stop offset="100%" stopColor="#9f3e07" stopOpacity="0.0"></stop>
                </linearGradient>
              </defs>
              <line stroke="#f2ede7" strokeDasharray="4,4" strokeWidth="1.5" x1="0" x2="700" y1="40" y2="40"></line>
              <line stroke="#f2ede7" strokeDasharray="4,4" strokeWidth="1.5" x1="0" x2="700" y1="100" y2="100"></line>
              <line stroke="#f2ede7" strokeDasharray="4,4" strokeWidth="1.5" x1="0" x2="700" y1="160" y2="160"></line>
              <line stroke="#dec0b5" strokeWidth="1" x1="0" x2="700" y1="210" y2="210"></line>
              <rect fill="#0a6c44" height="150" rx="3" width="16" x="25" y="60"></rect>
              <rect fill="#7b5600" height="100" rx="3" width="16" x="44" y="110"></rect>
              <rect fill="#9f3e07" height="120" rx="3" width="16" x="63" y="90"></rect>
              <rect fill="#0a6c44" height="155" rx="3" width="16" x="125" y="55"></rect>
              <rect fill="#7b5600" height="105" rx="3" width="16" x="144" y="105"></rect>
              <rect fill="#9f3e07" height="125" rx="3" width="16" x="163" y="85"></rect>
              <rect fill="#0a6c44" height="145" rx="3" width="16" x="225" y="65"></rect>
              <rect fill="#7b5600" height="100" rx="3" width="16" x="244" y="110"></rect>
              <rect fill="#9f3e07" height="115" rx="3" width="16" x="263" y="95"></rect>
              <rect fill="#0a6c44" height="160" rx="3" width="16" x="325" y="50"></rect>
              <rect fill="#7b5600" height="110" rx="3" width="16" x="344" y="100"></rect>
              <rect fill="#9f3e07" height="130" rx="3" width="16" x="363" y="80"></rect>
              <rect fill="#0a6c44" height="158" rx="3" width="16" x="425" y="52"></rect>
              <rect fill="#7b5600" height="108" rx="3" width="16" x="444" y="102"></rect>
              <rect fill="#9f3e07" height="128" rx="3" width="16" x="463" y="82"></rect>
              <rect fill="#0a6c44" height="142" rx="3" width="16" x="525" y="68"></rect>
              <rect fill="#7b5600" height="95" rx="3" width="16" x="544" y="115"></rect>
              <rect fill="#9f3e07" height="118" rx="3" width="16" x="563" y="92"></rect>
            </svg>
            <div className="flex items-center gap-4 text-label-sm font-label-sm mt-3">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-on-surface">Morning Tiffin</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-tertiary"></span>
                <span className="text-on-surface">Afternoon Meals</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-on-surface">Evening Tiffin</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Settlement Split & Top Dishes (4 Cols) */}
        <div className="stitch-grid-col-4">
          {/* Panel: Settlement Split */}
          <div className="stitch-card-panel">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--stitch-primary)' }}>qr_code_scanner</span>
                <h3 style={{ margin: 0, fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.125rem', fontWeight: 700 }}>
                  Settlement Split
                </h3>
              </div>
            </div>
            <div className="h-48 flex items-end justify-around px-2" style={{ marginTop: '1rem' }}>
              <div className="flex flex-col items-center gap-1" style={{ width: '30%' }}>
                <div className="bg-secondary h-full rounded-t" style={{ width: '100%', height: '68%' }}></div>
                <span className="text-label-sm font-label-sm text-secondary font-bold">UPI: ₹2.33L</span>
              </div>
              <div className="flex flex-col items-center gap-1" style={{ width: '30%' }}>
                <div className="bg-tertiary h-full rounded-t" style={{ width: '100%', height: '24%' }}></div>
                <span className="text-label-sm font-label-sm text-tertiary font-bold">Cash: ₹82.2K</span>
              </div>
              <div className="flex flex-col items-center gap-1" style={{ width: '30%' }}>
                <div className="bg-primary-container h-full rounded-t" style={{ width: '100%', height: '8%' }}></div>
                <span className="text-label-sm font-label-sm text-primary font-bold">Card: ₹27.4K</span>
              </div>
            </div>
          </div>

          {/* Panel: Top Revenue Generating Dishes */}
          <div className="stitch-card-panel" style={{ marginTop: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined text-[20px]" style={{ color: 'var(--stitch-primary)' }}>local_fire_department</span>
                <h3 style={{ margin: 0, fontFamily: 'Noto Serif, Georgia, serif', fontSize: '1.125rem', fontWeight: 700 }}>
                  Top Selling Today
                </h3>
              </div>
              <Link to="/admin/sales-reports" style={{ textDecoration: 'none' }}>
                <span style={{ fontSize: '0.6875rem', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', backgroundColor: 'var(--stitch-primary-fixed)', color: 'var(--stitch-primary)', fontWeight: 700 }}>
                  View Report
                </span>
              </Link>
            </div>

            <div>
              {topDishes.slice(0, 4).map((item, idx) => (
                <div key={item.id} className="stitch-top-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div className="stitch-item-thumb" style={{ backgroundColor: 'var(--stitch-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="material-symbols-outlined" style={{ color: 'var(--stitch-on-surface-variant)' }}>restaurant</span>
                    </div>
                    <div>
                      <strong style={{ fontSize: '0.875rem', color: 'var(--stitch-on-surface)', display: 'block' }}>{item.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: 'var(--stitch-on-surface-variant)' }}>{item.volume}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <strong style={{ color: 'var(--stitch-primary)', display: 'block' }}>{item.revenue}</strong>
                    <span style={{ fontSize: '0.6875rem', color: 'var(--stitch-on-surface-variant)' }}>
                      {idx === 0 ? 'Top Seller' : idx === 1 ? 'Strong' : idx === 2 ? 'Steady' : 'Popular'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default SalesReports;