import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDesignation } from "../context/DesignationContext";
import { useAuth } from "../context/AuthContext";
import ThreeHeroCanvas from "../components/common/ThreeHeroCanvas";
import StatusBadge, { OfficialDesignationSeal } from "../components/common/StatusBadge";
import LiveEligibilityChecklist from "../components/common/LiveEligibilityChecklist";
import Modal from "../components/common/Modal";
import CertificateView from "../components/common/CertificateView";
import StartupCard from "../components/StartupCard";
import {
  Award,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Building2,
  Layers,
  Scale,
  TrendingUp,
  FileCheck,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  Briefcase,
  Zap,
  Globe2,
  Lock,
  Search,
  Check,
  Compass,
  Network,
  Users,
  Shield,
  FileText,
  DollarSign,
  Cpu,
} from "lucide-react";

export default function Home() {
  const { applications, proclamation, stats } = useDesignation();
  const { user, isAuthenticated } = useAuth();
  const [quickCheckModal, setQuickCheckModal] = useState(false);
  const [previewCertApp, setPreviewCertApp] = useState(null);

  // Sample quick check form data
  const [quickFormData, setQuickFormData] = useState({
    legalName: "My Ethiopian Tech Venture",
    regDate: "2023-05-12",
    sector: "FinTech",
    tin: "0099887766",
    commercialRegNo: "ET/AA/2023/1234",
    problemStatement: "Solving logistics bottleneck across Ethiopian regions.",
    innovationDescription: "Proprietary software platform optimizing multi-modal supply chains with automated settlement.",
    ethiopianOwnershipPercent: 80,
    annualRevenueETB: 8500000,
    fullTimeEmployees: 14,
    iprStatus: "Registered with EIPA",
  });

  const designatedList = applications.filter(
    (a) => a.status === "designated" || a.status === "verified" || !a.status
  );

  return (
    <div className="relative overflow-hidden bg-slate-50 min-h-screen">
      {/* ===================== HERO SECTION ===================== */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
        {/* Interactive Constellation Mesh Canvas */}
        <ThreeHeroCanvas className="opacity-60" />

        {/* Sovereign Ambient Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8">
          {/* Official Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-teal-400/30 bg-teal-500/10 text-teal-300 text-xs font-semibold backdrop-blur-md shadow-sm">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Ethiopian Startup Proclamation No. 1396/2025</span>
            <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
            <span className="text-teal-200 font-bold">Official MinT Gateway</span>
          </div>

          {/* Main Sovereign Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
            Accelerating <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-teal-200 to-amber-300">Digital Innovation</span> & Sovereign Tech
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            The central statutory digital infrastructure for Ethiopian startups, investors, and ecosystem builders. Get officially designated under Proclamation No. 1396/2025 to unlock 3-year tax relief, FX prioritization, and national incentives.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to={isAuthenticated ? (user?.role === "founder" ? "/founder/create" : "/register") : "/register"}
              className="px-7 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-teal-900/50 hover:scale-[1.02] flex items-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Apply for Startup Designation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setQuickCheckModal(true)}
              className="px-6 py-3.5 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-md transition-all shadow-sm flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Check Eligibility (Live Meter)</span>
            </button>

            <Link
              to="/directory"
              className="px-6 py-3.5 rounded-2xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 font-semibold text-xs sm:text-sm transition-all"
            >
              Explore Designated Registry
            </Link>
          </div>

          {/* Proclamation Sovereign Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-10 border-t border-slate-800 max-w-4xl mx-auto text-left">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                {stats?.verifiedStartups || designatedList.length}+
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                MinT Designated
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                3 Years
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                Tax Profit Waiver
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                Fast-Track
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                FX Allocation
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">
                100% Digital
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-1">
                QR Verified Certs
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== PROCLAMATION INCENTIVE TIERS ===================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/10 text-teal-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>Statutory Benefits</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
            What Proclamation No. 1396/2025 Unlocks
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Approved by the House of Peoples&apos; Representatives to establish Ethiopia as Africa&apos;s premier sovereign technology and innovation powerhouse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {proclamation.incentiveTiers.map((tier, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:border-teal-400 hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center font-extrabold mb-4 group-hover:scale-110 transition-transform">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">
                  {tier.tier}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {tier.desc}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-teal-800">
                <span>{tier.category} Tier</span>
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== DESIGNATED SPOTLIGHT ===================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Verified National Registry
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Recently Designated Innovators
            </h2>
          </div>

          <Link
            to="/directory"
            className="flex items-center gap-1.5 text-xs font-bold text-teal-800 hover:text-teal-900 hover:underline"
          >
            <span>View All Designated ({designatedList.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {designatedList.slice(0, 3).map((app) => (
            <div
              key={app.id || app._id}
              className="p-6 rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-800 text-xs font-bold">
                    {app.sector}
                  </span>
                  <StatusBadge status={app.status || "designated"} size="sm" />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {app.legalName || app.name || app.companyName}
                  </h3>
                  {app.tradeName && (
                    <p className="text-xs text-teal-800 font-medium">
                      &ldquo;{app.tradeName}&rdquo;
                    </p>
                  )}
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {app.innovationDescription || app.problemStatement || app.oneLineDescription || app.description}
                </p>

                <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                  <div className="flex justify-between">
                    <span>Certificate No:</span>
                    <span className="font-mono font-semibold text-slate-800">
                      {app.certificate?.certificateNumber || "MINT/ET/2025/00142"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Headquarters:</span>
                    <span className="font-medium text-slate-800">
                      {app.headquarters || app.location || "Addis Ababa"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setPreviewCertApp(app)}
                  className="text-xs font-semibold text-teal-800 hover:underline flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>Inspect Certificate</span>
                </button>

                <Link
                  to={`/directory/${app.id || app._id}`}
                  className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1"
                >
                  <span>Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== MULTI-TRACK STATUTORY WORKFLOW ===================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 border border-teal-500/30 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>Two Official Statutory Tracks</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Start Your Statutory Filing Today
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Whether you are an early-stage venture building sovereign IP or an ecosystem hub accelerating cohorts, MinT provides digital accreditation and audited government certification.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg shadow-teal-900/50 transition-all flex items-center gap-2"
              >
                <span>Apply as Startup Enterprise</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/builders"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs backdrop-blur-md transition-all flex items-center gap-2"
              >
                <Network className="w-3.5 h-3.5" />
                <span>Explore Ecosystem Builders</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATUTORY ASSESSMENT LIFECYCLE ===================== */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 text-teal-800 text-xs font-bold uppercase tracking-wider mb-4">
                <ShieldCheck className="w-4 h-4" />
                <span>Audited Government Pipeline</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                Transparent Designation Lifecycle
              </h2>
              <p className="text-slate-600 leading-relaxed mb-6 text-sm">
                Designation is not a trivial vanity badge. It represents an audited statutory review with real fiscal implications, digital certificates, and granular investor data room controls.
              </p>

              <div className="space-y-3">
                {[
                  "Statutory eligibility check (commercial registration, 51%+ Ethiopian equity)",
                  "30 working-day review timeline governed by administrative regulations",
                  "QR-verified digital certificate issued by Ministry Directorate",
                  "Founder-governed investor data room with granular access audits",
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-6 shadow-xl space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 text-xs font-bold text-slate-800">
                <span>Official Case Trajectory</span>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px]">
                  Proclamation No. 1396/2025
                </span>
              </div>

              {[
                { title: "1. Online Submission", desc: "Founder submits incorporation data, TIN, and IP summary." },
                { title: "2. Technical & Legal Assessment", desc: "MinT reviewers evaluate statutory criteria and novelty." },
                { title: "3. Designation Decision", desc: "Approval granted under Section 4(1) of the Proclamation." },
                { title: "4. Sovereign Certificate Issuance", desc: "Digital QR-signed certificate generated for tax authorities." },
              ].map((step, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center text-xs font-extrabold shrink-0 border border-teal-200">
                    {i + 1}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{step.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== QUICK ELIGIBILITY CHECK MODAL ===================== */}
      <Modal
        isOpen={quickCheckModal}
        onClose={() => setQuickCheckModal(false)}
        title="Live Statutory Eligibility Calculator"
        subtitle="Test your venture against Ethiopian Startup Proclamation No. 1396/2025"
        maxWidth="max-w-3xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Commercial Registration Date
              </label>
              <input
                type="date"
                value={quickFormData.regDate}
                onChange={(e) =>
                  setQuickFormData({ ...quickFormData, regDate: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Sector Classification
              </label>
              <select
                value={quickFormData.sector}
                onChange={(e) =>
                  setQuickFormData({ ...quickFormData, sector: e.target.value })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
              >
                <option value="FinTech">FinTech</option>
                <option value="AgriTech">AgriTech (Deep-tech 7-yr window)</option>
                <option value="HealthTech">HealthTech (7-yr window)</option>
                <option value="CleanTech">CleanTech (7-yr window)</option>
                <option value="EdTech">EdTech</option>
                <option value="LogisticsTech">LogisticsTech</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Ethiopian Citizen Equity (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={quickFormData.ethiopianOwnershipPercent}
                onChange={(e) =>
                  setQuickFormData({
                    ...quickFormData,
                    ethiopianOwnershipPercent: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Full-Time Staff (Cap: 100)
              </label>
              <input
                type="number"
                value={quickFormData.fullTimeEmployees}
                onChange={(e) =>
                  setQuickFormData({
                    ...quickFormData,
                    fullTimeEmployees: Number(e.target.value),
                  })
                }
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 text-xs focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <LiveEligibilityChecklist formData={quickFormData} track="startup" />

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <button
              onClick={() => setQuickCheckModal(false)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold hover:bg-slate-50"
            >
              Close
            </button>
            <Link
              to="/register"
              onClick={() => setQuickCheckModal(false)}
              className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-teal-700/20"
            >
              <span>Proceed to Formal Filing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Modal>

      {/* ===================== CERTIFICATE INSPECTOR MODAL ===================== */}
      <Modal
        isOpen={!!previewCertApp}
        onClose={() => setPreviewCertApp(null)}
        title="MinT Official Designation Certificate"
        subtitle={`Verified statutory accreditation for ${previewCertApp?.legalName || previewCertApp?.name || previewCertApp?.companyName}`}
        maxWidth="max-w-4xl"
      >
        {previewCertApp && <CertificateView application={previewCertApp} />}
      </Modal>
    </div>
  );
}
