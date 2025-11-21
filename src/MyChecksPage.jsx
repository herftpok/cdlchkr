import { useState, useEffect } from 'react';
import { Menu, X, Search, Download, Eye, Calendar, Clock } from 'lucide-react';

export default function MyChecksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userChecks, setUserChecks] = useState(() => {
    const saved = localStorage.getItem('cdl_user_checks');
    return saved ? JSON.parse(saved) : {
      mvr: 0,
      psp: 0,
      cdlis: 0,
      drugTest: 0,
      bundle: 0
    };
  });

  // История проверок (в реальном приложении это будет загружаться с сервера)
  const [checksHistory, setChecksHistory] = useState(() => {
    const saved = localStorage.getItem('cdl_checks_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 1,
        driverName: 'JOHN SMITH',
        dlNumber: 'A1234567',
        state: 'CA',
        date: '2025-11-20T14:30:00',
        checks: ['MVR', 'PSP', 'CDLIS', 'Drug Test'],
        status: 'completed',
        totalCost: 46,
        paymentMethod: 'bundle'
      },
      {
        id: 2,
        driverName: 'SARAH JOHNSON',
        dlNumber: 'B9876543',
        state: 'TX',
        date: '2025-11-19T10:15:00',
        checks: ['MVR', 'CDLIS'],
        status: 'completed',
        totalCost: 25,
        paymentMethod: 'card'
      },
      {
        id: 3,
        driverName: 'MICHAEL BROWN',
        dlNumber: 'C5551234',
        state: 'FL',
        date: '2025-11-18T16:45:00',
        checks: ['Drug Test'],
        status: 'completed',
        totalCost: 20,
        paymentMethod: 'package'
      },
      {
        id: 4,
        driverName: 'EMILY DAVIS',
        dlNumber: 'D7778888',
        state: 'NY',
        date: '2025-11-17T09:20:00',
        checks: ['PSP', 'CDLIS'],
        status: 'completed',
        totalCost: 22,
        paymentMethod: 'card'
      },
      {
        id: 5,
        driverName: 'ROBERT WILSON',
        dlNumber: 'E3334444',
        state: 'IL',
        date: '2025-11-15T13:00:00',
        checks: ['MVR', 'PSP', 'CDLIS', 'Drug Test'],
        status: 'completed',
        totalCost: 46,
        paymentMethod: 'bundle'
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [viewingCheck, setViewingCheck] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-emerald-100 text-emerald-700', label: 'Completed' },
      processing: { color: 'bg-blue-100 text-blue-700', label: 'Processing' },
      failed: { color: 'bg-red-100 text-red-700', label: 'Failed' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const filteredChecks = checksHistory.filter(check => {
    const matchesSearch = 
      check.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.dlNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      check.state.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || check.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (checkId) => {
    const check = filteredChecks.find(c => c.id === checkId);
    if (check) {
      setViewingCheck(check);
    }
  };

  const handleDownloadReport = (checkId) => {
    const check = checksHistory.find(c => c.id === checkId);
    if (!check) return;

    // Создаем текстовое содержимое отчета
    const reportContent = `
CDL SCAN - DRIVER CHECK REPORT
${'='.repeat(80)}

DRIVER INFORMATION:
Name: ${check.driverName}
Driver License #: ${check.dlNumber}
State: ${check.state}

CHECK DETAILS:
Date: ${formatDate(check.date)}
Status: ${check.status}
Total Cost: $${check.totalCost}

CHECKS PERFORMED:
${check.checks.map(checkType => {
  const names = {
    mvr: 'Motor Vehicle Record (MVR)',
    psp: 'Pre-Employment Screening Program (PSP)',
    cdlis: 'Commercial Driver\'s License Information System (CDLIS)',
    drugTest: 'Drug & Alcohol Testing'
  };
  return `  • ${names[checkType] || checkType}`;
}).join('\n')}

${'='.repeat(80)}
Generated: ${new Date().toLocaleString()}
Report ID: ${check.id}
    `.trim();

    // Создаем blob и скачиваем
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CDL_Report_${check.dlNumber}_${check.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Показываем toast уведомление
    showToast('Report downloaded successfully', 'success');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-72 bg-white border-r border-slate-200
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col overflow-y-auto
      `}>
        {/* Logo & Close Button */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🚛
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">CDL scan</div>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
              M
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-slate-900 truncate">marketing-IH</div>
              <div className="text-xs text-emerald-600 font-medium">online</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-4 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Quick Actions</h3>
          <div className="space-y-2">
            <a href="#search" className="w-full px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">+</span>
              New driver check
            </a>
            <a href="#balance" className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">$</span>
              Top up your balance
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</h3>
          <div className="space-y-1">
            <a href="#search" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              Main page
            </a>
            <a href="mailto:admin@cdlscan.com" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              Contact Us
            </a>
          </div>
        </nav>

        {/* Account */}
        <div className="px-4 py-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Account</h3>
          <div className="space-y-1">
            <a href="#profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </a>
            <a href="#balance" className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 7h-9M14 17H5M6 11.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0zM14 15.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 1 0-5 0z" />
                </svg>
                My Packages
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-700 text-white text-xs font-bold">
                {userChecks.bundle + userChecks.mvr + userChecks.psp + userChecks.cdlis + userChecks.drugTest}
              </span>
            </a>
            <a href="#checks" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-medium transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              My Checks
            </a>
            <button 
              onClick={() => {
                localStorage.clear();
                window.location.href = '/';
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full text-left"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="lg:ml-72 flex-1 w-full">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">My Checks</h1>
            <span className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
              {filteredChecks.length} {filteredChecks.length === 1 ? 'check' : 'checks'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="#search" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
              <span>+</span>
              New Check
            </a>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 pb-24 max-w-7xl mx-auto">
          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by driver name, DL number, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all bg-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="processing">Processing</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm font-medium">Total Checks</span>
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Eye className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{checksHistory.length}</div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm font-medium">This Month</span>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                {checksHistory.filter(c => {
                  const date = new Date(c.date);
                  const now = new Date();
                  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                }).length}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm font-medium">Total Spent</span>
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                  <span className="text-lg">💰</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                ${checksHistory.reduce((sum, check) => sum + check.totalCost, 0)}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-600 text-sm font-medium">Avg. Cost</span>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">📊</span>
                </div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                ${checksHistory.length > 0 ? Math.round(checksHistory.reduce((sum, check) => sum + check.totalCost, 0) / checksHistory.length) : 0}
              </div>
            </div>
          </div>

          {/* Checks List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredChecks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No checks found</h3>
                <p className="text-slate-600 mb-6">
                  {searchQuery ? 'Try adjusting your search or filters' : 'Start by running your first driver check'}
                </p>
                <a 
                  href="#search" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  <span>+</span>
                  New Driver Check
                </a>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Driver Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Checks Performed
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredChecks.map((check) => (
                      <tr key={check.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-semibold text-slate-900">{check.driverName}</div>
                            <div className="text-sm text-slate-600">
                              {check.state} • {check.dlNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {check.checks.map((checkType, idx) => (
                              <span 
                                key={idx}
                                className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                              >
                                {checkType}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Calendar className="w-4 h-4" />
                            {formatDate(check.date)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(check.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">
                            ${check.totalCost}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(check.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleViewDetails(check.id)}
                              className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDownloadReport(check.id)}
                              className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                              title="Download Report"
                            >
                              <Download className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 lg:left-72 py-4 px-6 border-t border-slate-200 bg-white z-30">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-slate-600">
            <p>© 2025 CDLScan, All rights Reserved.</p>
            <div className="flex gap-6">
              <a href="#terms" className="text-indigo-600 hover:underline">Terms & Conditions</a>
              <a href="#privacy" className="text-indigo-600 hover:underline">Privacy policy</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modal for viewing check details */}
      {viewingCheck && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">
                Check Report Details
              </h2>
              <button
                onClick={() => setViewingCheck(null)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Driver Information */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span>👤</span>
                  Driver Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Full Name</div>
                    <div className="font-semibold text-slate-900">{viewingCheck.driverName}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Driver License #</div>
                    <div className="font-semibold text-slate-900 font-mono">{viewingCheck.dlNumber}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">State</div>
                    <div className="font-semibold text-slate-900">{viewingCheck.state}</div>
                  </div>
                </div>
              </div>

              {/* Check Details */}
              <div className="bg-slate-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span>📋</span>
                  Check Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Date & Time</div>
                    <div className="font-semibold text-slate-900">{formatDate(viewingCheck.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Status</div>
                    <div>{getStatusBadge(viewingCheck.status)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-slate-600 mb-1">Total Cost</div>
                    <div className="font-semibold text-slate-900 text-lg">${viewingCheck.totalCost}</div>
                  </div>
                </div>
              </div>

              {/* Checks Performed */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <span>✅</span>
                  Checks Performed
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {viewingCheck.checks.map((checkType, index) => {
                    const checkInfo = {
                      mvr: { name: 'Motor Vehicle Record (MVR)', icon: '🚗', color: 'bg-blue-100 text-blue-700' },
                      psp: { name: 'Pre-Employment Screening Program (PSP)', icon: '📊', color: 'bg-green-100 text-green-700' },
                      cdlis: { name: 'Commercial Driver\'s License Information System (CDLIS)', icon: '💼', color: 'bg-purple-100 text-purple-700' },
                      drugTest: { name: 'Drug & Alcohol Testing', icon: '🧪', color: 'bg-orange-100 text-orange-700' }
                    };
                    const info = checkInfo[checkType] || { name: checkType, icon: '✓', color: 'bg-slate-100 text-slate-700' };
                    
                    return (
                      <div key={index} className={`${info.color} rounded-lg p-4 flex items-center gap-3`}>
                        <span className="text-2xl">{info.icon}</span>
                        <span className="font-medium">{info.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Report Information */}
              <div className="border-t border-slate-200 pt-6">
                <div className="text-sm text-slate-500 space-y-1">
                  <div>Report ID: <span className="font-mono text-slate-700">{viewingCheck.id}</span></div>
                  <div>Generated: <span className="text-slate-700">{new Date().toLocaleString()}</span></div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-end gap-3">
              <button
                onClick={() => setViewingCheck(null)}
                className="px-4 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownloadReport(viewingCheck.id);
                  setViewingCheck(null);
                }}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
