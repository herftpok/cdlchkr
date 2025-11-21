import React, { useEffect } from "react";

const Check = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

const Truck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M16 3h3a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2h-3M16 3v16M16 3H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10M8 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
  </svg>
);

const Shield = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const Clock = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const FileCheck = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M9 15l2 2 4-4" />
  </svg>
);

const Users = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

export default function App() {
  useEffect(() => {
  }, []);

  const handleGetStarted = () => {
    window.location.href = '#contact';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <Header />
      <main>
        <Hero onGetStarted={handleGetStarted} />
        <Metrics />
        <ReportExamples />
        <IndustryChallenges />
        <KeyServices />
        <CompanyBenefits />
        <CandidateExperience />
        <HowItWorks />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}

const Header = () => (
  <header className="sticky top-0 z-40 backdrop-blur bg-white/70 border-b border-slate-100">
    <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Truck className="w-6 h-6 text-indigo-600" />
        <span className="font-semibold tracking-tight">CDL Checker</span>
      </div>
      <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
        <a href="#services" className="hover:text-slate-900">Services</a>
        <a href="#benefits" className="hover:text-slate-900">Benefits</a>
        <a href="#how-it-works" className="hover:text-slate-900">How it works</a>
        <a href="#faq" className="hover:text-slate-900">FAQ</a>
      </nav>
      <div className="flex items-center gap-2">
        <a 
          href="/check" 
          className="px-5 py-2.5 text-sm rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-semibold"
        >
          Start Check
        </a>
      </div>
    </div>
  </header>
);

const Section = ({ id, title, subtitle, children, className = "" }) => (
  <section id={id} className={`mx-auto px-4 md:px-6 py-8 md:py-12 ${className}`}>
    {title && (
      <div className="mb-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-3 text-lg text-slate-600">{subtitle}</p>}
      </div>
    )}
    {children}
  </section>
);

