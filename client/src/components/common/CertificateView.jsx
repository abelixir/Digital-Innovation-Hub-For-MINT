import { Shield, Award, CheckCircle2, QrCode, Download, Printer } from "lucide-react";

export default function CertificateView({ application }) {
  if (!application) return null;

  const cert = application.certificate || {
    certificateNumber: `MINT/ET/2025/${Math.floor(10000 + Math.random() * 90000)}`,
    issueDate: "2025-02-15",
    expiryDate: "2028-02-14",
    verifier: "Ministry of Innovation and Technology",
    qrCodeData: `https://mint.gov.et/verify/${application.id || "MINT-2025"}`,
    sealType: "Sovereign Gold Seal",
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Official Certificate Canvas */}
      <div className="relative p-8 sm:p-12 rounded-3xl bg-amber-50/40 dark:bg-slate-950 border-4 border-double border-amber-600/40 text-slate-900 dark:text-white shadow-xl overflow-hidden print:p-0 print:border-none print:shadow-none">
        {/* Watermark Emblem */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
          <Shield className="w-96 h-96 text-slate-900" />
        </div>

        {/* Certificate Border Corner Ornaments */}
        <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-amber-600/60" />
        <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-amber-600/60" />
        <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-amber-600/60" />
        <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-amber-600/60" />

        <div className="relative z-10 text-center space-y-6">
          {/* Header */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 mb-2">
              <Shield className="w-8 h-8" />
            </div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400">
              Federal Democratic Republic of Ethiopia
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-extrabold tracking-wide uppercase text-slate-900 dark:text-white">
              Ministry of Innovation and Technology
            </h2>
            <div className="text-xs font-medium text-slate-500">
              Startup Proclamation No. 1396/2025 · Official Registry
            </div>
          </div>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />

          {/* Certificate Title */}
          <div>
            <div className="text-xs uppercase tracking-widest text-slate-500 mb-1">
              Certificate of Official Statutory Designation
            </div>
            <p className="text-xs italic text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              This is to certify that the enterprise named below has satisfied all legal requirements and criteria under Ethiopian Startup Proclamation No. 1396/2025 and is formally designated as an official Ethiopian Technology Startup.
            </p>
          </div>

          {/* Enterprise Name */}
          <div className="py-3 px-6 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-amber-500/20 max-w-xl mx-auto backdrop-blur-sm">
            <div className="text-2xl sm:text-3xl font-serif font-bold text-indigo-950 dark:text-indigo-200">
              {application.legalName || application.name}
            </div>
            {application.tradeName && (
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                Trade Name: &ldquo;{application.tradeName}&rdquo;
              </div>
            )}
            <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-3">
              <span>Sector: <strong>{application.sector}</strong></span>
              <span>•</span>
              <span>TIN: <strong>{application.tin || "0078493021"}</strong></span>
            </div>
          </div>

          {/* Certificate Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-left text-xs pt-2">
            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Certificate No</div>
              <div className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {cert.certificateNumber}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Date of Issuance</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {cert.issueDate}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Statutory Expiry</div>
              <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">
                {cert.expiryDate}
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Verification Status</div>
              <div className="font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active & Audited</span>
              </div>
            </div>
          </div>

          {/* Footer Seals and Signatures */}
          <div className="flex items-center justify-between pt-6 border-t border-amber-600/30 max-w-2xl mx-auto">
            <div className="text-left space-y-1">
              <div className="w-32 h-10 border-b border-dashed border-slate-400 flex items-end">
                <span className="font-serif italic text-xs text-slate-700 dark:text-slate-300">
                  Belete Molla (Ph.D)
                </span>
              </div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Minister of Innovation & Tech
              </div>
            </div>

            {/* Sovereign Seal Stamp */}
            <div className="flex flex-col items-center justify-center w-20 h-20 rounded-full border-2 border-amber-600 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-center p-1 shadow-inner">
              <Award className="w-6 h-6 text-amber-600" />
              <span className="text-[7px] font-extrabold uppercase tracking-tight leading-tight mt-0.5">
                MinT Sovereign Seal
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
                <QrCode className="w-12 h-12 text-slate-800 dark:text-slate-200" />
              </div>
              <div className="text-[10px] text-slate-500 text-left leading-tight hidden sm:block">
                Scan to verify on
                <div className="font-mono font-bold text-slate-700 dark:text-slate-300">
                  mint.gov.et
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center justify-end gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Certificate</span>
        </button>
        <button
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download PDF Copy</span>
        </button>
      </div>
    </div>
  );
}
