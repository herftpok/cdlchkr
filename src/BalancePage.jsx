import React, { useState } from "react";

const Check = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

export default function BalancePage() {
  const [activeTab, setActiveTab] = useState("bundle");
  const [userChecks, setUserChecks] = useState(() => {
    // Load user's purchased checks from localStorage
    const saved = localStorage.getItem('cdl_user_checks');
    return saved ? JSON.parse(saved) : {
      mvr: 0,
      psp: 0,
      cdlis: 0,
      drugTest: 0,
      bundle: 0
    };
  });
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Save user checks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('cdl_user_checks', JSON.stringify(userChecks));
  }, [userChecks]);

  // Package definitions for each check type
  const checkTypes = {
    bundle: {
      name: "Complete Bundle",
      icon: "🎁",
      description: "All 4 checks in one package",
      basePrice: 57,
      packages: [
        { quantity: 1, price: 46, pricePerCheck: 46, savings: 11 },
        { quantity: 5, price: 200, pricePerCheck: 40, savings: 85, popular: true },
        { quantity: 10, price: 350, pricePerCheck: 35, savings: 220 }
      ]
    },
    mvr: {
      name: "MVR Check",
      icon: "🚗",
      description: "Motor Vehicle Record",
      basePrice: 15,
      packages: [
        { quantity: 1, price: 15, pricePerCheck: 15, savings: 0 },
        { quantity: 5, price: 65, pricePerCheck: 13, savings: 10, popular: true },
        { quantity: 10, price: 120, pricePerCheck: 12, savings: 30 }
      ]
    },
    psp: {
      name: "PSP Report",
      icon: "📋",
      description: "Pre-Employment Screening",
      basePrice: 12,
      packages: [
        { quantity: 1, price: 12, pricePerCheck: 12, savings: 0 },
        { quantity: 5, price: 55, pricePerCheck: 11, savings: 5, popular: true },
        { quantity: 10, price: 100, pricePerCheck: 10, savings: 20 }
      ]
    },
    cdlis: {
      name: "CDLIS History",
      icon: "📝",
      description: "Commercial Driver License Info",
      basePrice: 10,
      packages: [
        { quantity: 1, price: 10, pricePerCheck: 10, savings: 0 },
        { quantity: 5, price: 45, pricePerCheck: 9, savings: 5, popular: true },
        { quantity: 10, price: 80, pricePerCheck: 8, savings: 20 }
      ]
    },
    drugTest: {
      name: "Drug Test",
      icon: "💊",
      description: "Drug & Alcohol Screening",
      basePrice: 20,
      packages: [
        { quantity: 1, price: 20, pricePerCheck: 20, savings: 0 },
        { quantity: 5, price: 90, pricePerCheck: 18, savings: 10, popular: true },
        { quantity: 10, price: 170, pricePerCheck: 17, savings: 30 }
      ]
    }
  };

  const handleBuyPackage = (checkType, pkg) => {
    setSelectedPackage({ checkType, ...pkg });
    setShowPaymentModal(true);
  };

  const formatCardNumber = (value) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setCardNumber(formatCardNumber(value));
    }
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    if (value.length <= 5) {
      setCardExpiry(value);
    }
  };

  const handleCvcChange = (e) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setCardCvc(value);
    }
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    setTimeout(() => {
      const cleanCardNumber = cardNumber.replace(/\s/g, '');
      if (cleanCardNumber === '1111111111111111') {
        setPaymentProcessing(false);
        
        // Add purchased checks to user's balance
        setUserChecks(prev => ({
          ...prev,
          [selectedPackage.checkType]: prev[selectedPackage.checkType] + selectedPackage.quantity
        }));
        
        setShowPaymentModal(false);
        setCardNumber("");
        setCardExpiry("");
        setCardCvc("");
        
        const checkTypeName = checkTypes[selectedPackage.checkType].name;
        setSuccessMessage(`Success! Added ${selectedPackage.quantity} ${checkTypeName} check${selectedPackage.quantity > 1 ? 's' : ''} to your account.`);
        setShowSuccessNotification(true);
        setTimeout(() => setShowSuccessNotification(false), 5000);
        
        setSelectedPackage(null);
      } else {
        setPaymentProcessing(false);
        setErrorMessage('Payment declined. Please use test card: 1111 1111 1111 1111');
        setShowErrorNotification(true);
        setTimeout(() => setShowErrorNotification(false), 5000);
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 bg-white border-r border-slate-200 min-h-screen flex-col fixed left-0 top-0 bottom-0 z-50">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              🚛
            </div>
            <div>
              <div className="font-bold text-slate-900 text-lg">CDL scan</div>
            </div>
          </div>
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
            <a href="#balance" className="flex items-center justify-between px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 transition-colors">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                My Packages
              </div>
            </a>
            <a href="#checks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
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
        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 backdrop-blur">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/" className="lg:hidden flex items-center gap-2 text-slate-900 hover:text-indigo-600 transition-colors">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-3M16 3v16M16 3H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10M8 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
                </svg>
              </a>
              <h1 className="text-xl font-bold text-slate-900">Balance & Credits</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-12 max-w-6xl mx-auto">
          {/* Available Checks Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-8 mb-12 text-white shadow-xl">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Your Available Checks</h2>
              <p className="text-indigo-100 text-sm">Purchase check packages to unlock screening capabilities</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-3xl mb-2">🎁</div>
                <div className="text-2xl font-bold">{userChecks.bundle}</div>
                <div className="text-xs text-indigo-200">Complete Bundles</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-3xl mb-2">🚗</div>
                <div className="text-2xl font-bold">{userChecks.mvr}</div>
                <div className="text-xs text-indigo-200">MVR Checks</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-3xl mb-2">📋</div>
                <div className="text-2xl font-bold">{userChecks.psp}</div>
                <div className="text-xs text-indigo-200">PSP Reports</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-3xl mb-2">📝</div>
                <div className="text-2xl font-bold">{userChecks.cdlis}</div>
                <div className="text-xs text-indigo-200">CDLIS History</div>
              </div>
              <div className="bg-white/10 rounded-2xl p-4 backdrop-blur">
                <div className="text-3xl mb-2">💊</div>
                <div className="text-2xl font-bold">{userChecks.drugTest}</div>
                <div className="text-xs text-indigo-200">Drug Tests</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {Object.entries(checkTypes).map(([key, check]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                    activeTab === key
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-white text-slate-700 hover:bg-slate-50 border-2 border-slate-200'
                  }`}
                >
                  <span className="text-xl">{check.icon}</span>
                  <span>{check.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Packages Section */}
          <div className="mb-12">
            {Object.entries(checkTypes).map(([key, check]) => (
              activeTab === key && (
                <div key={key}>
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-900 mb-3">{check.name} Packages</h2>
                    <p className="text-lg text-slate-600">{check.description} • Buy in bulk and save more</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    {check.packages.map((pkg, idx) => (
                      <div
                        key={idx}
                        className={`relative rounded-3xl border-2 bg-white transition-all hover:shadow-xl flex flex-col ${
                          pkg.popular 
                            ? 'border-indigo-500 shadow-lg scale-105' 
                            : 'border-slate-200 hover:border-indigo-200'
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-indigo-600 text-white text-sm font-bold rounded-full shadow-lg">
                            🔥 Most Popular
                          </div>
                        )}

                        <div className="text-center p-8 pb-6">
                          <div className="text-5xl mb-4">{check.icon}</div>
                          
                          {/* Quantity */}
                          <div className="mb-4">
                            <div className="flex items-baseline justify-center gap-2">
                              <span className="text-6xl font-bold text-slate-900">{pkg.quantity}</span>
                              <span className="text-lg text-slate-600 font-medium">check{pkg.quantity > 1 ? 's' : ''}</span>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="mb-4">
                            <div className="text-4xl font-bold text-indigo-600 mb-2">${pkg.price}</div>
                            {pkg.savings > 0 && (
                              <div className="flex items-center justify-center gap-2 text-sm">
                                <span className="text-slate-400 line-through">${pkg.price + pkg.savings}</span>
                                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 font-bold rounded-md">
                                  Save ${pkg.savings}!
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Price per check */}
                          <div className="bg-slate-50 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-600">Price per check:</span>
                              <span className="text-xl font-bold text-slate-900">${pkg.pricePerCheck}</span>
                            </div>
                            {pkg.quantity > 1 && (
                              <div className="mt-2 pt-2 border-t border-slate-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-slate-500">vs single price:</span>
                                  <span className="text-sm text-slate-400 line-through">${check.basePrice}</span>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Features */}
                          <div className="text-sm text-slate-600 mb-4">
                            {key === 'bundle' ? (
                              <div className="flex items-center justify-center gap-1">
                                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span>Includes all 4 check types</span>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center gap-1">
                                <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20 6L9 17l-5-5" />
                                </svg>
                                <span>Never expires</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Button - fixed at bottom */}
                        <div className="p-6 pt-0 mt-auto">
                          <button
                            onClick={() => handleBuyPackage(key, pkg)}
                            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                              pkg.popular
                                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg'
                                : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                            }`}
                          >
                            Buy Package
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>

          {/* How It Works */}
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">How Check Packages Work</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">�</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">1. Buy Packages</h4>
                <p className="text-sm text-slate-600">Choose check type and quantity. Larger packages = bigger savings</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔍</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">2. Run Checks</h4>
                <p className="text-sm text-slate-600">Use your checks anytime to screen drivers. They never expire</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💰</span>
                </div>
                <h4 className="font-bold text-slate-900 mb-2">3. Save Money</h4>
                <p className="text-sm text-slate-600">Bundle packages save up to 39% compared to single checks</p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-in fade-in zoom-in duration-300">
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
                {checkTypes[selectedPackage.checkType].icon}
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {checkTypes[selectedPackage.checkType].name}
              </h2>
              <p className="text-slate-600">
                {selectedPackage.quantity} check{selectedPackage.quantity > 1 ? 's' : ''} for ${selectedPackage.price}
              </p>
              <p className="text-sm text-emerald-600 font-semibold mt-1">
                ${selectedPackage.pricePerCheck} per check
              </p>
            </div>

            {/* Test Card Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 text-lg">ℹ️</div>
                <div className="flex-1">
                  <p className="text-sm text-blue-900 font-semibold mb-1">Test Mode</p>
                  <p className="text-xs text-blue-700">
                    Use card: <span className="font-mono font-bold">1111 1111 1111 1111</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Card Number
                </label>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="1111 1111 1111 1111"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={cardExpiry}
                    onChange={handleExpiryChange}
                    placeholder="MM/YY"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    CVC
                  </label>
                  <input
                    type="text"
                    value={cardCvc}
                    onChange={handleCvcChange}
                    placeholder="123"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={paymentProcessing || !cardNumber || !cardExpiry || !cardCvc}
                className="w-full py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {paymentProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    🔒 Pay ${selectedPackage.price}
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-center text-slate-500 mt-4">
              🔒 Secure payment • Your data is encrypted
            </p>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-emerald-600 text-white rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-md">
            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold mb-1">Payment Successful!</p>
              <p className="text-sm text-emerald-50">{successMessage}</p>
            </div>
            <button 
              onClick={() => setShowSuccessNotification(false)}
              className="flex-shrink-0 text-white hover:text-emerald-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="fixed top-6 right-6 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-red-600 text-white rounded-2xl shadow-2xl p-5 flex items-start gap-4 max-w-md">
            <div className="flex-shrink-0 w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold mb-1">Payment Failed</p>
              <p className="text-sm text-red-50">{errorMessage}</p>
            </div>
            <button 
              onClick={() => setShowErrorNotification(false)}
              className="flex-shrink-0 text-white hover:text-red-100 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