const Hero = ({ onGetStarted }) => (
  <div className="relative overflow-hidden">
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-6 md:py-16 grid md:grid-cols-2 gap-8 items-center">
      <div className="min-w-0">
        <h1 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }} 
          className="text-4xl md:text-6xl font-bold leading-tight break-words"
        >
          Hire drivers faster. Screen smarter.
        </h1>
        
        <p className="mt-4 text-slate-600 text-lg md:text-xl break-words leading-relaxed">
          Modern, transparent, and lightning-fast driver screening for transportation companies. 
          Automate up to 90% of manual compliance work and get candidates on the road sooner.
        </p>
        
        <ul className="mt-5 grid gap-3 text-base md:text-lg text-slate-700">
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" /> 
            <span>Complete DOT, MVR, and criminal background checks</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" /> 
            <span>Mobile-first candidate experience</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" /> 
            <span>Real-time status tracking & transparent ETA</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600 shrink-0" /> 
            <span>Automated compliance and audit-ready reports</span>
          </li>
        </ul>
        
        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <a 
            href="/check"
            className="inline-flex items-center justify-center px-8 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-base md:text-lg transition-colors w-full sm:w-auto"
          >
            Check Driver Now →
          </a>
          <a 
            href="#how-it-works" 
            className="text-indigo-600 hover:text-indigo-700 font-bold text-sm md:text-base"
          >
            See how it works →
          </a>
        </div>
      </div>
      
      <div className="relative hidden md:block">
        <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-200 bg-white">
          {/* Mock Dashboard Screenshot - Showing RED FLAGS */}
          <div className="bg-gradient-to-br from-red-50 to-slate-50 p-6">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Dashboard Header */}
              <div className="bg-red-600 text-white px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-base">⚠️ CRITICAL ISSUES DETECTED</div>
                  <div className="text-sm opacity-90">Screening Report</div>
                </div>
              </div>
              
              {/* Status Cards - NEGATIVE FINDINGS */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                      ⚠️
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">MVR Check: DUI FOUND</div>
                      <div className="text-sm text-red-700 font-medium">2 DUI violations in 18 months</div>
                    </div>
                  </div>
                  <div className="text-red-600 font-bold text-sm">REJECT</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border-2 border-amber-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-600 flex items-center justify-center text-white text-xl">
                      ⚠️
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">License Suspended</div>
                      <div className="text-sm text-amber-700 font-medium">CDL suspended in another state</div>
                    </div>
                  </div>
                  <div className="text-amber-600 font-bold text-sm">ALERT</div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white text-xl">
                      ⚠️
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">Employment Gap</div>
                      <div className="text-sm text-red-700 font-medium">3 years unexplained, falsified resume</div>
                    </div>
                  </div>
                  <div className="text-red-600 font-bold text-sm">FRAUD</div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="bg-red-50 px-6 py-4 border-t-2 border-red-200">
                <div className="text-center">
                  <div className="text-red-600 font-bold text-lg mb-1">❌ DO NOT HIRE</div>
                  <div className="text-sm text-slate-600">Manual check would have missed these issues</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const IndustryChallenges = () => (
  <Section 
    id="challenges" 
    title="Industry challenges we solve" 
    subtitle="Transportation companies face unique hiring obstacles"
  >
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <Clock className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-3">Slow manual hiring</h3>
        <p className="text-slate-600 text-base leading-relaxed">
          Weeks of paperwork, phone calls, and waiting on faxed documents delay time-to-hire and cost you qualified drivers.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <FileCheck className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-3">Compliance complexity</h3>
        <p className="text-slate-600 text-base leading-relaxed">
          Keeping up with FMCSA regulations, audit requirements, and multi-state record checks is time-consuming and error-prone.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-red-200 bg-red-50 p-6">
        <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <Shield className="w-7 h-7 text-red-600" />
        </div>
        <h3 className="font-bold text-xl text-slate-900 mb-3">Incomplete screening</h3>
        <p className="text-slate-600 text-base leading-relaxed">
          Manual processes miss critical CDL, MVR, DOT, and criminal history checks, putting your fleet and reputation at risk.
        </p>
      </div>
    </div>
  </Section>
);

const KeyServices = () => {
  const ServiceCard = ({ icon, title, description }) => (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-bold text-lg text-slate-900 mb-3">{title}</h3>
      <p className="text-base text-slate-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <Section 
      id="services" 
      title="Complete driver screening — all in one platform" 
      subtitle="Everything you need to hire safely and compliantly"
      className="bg-slate-50"
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <ServiceCard
          icon={<FileCheck className="w-6 h-6" />}
          title="DOT Physical & Certification"
          description="Verify DOT medical examiner certificates and track expiration dates automatically."
        />
        <ServiceCard
          icon={<FileCheck className="w-6 h-6" />}
          title="CDL & MVR Checks"
          description="Instant CDL validation and comprehensive motor vehicle records from all 50 states."
        />
        <ServiceCard
          icon={<Shield className="w-6 h-6" />}
          title="Drug & Alcohol Testing"
          description="DOT-compliant pre-employment, random, and post-incident testing with fast turnaround."
        />
        <ServiceCard
          icon={<Shield className="w-6 h-6" />}
          title="Criminal Background Checks"
          description="Multi-jurisdiction criminal history screening with FCRA-compliant reporting."
        />
        <ServiceCard
          icon={<Users className="w-6 h-6" />}
          title="Employment Verification"
          description="Automated past employer verification and reference checks."
        />
        <ServiceCard
          icon={<FileCheck className="w-6 h-6" />}
          title="Post-Hire Administration"
          description="Ongoing random testing, annual MVR monitoring, and compliance file management."
        />
      </div>
    </Section>
  );
};

const Metrics = () => (
  <section className="py-10 bg-white border-y border-slate-100">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">Results that matter</h2>
        <p className="text-lg text-slate-600">See the impact of modern driver screening</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-5xl md:text-6xl font-bold text-indigo-600">3×</div>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">Faster hiring</p>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-bold text-indigo-600">90%</div>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">Less manual work</p>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-bold text-indigo-600">99.8%</div>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">Accuracy rate</p>
        </div>
        <div>
          <div className="text-5xl md:text-6xl font-bold text-indigo-600">24-48h</div>
          <p className="mt-3 text-base md:text-lg text-slate-600 font-medium">Average turnaround</p>
        </div>
      </div>
    </div>
  </section>
);

const ReportExamples = () => {
  const [activeTab, setActiveTab] = React.useState('mvr');

  return (
    <Section 
      title="Comprehensive, audit-ready reports" 
      subtitle="See exactly what you get with every screening"
      className="bg-white"
    >
      <div className="max-w-6xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('mvr')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'mvr'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            MVR Report
          </button>
          <button
            onClick={() => setActiveTab('drug')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'drug'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Drug Test Results
          </button>
          <button
            onClick={() => setActiveTab('cdl')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'cdl'
                ? 'bg-indigo-600 text-white shadow-lg'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            CDL History
          </button>
        </div>

        {/* Report Content */}
        <div className="rounded-3xl border-2 border-slate-200 bg-white overflow-hidden shadow-xl">
          {activeTab === 'mvr' && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Motor Vehicle Record (MVR)</h3>
                  <p className="text-base text-slate-600">Complete driving history from all 50 states</p>
                </div>
                <div className="px-5 py-2 rounded-lg bg-red-100 text-red-700 font-bold text-base">
                  ⚠️ RISK
                </div>
              </div>
              
              {/* NEGATIVE Sample MVR Data */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="text-sm text-slate-500 mb-1">Driver Information</div>
                    <div className="font-bold text-slate-900 text-base">SMITH, JOHN</div>
                    <div className="text-base text-slate-600 mt-1">License: VA • X1487849</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300">
                    <div className="text-sm text-slate-500 mb-1">License Status</div>
                    <div className="font-bold text-amber-700 text-base">⚠️ SUSPENDED</div>
                    <div className="text-base text-slate-600 mt-1">Class A CDL • Suspended in NY</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                    <div className="text-sm text-slate-500 mb-1">DUI Violations (3 years)</div>
                    <div className="font-bold text-red-600 text-3xl">2</div>
                    <div className="text-base text-red-700 font-medium mt-1">📍 Failed to disclose on application</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                    <div className="text-sm text-slate-500 mb-1">Accidents (3 years)</div>
                    <div className="font-bold text-red-600 text-3xl">5</div>
                    <div className="text-base text-red-700 font-medium mt-1">3 preventable, 2 with injuries</div>
                  </div>
                  
                  <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                    <div className="text-sm text-slate-500 mb-1">Major Violations</div>
                    <div className="font-bold text-red-600 text-base">Reckless Driving</div>
                    <div className="text-base text-red-700 font-medium mt-1">187 mph in 55 mph zone</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t-2 border-red-200 bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-base text-red-700 font-bold">
                  <span className="text-xl">❌</span>
                  <span>RECOMMENDATION: DO NOT HIRE - High risk driver with multiple serious violations</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'drug' && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">DOT Drug Test Panel</h3>
                  <p className="text-base text-slate-600">5-panel urine screening • FMCSA compliant</p>
                </div>
                <div className="px-5 py-2 rounded-lg bg-red-100 text-red-700 font-bold text-base">
                  ❌ POSITIVE
                </div>
              </div>
              
              {/* NEGATIVE Drug Test Data */}
              <div className="grid md:grid-cols-2 gap-5 mb-5">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-sm text-slate-500 mb-2">Test Information</div>
                  <div className="space-y-1 text-base">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date collected:</span>
                      <span className="font-medium text-slate-900">2024-12-18</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Collection site:</span>
                      <span className="font-medium text-slate-900">Quest Diagnostics</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Specimen type:</span>
                      <span className="font-medium text-slate-900">Urine</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Program:</span>
                      <span className="font-medium text-slate-900">DOT/FMCSA</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="text-sm text-slate-500 mb-2">Medical Review Officer</div>
                  <div className="space-y-1 text-base">
                    <div className="font-bold text-slate-900">Dr. J. Robinson, MD</div>
                    <div className="text-slate-600">Certified Medical Review Officer</div>
                    <div className="mt-3 pt-3 border-t-2 border-red-200">
                      <div className="text-sm text-red-600 font-bold">FAILED - No valid prescription</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Test Results Table */}
              <div className="overflow-hidden rounded-xl border-2 border-red-200">
                <table className="w-full text-base">
                  <thead className="bg-red-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold text-slate-900">Drug Panel</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-900">Result</th>
                      <th className="px-4 py-3 text-left font-bold text-slate-900">Level Detected</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-slate-900">Amphetamines</td>
                      <td className="px-4 py-3"><span className="text-slate-600 font-medium">NEGATIVE</span></td>
                      <td className="px-4 py-3 text-slate-600">—</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 text-slate-900 font-bold">Cocaine</td>
                      <td className="px-4 py-3"><span className="text-red-600 font-bold text-lg">⚠️ POSITIVE</span></td>
                      <td className="px-4 py-3 text-red-600 font-bold">875 ng/mL</td>
                    </tr>
                    <tr className="bg-red-50">
                      <td className="px-4 py-3 text-slate-900 font-bold">Marijuana (THC)</td>
                      <td className="px-4 py-3"><span className="text-red-600 font-bold text-lg">⚠️ POSITIVE</span></td>
                      <td className="px-4 py-3 text-red-600 font-bold">320 ng/mL</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-slate-900">Opiates</td>
                      <td className="px-4 py-3"><span className="text-slate-600 font-medium">NEGATIVE</span></td>
                      <td className="px-4 py-3 text-slate-600">—</td>
                    </tr>
                    <tr className="bg-white">
                      <td className="px-4 py-3 text-slate-900">Phencyclidine (PCP)</td>
                      <td className="px-4 py-3"><span className="text-slate-600 font-medium">NEGATIVE</span></td>
                      <td className="px-4 py-3 text-slate-600">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-5 pt-5 border-t-2 border-red-200 bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-base text-red-700 font-bold">
                  <span className="text-xl">❌</span>
                  <span>DISQUALIFIED - Candidate tested positive for multiple controlled substances. DOT regulations prohibit hiring.</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cdl' && (
            <div className="p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">CDL History Report</h3>
                  <p className="text-base text-slate-600">Complete commercial driver license record via CDLIS</p>
                </div>
                <div className="px-5 py-2 rounded-lg bg-red-100 text-red-700 font-bold text-base">
                  🚫 FRAUD
                </div>
              </div>
              
              {/* NEGATIVE CDL Data */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="text-sm text-slate-500 mb-2 font-bold">⚠️ Falsified Application</div>
                  <div className="grid grid-cols-2 gap-4 text-base">
                    <div>
                      <div className="text-red-700 font-medium">Claimed License</div>
                      <div className="font-bold text-slate-900">Class A CDL - Florida</div>
                    </div>
                    <div>
                      <div className="text-red-700 font-medium">Actual Status</div>
                      <div className="font-bold text-red-600">DOES NOT EXIST</div>
                    </div>
                    <div>
                      <div className="text-red-700 font-medium">Claimed Experience</div>
                      <div className="font-bold text-slate-900">8 years</div>
                    </div>
                    <div>
                      <div className="text-red-700 font-medium">Actual</div>
                      <div className="font-bold text-red-600">3 years gap</div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 border-2 border-amber-300">
                  <div className="text-sm text-slate-500 mb-2 font-bold">Real License Found</div>
                  <div className="space-y-2 text-base">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Actual State:</span>
                      <span className="font-bold text-slate-900">Tennessee (not Florida)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Status:</span>
                      <span className="font-bold text-amber-600">REVOKED 2021</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Reason:</span>
                      <span className="font-bold text-red-600">Safety violations</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-300">
                  <div className="text-sm text-slate-500 mb-2 font-bold">❌ CDLIS System Findings</div>
                  <ul className="space-y-2 text-base text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold text-lg shrink-0">⚠️</span>
                      <span><strong>Employment gap:</strong> 3 years unexplained (2018-2021)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold text-lg shrink-0">⚠️</span>
                      <span><strong>Medical cert:</strong> Expired, never renewed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold text-lg shrink-0">⚠️</span>
                      <span><strong>Previous employer check:</strong> Fired for substance abuse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold text-lg shrink-0">⚠️</span>
                      <span><strong>Reference verification:</strong> 2 of 3 references are fake numbers</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-xl bg-red-100 border-2 border-red-400">
                  <div className="text-center">
                    <div className="text-red-600 font-bold text-lg mb-2">🚫 RESUME COMPLETELY FABRICATED</div>
                    <div className="text-base text-red-700">Candidate lied about license, experience, and work history</div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t-2 border-red-200 bg-red-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-base text-red-700 font-bold">
                  <span className="text-xl">❌</span>
                  <span>Manual screening would have missed this fraud. Our system caught 4 major discrepancies in 24 hours.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6">
          <p className="text-lg text-slate-600 mb-4 font-medium">Catch fraud and risks before they become problems</p>
          <a 
            href="/check"
            className="inline-block px-8 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-lg"
          >
            Run Background Check →
          </a>
        </div>
      </div>
    </Section>
  );
};

const CompanyBenefits = () => {
  const BenefitCard = ({ icon, title, description, highlight }) => (
    <div className={`rounded-3xl border ${highlight ? 'border-indigo-300 bg-indigo-50' : 'border-slate-200 bg-white'} p-7 shadow-sm`}>
      <div className={`w-14 h-14 rounded-2xl ${highlight ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="font-bold text-xl text-slate-900 mb-3">{title}</h3>
      <p className="text-base text-slate-600 leading-relaxed">{description}</p>
    </div>
  );

  return (
    <Section 
      id="benefits" 
      title="Why transportation companies choose us" 
      subtitle="Save time, reduce risk, stay compliant"
    >
      <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        <BenefitCard
          icon={<Clock className="w-6 h-6" />}
          title="Slash time-to-hire"
          description="Get drivers onboarded 3× faster with automated workflows, eliminating weeks of back-and-forth paperwork."
          highlight
        />
        <BenefitCard
          icon={<FileCheck className="w-6 h-6" />}
          title="Automate 90% of manual tasks"
          description="No more chasing faxes, making phone calls, or manually tracking expiration dates. Our platform does it all."
          highlight
        />
        <BenefitCard
          icon={<Shield className="w-6 h-6" />}
          title="Enhanced safety & compliance"
          description="Comprehensive screening catches issues manual processes miss. Stay audit-ready with organized digital records."
        />
        <BenefitCard
          icon={<Users className="w-6 h-6" />}
          title="Reduce operational costs"
          description="Eliminate dedicated screening staff overhead. Pay only for completed checks with transparent, per-check pricing."
        />
      </div>
    </Section>
  );
};

const CandidateExperience = () => (
  <Section 
    title="Better experience = higher completion rates" 
    subtitle="Your candidates deserve a modern, respectful screening process"
    className="bg-slate-50"
  >
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6" />
        </div>
        <h3 className="font-medium text-slate-900 mb-2">Mobile-first forms</h3>
        <p className="text-sm text-slate-600">
          Candidates complete screening on their phones in minutes, not hours.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="font-medium text-slate-900 mb-2">Transparent status & ETA</h3>
        <p className="text-sm text-slate-600">
          Real-time updates keep candidates informed and reduce support calls.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
        <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
          <Users className="w-6 h-6" />
        </div>
        <h3 className="font-medium text-slate-900 mb-2">Candidate support</h3>
        <p className="text-sm text-slate-600">
          Dedicated support team helps candidates with questions and issues.
        </p>
      </div>
    </div>

    <div className="mt-10 text-center">
      <div className="inline-block rounded-2xl bg-white border border-slate-200 px-6 py-4 shadow-sm">
        <p className="text-sm text-slate-600 mb-1">Average completion rate</p>
        <p className="text-3xl font-bold text-indigo-600">94%</p>
      </div>
    </div>
  </Section>
);

const HowItWorks = () => (
  <Section 
    id="how-it-works" 
    title="How it works" 
    subtitle="From request to results in 3 simple steps"
  >
    <div className="max-w-5xl mx-auto">
      <ol className="grid md:grid-cols-3 gap-8 text-sm mb-12">
        <li className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm relative">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold mb-4 text-lg">
            1
          </div>
          <h3 className="font-medium text-slate-900 mb-2 text-lg">Submit request</h3>
          <p className="text-slate-600 mb-4">
            Send a screening request via dashboard, API, or ATS integration. Candidate receives instant SMS/email invitation.
          </p>
          
          {/* Visual mockup */}
          <div className="mt-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
            <div className="text-xs text-slate-500 mb-2">Candidate receives:</div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-slate-200">
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 text-xs">📱</div>
                <div className="text-xs">
                  <div className="font-medium text-slate-900">CDL Checker Screening</div>
                  <div className="text-slate-600 mt-1">Complete your screening in 5 min. Tap to start →</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Arrow connector (hidden on mobile) */}
          <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-slate-300 text-2xl">→</div>
        </li>

        <li className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm relative">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold mb-4 text-lg">
            2
          </div>
          <h3 className="font-medium text-slate-900 mb-2 text-lg">Automated checks</h3>
          <p className="text-slate-600 mb-4">
            Our platform automatically runs all required checks: CDL, MVR, DOT, drug testing, criminal background, and employment verification.
          </p>
          
          {/* Visual mockup */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">✓</div>
              <span className="text-slate-600">MVR Check</span>
              <span className="ml-auto text-slate-500">2h</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center text-white">✓</div>
              <span className="text-slate-600">Drug Test</span>
              <span className="ml-auto text-slate-500">24h</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-slate-600">Background</span>
              <span className="ml-auto text-slate-500">In progress...</span>
            </div>
          </div>
          
          {/* Arrow connector (hidden on mobile) */}
          <div className="hidden md:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-slate-300 text-2xl">→</div>
        </li>

        <li className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-semibold mb-4 text-lg">
            3
          </div>
          <h3 className="font-medium text-slate-900 mb-2 text-lg">Get results</h3>
          <p className="text-slate-600 mb-4">
            Receive comprehensive, audit-ready reports in your unified dashboard. Make informed hiring decisions fast.
          </p>
          
          {/* Visual mockup */}
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-emerald-900">All Checks Complete</div>
              <div className="text-lg">✓</div>
            </div>
            <div className="text-xs text-emerald-700">
              <div className="flex justify-between">
                <span>Total time:</span>
                <span className="font-semibold">28 hours</span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Status:</span>
                <span className="font-semibold">CLEARED TO HIRE</span>
              </div>
            </div>
          </div>
        </li>
      </ol>

      <div className="text-center">
        <a 
          href="/check"
          className="inline-block px-8 py-4 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-lg"
        >
          Start Driver Check →
        </a>
      </div>
    </div>
  </Section>
);

const Testimonials = () => {
  const items = [
    {
      name: "Mike Anderson, Safety Director",
      company: "Regional Freight Co.",
      body: "We cut our driver onboarding time from 3 weeks to under 5 days. The mobile experience is a game-changer — candidates actually complete the process without constant follow-ups.",
      img: "https://i.pravatar.cc/120?img=12",
    },
    {
      name: "Sarah Mitchell, HR Manager",
      company: "Express Logistics",
      body: "CDL Checker saved us from hiring a driver with a hidden DUI on their record. The comprehensive MVR checks caught what our old process missed. Worth every penny.",
      img: "https://i.pravatar.cc/120?img=47",
    },
    {
      name: "James Rodriguez, Fleet Owner",
      company: "Rodriguez Transport LLC",
      body: "As a small fleet, we couldn't afford a dedicated compliance person. This platform automates everything and keeps us audit-ready. Our DOT audits are now stress-free.",
      img: "https://i.pravatar.cc/120?img=33",
    },
  ];

  const Card = ({ t }) => (
    <figure className="shrink-0 w-[320px] rounded-3xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col gap-3 whitespace-normal">
      <div className="flex items-center gap-3">
        <img src={t.img} alt="User" className="w-10 h-10 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <figcaption className="text-slate-800 text-sm font-semibold leading-snug break-words">
            {t.name}
          </figcaption>
          <p className="text-xs text-slate-500">{t.company}</p>
        </div>
      </div>
      <blockquote className="text-slate-700 text-sm leading-relaxed break-words">
        {t.body}
      </blockquote>
    </figure>
  );

  return (
    <Section title="Trusted by transportation companies nationwide" subtitle="Real results from real customers">
      <div className="overflow-hidden md:hidden">
        <div
          className="flex will-change-transform whitespace-nowrap gap-4"
          style={{ animation: 'testimonials 40s linear infinite' }}
        >
          {[...items, ...items, ...items].map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>

      <div className="overflow-hidden hidden md:block">
        <div className="flex gap-6 will-change-transform" style={{ animation: 'testimonials 36s linear infinite' }}>
          {[...items, ...items, ...items].map((t, i) => (
            <figure key={`d-${i}`} className="min-w-[480px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm flex items-start gap-4">
              <img src={t.img} alt="User" className="w-12 h-12 rounded-full object-cover shrink-0" />
              <div className="min-w-0 flex-1">
                <figcaption className="text-slate-800 font-semibold mb-1">{t.name}</figcaption>
                <p className="text-xs text-slate-500 mb-3">{t.company}</p>
                <blockquote className="leading-relaxed text-sm text-slate-700">
                  {t.body}
                </blockquote>
              </div>
            </figure>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes testimonials {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
      `}</style>
    </Section>
  );
};

const FAQ = () => (
  <Section 
    id="faq" 
    title="Frequently asked questions" 
    subtitle="Everything you need to know"
    className="bg-slate-50"
  >
    <div className="grid md:grid-cols-2 gap-6 text-sm max-w-5xl mx-auto">
      {[ 
        { 
          q: "How long does a complete driver screening take?", 
          a: "Most screenings are completed within 24-48 hours. Drug test results may take up to 72 hours depending on the testing facility." 
        },
        { 
          q: "Are you FMCSA and DOT compliant?", 
          a: "Yes, our platform is fully compliant with all FMCSA regulations and DOT requirements. All reports are audit-ready." 
        },
        { 
          q: "Can I integrate with our existing ATS or HRIS?", 
          a: "Absolutely. We offer native integrations with major ATS platforms and a REST API for custom integrations." 
        },
        { 
          q: "What states do you cover for MVR checks?", 
          a: "We provide motor vehicle record checks across all 50 states and can access CDL information from CDLIS." 
        },
        { 
          q: "How does pricing work?", 
          a: "We offer transparent, per-check pricing with volume discounts. No setup fees or monthly minimums. Contact us for a custom quote." 
        },
        { 
          q: "What kind of candidate support do you provide?", 
          a: "Candidates have access to phone and email support during business hours to help with any questions or technical issues." 
        },
        { 
          q: "Can I run post-hire monitoring and random testing?", 
          a: "Yes, we offer ongoing services including annual MVR monitoring, random drug testing pools, and compliance file management." 
        },
        { 
          q: "Is candidate data secure?", 
          a: "We use bank-level encryption (256-bit SSL) and are SOC 2 Type II certified. All data is encrypted at rest and in transit." 
        },
      ].map((i) => (
        <div key={i.q} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="font-medium text-slate-900 mb-2">{i.q}</h3>
          <p className="text-slate-600">{i.a}</p>
        </div>
      ))}
    </div>
  </Section>
);

const CTASection = () => (
  <section id="contact" className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-700">
    <div className="max-w-4xl mx-auto px-6 text-center text-white">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">
        Ready to screen your next driver?
      </h2>
      <p className="text-xl text-indigo-100 mb-8">
        Start comprehensive background checks in minutes. 
        Catch fraud, DUIs, and safety risks before they cost you.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a 
          href="/check"
          className="inline-block px-10 py-5 rounded-2xl bg-white text-indigo-600 hover:bg-slate-50 font-bold text-lg transition-colors"
        >
          Check Driver Now →
        </a>
        <a 
          href="/balance"
          className="inline-block px-10 py-5 rounded-2xl border-2 border-white text-white hover:bg-white/10 font-bold text-lg transition-colors"
        >
          View Pricing
        </a>
      </div>
      <p className="mt-6 text-base text-indigo-200">
        Questions? Email us at <a href="mailto:admin@cdlscan.com" className="underline hover:text-white font-semibold">admin@cdlscan.com</a>
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto max-w-6xl px-4 md:px-6 py-10 grid md:grid-cols-4 gap-8 text-sm">
      <div>
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
          <Truck className="w-5 h-5 text-indigo-600" /> 
          CDL Checker
        </div>
        <p className="text-slate-500 text-sm">
          Modern driver screening for transportation companies.
        </p>
      </div>
      <div>
        <div className="font-medium text-slate-700 mb-3">Services</div>
        <ul className="text-slate-600 grid gap-2">
          <li><a href="#services" className="hover:text-slate-900">DOT Checks</a></li>
          <li><a href="#services" className="hover:text-slate-900">MVR Reports</a></li>
          <li><a href="#services" className="hover:text-slate-900">Drug Testing</a></li>
          <li><a href="#services" className="hover:text-slate-900">Background Checks</a></li>
        </ul>
      </div>
      <div>
        <div className="font-medium text-slate-700 mb-3">Company</div>
        <ul className="text-slate-600 grid gap-2">
          <li><a href="#benefits" className="hover:text-slate-900">Benefits</a></li>
          <li><a href="#how-it-works" className="hover:text-slate-900">How it works</a></li>
          <li><a href="#faq" className="hover:text-slate-900">FAQ</a></li>
          <li><a href="#contact" className="hover:text-slate-900">Contact</a></li>
        </ul>
      </div>
      <div>
        <div className="font-medium text-slate-700 mb-3">Legal</div>
        <ul className="text-slate-600 grid gap-2">
          <li><a href="/privacy" target="_blank" rel="noreferrer" className="hover:text-slate-900">Privacy Policy</a></li>
          <li><a href="/terms" target="_blank" rel="noreferrer" className="hover:text-slate-900">Terms of Service</a></li>
          <li><a href="/compliance" target="_blank" rel="noreferrer" className="hover:text-slate-900">Compliance</a></li>
        </ul>
      </div>
    </div>
    <div className="mx-auto max-w-6xl px-4 md:px-6 pb-8 text-xs text-slate-500 border-t border-slate-100 pt-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© {new Date().getFullYear()} CDL Checker. All rights reserved.</p>
        <p>FMCSA Compliant • SOC 2 Type II Certified • FCRA Compliant</p>
      </div>
    </div>
  </footer>
);
