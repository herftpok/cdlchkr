import React, { useState } from "react";

const Check = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const Shield = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const US_STATES = [
  { code: "AL", name: "Alabama" },
  { code: "AK", name: "Alaska" },
  { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" },
  { code: "CA", name: "California" },
  { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" },
  { code: "DE", name: "Delaware" },
  { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" },
  { code: "HI", name: "Hawaii" },
  { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" },
  { code: "IN", name: "Indiana" },
  { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" },
  { code: "KY", name: "Kentucky" },
  { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" },
  { code: "MD", name: "Maryland" },
  { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" },
  { code: "MN", name: "Minnesota" },
  { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" },
  { code: "MT", name: "Montana" },
  { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" },
  { code: "NH", name: "New Hampshire" },
  { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" },
  { code: "NY", name: "New York" },
  { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" },
  { code: "OH", name: "Ohio" },
  { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" },
  { code: "PA", name: "Pennsylvania" },
  { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" },
  { code: "SD", name: "South Dakota" },
  { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" },
  { code: "UT", name: "Utah" },
  { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" },
  { code: "WA", name: "Washington" },
  { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" },
  { code: "WY", name: "Wyoming" },
];

const TEST_DATA = {
  dlNumber: "X1487849",
  driverName: "SMITH, JOHN",
  dob: "1984-03-15",
  state: "VA"
};

export default function CheckDriverPage() {
  const [formData, setFormData] = useState({
    state: "",
    dlNumber: "",
    driverName: "",
    dob: "",
  });

  const [selectedChecks, setSelectedChecks] = useState({
    mvr: true,
    psp: true,
    cdlis: true,
    drugTest: true,
  });

  const [showResults, setShowResults] = useState(false);
  const [isTestData, setIsTestData] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [loadingResults, setLoadingResults] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" or "package"
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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

  // Price calculation based on selected checks
  const CHECK_PRICES = {
    mvr: 15,
    psp: 12,
    cdlis: 10,
    drugTest: 20,
  };

  const BUNDLE_DISCOUNT = 0.8; // 20% discount for all checks

  // Save user checks to localStorage whenever they change
  React.useEffect(() => {
    localStorage.setItem('cdl_user_checks', JSON.stringify(userChecks));
  }, [userChecks]);

  // Calculate what can be covered by packages and what needs to be paid
  const calculatePaymentBreakdown = () => {
    const allSelected = Object.values(selectedChecks).every(v => v);
    
    // If all checks selected and user has bundle, use bundle
    if (allSelected && userChecks.bundle > 0) {
      return {
        canUsePackages: true,
        usesBundle: true,
        coveredByPackages: totalPrice,
        needsToPay: 0,
        breakdown: {}
      };
    }

    // Calculate individual coverage
    const breakdown = {
      mvr: { selected: selectedChecks.mvr, hasPackage: userChecks.mvr > 0, price: CHECK_PRICES.mvr },
      psp: { selected: selectedChecks.psp, hasPackage: userChecks.psp > 0, price: CHECK_PRICES.psp },
      cdlis: { selected: selectedChecks.cdlis, hasPackage: userChecks.cdlis > 0, price: CHECK_PRICES.cdlis },
      drugTest: { selected: selectedChecks.drugTest, hasPackage: userChecks.drugTest > 0, price: CHECK_PRICES.drugTest }
    };

    let coveredByPackages = 0;
    let needsToPay = 0;

    Object.entries(breakdown).forEach(([key, info]) => {
      if (info.selected) {
        if (info.hasPackage) {
          coveredByPackages += info.price;
        } else {
          needsToPay += info.price;
        }
      }
    });

    return {
      canUsePackages: coveredByPackages > 0,
      usesBundle: false,
      coveredByPackages,
      needsToPay,
      breakdown
    };
  };

  const calculatePrice = () => {
    const selectedCount = Object.values(selectedChecks).filter(Boolean).length;
    
    if (selectedCount === 0) return 0;
    
    // If all 4 checks selected, apply bundle discount
    if (selectedCount === 4) {
      const totalPrice = Object.values(CHECK_PRICES).reduce((sum, price) => sum + price, 0);
      return Math.round(totalPrice * BUNDLE_DISCOUNT);
    }
    
    // Calculate individual prices
    return Object.entries(selectedChecks)
      .filter(([_, selected]) => selected)
      .reduce((sum, [key, _]) => sum + CHECK_PRICES[key], 0);
  };

  const totalPrice = calculatePrice();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checkName) => {
    setSelectedChecks(prev => ({
      ...prev,
      [checkName]: !prev[checkName]
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(selectedChecks).every(v => v);
    setSelectedChecks({
      mvr: !allSelected,
      psp: !allSelected,
      cdlis: !allSelected,
      drugTest: !allSelected,
    });
  };

  const handleFillTestData = () => {
    setFormData({
      state: TEST_DATA.state,
      dlNumber: TEST_DATA.dlNumber,
      driverName: TEST_DATA.driverName,
      dob: TEST_DATA.dob,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Check if test data was entered
    const isTest = 
      formData.dlNumber === TEST_DATA.dlNumber &&
      formData.driverName.toUpperCase() === TEST_DATA.driverName &&
      formData.dob === TEST_DATA.dob &&
      formData.state === TEST_DATA.state;
    
    setIsTestData(isTest);
    
    // Show paywall instead of results
    setShowPaywall(true);
  };

  const handlePayment = (e) => {
    e.preventDefault();
    setPaymentProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      let paymentSuccessful = false;
      const breakdown = calculatePaymentBreakdown();

      if (paymentMethod === "hybrid" || paymentMethod === "package") {
        // Hybrid payment: use packages + card for remainder
        const allSelected = Object.values(selectedChecks).every(v => v);
        
        // Check if user has bundle package available
        if (allSelected && userChecks.bundle > 0) {
          setUserChecks(prev => ({
            ...prev,
            bundle: prev.bundle - 1
          }));
          paymentSuccessful = true;
        } else if (breakdown.canUsePackages) {
          // Use available packages
          const newChecks = { ...userChecks };
          if (selectedChecks.mvr && userChecks.mvr > 0) newChecks.mvr--;
          if (selectedChecks.psp && userChecks.psp > 0) newChecks.psp--;
          if (selectedChecks.cdlis && userChecks.cdlis > 0) newChecks.cdlis--;
          if (selectedChecks.drugTest && userChecks.drugTest > 0) newChecks.drugTest--;

          // If there's remainder and we're in hybrid mode, process card payment
          if (breakdown.needsToPay > 0 && paymentMethod === "hybrid") {
            const cleanCardNumber = cardNumber.replace(/\s/g, '');
            if (cleanCardNumber === '1111111111111111') {
              setUserChecks(newChecks);
              paymentSuccessful = true;
            } else {
              setPaymentProcessing(false);
              setErrorMessage('Payment declined. Please use test card: 1111 1111 1111 1111');
              setShowErrorNotification(true);
              setTimeout(() => setShowErrorNotification(false), 5000);
              return;
            }
          } else if (breakdown.needsToPay === 0) {
            // All covered by packages
            setUserChecks(newChecks);
            paymentSuccessful = true;
          } else {
            // Package-only mode but need to pay more
            setPaymentProcessing(false);
            setErrorMessage(`Missing packages! You need to pay $${breakdown.needsToPay} more.`);
            setShowErrorNotification(true);
            setTimeout(() => setShowErrorNotification(false), 5000);
            return;
          }
        } else {
          setPaymentProcessing(false);
          setErrorMessage('You don\'t have any packages for selected checks!');
          setShowErrorNotification(true);
          setTimeout(() => setShowErrorNotification(false), 5000);
          return;
        }
      } else {
        // Pay with card only
        const cleanCardNumber = cardNumber.replace(/\s/g, '');
        if (cleanCardNumber === '1111111111111111') {
          paymentSuccessful = true;
        } else {
          setPaymentProcessing(false);
          setErrorMessage('Payment declined. Please use test card: 1111 1111 1111 1111');
          setShowErrorNotification(true);
          setTimeout(() => setShowErrorNotification(false), 5000);
          return;
        }
      }

      if (paymentSuccessful) {
        setPaymentProcessing(false);
        setPaymentSuccess(true);
        
        // Close paywall and show loading
        setTimeout(() => {
          setShowPaywall(false);
          setLoadingResults(true);
          
          // Scroll to results area
          setTimeout(() => {
            document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          
          // Simulate data loading (2 seconds)
          setTimeout(() => {
            setLoadingResults(false);
            setShowResults(true);
          }, 2000);
        }, 1500); // Show success message for 1.5 seconds
      }
    }, 2000);
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

  const isFormValid = 
    formData.state && 
    formData.dlNumber && 
    formData.driverName && 
    formData.dob &&
    Object.values(selectedChecks).some(v => v);

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
            <a href="/search" className="w-full px-4 py-2.5 rounded-xl bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">+</span>
              New driver check
            </a>
            <a href="/balance" className="w-full px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2">
              <span className="text-lg">$</span>
              Top up your balance
            </a>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 border-b border-slate-200">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 px-2">Navigation</h3>
          <div className="space-y-1">
            <a href="/search" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-medium hover:bg-indigo-200 transition-colors">
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
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Profile
            </a>
            <a href="/balance" className="flex items-center justify-between px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
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
            <a href="/checks" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
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
              <h1 className="text-xl font-bold text-slate-900">Driver Background Check</h1>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-6 py-12 max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Driver Background Check
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Run comprehensive screening checks in minutes. Enter driver information below to get started.
          </p>
        </div>

        {/* Test Data Notice */}
        <div className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div className="flex-1">
              <h3 className="font-bold text-blue-900 mb-1">Test Mode Available</h3>
              <p className="text-sm text-blue-700 mb-3">
                Want to see a sample report? Use our test data to view example screening results.
              </p>
              <button
                onClick={handleFillTestData}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
              >
                Fill Test Data
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 mb-12">
          {/* Driver Information Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Shield className="w-6 h-6 text-indigo-600" />
              Driver Information
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {/* MVR State */}
              <div>
                <label htmlFor="state" className="block text-sm font-semibold text-slate-700 mb-2">
                  MVR State <span className="text-red-600">*</span>
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all text-base"
                >
                  <option value="">Select State</option>
                  {US_STATES.map(state => (
                    <option key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* DL Number */}
              <div>
                <label htmlFor="dlNumber" className="block text-sm font-semibold text-slate-700 mb-2">
                  DL Number <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="dlNumber"
                  name="dlNumber"
                  value={formData.dlNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., X1487849"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all text-base"
                />
              </div>

              {/* Driver Name */}
              <div>
                <label htmlFor="driverName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Driver Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="driverName"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  required
                  placeholder="LAST, FIRST"
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all text-base"
                />
              </div>

              {/* Driver DOB */}
              <div>
                <label htmlFor="dob" className="block text-sm font-semibold text-slate-700 mb-2">
                  Driver Date of Birth <span className="text-red-600">*</span>
                </label>
                <input
                  type="date"
                  id="dob"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all text-base"
                />
              </div>
            </div>
          </div>

          {/* Check Selection Section */}
          <div className="mb-8 pt-8 border-t border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Check className="w-6 h-6 text-indigo-600" />
                Select Screening Checks
              </h2>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {Object.values(selectedChecks).every(v => v) ? "Deselect All" : "Select All"}
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* MVR Check */}
              <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={selectedChecks.mvr}
                  onChange={() => handleCheckboxChange('mvr')}
                  className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">MVR Driving History</div>
                  <div className="text-sm text-slate-600">Motor Vehicle Record check across all 50 states</div>
                </div>
              </label>

              {/* PSP Check */}
              <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={selectedChecks.psp}
                  onChange={() => handleCheckboxChange('psp')}
                  className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">FMCSA PSP History</div>
                  <div className="text-sm text-slate-600">Pre-employment Screening Program crash & inspection data</div>
                </div>
              </label>

              {/* CDLIS Check */}
              <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={selectedChecks.cdlis}
                  onChange={() => handleCheckboxChange('cdlis')}
                  className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">CDLIS History</div>
                  <div className="text-sm text-slate-600">Commercial Driver's License Information System verification</div>
                </div>
              </label>

              {/* Drug Test */}
              <label className="flex items-start gap-4 p-4 rounded-xl border-2 border-slate-200 hover:border-indigo-300 cursor-pointer transition-all">
                <input
                  type="checkbox"
                  checked={selectedChecks.drugTest}
                  onChange={() => handleCheckboxChange('drugTest')}
                  className="mt-1 w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600"
                />
                <div className="flex-1">
                  <div className="font-bold text-slate-900 mb-1">Drug Test Results</div>
                  <div className="text-sm text-slate-600">DOT-compliant 5-panel drug screening results</div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6 border-t border-slate-200">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                isFormValid
                  ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg hover:shadow-xl"
                  : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
            >
              {isFormValid ? "Run Background Check →" : "Please fill all required fields"}
            </button>
          </div>
        </form>

        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 relative animate-in fade-in zoom-in duration-300 max-h-[95vh] flex flex-col">
              <button 
                onClick={() => setShowPaywall(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div className="overflow-y-auto flex-1 px-6 py-6">
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-1">Complete Your Purchase</h2>
                <p className="text-sm text-slate-600">Select checks and unlock screening results</p>
              </div>

              {/* Two Column Layout on Desktop */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
              {/* Select Checks */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Select Checks</h3>
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {Object.values(selectedChecks).every(v => v) ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="space-y-2">
                  {/* MVR Check */}
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all h-[70px] ${
                    selectedChecks.mvr ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedChecks.mvr}
                      onChange={() => handleCheckboxChange('mvr')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">MVR Check</span>
                        <span className="font-bold text-indigo-600 text-sm shrink-0">${CHECK_PRICES.mvr}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-tight">Motor Vehicle Record screening</p>
                    </div>
                  </label>

                  {/* PSP Check */}
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all h-[70px] ${
                    selectedChecks.psp ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedChecks.psp}
                      onChange={() => handleCheckboxChange('psp')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">PSP Report</span>
                        <span className="font-bold text-indigo-600 text-sm shrink-0">${CHECK_PRICES.psp}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-tight">Pre-Employment Screening Program</p>
                    </div>
                  </label>

                  {/* CDLIS Check */}
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all h-[70px] ${
                    selectedChecks.cdlis ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedChecks.cdlis}
                      onChange={() => handleCheckboxChange('cdlis')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">CDLIS History</span>
                        <span className="font-bold text-indigo-600 text-sm shrink-0">${CHECK_PRICES.cdlis}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-tight">Commercial Driver's License Info</p>
                    </div>
                  </label>

                  {/* Drug Test */}
                  <label className={`flex items-start gap-2.5 p-2.5 rounded-lg border-2 cursor-pointer transition-all h-[70px] ${
                    selectedChecks.drugTest ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="checkbox"
                      checked={selectedChecks.drugTest}
                      onChange={() => handleCheckboxChange('drugTest')}
                      className="mt-0.5 w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-600 shrink-0"
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-slate-900 text-sm">Drug Test</span>
                        <span className="font-bold text-indigo-600 text-sm shrink-0">${CHECK_PRICES.drugTest}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-tight">DOT 5-panel drug screening</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 mb-4 border border-indigo-200">
                {Object.values(selectedChecks).every(v => v) && (
                  <div className="bg-emerald-100 border border-emerald-300 rounded-lg px-2.5 py-1.5 mb-2.5 flex items-center gap-2">
                    <span className="text-base">🎉</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-emerald-900">Bundle Discount Applied!</p>
                      <p className="text-[10px] text-emerald-700">Save 20% with all checks</p>
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5 text-sm mb-2.5">
                  {selectedChecks.mvr && (
                    <div className={`flex justify-between ${
                      (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.mvr > 0
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.mvr > 0
                          ? "line-through"
                          : ""
                      }>
                        MVR Check
                        {(paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.mvr > 0 && (
                          <span className="ml-1 text-xs font-semibold">📦</span>
                        )}
                      </span>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.mvr > 0
                          ? "line-through"
                          : ""
                      }>
                        ${CHECK_PRICES.mvr}
                      </span>
                    </div>
                  )}
                  {selectedChecks.psp && (
                    <div className={`flex justify-between ${
                      (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.psp > 0
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.psp > 0
                          ? "line-through"
                          : ""
                      }>
                        PSP Report
                        {(paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.psp > 0 && (
                          <span className="ml-1 text-xs font-semibold">📦</span>
                        )}
                      </span>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.psp > 0
                          ? "line-through"
                          : ""
                      }>
                        ${CHECK_PRICES.psp}
                      </span>
                    </div>
                  )}
                  {selectedChecks.cdlis && (
                    <div className={`flex justify-between ${
                      (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.cdlis > 0
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.cdlis > 0
                          ? "line-through"
                          : ""
                      }>
                        CDLIS History
                        {(paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.cdlis > 0 && (
                          <span className="ml-1 text-xs font-semibold">📦</span>
                        )}
                      </span>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.cdlis > 0
                          ? "line-through"
                          : ""
                      }>
                        ${CHECK_PRICES.cdlis}
                      </span>
                    </div>
                  )}
                  {selectedChecks.drugTest && (
                    <div className={`flex justify-between ${
                      (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.drugTest > 0
                        ? "text-emerald-600"
                        : "text-slate-700"
                    }`}>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.drugTest > 0
                          ? "line-through"
                          : ""
                      }>
                        Drug Test
                        {(paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.drugTest > 0 && (
                          <span className="ml-1 text-xs font-semibold">📦</span>
                        )}
                      </span>
                      <span className={
                        (paymentMethod === "package" || paymentMethod === "hybrid") && userChecks.drugTest > 0
                          ? "line-through"
                          : ""
                      }>
                        ${CHECK_PRICES.drugTest}
                      </span>
                    </div>
                  )}
                  
                  {Object.values(selectedChecks).every(v => v) && (
                    <div className="flex justify-between text-emerald-600 font-semibold">
                      <span>Bundle Discount (20%)</span>
                      <span>-${Object.values(CHECK_PRICES).reduce((sum, price) => sum + price, 0) - totalPrice}</span>
                    </div>
                  )}
                  
                  {/* Package Savings */}
                  {(() => {
                    const breakdown = calculatePaymentBreakdown();
                    if ((paymentMethod === "package" || paymentMethod === "hybrid") && breakdown.coveredByPackages > 0) {
                      return (
                        <div className="flex justify-between text-emerald-600 font-semibold border-t border-emerald-200 pt-1.5 mt-1.5">
                          <span className="flex items-center gap-1">
                            📦 Package Savings
                          </span>
                          <span>-${breakdown.coveredByPackages}</span>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                <div className="pt-3 border-t-2 border-indigo-200 flex items-baseline justify-between">
                  <span className="text-slate-700 font-semibold">Total</span>
                  <div className="flex items-baseline gap-1">
                    {(() => {
                      const breakdown = calculatePaymentBreakdown();
                      const finalAmount = (paymentMethod === "package" || paymentMethod === "hybrid") 
                        ? breakdown.needsToPay 
                        : totalPrice;
                      
                      return (
                        <>
                          {(paymentMethod === "package" || paymentMethod === "hybrid") && breakdown.coveredByPackages > 0 && (
                            <span className="text-lg text-slate-400 line-through mr-2">${totalPrice}</span>
                          )}
                          <span className="text-3xl font-bold text-slate-900">${finalAmount}</span>
                        </>
                      );
                    })()}
                    {Object.values(selectedChecks).filter(Boolean).length === 0 && (
                      <span className="text-xs text-slate-500 ml-1">Select checks</span>
                    )}
                  </div>
                </div>
              </div>
              </div>
              {/* End of Two Column Layout */}

              {/* Use Packages Checkbox - Show if packages are available */}
              {(() => {
                const breakdown = calculatePaymentBreakdown();
                if (!breakdown.canUsePackages) return null;
                
                return (
                  <div className="mb-4">
                    <label className="flex items-start gap-3 p-4 rounded-xl border-2 border-emerald-200 bg-emerald-50 cursor-pointer hover:bg-emerald-100 transition-colors">
                      <input
                        type="checkbox"
                        checked={paymentMethod === "package" || paymentMethod === "hybrid"}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setPaymentMethod(breakdown.needsToPay > 0 ? "hybrid" : "package");
                          } else {
                            setPaymentMethod("card");
                          }
                        }}
                        className="mt-0.5 w-5 h-5 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-bold text-emerald-900">
                            📦 Use available packages
                          </span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Save ${breakdown.coveredByPackages}
                          </span>
                        </div>
                        {breakdown.usesBundle ? (
                          <p className="text-xs text-emerald-700">
                            Using: <span className="font-semibold">1 Bundle package</span> (all 4 checks)
                          </p>
                        ) : (
                          <div className="text-xs text-emerald-700">
                            {breakdown.coveredByPackages > 0 && (
                              <div className="mb-1">
                                <span className="font-semibold">Using:</span>
                                {selectedChecks.mvr && userChecks.mvr > 0 && ' MVR'}
                                {selectedChecks.psp && userChecks.psp > 0 && ' PSP'}
                                {selectedChecks.cdlis && userChecks.cdlis > 0 && ' CDLIS'}
                                {selectedChecks.drugTest && userChecks.drugTest > 0 && ' Drug Test'}
                                <span className="font-semibold"> (${breakdown.coveredByPackages})</span>
                              </div>
                            )}
                            {breakdown.needsToPay > 0 && (
                              <div className="text-slate-600">
                                <span className="font-semibold">Paying with card:</span>
                                {selectedChecks.mvr && userChecks.mvr === 0 && ' MVR'}
                                {selectedChecks.psp && userChecks.psp === 0 && ' PSP'}
                                {selectedChecks.cdlis && userChecks.cdlis === 0 && ' CDLIS'}
                                {selectedChecks.drugTest && userChecks.drugTest === 0 && ' Drug Test'}
                                <span className="font-semibold"> (${breakdown.needsToPay})</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </label>
                  </div>
                );
              })()}

              {/* Test Card Notice */}
              {(paymentMethod === "card" || (paymentMethod === "hybrid" && calculatePaymentBreakdown().needsToPay > 0)) && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
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
              )}

              {/* Package Only Payment - Show button without card form */}
              {((paymentMethod === "package" || paymentMethod === "hybrid") && calculatePaymentBreakdown().needsToPay === 0) && (
                <form onSubmit={handlePayment}>
                  <button
                    type="submit"
                    disabled={paymentProcessing || totalPrice === 0}
                    className="w-full py-3 rounded-lg bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {paymentProcessing ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </>
                    ) : totalPrice === 0 ? (
                      <>Select at least one check</>
                    ) : (
                      <>🔒 Use Package & View Results</>
                    )}
                  </button>
                </form>
              )}

              {/* Card Payment Form - Show when card is needed */}
              {(paymentMethod === "card" || (paymentMethod === "hybrid" && calculatePaymentBreakdown().needsToPay > 0)) && (
              <form onSubmit={handlePayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    placeholder="1111 1111 1111 1111"
                    required
                    className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      CVC
                    </label>
                    <input
                      type="text"
                      value={cardCvc}
                      onChange={handleCvcChange}
                      placeholder="123"
                      required
                      className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all font-mono text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={(() => {
                    if (paymentProcessing || totalPrice === 0) return true;
                    const breakdown = calculatePaymentBreakdown();
                    // Package only mode - no card required
                    if ((paymentMethod === "package" || paymentMethod === "hybrid") && breakdown.needsToPay === 0) {
                      return false;
                    }
                    // Card needed - require card details
                    return !cardNumber || !cardExpiry || !cardCvc;
                  })()}
                  className="w-full py-3 rounded-lg bg-indigo-600 text-white font-bold text-base hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {paymentProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : totalPrice === 0 ? (
                    <>
                      Select at least one check
                    </>
                  ) : (() => {
                    const breakdown = calculatePaymentBreakdown();
                    // Using packages only (no card needed)
                    if ((paymentMethod === "package" || paymentMethod === "hybrid") && breakdown.needsToPay === 0) {
                      return <>🔒 Use Package & View Results</>;
                    }
                    // Hybrid mode (packages + card)
                    if (paymentMethod === "hybrid" && breakdown.needsToPay > 0) {
                      return <>🔒 Use Packages & Pay ${breakdown.needsToPay}</>;
                    }
                    // Card only
                    return <>🔒 Pay ${totalPrice} & View Results</>;
                  })()}
                </button>
              </form>
              )}

              <p className="text-xs text-center text-slate-500 mt-3">
                🔒 Secure payment • Your data is encrypted
              </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loadingResults && (
          <div id="results" className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
            {/* Payment Success Banner */}
            <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-8 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-emerald-900">Payment Successful!</p>
                  <p className="text-sm text-emerald-700">Processing your screening request...</p>
                </div>
                <span className="text-2xl">✓</span>
              </div>
            </div>

            {/* Loading Animation */}
            <div className="text-center py-16">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <svg className="animate-spin w-24 h-24 text-indigo-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Loading Driver Records</h3>
              <p className="text-slate-600 mb-6">
                Fetching comprehensive background data from multiple sources...
              </p>
              <div className="max-w-md mx-auto space-y-3 text-left">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span>Verifying driver information</span>
                </div>
                {selectedChecks.mvr && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="animate-spin w-3 h-3 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <span>Retrieving MVR records...</span>
                  </div>
                )}
                {selectedChecks.psp && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="animate-spin w-3 h-3 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <span>Querying PSP database...</span>
                  </div>
                )}
                {selectedChecks.cdlis && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="animate-spin w-3 h-3 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <span>Accessing CDLIS system...</span>
                  </div>
                )}
                {selectedChecks.drugTest && (
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <svg className="animate-spin w-3 h-3 text-indigo-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <span>Processing drug test results...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {showResults && (
          <div id="results" className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
            {/* Payment Success Banner */}
            {paymentSuccess && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 mb-6 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-emerald-900">Payment Successful!</p>
                    <p className="text-sm text-emerald-700">Your screening results are ready</p>
                  </div>
                  <span className="text-2xl">✓</span>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-lg ${
                isTestData 
                  ? "bg-red-100 text-red-700 border-2 border-red-300"
                  : "bg-emerald-100 text-emerald-700 border-2 border-emerald-300"
              }`}>
                {isTestData ? "⚠️ RISK DETECTED" : "✓ Processing"}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
                {isTestData ? "Screening Results" : "Check Submitted"}
              </h2>
              <p className="text-lg text-slate-600">
                {isTestData 
                  ? `Results for ${formData.driverName}` 
                  : "Your screening request has been submitted and is being processed"
                }
              </p>
            </div>

            {isTestData ? (
              <TestResults selectedChecks={selectedChecks} formData={formData} />
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏱️</div>
                <p className="text-xl text-slate-600 mb-6">
                  Screening typically completes in 24-48 hours
                </p>
                <p className="text-base text-slate-500">
                  You'll receive an email notification when results are ready
                </p>
              </div>
            )}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}

// MVR Report Component - Exact format from screenshot
const MVRReport = ({ formData }) => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 font-mono text-xs">
      <div className="text-center border-b-2 border-slate-400 pb-2 mb-4">
        <div className="text-sm font-bold">MVR Screening Report</div>
        <div className="text-[10px]">ACME, INC</div>
      </div>

      {/* Driver Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-[10px]">
        <div>
          <div className="font-bold mb-1">License Number:</div>
          <div>H123456789</div>
          <div className="font-bold mt-2 mb-1">License Name:</div>
          <div>SAMPLE, SAMMY</div>
          <div className="font-bold mt-2 mb-1">Address:</div>
          <div>5555 N. SAMPLE LANE</div>
          <div>HILLSBOROUGH COUNTY, FL</div>
        </div>
        <div>
          <div className="font-bold mb-1">License Info:</div>
          <div>Type: Personal</div>
          <div>Class: E</div>
          <div>Status: VALID & NON-COMMERCIAL ANY TYPE NON COMMERCIAL VEH</div>
          <div>Issued: 2019-02-27</div>
          <div>Expires: 2027-03-15</div>
          <div className="font-bold mt-2 mb-1">Original Issue Date:</div>
          <div>2015-06-18</div>
          <div className="font-bold mt-2 mb-1">Restrictions:</div>
          <div>CORRECTIVE LENSES</div>
          <div>IGNITION INTERLOCK DEVICE</div>
        </div>
      </div>

      {/* Expiration Dates */}
      <div className="mb-4 text-[10px]">
        <div className="font-bold mb-1">Expiration Date:</div>
        <div>License: 2027-03-15</div>
        <div>Issue Date: 2019-02-27</div>
        <div>Original Issue Date: 2015-06-18</div>
        <div className="font-bold mt-2 mb-1">Endorsement:</div>
        <div>TANK VEHICLE</div>
      </div>

      {/* License 2 */}
      <div className="border-t-2 border-slate-300 pt-4 mb-4">
        <div className="font-bold text-[10px] mb-2">License Info - License #2</div>
        <div className="grid grid-cols-2 gap-4 text-[10px]">
          <div>
            <div>License Type: Commercial</div>
            <div>Class: A</div>
            <div>Status: VALID & COMMERCIAL VEH1 ANY WEIGHT MAY TOW ANOTHER VEHICLE &gt; 10K</div>
          </div>
          <div>
            <div>Issued: 2019-08-30</div>
            <div>Expires: 2023-08-30</div>
            <div>Issue Date: 2015-06-18</div>
            <div>Endorsement: TANK VEHICLE</div>
          </div>
        </div>
      </div>

      {/* License 3 */}
      <div className="border-t-2 border-slate-300 pt-4 mb-4">
        <div className="font-bold text-[10px] mb-2">License Info - License #3</div>
        <div className="text-[10px]">
          <div>License Type: Identification</div>
          <div>Class: I - NON VALID</div>
          <div>Expiration Date: 2019-08-30</div>
          <div>Issue Date: 2015-06-18</div>
          <div>Self Certification Description: NON-EXCEPTED-INTERSTATE</div>
          <div className="font-bold mt-2">Message:</div>
          <div>CDL PERMIT 120DAYS</div>
        </div>
      </div>

      {/* License 4 */}
      <div className="border-t-2 border-slate-300 pt-4 mb-4">
        <div className="font-bold text-[10px] mb-2">License Info - License #4</div>
        <div className="text-[10px]">
          <div>License Type: Identification</div>
          <div>Class: I - NON VALID</div>
          <div>Expiration Date: 2014-06-18</div>
        </div>
      </div>

      {/* Driver Licenses w/ Restrictions - Total State Points */}
      <div className="border-t-2 border-slate-300 pt-4 mb-4">
        <div className="font-bold text-[10px] mb-2">Driver Licenses w/ Restrictions - Total State Points</div>
        <div className="text-[10px]">
          <div className="font-bold">Total State Points: 2</div>
        </div>
      </div>

      {/* Medical Disqualification */}
      <div className="border-t-2 border-slate-300 pt-4 mb-4">
        <div className="font-bold text-[10px] mb-2">Medical Disqualification - Self Certification Description</div>
        <div className="text-[10px]">
          <div>Self Certification Description: NON-EXCEPTED-INTERSTATE</div>
          <div className="font-bold mt-2">Message:</div>
          <div>THIRD PARTY CDL SKILLS TEST CERTIFICATION</div>
        </div>
      </div>

      {/* VIOLATIONS */}
      <div className="border-t-2 border-slate-400 pt-4 mb-4">
        <div className="font-bold text-sm mb-3 text-center">VIOLATIONS</div>
        
        {/* Violation 1 */}
        <div className="bg-red-50 border border-red-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2014-09-13 | This Date: 2015-06-18</div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div>State: TN</div>
              <div>Violation: FL</div>
              <div>Court: HILLSBOROUGH</div>
            </div>
            <div>
              <div>State Code: A47</div>
              <div>ACD: A90</div>
              <div>Points: 0</div>
            </div>
          </div>
          <div className="mt-2 font-bold text-red-700">BLOOD ALCOHOL LEVEL: 0.311</div>
          <div>ADJUDICATION WITHHELD BY JUDGE</div>
          <div className="mt-1 text-red-600 font-bold">DISQUALIFICATION</div>
          <div>Rpt Date: 2015-06-18 | End Date: 2016-06-18</div>
          <div>Description: FIRST DUI CONVICTION BODILY INJURY LIABILITY/PROPERTY</div>
          <div className="mt-2 font-bold">MISC: REVOCATION AS A RESULT OF VIOLATION</div>
        </div>

        {/* Violation 2 */}
        <div className="bg-red-50 border border-red-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2015-09-16</div>
          <div>State: TN | State Code: A08 | ACD: A20</div>
          <div className="mt-1 font-bold text-red-700">DUI-UNLAWFUL BLOOD ALCOHOL</div>
          <div>Court: HILLSBOROUGH | Conviction: DUI</div>
          <div className="mt-2 text-red-600 font-bold">REVOCATION</div>
          <div>Date: 2015-09-16</div>
          <div>Description: DRIVING UNDER THE INFLUENCE</div>
          <div>MISC: REVOCATION AS A RESULT OF VIOLATION</div>
        </div>

        {/* Violation 3 */}
        <div className="bg-amber-50 border border-amber-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2014-05-14 | This Date: 2014-08-14</div>
          <div>State: FL | State Code: A10 | ACD: A10 | Points: 0</div>
          <div className="mt-1 font-bold">DRIVING UNDER THE INFLUENCE - FIRST OFFENSE</div>
          <div>Court: HILLSBOROUGH COUNTY</div>
          <div>MISC: DRIVING UNDER THE INFLUENCE</div>
        </div>

        {/* Violation 4 */}
        <div className="bg-amber-50 border border-amber-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2014-05-16</div>
          <div>State: TN | State Code: 946 | ACD: S96 | Points: 0</div>
          <div className="mt-1 font-bold">DISREGARDING TRAFFIC CONTROL DEVICE</div>
          <div>Court: HILLSBOROUGH</div>
        </div>

        {/* Violation 5 */}
        <div className="bg-amber-50 border border-amber-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2014-06-18</div>
          <div>State: FL | State Code: A08 | ACD: A08 | Points: 0</div>
          <div className="mt-1 font-bold">CDL REFUSE/FAIL SUBMIT TEST</div>
        </div>

        {/* Multiple other violations */}
        <div className="bg-slate-50 border border-slate-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2015-06-18</div>
          <div>State: FL | ACD: S93</div>
          <div className="mt-1 font-bold">CLASS D - SPEEDING 31+ MPH OVER LIMIT: 120 MPH IN 65 ZONE</div>
          <div>ADJUDICATION WITHHELD BY JUDGE</div>
        </div>

        <div className="bg-slate-50 border border-slate-300 p-2 mb-3 text-[10px]">
          <div className="font-bold mb-1">Incident Date: 2016-07-20</div>
          <div>ACD: S15 | Points: 3</div>
          <div className="mt-1 font-bold">CLASS A - MISDEMEANOR - EXCEED 15 MPH</div>
        </div>
      </div>

      {/* DISQUALIFICATION */}
      <div className="border-t-2 border-slate-400 pt-4 mb-4">
        <div className="font-bold text-sm mb-3 text-center">DISQUALIFICATION</div>
        <div className="bg-red-100 border-2 border-red-500 p-3 text-[10px]">
          <div className="font-bold mb-2">Rpt Date: 2015-06-18 | End Date: 2016-06-18</div>
          <div>State Code: A90</div>
          <div className="font-bold text-red-700 mt-2">ADMINISTRATIVE SUSPENSION FOR REFUSE OR FAIL CDL</div>
          <div className="mt-2">Description: FIRST DUI CONVICTION BODILY INJURY LIABILITY/PROPERTY</div>
          <div className="mt-2 font-bold">MISC: DUI-REINSTATEMENT PERMITTED AFTER TREATMENT COMPLETED</div>
        </div>
      </div>

      {/* SUSPENSION */}
      <div className="border-t-2 border-slate-400 pt-4 mb-4">
        <div className="font-bold text-sm mb-3 text-center">SUSPENSION</div>
        <div className="space-y-2 text-[10px]">
          <div className="bg-red-50 border border-red-300 p-2">
            <div className="font-bold">Rpt Date: 2015-09-16</div>
            <div>ADMINISTRATIVE SUSPENSION FOR REFUSE OR FAIL CDL</div>
          </div>
          <div className="bg-red-50 border border-red-300 p-2">
            <div className="font-bold">Rpt Date: 2012-09-13</div>
            <div>DUI - REINSTATEMENT PERMITTED AFTER TREATMENT COMPLETED</div>
          </div>
        </div>
      </div>

      {/* REVOCATION */}
      <div className="border-t-2 border-slate-400 pt-4 mb-4">
        <div className="font-bold text-sm mb-3 text-center">REVOCATION</div>
        <div className="bg-red-100 border-2 border-red-500 p-3 text-[10px]">
          <div className="font-bold mb-2">Rpt Date: 2015-09-16</div>
          <div>State Code: A20 | ACD: A20 | County: HILLSBOROUGH</div>
          <div className="mt-2 font-bold text-red-700">DRIVING UNDER THE INFLUENCE</div>
          <div className="mt-2">MISC: REVOCATION AS A RESULT OF VIOLATION</div>
        </div>
      </div>

      {/* DISQUALIFICATION for CDL */}
      <div className="border-t-2 border-slate-400 pt-4">
        <div className="font-bold text-sm mb-3 text-center">DISQUALIFICATION</div>
        <div className="bg-red-100 border-2 border-red-500 p-3 text-[10px]">
          <div className="font-bold mb-2">Rpt Date: 2015-09-16 | End Date: 2016-06-18</div>
          <div>ACD: A90 | County: HILLSBOROUGH</div>
          <div className="mt-2 font-bold text-red-700">ADMINISTRATIVE DISQUALIFICATION REFUSE OR FAIL</div>
        </div>
      </div>
    </div>
  );
};

// PSP Report Component - Exact format from screenshot
const PSPReport = () => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 font-mono text-xs">
      <div className="text-right mb-4">
        <span className="bg-red-600 text-white px-3 py-1 font-bold">Sample Report</span>
      </div>
      <div className="text-center border-b-2 border-slate-400 pb-2 mb-4">
        <div className="text-lg font-bold">PSP Detailed Report</div>
        <div className="text-[10px]">Federal Motor Carrier Safety Administration</div>
      </div>

      {/* Driver Information Table */}
      <div className="mb-6">
        <div className="bg-slate-200 font-bold p-2 text-center text-sm">Driver Information</div>
        <table className="w-full border-collapse border border-slate-400 text-[10px]">
          <thead className="bg-slate-100">
            <tr>
              <th className="border border-slate-400 p-1 text-left">Last Name</th>
              <th className="border border-slate-400 p-1 text-left">First Name</th>
              <th className="border border-slate-400 p-1 text-left">License #</th>
              <th className="border border-slate-400 p-1 text-left">State</th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white">
              <td className="border border-slate-400 p-1">SMITH</td>
              <td className="border border-slate-400 p-1">JOHN</td>
              <td className="border border-slate-400 p-1">X1487849</td>
              <td className="border border-slate-400 p-1">VA</td>
            </tr>
            <tr className="bg-amber-50">
              <td className="border border-slate-400 p-1">SMITH</td>
              <td className="border border-slate-400 p-1">JOHN</td>
              <td className="border border-slate-400 p-1">123456789</td>
              <td className="border border-slate-400 p-1">NY</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Crash Activity */}
      <div className="mb-6">
        <div className="bg-amber-200 font-bold p-2 text-sm mb-2">Crash Activity (5 year history from MCMIS snapshot date)</div>
        
        {/* Crash Summary */}
        <div className="bg-amber-100 border border-amber-400 p-3 mb-3 text-[10px]">
          <div className="font-bold mb-2">Crash Summary (Crashes listed represent a driver's involvement in FMCSA-reportable crashes, without any determination as to responsibility.)</div>
          <div className="grid grid-cols-5 gap-2 text-center">
            <div className="bg-white p-2 border border-slate-300">
              <div className="font-bold text-xl text-red-600">5</div>
              <div className="text-[9px]"># of Crashes</div>
            </div>
            <div className="bg-white p-2 border border-slate-300">
              <div className="font-bold text-lg">1</div>
              <div className="text-[9px]"># of Crashes with Fatalities</div>
            </div>
            <div className="bg-white p-2 border border-slate-300">
              <div className="font-bold text-lg">3</div>
              <div className="text-[9px]"># of Crashes with Injuries</div>
            </div>
            <div className="bg-white p-2 border border-slate-300">
              <div className="font-bold text-lg">1</div>
              <div className="text-[9px]"># of Tow-aways</div>
            </div>
            <div className="bg-white p-2 border border-slate-300">
              <div className="font-bold text-lg">1</div>
              <div className="text-[9px]"># of Citations Issued</div>
            </div>
          </div>
        </div>

        {/* Crash Details Table */}
        <div className="overflow-x-auto">
          <div className="font-bold mb-1 text-[10px]">Crash Details (Crashes listed represent a driver's involvement in FMCSA-reportable crashes, without any determination as to responsibility.)</div>
          <table className="w-full border-collapse border border-slate-400 text-[9px]">
            <thead className="bg-slate-200">
              <tr>
                <th className="border border-slate-400 p-1">#</th>
                <th className="border border-slate-400 p-1">Date</th>
                <th className="border border-slate-400 p-1">DOT #</th>
                <th className="border border-slate-400 p-1">Carrier Name</th>
                <th className="border border-slate-400 p-1">Driver Name</th>
                <th className="border border-slate-400 p-1">Drive Lic</th>
                <th className="border border-slate-400 p-1">State</th>
                <th className="border border-slate-400 p-1">Driver DOB</th>
                <th className="border border-slate-400 p-1">Rpt St</th>
                <th className="border border-slate-400 p-1">Rpt Number</th>
                <th className="border border-slate-400 p-1">Location</th>
                <th className="border border-slate-400 p-1"># Fatalities</th>
                <th className="border border-slate-400 p-1"># Injuries</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-red-50">
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1">05/24/2013</td>
                <td className="border border-slate-400 p-1">188714</td>
                <td className="border border-slate-400 p-1">XYZ TRUCKS, INC</td>
                <td className="border border-slate-400 p-1">SMITH JOHN</td>
                <td className="border border-slate-400 p-1">123456789</td>
                <td className="border border-slate-400 p-1">NY</td>
                <td className="border border-slate-400 p-1">10/11/1984</td>
                <td className="border border-slate-400 p-1">VA</td>
                <td className="border border-slate-400 p-1">VA5203R763</td>
                <td className="border border-slate-400 p-1">I-95 SB RT 28</td>
                <td className="border border-slate-400 p-1 text-center font-bold text-red-600">1</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1 text-center">2</td>
                <td className="border border-slate-400 p-1">03/06/2013</td>
                <td className="border border-slate-400 p-1">188714</td>
                <td className="border border-slate-400 p-1">XYZ TRUCKS, INC</td>
                <td className="border border-slate-400 p-1">SMITH JOHN (co-driver)</td>
                <td className="border border-slate-400 p-1">123456789</td>
                <td className="border border-slate-400 p-1">NY</td>
                <td className="border border-slate-400 p-1">10/11/1984</td>
                <td className="border border-slate-400 p-1">CA</td>
                <td className="border border-slate-400 p-1">CA1162H3572</td>
                <td className="border border-slate-400 p-1">I-5/US 2 SB</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1 text-center">3</td>
                <td className="border border-slate-400 p-1">12/06/2012</td>
                <td className="border border-slate-400 p-1">475092</td>
                <td className="border border-slate-400 p-1">SMITH LOGISTICS</td>
                <td className="border border-slate-400 p-1">SMITH JOHN</td>
                <td className="border border-slate-400 p-1">X1487849</td>
                <td className="border border-slate-400 p-1">VA</td>
                <td className="border border-slate-400 p-1">10/11/1984</td>
                <td className="border border-slate-400 p-1">MT</td>
                <td className="border border-slate-400 p-1">MT4839273322</td>
                <td className="border border-slate-400 p-1">US 2 EB</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1 text-center">4</td>
                <td className="border border-slate-400 p-1">10/14/2013</td>
                <td className="border border-slate-400 p-1">345678</td>
                <td className="border border-slate-400 p-1">MIKE'S TRUCKS</td>
                <td className="border border-slate-400 p-1">SMITH JOHN</td>
                <td className="border border-slate-400 p-1">X1487849</td>
                <td className="border border-slate-400 p-1">VA</td>
                <td className="border border-slate-400 p-1">10/11/1984</td>
                <td className="border border-slate-400 p-1">NY</td>
                <td className="border border-slate-400 p-1">NY4374729121</td>
                <td className="border border-slate-400 p-1">I-87 NB</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1 text-center">5</td>
                <td className="border border-slate-400 p-1">02/07/2013</td>
                <td className="border border-slate-400 p-1">1534216</td>
                <td className="border border-slate-400 p-1">ROGER PARTNERS</td>
                <td className="border border-slate-400 p-1">SMITH JOHN</td>
                <td className="border border-slate-400 p-1">X1487849</td>
                <td className="border border-slate-400 p-1">VA</td>
                <td className="border border-slate-400 p-1">10/11/1984</td>
                <td className="border border-slate-400 p-1">NJ</td>
                <td className="border border-slate-400 p-1">NJ7856873437</td>
                <td className="border border-slate-400 p-1">I-95 SB</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Inspection Activity */}
      <div className="mb-6">
        <div className="bg-amber-200 font-bold p-2 text-sm mb-2">Inspection Activity (3 year history from MCMIS snapshot date)</div>
        
        {/* Inspection Summary */}
        <div className="grid grid-cols-3 gap-3 mb-4 text-[10px]">
          <div className="bg-white border border-slate-300 p-2">
            <div className="font-bold mb-1">Driver Summary</div>
            <div>Driver Inspections: 4</div>
            <div>Driver Out-of-service Inspections: 1</div>
            <div>Driver Out-of-service Rate: <span className="font-bold text-red-600">25%</span></div>
          </div>
          <div className="bg-white border border-slate-300 p-2">
            <div className="font-bold mb-1">Vehicle Summary</div>
            <div>Vehicle Inspections: 4</div>
            <div>Vehicle Out-of-service Inspections: 2</div>
            <div>Vehicle Out-of-service Rate: <span className="font-bold text-red-600">50%</span></div>
          </div>
          <div className="bg-white border border-slate-300 p-2">
            <div className="font-bold mb-1">Hazmat Summary</div>
            <div>Hazmat Inspections: 0</div>
            <div>Hazmat Out-of-service Inspections: 0</div>
            <div>Hazmat-Out-of-service Rate: 0%</div>
          </div>
        </div>

        {/* Inspection Details */}
        <div className="space-y-3 text-[9px]">
          <div className="font-bold text-[10px] mb-2">Inspection Details</div>
          
          {/* Inspection 1 */}
          <div className="border border-amber-400 p-2 bg-amber-50">
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="font-bold">Date</td>
                  <td>04/26/2012</td>
                  <td className="font-bold">DOT #</td>
                  <td>843574</td>
                  <td className="font-bold">Carrier Name</td>
                  <td>JONES HAULING</td>
                </tr>
                <tr>
                  <td className="font-bold">Driver Name</td>
                  <td colSpan="2">SMITH JOHN</td>
                  <td className="font-bold">Drive Lic</td>
                  <td>X1487849</td>
                  <td className="font-bold">State</td>
                  <td>VA</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-white p-2 border border-amber-500">
              <div className="font-bold">Vehicle Violation: 393.47(e)</div>
              <div>CLAMP/BOOT TYPE BRAKE(S) OUT OF ADJUSTMENT</div>
              <div className="text-amber-700 font-bold mt-1">NON-OOS</div>
            </div>
            <div className="mt-1">
              <span className="font-bold">Inspection Info:</span> Rpt St: LA • Rpt Number: 3457484373 • Hazmat: N • Insp Level: 1 • # of Level: 3
            </div>
          </div>

          {/* Inspection 2 - With OOS */}
          <div className="border-2 border-red-500 p-2 bg-red-50">
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="font-bold">Date</td>
                  <td>08/24/2012</td>
                  <td className="font-bold">DOT #</td>
                  <td>188714</td>
                  <td className="font-bold">Carrier Name</td>
                  <td>XYZ TRUCKS, INC</td>
                </tr>
                <tr>
                  <td className="font-bold">Driver Name</td>
                  <td colSpan="2">SMITH JOHN (co-driver)</td>
                  <td className="font-bold">Drive Lic</td>
                  <td>123456789</td>
                  <td className="font-bold">State</td>
                  <td>NY</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-white p-2 border-2 border-red-600">
              <div className="font-bold text-red-700">Vehicle Violation: 393.9(a)</div>
              <div>INOPERATIVE OR MISSING BRAKE</div>
              <div className="text-red-700 font-bold mt-1">⚠️ OOS - This violation does NOT apply to SMITH JOHN</div>
            </div>
          </div>

          {/* Inspection 3 */}
          <div className="border border-amber-400 p-2 bg-white">
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="font-bold">Date</td>
                  <td>01/22/2013</td>
                  <td className="font-bold">DOT #</td>
                  <td>345678</td>
                  <td className="font-bold">Carrier Name</td>
                  <td>MIKE'S TRUCKS</td>
                </tr>
                <tr>
                  <td className="font-bold">Driver Name</td>
                  <td colSpan="2">SMITH JOHN</td>
                  <td className="font-bold">Drive Lic</td>
                  <td>X1487849</td>
                  <td className="font-bold">State</td>
                  <td>VA</td>
                </tr>
              </tbody>
            </table>
            <div className="bg-amber-50 p-2 border border-amber-500">
              <div className="font-bold">Vehicle Violation: 396.3(a)(1)</div>
              <div>TIRES (GENERAL)</div>
              <div className="text-amber-700 font-bold mt-1">NON-OOS</div>
            </div>
          </div>

          {/* Inspection 4 - Multiple Violations */}
          <div className="border-2 border-red-500 p-2 bg-red-50">
            <table className="w-full mb-2">
              <tbody>
                <tr>
                  <td className="font-bold">Date</td>
                  <td>03/06/2013</td>
                  <td className="font-bold">DOT #</td>
                  <td>345678</td>
                  <td className="font-bold">Carrier Name</td>
                  <td>MIKE'S TRUCKS</td>
                </tr>
                <tr>
                  <td className="font-bold">Driver Name</td>
                  <td colSpan="2">SMITH JOHN</td>
                  <td className="font-bold">Drive Lic</td>
                  <td>X1487849</td>
                  <td className="font-bold">State</td>
                  <td>VA</td>
                </tr>
              </tbody>
            </table>
            <div className="space-y-2">
              <div className="bg-blue-100 p-2 border border-blue-400">
                <div className="font-bold">State Classified: 123.66</div>
                <div>State Citation Result: Convicted of different charge</div>
                <div className="text-blue-700 font-bold mt-1">NON-OOS</div>
              </div>
              <div className="bg-amber-50 p-2 border border-amber-500">
                <div className="font-bold">Vehicle Violation: 393.11(f)</div>
                <div>FAILURE TO PAY FINE</div>
                <div className="text-amber-700 font-bold mt-1">NON-OOS</div>
              </div>
              <div className="bg-white p-2 border-2 border-red-600">
                <div className="font-bold text-red-700">Vehicle Violation: 393.40</div>
                <div>INADEQUATE BRAKE SYSTEM ON A CMV</div>
                <div className="text-red-700 font-bold mt-1">⚠️ OOS</div>
              </div>
            </div>
          </div>
        </div>

        {/* Violation Summary Table */}
        <div className="mt-4">
          <div className="font-bold text-[10px] mb-2">Violation Summary</div>
          <table className="w-full border-collapse border border-slate-400 text-[9px]">
            <thead className="bg-slate-200">
              <tr>
                <th className="border border-slate-400 p-1 text-left">Violation #</th>
                <th className="border border-slate-400 p-1 text-left">Description</th>
                <th className="border border-slate-400 p-1 text-center"># of Violations</th>
                <th className="border border-slate-400 p-1 text-center"># of Out-of-service Violations</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1">393.47(e)</td>
                <td className="border border-slate-400 p-1">CLAMP/BOOT TYPE BRAKE(S) OUT OF ADJUSTMENT</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1">393.9(a)</td>
                <td className="border border-slate-400 p-1">INOPERATIVE OR MISSING BRAKE</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1 text-center font-bold text-red-600">1</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1">396.3(a)(1)</td>
                <td className="border border-slate-400 p-1">TIRES (GENERAL)</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1">393.11(f)</td>
                <td className="border border-slate-400 p-1">FAILURE TO PAY FINE</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1 text-center">0</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-slate-400 p-1">393.40</td>
                <td className="border border-slate-400 p-1">INADEQUATE BRAKE SYSTEM ON A CMV</td>
                <td className="border border-slate-400 p-1 text-center">1</td>
                <td className="border border-slate-400 p-1 text-center font-bold text-red-600">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-[9px] text-slate-600 border-t pt-2">
        The summary counts and listed only include violations that were attributable to SMITH JOHN.
      </div>
    </div>
  );
};

// Drug Test Report Component - Exact format from screenshot
const DrugTestReport = () => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 font-sans text-xs">
      <div className="text-center border-b-2 border-slate-400 pb-3 mb-4">
        <div className="text-2xl font-bold">DOT DRUG TEST</div>
        <div className="float-right border-2 border-slate-400 px-3 py-1 font-bold">Test Results</div>
        <div className="clear-both"></div>
      </div>

      {/* Test Information Grid */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 mb-6 text-[11px]">
        <div>
          <span className="font-bold">Date Results Transmitted:</span> 2014-12-24 11:33 AM
        </div>
        <div>
          <span className="font-bold">Reason for Test:</span> PRE-EMPLOYMENT
        </div>
        <div>
          <span className="font-bold">Transmitted By:</span> DRN
        </div>
        <div>
          <span className="font-bold">Date Specimen Collected:</span> 2014-12-18
        </div>
        <div>
          <span className="font-bold">Participant/Donor:</span> E. FUDD
        </div>
        <div>
          <span className="font-bold">Laboratory:</span> Quest Diagnostics
        </div>
        <div>
          <span className="font-bold">SSN/EID:</span> xxx-xx-1111
        </div>
        <div>
          <span className="font-bold">Collection Site:</span> COLLECTION PLUS
        </div>
        <div>
          <span className="font-bold">CCF/Specimen ID:</span> 888888
        </div>
        <div>
          <span className="font-bold">Collection Site Phone:</span> 9164873033
        </div>
        <div>
          <span className="font-bold">Specimen Type:</span> URINE
        </div>
        <div>
          <span className="font-bold">Program:</span> DOT
        </div>
        <div>
          <span className="font-bold">Company:</span> MVRCheck
        </div>
        <div>
          <span className="font-bold">Agency:</span> FMCSA
        </div>
        <div>
          <span className="font-bold">Location:</span> MVRCheck
        </div>
        <div>
          <span className="font-bold">Date MRO Received CCF Copy 2:</span> 2014-12-24
        </div>
        <div>
          <span className="font-bold">Lab Account Number:</span> 11111222
        </div>
        <div>
          <span className="font-bold">Date Test Verified by MRO:</span> 2014-12-24
        </div>
      </div>

      {/* Test Results Table */}
      <div className="border-2 border-slate-400 mb-6">
        <div className="bg-slate-100 p-2 text-center font-bold text-sm border-b-2 border-slate-400">
          Test Results
        </div>
        <div className="p-3">
          <div className="text-center font-bold mb-3">Panel - DOT DRUG PANEL W/TS 45304N</div>
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="border-b-2 border-slate-400">
                <th className="text-left py-2 font-bold">Drug</th>
                <th className="text-left py-2 font-bold">Results</th>
                <th className="text-right py-2 font-bold">Screen</th>
                <th className="text-right py-2 font-bold">Confirm</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="py-2">Amphetamines</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">500</td>
                <td className="py-2 text-right">250</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2">Cocaine</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">150</td>
                <td className="py-2 text-right">100</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2">Marijuana</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">50</td>
                <td className="py-2 text-right">15</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2">MDA-Analogues</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">500</td>
                <td className="py-2 text-right">250</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="py-2">Opiates</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">2000</td>
                <td className="py-2 text-right">2000</td>
              </tr>
              <tr>
                <td className="py-2">Phencyclidine (PCP)</td>
                <td className="py-2 font-bold">NEGATIVE</td>
                <td className="py-2 text-right">25</td>
                <td className="py-2 text-right">25</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Determination */}
      <div className="border-2 border-slate-400 mb-6">
        <div className="bg-slate-100 p-3 text-center text-lg font-bold">
          MY DETERMINATION/VERIFICATION IS: <span className="text-emerald-600">NEGATIVE</span>
        </div>
      </div>

      {/* MRO Signature */}
      <div className="mb-6 text-[11px]">
        <div className="font-bold mb-2">Certified Medical Review Officer</div>
        <div className="border-b-2 border-slate-400 pb-1 mb-2">
          <span className="font-bold">Signature</span>
          <span className="ml-4 font-cursive text-2xl italic">J. Pabla, MD</span>
        </div>
      </div>

      {/* Confidentiality Notice */}
      <div className="text-[9px] text-slate-600 border-t pt-3 leading-tight">
        The information contained in this message is CONFIDENTIAL and is for the intended addressee only. Any unauthorized use, dissemination of the information, 
        or copying of this message is prohibited. If you believe you have received this message in error, please contact our Client Services Department at 
        mro@thescreen.com and delete this message without copying or disclosing it.
      </div>
    </div>
  );
};

// CDLIS Report Component - Exact format from screenshot
const CDLISReport = () => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 font-mono text-[10px]">
      <div className="text-center border mb-4 p-2">
        <div className="font-bold mb-1">Sample</div>
        <div className="text-sm font-bold">CDLIS SYSTEM REPORT</div>
        <div className="text-[9px] mt-1">REPORT SEARCH DATE &gt;&gt; 01/12/2006</div>
      </div>

      {/* Header Info */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <div className="font-bold underline mb-2">LICENSE NAME/ADDRESS</div>
          <div className="pl-2">
            <div className="font-bold">DOE, JOHN</div>
          </div>
        </div>
        <div>
          <div className="font-bold underline mb-2">DRIVER DESCRIPTION</div>
          <div className="pl-2">
            <div>D.O.B. |SEX| HGT |RACE|  SOC.SEC</div>
            <div className="border-t border-slate-400 mt-1 pt-1">11/25/XX| M  |509" |     |XXX-XX-XXX</div>
          </div>
        </div>
      </div>

      {/* Report Prepared For */}
      <div className="border-t-2 border-slate-400 pt-3 mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="font-bold underline mb-2">REPORT PREPARED FOR</div>
            <div className="pl-2">
              <div>XXXXXXX CHECK</div>
              <div>XXX E BIG BEAVER ROAD, SUITE 300</div>
              <div>TROY,MI LXLXLL</div>
            </div>
          </div>
          <div>
            <div className="font-bold underline mb-2">COMMENT:</div>
            <div className="pl-2">
              <div>POLICY #: LXLXLXLXLX</div>
              <div>REQUESTOR: CLCLCLCLCLC</div>
              <div>CHARGED TO ACCOUNT XXX/XXXX</div>
            </div>
          </div>
        </div>
      </div>

      {/* Miscellaneous */}
      <div className="border-t-2 border-slate-400 pt-3 mb-4">
        <div className="text-center font-bold mb-2">MISCELLANEOUS AND STATE SPECIFIC INFORMATION</div>
        <div className="text-center">None</div>
      </div>

      {/* CDLIS Record History */}
      <div className="border-t-2 border-slate-400 pt-3">
        <div className="text-center font-bold mb-3 border-b border-slate-400 pb-2">CDLIS RECORD HISTORY</div>

        {/* Record 1 */}
        <div className="mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold align-top w-20">TYPE</td>
                <td className="align-top w-32">DESCRIPTION</td>
              </tr>
              <tr>
                <td className="align-top">CDLI</td>
                <td className="align-top"></td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-2">
                  <div className="pl-4">
                    <div>License Information</div>
                    <div className="pl-4">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXXX</div>
                      <div>License SSN.........: XXXXXX</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Record 2 */}
        <div className="mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold align-top w-20">CDLI</td>
                <td className="align-top"></td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-2">
                  <div className="pl-4">
                    <div>License Information</div>
                    <div className="pl-4">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXX</div>
                      <div>License SSN.........: XXXXXX</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Record 3 */}
        <div className="mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold align-top w-20">CDLI</td>
                <td className="align-top"></td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-2">
                  <div className="pl-4">
                    <div>License Information</div>
                    <div className="pl-4">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXXXX</div>
                      <div>License SSN.........: XXXX</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Record 4 - Primary CDL */}
        <div className="mb-4">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="font-bold align-top w-20">CDLI</td>
                <td className="align-top"></td>
              </tr>
              <tr>
                <td colSpan="2" className="pt-2">
                  <div className="pl-4">
                    <div>License Information</div>
                    <div className="pl-4">
                      <div className="font-bold">License Type........: F - Primary CDL</div>
                      <div className="font-bold">License State.......: TN</div>
                      <div>License Number......: XXXXXX</div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="text-center font-bold mt-6 border-t-2 border-slate-400 pt-3">
          ******END OF RECORD*****
        </div>
      </div>
    </div>
  );
};

// Test Results Component
const TestResults = ({ selectedChecks, formData }) => {
  return (
    <div className="space-y-6">
      {/* MVR Results */}
      {selectedChecks.mvr && (
        <MVRReport formData={formData} />
      )}

      {/* PSP Results */}
      {selectedChecks.psp && (
        <PSPReport />
      )}

      {/* Drug Test Results */}
      {selectedChecks.drugTest && (
        <DrugTestReport />
      )}

      {/* CDLIS Results */}
      {selectedChecks.cdlis && (
        <CDLISReport />
      )}

      {/* Overall Warning - Only show if using test data */}
      <div className="p-6 rounded-2xl bg-red-600 text-white">
        <div className="text-center">
          <div className="text-5xl mb-4">❌</div>
          <h3 className="text-3xl font-bold mb-3">CRITICAL FAILURE - DO NOT HIRE</h3>
          <div className="text-lg space-y-2">
            <p>This candidate presents <span className="font-bold underline">SEVERE SAFETY RISKS</span> across multiple verification points:</p>
            <ul className="text-left max-w-3xl mx-auto mt-4 space-y-2">
              {selectedChecks.mvr && <li>✗ <strong>MVR:</strong> Multiple DUI violations (BAC 0.311), license suspensions/revocations, fatal accident</li>}
              {selectedChecks.psp && <li>✗ <strong>PSP:</strong> 5 crashes (1 fatal), 25% driver OOS rate, 50% vehicle OOS rate, brake system failures</li>}
              {selectedChecks.drugTest && <li>✗ <strong>Drug Test:</strong> NEGATIVE result cleared for hiring</li>}
              {selectedChecks.cdlis && <li>✗ <strong>CDLIS:</strong> Claimed Florida CDL does not exist, Tennessee CDL revoked, 3-year employment gap with no valid license</li>}
            </ul>
            <div className="mt-6 pt-4 border-t border-white/30">
              <p className="text-xl font-bold">Manual screening would have missed these critical issues.</p>
              <p className="text-lg">Our automated system detected all red flags in 24-48 hours.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => window.print()}
          className="flex-1 py-4 rounded-xl border-2 border-slate-300 text-slate-700 font-bold text-lg hover:bg-slate-50 transition-colors"
        >
          📄 Print All Reports
        </button>
        <button
          onClick={() => window.location.reload()}
          className="flex-1 py-4 rounded-xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-colors"
        >
          🔍 Check Another Driver
        </button>
      </div>
    </div>
  );
};

// Legacy placeholder in case we need to keep old structure
const OldTestResults = ({ selectedChecks, formData }) => {
  return (
    <div className="space-y-6 hidden">
      {/* MVR Results */}
      {selectedChecks.mvr && (
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-300">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🚗</span> MVR Screening Report
          </h3>
          
          {/* Driver Info */}
          <div className="mb-4 p-4 bg-white rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-slate-700">License Name:</span>
                <div className="font-mono">{formData.driverName}</div>
              </div>
              <div>
                <span className="font-semibold text-slate-700">D.O.B:</span>
                <div className="font-mono">03/15/1984 | M | 509" | XXX-XX-XXX</div>
              </div>
              <div>
                <span className="font-semibold text-slate-700">License Number:</span>
                <div className="font-mono">{formData.dlNumber}</div>
              </div>
              <div>
                <span className="font-semibold text-slate-700">License State:</span>
                <div className="font-mono">{formData.state}</div>
              </div>
            </div>
          </div>

          {/* License History */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">License History</h4>
            <div className="space-y-2">
              <div className="p-3 bg-white rounded-lg border-l-4 border-red-500">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold text-slate-900">License Type: A - AKA</div>
                    <div className="text-sm text-slate-600">License State: CA • License Number: XXXX</div>
                  </div>
                  <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-semibold">SUSPENDED</span>
                </div>
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <div className="font-semibold text-slate-900">License Type: A - AKA</div>
                <div className="text-sm text-slate-600">License State: CA • License Number: XXX</div>
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <div className="font-semibold text-slate-900">License Type: A - AKA</div>
                <div className="text-sm text-slate-600">License State: CA • License Number: XXXXX</div>
              </div>
              
              <div className="p-3 bg-white rounded-lg">
                <div className="font-semibold text-slate-900">License Type: F - Primary CDL</div>
                <div className="text-sm text-slate-600">License State: TN • License Number: XXXXXX</div>
              </div>
            </div>
          </div>

          {/* Violations Summary */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Violations Summary</h4>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-lg text-center border-2 border-red-300">
                <div className="text-3xl font-bold text-red-600">12</div>
                <div className="text-sm text-slate-600 mt-1">Total Violations</div>
              </div>
              <div className="p-3 bg-white rounded-lg text-center border-2 border-red-300">
                <div className="text-3xl font-bold text-red-600">5</div>
                <div className="text-sm text-slate-600 mt-1">DUI/Alcohol</div>
              </div>
              <div className="p-3 bg-white rounded-lg text-center border-2 border-amber-300">
                <div className="text-3xl font-bold text-amber-600">8</div>
                <div className="text-sm text-slate-600 mt-1">Accidents</div>
              </div>
            </div>
          </div>

          {/* Detailed Violations */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Violation Details</h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-red-900">BLOOD ALCOHOL LEVEL: 0.311</span>
                  <span className="text-red-700">2014-09-13</span>
                </div>
                <div className="text-red-800">ADJUDICATION WITHHELD BY JUDGE • State Code: A47 • ACD: A90</div>
                <div className="text-red-700 font-semibold mt-1">REVOCATION AS A RESULT OF VIOLATION</div>
              </div>

              <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-red-900">DUI - UNLAWFUL BLOOD ALCOHOL</span>
                  <span className="text-red-700">2015-09-16</span>
                </div>
                <div className="text-red-800">State: TN • Court: HILLSBOROUGH • State Code: A08</div>
                <div className="text-red-700 font-semibold mt-1">DRIVING UNDER THE INFLUENCE</div>
              </div>

              <div className="p-3 bg-red-100 rounded-lg border-l-4 border-red-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-red-900">FELONY CONVICTION - DUI INJURY LIABILITY/PROPERTY</span>
                  <span className="text-red-700">2014-03-02</span>
                </div>
                <div className="text-red-800">State: FL • Court: HILLSBOROUGH</div>
              </div>

              <div className="p-3 bg-amber-100 rounded-lg border-l-4 border-amber-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-amber-900">SPEEDING: 187 MPH IN 65 MPH ZONE</span>
                  <span className="text-amber-700">2015-06-18</span>
                </div>
                <div className="text-amber-800">ADJUDICATION WITHHELD BY JUDGE • ACD: S93</div>
              </div>

              <div className="p-3 bg-amber-100 rounded-lg border-l-4 border-amber-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-amber-900">DRIVING UNDER THE INFLUENCE</span>
                  <span className="text-amber-700">2014-08-14</span>
                </div>
                <div className="text-amber-800">State: FL • ACD: A20</div>
              </div>

              <div className="p-3 bg-amber-100 rounded-lg border-l-4 border-amber-600">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-amber-900">DISREGARDING TRAFFIC CONTROL DEVICE</span>
                  <span className="text-amber-700">2014-05-16</span>
                </div>
                <div className="text-amber-800">State: TN • State Code: 946</div>
              </div>
            </div>
          </div>

          {/* Suspensions */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Suspensions</h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-red-900">ADMINISTRATIVE SUSPENSION FOR REFUSE OR FAIL CDL</span>
                  <span className="text-red-700">2015-09-16</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <div className="flex justify-between">
                  <span className="font-bold text-red-900">DUI-REINSTATEMENT PERMITTED AFTER TREATMENT COMPLETED</span>
                  <span className="text-red-700">2012-09-13</span>
                </div>
              </div>
            </div>
          </div>

          {/* Accidents */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Accident History</h4>
            <div className="space-y-2 text-sm">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-900">SINGLE VEHICLE • 1 FATALITY</span>
                  <span className="text-slate-600">2014-03-02</span>
                </div>
                <div className="text-amber-700 font-semibold">DRIVER AT FAULT - DUI Related</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-slate-900">REAR-END COLLISION</span>
                  <span className="text-slate-600">2015-02-10</span>
                </div>
                <div className="text-amber-700">Property damage only</div>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-300">
                <div className="flex justify-between">
                  <span className="font-bold text-slate-900">MULTI-VEHICLE COLLISION • 2 INJURIES</span>
                  <span className="text-slate-600">2014-11-20</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 p-4 bg-red-100 rounded-lg border-2 border-red-400">
            <p className="text-base text-red-700 font-bold">
              ❌ CRITICAL FAILURE: Multiple DUI violations, suspended license, fatal accident, extreme speeding (187 MPH). 
              Driver poses SEVERE SAFETY RISK. DO NOT HIRE under any circumstances.
            </p>
          </div>
        </div>
      )}

      {/* PSP Results */}
      {selectedChecks.psp && (
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-300">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">📋</span> PSP Detailed Report
          </h3>
          <div className="text-right mb-4">
            <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">Sample Report</span>
          </div>

          {/* Driver Information */}
          <div className="mb-6 p-4 bg-white rounded-lg border-2 border-slate-300">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">Driver Information</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left p-2 font-bold border">Last Name</th>
                    <th className="text-left p-2 font-bold border">First Name</th>
                    <th className="text-left p-2 font-bold border">License #</th>
                    <th className="text-left p-2 font-bold border">State</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="p-2 border">SMITH</td>
                    <td className="p-2 border">JOHN</td>
                    <td className="p-2 border">X1487849</td>
                    <td className="p-2 border">VA</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="p-2 border">SMITH</td>
                    <td className="p-2 border">JOHN</td>
                    <td className="p-2 border">123456789</td>
                    <td className="p-2 border">NY</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Crash Activity Summary */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3 text-lg bg-amber-100 p-2 rounded">
              Crash Activity (5 year history from MCMIS snapshot date)
            </h4>
            <div className="mb-4 p-3 bg-amber-50 rounded border border-amber-300">
              <div className="font-bold text-amber-900 mb-2">Crash Summary (Crashes listed represent a driver's involvement in FMCSA-reportable crashes, without any determination as to responsibility.)</div>
              <div className="grid grid-cols-5 gap-2 text-sm">
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-2xl text-red-600">5</div>
                  <div className="text-xs">Total Crashes</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-xl">1</div>
                  <div className="text-xs">Crashes with Fatalities</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-xl">3</div>
                  <div className="text-xs">Crashes with Injuries</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-xl">1</div>
                  <div className="text-xs">Total Tow-aways</div>
                </div>
                <div className="bg-white p-2 rounded text-center">
                  <div className="font-bold text-xl">1</div>
                  <div className="text-xs">Citations Issued</div>
                </div>
              </div>
            </div>

            {/* Crash Details */}
            <div className="space-y-3">
              <h5 className="font-bold text-slate-900">Crash Details (Crashes listed represent a driver's involvement in FMCSA-reportable crashes, without any determination as to responsibility.)</h5>
              
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse">
                  <thead className="bg-slate-200">
                    <tr>
                      <th className="border p-1">#</th>
                      <th className="border p-1">Date</th>
                      <th className="border p-1">DOT #</th>
                      <th className="border p-1">Carrier Name</th>
                      <th className="border p-1">Driver Name</th>
                      <th className="border p-1">Drive Lic</th>
                      <th className="border p-1">State</th>
                      <th className="border p-1">Driver DOB</th>
                      <th className="border p-1">Rpt St</th>
                      <th className="border p-1">Rpt Number</th>
                      <th className="border p-1">Location</th>
                      <th className="border p-1"># Fatalities</th>
                      <th className="border p-1"># Injuries</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr className="bg-red-50 hover:bg-red-100">
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1">05/24/2013</td>
                      <td className="border p-1">188714</td>
                      <td className="border p-1">XYZ TRUCKS, INC</td>
                      <td className="border p-1">SMITH JOHN</td>
                      <td className="border p-1">123456789</td>
                      <td className="border p-1">NY</td>
                      <td className="border p-1">10/11/1984</td>
                      <td className="border p-1">VA</td>
                      <td className="border p-1">VA5203R763</td>
                      <td className="border p-1">I-95 SB RT 28</td>
                      <td className="border p-1 text-center font-bold text-red-600">1</td>
                      <td className="border p-1 text-center">1</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border p-1 text-center">2</td>
                      <td className="border p-1">03/06/2013</td>
                      <td className="border p-1">188714</td>
                      <td className="border p-1">XYZ TRUCKS, INC</td>
                      <td className="border p-1">SMITH JOHN (co-driver)</td>
                      <td className="border p-1">123456789</td>
                      <td className="border p-1">NY</td>
                      <td className="border p-1">10/11/1984</td>
                      <td className="border p-1">CA</td>
                      <td className="border p-1">CA1162H3572</td>
                      <td className="border p-1">I-5/US 2 SB</td>
                      <td className="border p-1 text-center">0</td>
                      <td className="border p-1 text-center">1</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border p-1 text-center">3</td>
                      <td className="border p-1">12/06/2012</td>
                      <td className="border p-1">475092</td>
                      <td className="border p-1">SMITH LOGISTICS</td>
                      <td className="border p-1">SMITH JOHN</td>
                      <td className="border p-1">X1487849</td>
                      <td className="border p-1">VA</td>
                      <td className="border p-1">10/11/1984</td>
                      <td className="border p-1">MT</td>
                      <td className="border p-1">MT4839273322</td>
                      <td className="border p-1">US 2 EB</td>
                      <td className="border p-1 text-center">0</td>
                      <td className="border p-1 text-center">0</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border p-1 text-center">4</td>
                      <td className="border p-1">10/14/2013</td>
                      <td className="border p-1">345678</td>
                      <td className="border p-1">MIKE'S TRUCKS</td>
                      <td className="border p-1">SMITH JOHN</td>
                      <td className="border p-1">X1487849</td>
                      <td className="border p-1">VA</td>
                      <td className="border p-1">10/11/1984</td>
                      <td className="border p-1">NY</td>
                      <td className="border p-1">NY4374729121</td>
                      <td className="border p-1">I-87 NB</td>
                      <td className="border p-1 text-center">0</td>
                      <td className="border p-1 text-center">1</td>
                    </tr>
                    <tr className="hover:bg-slate-50">
                      <td className="border p-1 text-center">5</td>
                      <td className="border p-1">02/07/2013</td>
                      <td className="border p-1">1534216</td>
                      <td className="border p-1">ROGER PARTNERS</td>
                      <td className="border p-1">SMITH JOHN</td>
                      <td className="border p-1">X1487849</td>
                      <td className="border p-1">VA</td>
                      <td className="border p-1">10/11/1984</td>
                      <td className="border p-1">NJ</td>
                      <td className="border p-1">NJ7856873437</td>
                      <td className="border p-1">I-95 SB</td>
                      <td className="border p-1 text-center">0</td>
                      <td className="border p-1 text-center">0</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Inspection Activity */}
          <div className="mb-6">
            <h4 className="font-bold text-slate-900 mb-3 text-lg bg-amber-100 p-2 rounded">
              Inspection Activity (3 year history from MCMIS snapshot date)
            </h4>
            
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white p-3 rounded border border-slate-300">
                <div className="font-bold text-slate-700 mb-2">Driver Summary</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Driver Inspections:</span>
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out-of-service:</span>
                    <span className="font-bold text-red-600">1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out-of-service Rate:</span>
                    <span className="font-bold text-red-600">25%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-300">
                <div className="font-bold text-slate-700 mb-2">Vehicle Summary</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Vehicle Inspections:</span>
                    <span className="font-bold">4</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out-of-service:</span>
                    <span className="font-bold text-red-600">2</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out-of-service Rate:</span>
                    <span className="font-bold text-red-600">50%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-3 rounded border border-slate-300">
                <div className="font-bold text-slate-700 mb-2">Hazmat Summary</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Hazmat Inspections:</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Out-of-service:</span>
                    <span className="font-bold">0</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate:</span>
                    <span className="font-bold">0%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Inspection Details */}
            <h5 className="font-bold text-slate-900 mb-2">Inspection Details</h5>
            <div className="space-y-3">
              <div className="bg-white border-2 border-amber-400 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-2">
                  <div><span className="font-bold">Date:</span> 04/26/2012</div>
                  <div><span className="font-bold">DOT #:</span> 843574</div>
                  <div><span className="font-bold">Carrier:</span> JONES HAULING</div>
                  <div><span className="font-bold">Driver:</span> SMITH JOHN</div>
                  <div><span className="font-bold">License:</span> X1487849</div>
                  <div><span className="font-bold">State:</span> VA</div>
                </div>
                <div className="bg-amber-50 p-2 rounded mb-2">
                  <div className="font-bold text-amber-900">Vehicle Violation: 393.47(e)</div>
                  <div className="text-sm">CLAMP/BOOT TYPE BRAKE(S) OUT OF ADJUSTMENT</div>
                  <div className="text-xs text-red-600 font-semibold">NON-OOS</div>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">Inspection Info:</span> Rpt St: LA • Rpt Number: 3457484373 • Hazmat: N • Insp Level: 1 • # of Level: 3
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-2">
                  <div><span className="font-bold">Date:</span> 08/24/2012</div>
                  <div><span className="font-bold">DOT #:</span> 188714</div>
                  <div><span className="font-bold">Carrier:</span> XYZ TRUCKS, INC</div>
                  <div><span className="font-bold">Driver:</span> SMITH JOHN (co-driver)</div>
                  <div><span className="font-bold">License:</span> 123456789</div>
                  <div><span className="font-bold">State:</span> NY</div>
                </div>
                <div className="bg-red-100 p-2 rounded mb-2">
                  <div className="font-bold text-red-900">Vehicle Violation: 393.9(a)</div>
                  <div className="text-sm">INOPERATIVE OR MISSING BRAKE</div>
                  <div className="text-xs text-red-700 font-bold">⚠️ OOS - This violation does NOT apply to SMITH JOHN</div>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">Inspection Info:</span> Rpt St: CA • Rpt Number: 3611900490 • Hazmat: N • Insp Level: 1 • # of Level: 1
                </div>
              </div>

              <div className="bg-white border-2 border-amber-400 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-2">
                  <div><span className="font-bold">Date:</span> 01/22/2013</div>
                  <div><span className="font-bold">DOT #:</span> 345678</div>
                  <div><span className="font-bold">Carrier:</span> MIKE'S TRUCKS</div>
                  <div><span className="font-bold">Driver:</span> SMITH JOHN</div>
                  <div><span className="font-bold">License:</span> X1487849</div>
                  <div><span className="font-bold">State:</span> VA</div>
                </div>
                <div className="bg-amber-50 p-2 rounded mb-2">
                  <div className="font-bold text-amber-900">Vehicle Violation: 396.3(a)(1)</div>
                  <div className="text-sm">TIRES (GENERAL)</div>
                  <div className="text-xs text-red-600 font-semibold">NON-OOS</div>
                </div>
                <div className="text-xs text-slate-600">
                  <span className="font-bold">Inspection Info:</span> Rpt St: IA • Rpt Number: 4032074943 • Hazmat: N • Insp Level: 1 • # of Level: 1
                </div>
              </div>

              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs mb-2">
                  <div><span className="font-bold">Date:</span> 03/06/2013</div>
                  <div><span className="font-bold">DOT #:</span> 345678</div>
                  <div><span className="font-bold">Carrier:</span> MIKE'S TRUCKS</div>
                  <div><span className="font-bold">Driver:</span> SMITH JOHN</div>
                  <div><span className="font-bold">License:</span> X1487849</div>
                  <div><span className="font-bold">State:</span> VA</div>
                </div>
                <div className="bg-blue-100 p-2 rounded mb-2">
                  <div className="font-bold text-blue-900">State Classified: 123.66</div>
                  <div className="text-sm">State Citation Result: Convicted of different charge</div>
                  <div className="text-xs text-blue-700 font-bold">NON-OOS</div>
                </div>
                <div className="bg-red-100 p-2 rounded mb-2">
                  <div className="font-bold text-red-900">Vehicle Violation: 393.11(f)</div>
                  <div className="text-sm">FAILURE TO PAY FINE</div>
                  <div className="text-xs text-red-700 font-bold">NON-OOS</div>
                </div>
                <div className="bg-red-100 p-2 rounded">
                  <div className="font-bold text-red-900">Vehicle Violation: 393.40</div>
                  <div className="text-sm">INADEQUATE BRAKE SYSTEM ON A CMV</div>
                  <div className="text-xs text-red-700 font-bold">⚠️ OOS</div>
                </div>
                <div className="text-xs text-slate-600 mt-2">
                  <span className="font-bold">Inspection Info:</span> Rpt St: WA • Rpt Number: 8383664809 • Hazmat: N • Insp Level: 3 • # of Level: 3
                </div>
              </div>
            </div>

            {/* Violation Summary */}
            <div className="mt-4 bg-white border border-slate-300 rounded-lg p-3">
              <h5 className="font-bold text-slate-900 mb-2">Violation Summary</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="border p-1 text-left">Violation #</th>
                      <th className="border p-1 text-left">Description</th>
                      <th className="border p-1 text-center"># of Violations</th>
                      <th className="border p-1 text-center"># of Out-of-service Violations</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="border p-1">393.47(e)</td>
                      <td className="border p-1">CLAMP/BOOT TYPE BRAKE(S) OUT OF ADJUSTMENT</td>
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1 text-center">0</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="border p-1">393.9(a)</td>
                      <td className="border p-1">INOPERATIVE OR MISSING BRAKE</td>
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1 text-center font-bold text-red-600">1</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="border p-1">396.3(a)(1)</td>
                      <td className="border p-1">TIRES (GENERAL)</td>
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1 text-center">0</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="border p-1">393.11(f)</td>
                      <td className="border p-1">FAILURE TO PAY FINE</td>
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1 text-center">0</td>
                    </tr>
                    <tr className="bg-white hover:bg-slate-50">
                      <td className="border p-1">393.40</td>
                      <td className="border p-1">INADEQUATE BRAKE SYSTEM ON A CMV</td>
                      <td className="border p-1 text-center">1</td>
                      <td className="border p-1 text-center font-bold text-red-600">1</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded mb-4">
            The summary counts and listed only include violations that were attributable to SMITH JOHN.
          </div>

          <div className="p-4 bg-red-100 rounded-lg border-2 border-red-400">
            <p className="text-base text-red-700 font-bold">
              ⚠️ CRITICAL SAFETY CONCERNS: 5 crashes in 5 years (including 1 FATAL), 25% driver out-of-service rate, 50% vehicle out-of-service rate. 
              Multiple brake system violations. Pattern indicates SEVERE safety risk and poor vehicle maintenance practices.
            </p>
          </div>
        </div>
      )}

      {/* CDLIS Results */}
      {selectedChecks.cdlis && (
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-300">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">🆔</span> CDLIS System Report
          </h3>
          
          {/* Report Header */}
          <div className="mb-4 p-4 bg-slate-100 rounded-lg border-2 border-slate-300 text-center">
            <div className="text-sm font-bold text-slate-600 mb-1">Sample</div>
            <div className="text-lg font-bold text-slate-900">CDLIS SYSTEM REPORT</div>
            <div className="text-xs text-slate-600 mt-1">REPORT SEARCH DATE &gt;&gt; 01/12/2006</div>
          </div>

          {/* License Information */}
          <div className="mb-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-slate-300">
                <h4 className="font-bold text-slate-900 mb-3">LICENSE NAME/ADDRESS</h4>
                <div className="space-y-2 text-sm">
                  <div className="font-mono font-bold">DOE, JOHN</div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-slate-300">
                <h4 className="font-bold text-slate-900 mb-3">DRIVER DESCRIPTION</h4>
                <div className="space-y-1 text-xs font-mono">
                  <div>D.O.B. |SEX| HGT |RACE| SOC.SEC</div>
                  <div className="border-t pt-1">11/25/XX| M |509" | |XXX-XX-XXX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Prepared For */}
          <div className="mb-4 bg-white p-4 rounded-lg border border-slate-300">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">REPORT PREPARED FOR</h4>
                <div className="text-sm font-mono">
                  <div>XXXXXXX CHECK</div>
                  <div>XXX E BIG BEAVER ROAD, SUITE 300</div>
                  <div>TROY,MI LXLXLL</div>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-2">COMMENT:</h4>
                <div className="text-xs">
                  <div>POLICY #: LXLXLXLXLX</div>
                  <div>REQUESTOR: CLCLCLCLCLC</div>
                  <div className="text-red-600 font-bold">CHARGED TO ACCOUNT XXX/XXXX</div>
                </div>
              </div>
            </div>
          </div>

          {/* Miscellaneous and State Specific Information */}
          <div className="mb-4 bg-white p-4 rounded-lg border border-slate-300">
            <h4 className="font-bold text-slate-900 mb-2 text-center">MISCELLANEOUS AND STATE SPECIFIC INFORMATION</h4>
            <div className="text-center text-sm">None</div>
          </div>

          {/* CDLIS Record History */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-center border-b-2 border-slate-300 pb-2">CDLIS RECORD HISTORY</h4>
            
            <div className="space-y-4">
              {/* Record 1 */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-900">TYPE: </span>
                    <span className="text-slate-700">CDLI</span>
                  </div>
                  <span className="bg-amber-200 px-3 py-1 rounded text-xs font-bold">LICENSE #1</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div>
                    <span className="font-bold">License Information</span>
                    <div className="pl-4 mt-1 space-y-1 text-xs">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXXX</div>
                      <div>License SSN.........: XXXXXX</div>
                    </div>
                  </div>
                  <div>
                    <span className="font-bold">DESCRIPTION</span>
                    <div className="pl-4 mt-1 space-y-1 text-xs"></div>
                  </div>
                </div>
              </div>

              {/* Record 2 */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-900">TYPE: </span>
                    <span className="text-slate-700">CDLI</span>
                  </div>
                  <span className="bg-amber-200 px-3 py-1 rounded text-xs font-bold">LICENSE #2</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div>
                    <span className="font-bold">License Information</span>
                    <div className="pl-4 mt-1 space-y-1 text-xs">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXX</div>
                      <div>License SSN.........: XXXXXX</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Record 3 */}
              <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-900">TYPE: </span>
                    <span className="text-slate-700">CDLI</span>
                  </div>
                  <span className="bg-amber-200 px-3 py-1 rounded text-xs font-bold">LICENSE #3</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div>
                    <span className="font-bold">License Information</span>
                    <div className="pl-4 mt-1 space-y-1 text-xs">
                      <div>License Type........: A - AKA</div>
                      <div>License State.......: CA</div>
                      <div>License Number......: XXXXX</div>
                      <div>License SSN.........: XXXX</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Record 4 - Primary CDL */}
              <div className="bg-red-100 border-2 border-red-500 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-bold text-slate-900">TYPE: </span>
                    <span className="text-slate-700">CDLI</span>
                  </div>
                  <span className="bg-red-400 text-white px-3 py-1 rounded text-xs font-bold">PRIMARY CDL - REVOKED</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm font-mono">
                  <div>
                    <span className="font-bold">License Information</span>
                    <div className="pl-4 mt-1 space-y-1 text-xs">
                      <div className="text-red-700 font-bold">License Type........: F - Primary CDL</div>
                      <div className="text-red-700 font-bold">License State.......: TN</div>
                      <div>License Number......: XXXXXX</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-sm font-mono">
              ******END OF RECORD*****
            </div>
          </div>

          {/* Analysis Section */}
          <div className="space-y-3">
            <div className="p-4 bg-white rounded-lg border-2 border-slate-300">
              <h4 className="font-bold text-slate-900 mb-2">📄 Claimed on Resume:</h4>
              <div className="text-sm">
                <div className="font-mono">Class A CDL - License #: FL-D123-456-78-901-0</div>
                <div className="text-slate-600 mt-1">State: Florida • Issued: 2018 • Valid through: 2026</div>
              </div>
            </div>

            <div className="p-4 bg-red-100 rounded-lg border-2 border-red-500">
              <h4 className="font-bold text-red-900 mb-2">🚫 CDLIS Verification Result:</h4>
              <div className="text-sm space-y-2">
                <div className="font-bold text-red-700 text-lg">LICENSE DOES NOT EXIST IN FLORIDA RECORDS</div>
                <div className="text-red-800">• No CDL issued to JOHN DOE (DOB: 11/25/XX) in Florida</div>
                <div className="text-red-800">• License number format does not match Florida system</div>
                <div className="text-red-800">• SSN provided does not match any Florida CDL records</div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-400">
              <h4 className="font-bold text-amber-900 mb-2">⚠️ Actual License Found:</h4>
              <div className="text-sm space-y-2">
                <div className="font-bold text-amber-800">Tennessee CDL - Class F (Primary CDL)</div>
                <div className="text-amber-700">• License State: TN • License Number: XXXXXX</div>
                <div className="text-red-700 font-bold text-lg mt-2">STATUS: REVOKED (2021)</div>
                <div className="text-red-800">• Reason: Multiple safety violations</div>
                <div className="text-red-800">• NOT ELIGIBLE for reinstatement until 2026</div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-300">
              <h4 className="font-bold text-slate-900 mb-2">📋 Additional Findings:</h4>
              <div className="text-sm space-y-1 text-slate-700">
                <div>• 3 additional license records found (CA) - all aliases/AKAs</div>
                <div>• Employment dates claimed: 2018-2023 (5 years experience)</div>
                <div className="text-red-600 font-bold">• ACTUAL: No valid CDL from 2021-2024 (3 year gap)</div>
                <div className="text-red-600 font-bold">• Tennessee license was only valid 2015-2021</div>
                <div className="text-red-600 font-bold">• Resume claims Florida license that NEVER EXISTED</div>
              </div>
            </div>

            <div className="p-4 bg-red-600 text-white rounded-lg">
              <h4 className="font-bold mb-2 text-xl">� FRAUD ALERT - CRITICAL</h4>
              <div className="space-y-2 text-sm">
                <div className="font-bold">RESUME COMPLETELY FABRICATED:</div>
                <div>✗ Claimed Florida CDL does not exist in any state database</div>
                <div>✗ Actual Tennessee CDL was REVOKED for safety violations</div>
                <div>✗ 3-year employment gap where candidate had NO VALID LICENSE</div>
                <div>✗ Multiple alias names used across different states</div>
                <div>✗ Falsified employment history during license revocation period</div>
                <div className="mt-3 pt-3 border-t border-white/30 font-bold text-lg">
                  ⛔ RECOMMENDATION: IMMEDIATE REJECTION - Do not proceed with hiring. Report to authorities if required.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drug Test Results */}
      {selectedChecks.drugTest && (
        <div className="p-6 rounded-2xl bg-red-50 border-2 border-red-300">
          <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💊</span> DOT Drug Test Results
          </h3>
          
          {/* Test Header Info */}
          <div className="mb-4 p-4 bg-white rounded-lg">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold text-slate-700">Date Results Transmitted:</div>
                <div>2014-12-24 11:33 AM</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Reason for Test:</div>
                <div className="text-red-600 font-bold">PRE-EMPLOYMENT</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Transmitted By:</div>
                <div>DRN</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Date Specimen Collected:</div>
                <div>2014-12-18</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Participant/Donor:</div>
                <div>E. FUDD</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Laboratory:</div>
                <div>Quest Diagnostics</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">SSN/EID:</div>
                <div>xxx-xx-1111</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Collection Site:</div>
                <div>COLLECTION PLUS</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">CCF/Specimen ID:</div>
                <div>888888</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Collection Site Phone:</div>
                <div>9164873033</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Specimen Type:</div>
                <div>URINE</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Program:</div>
                <div>DOT</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Company:</div>
                <div>MVRCheck</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Agency:</div>
                <div>FMCSA</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Location:</div>
                <div>MVRCheck</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Date MRO Received CCF Copy 2:</div>
                <div>2014-12-24</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Lab Account Number:</div>
                <div>11111222</div>
              </div>
              <div>
                <div className="font-semibold text-slate-700">Date Test Verified by MRO:</div>
                <div>2014-12-24</div>
              </div>
            </div>
          </div>

          {/* Test Results Panel */}
          <div className="mb-4">
            <h4 className="font-bold text-slate-900 mb-3 text-lg">DOT DRUG PANEL W/TS 45304N</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-200">
                  <tr>
                    <th className="text-left p-2 font-bold">Drug</th>
                    <th className="text-left p-2 font-bold">Results</th>
                    <th className="text-right p-2 font-bold">Screen</th>
                    <th className="text-right p-2 font-bold">Confirm</th>
                  </tr>
                </thead>
                <tbody className="bg-white">
                  <tr className="border-b">
                    <td className="p-2">Amphetamines</td>
                    <td className="p-2 font-semibold">NEGATIVE</td>
                    <td className="p-2 text-right">500</td>
                    <td className="p-2 text-right">250</td>
                  </tr>
                  <tr className="border-b bg-red-100">
                    <td className="p-2 font-bold">Cocaine</td>
                    <td className="p-2 font-bold text-red-700">POSITIVE</td>
                    <td className="p-2 text-right">150</td>
                    <td className="p-2 text-right font-bold text-red-700">875 ng/mL</td>
                  </tr>
                  <tr className="border-b bg-red-100">
                    <td className="p-2 font-bold">Marijuana</td>
                    <td className="p-2 font-bold text-red-700">POSITIVE</td>
                    <td className="p-2 text-right">50</td>
                    <td className="p-2 text-right font-bold text-red-700">320 ng/mL</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">MDA-Analogues</td>
                    <td className="p-2 font-semibold">NEGATIVE</td>
                    <td className="p-2 text-right">500</td>
                    <td className="p-2 text-right">250</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2">Opiates</td>
                    <td className="p-2 font-semibold">NEGATIVE</td>
                    <td className="p-2 text-right">2000</td>
                    <td className="p-2 text-right">2000</td>
                  </tr>
                  <tr>
                    <td className="p-2">Phencyclidine (PCP)</td>
                    <td className="p-2 font-semibold">NEGATIVE</td>
                    <td className="p-2 text-right">25</td>
                    <td className="p-2 text-right">25</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Final Determination */}
          <div className="mb-4 p-4 bg-red-600 text-white rounded-lg text-center">
            <div className="text-2xl font-bold mb-2">MY DETERMINATION/VERIFICATION IS: POSITIVE</div>
            <div className="text-sm">Test failed for Cocaine and Marijuana (THC)</div>
          </div>

          {/* Medical Review Officer Signature */}
          <div className="mb-4 p-4 bg-white rounded-lg border-2 border-slate-300">
            <div className="font-semibold text-slate-900 mb-2">Certified Medical Review Officer</div>
            <div className="text-sm text-slate-600 mb-2">Signature:</div>
            <div className="font-signature text-2xl text-slate-700 italic">J. Phelm, MD</div>
          </div>

          {/* Confidentiality Notice */}
          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded">
            The information contained in this message is CONFIDENTIAL and is for the intended addressee only. Any unauthorized use, dissemination of the information, 
            or copying of this message is prohibited. If you believe you have received this message in error, please contact our Client Services Department at 
            mro@thescreen.com and delete this message without copying or disclosing it.
          </div>

          <div className="mt-4 p-4 bg-red-100 rounded-lg border-2 border-red-400">
            <p className="text-base text-red-700 font-bold">
              ❌ DOT DISQUALIFICATION: Positive test for Cocaine (875 ng/mL) and Marijuana (320 ng/mL). 
              Federal regulations PROHIBIT hiring for safety-sensitive positions. Candidate must complete SAP program and pass return-to-duty test before consideration.
            </p>
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
              <p className="font-bold mb-1">Error</p>
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
};
