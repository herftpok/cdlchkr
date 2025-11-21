import { useState, useEffect } from 'react';
import { Menu, X, Check } from 'lucide-react';

export default function ProfilePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
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

  // Profile form state
  const [fullName, setFullName] = useState('marketing-IHz');
  const [nickname, setNickname] = useState('marketing-IHz');
  const [acceptMessages, setAcceptMessages] = useState(true);
  const [newPassword, setNewPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Referral data
  const [referralCode] = useState('XYB8YJ');
  const referralLink = `https://cdlscan.com?ref=${referralCode}`;

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    // Show success notification
    alert('Profile updated successfully!');
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex">
      {/* Sidebar - same as other pages */}
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
            <a href="/search" className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors">
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
            <a href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-indigo-100 text-indigo-700 font-medium transition-colors">
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
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>
            <h1 className="text-xl font-bold text-slate-900">Profile settings</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors font-medium">
              Share & Earn
            </button>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2">
              <span>👥</span>
              Invite Friends
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="p-6 pb-24 max-w-6xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-6 border-b border-slate-200 mb-6">
            <button 
              onClick={() => setActiveTab('general')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'general' 
                  ? 'text-indigo-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              General
              {activeTab === 'general' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('notifications')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'notifications' 
                  ? 'text-indigo-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Notification management
              {activeTab === 'notifications' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('referral')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'referral' 
                  ? 'text-indigo-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Referral program
              {activeTab === 'referral' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
            <button 
              onClick={() => setActiveTab('api')}
              className={`pb-3 px-1 font-medium transition-colors relative ${
                activeTab === 'api' 
                  ? 'text-indigo-600' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              API Token Access
              {activeTab === 'api' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"></div>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'general' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <form onSubmit={handleUpdateProfile} className="max-w-2xl">
                {/* Profile Photo */}
                <div className="mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-400 to-blue-500 flex items-center justify-center text-white font-bold text-2xl">
                      M
                    </div>
                    <button 
                      type="button"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                    >
                      Upload photo
                    </button>
                    <p className="text-xs text-slate-500">Allowed JPG, PNG, BMP</p>
                  </div>
                </div>

                {/* Full Name */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name <span className="text-emerald-600">✓ Verified user</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>

                {/* Nickname */}
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Nickname
                  </label>
                  <p className="text-xs text-slate-500 mb-2">(displays in chat and on stories)</p>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all"
                  />
                  <p className="text-xs text-indigo-600 mt-1">You have 3 opportunity left to change your nickname</p>
                </div>

                {/* Accept Messages Toggle */}
                <div className="mb-8">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={acceptMessages}
                      onChange={(e) => setAcceptMessages(e.target.checked)}
                      className="w-12 h-6 appearance-none bg-indigo-600 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-600
                        before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                        checked:before:translate-x-6"
                    />
                    <span className="text-sm text-slate-700">Accept personal messages from other users</span>
                  </label>
                </div>

                {/* New Password */}
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    New password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New password"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600 focus:ring-opacity-20 outline-none transition-all"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                >
                  Update profile
                </button>
              </form>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-12 h-6 appearance-none bg-indigo-600 rounded-full relative cursor-pointer transition-colors checked:bg-indigo-600
                    before:content-[''] before:absolute before:w-5 before:h-5 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform
                    checked:before:translate-x-6"
                />
                <span className="text-sm text-slate-700">Send notifications to my email</span>
              </label>
            </div>
          )}

          {activeTab === 'referral' && (
            <div>
              {/* Hero Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">
                      Refer Friends. Earn<br />Searches Together.
                    </h2>
                    <p className="text-slate-600 mb-6">
                      Get free searches every time your friend uses CDLscan
                    </p>
                    <button className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium flex items-center gap-2">
                      📄 View referral rules
                    </button>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="font-bold text-slate-900 mb-4">Your referral terms</h3>
                    
                    <div className="bg-indigo-600 rounded-lg p-4 mb-6 text-white">
                      <div className="font-semibold mb-3">You receive</div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <div className="font-semibold">1 new user = 1 free search!</div>
                          <div className="text-indigo-100">Get 1 free search for each Invited user after they make their first payment.</div>
                        </div>
                        <div>
                          <div className="font-semibold">Every $10 spent by Invited user = 1 free search!</div>
                          <div className="text-indigo-100">Get 1 free search for each $10 spent on an Order by your Invited users.</div>
                        </div>
                      </div>
                    </div>

                    {/* Referral Link */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Referral Link</label>
                      <div className="flex gap-2">
                        <div className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono">
                          {referralLink}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(referralLink)}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* Referral Code */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-slate-700 mb-2">Referral Code</label>
                      <div className="flex gap-2">
                        <div className="flex-1 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-mono">
                          # {referralCode}
                        </div>
                        <button 
                          onClick={() => copyToClipboard(referralCode)}
                          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          📋
                        </button>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center justify-center gap-2">
                        <span>👥</span>
                        Invite Friends
                      </button>
                      <button 
                        onClick={() => copyToClipboard(referralLink)}
                        className="flex-1 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                      >
                        Copy the Link
                      </button>
                      <button className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium">
                        📤 Share
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Invitations */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">My Invitations</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Referral Link clicks</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">229</div>
                      <div className="text-xs text-slate-500">last a month ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Invited Users</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">1</div>
                      <div className="text-xs text-slate-500">last 1 year and 2 months ago</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Service Orders created by Invited Users</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">0</div>
                      <div className="text-xs text-slate-500">---</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-slate-200">
                    <span className="text-slate-700 font-medium">Service Orders paid by Invited Users</span>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">0</div>
                      <div className="text-xs text-slate-500">---</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-slate-700 font-medium">Rewarded Free Searches</span>
                    <div className="text-right">
                      <div className="font-bold text-indigo-600">0</div>
                      <div className="text-xs text-slate-500">---</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* How does it work */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-6">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">How does it work?</h3>
                <ol className="space-y-4 text-slate-700">
                  <li>1. Invite your friends, colleagues, or anyone who might be interested in CDLscan to join us.</li>
                  <li>2. Your friends will be associated with you after they Sign up.</li>
                  <li>3. Automatically get <span className="font-semibold">Free Searches</span> when invited users top up their Balance.</li>
                </ol>
              </div>

              {/* Terms & Conditions */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-6">Terms & Conditions</h3>
                <ol className="space-y-3 text-sm text-slate-700">
                  <li>1. Referrers will start earning commissions when a referee signs up with CDLscan and whenever their referees complete a trade on the CDLscan platform. Upon the registration of a referee, referrers will be able to receive commissions on the trades of their referees for 365 days.</li>
                  <li>2. Referral commissions will be distributed daily.</li>
                  <li>3. When the referee is CDLscan user, the referrer will not receive referral commissions.</li>
                  <li>4. CDLscan reserves the right to disqualify a participant if he/she engages in any inappropriate, dishonest or abusive activities (participating using multiple accounts) during the event.</li>
                  <li>5. Participants who violate the terms will not be eligible for referral incentives; any fraudulent or abusive behaviors will result in the immediate termination of all associated accounts.</li>
                  <li>6. For more information about the Referral Program, please visit <a href="https://cdlscan.com" className="text-indigo-600 hover:underline">https://cdlscan.com</a>, email <a href="mailto:admin@cdlscan.com" className="text-indigo-600 hover:underline">admin@cdlscan.com</a>, or contact our customer support.</li>
                  <li>7. CDLscan reserves the right to amend the Terms and Conditions of the referral program at any time without prior notice.</li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">API Token Access</h3>
              <p className="text-slate-600 mb-6">Generate and manage your API tokens for programmatic access to CDLscan services.</p>
              
              <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Generate New Token
              </button>
              
              <div className="mt-8 p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-600">No active API tokens yet.</p>
              </div>
            </div>
          )}
        </main>

      </div>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 lg:left-72 py-4 px-6 border-t border-slate-200 bg-white z-30">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-600">
          <p>© 2025 CDLScan, All rights Reserved.</p>
          <div className="flex gap-6">
            <a href="#terms" className="text-indigo-600 hover:underline">Terms & Conditions</a>
            <a href="#privacy" className="text-indigo-600 hover:underline">Privacy policy</a>
          </div>
        </div>
      </footer>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
