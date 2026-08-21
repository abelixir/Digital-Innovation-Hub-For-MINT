import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-teal-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">MinT</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">
                  Digital Startup Portal
                </div>
                <div className="text-xs text-slate-400">
                  Ministry of Innovation & Technology
                </div>
              </div>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Official platform for startup designation under Proclamation
              1396/2025 — connecting founders, investors, and ecosystem
              builders across Ethiopia.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Portal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-white transition-colors">
                  Designated startups
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition-colors">
                  Apply
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition-colors">
                  Sign in
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Framework</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>Proclamation 1396/2025</li>
              <li>Digital Ethiopia 2030</li>
              <li>Startup designation & certificates</li>
              <li>Ecosystem builder recognition</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Ministry of Innovation and Technology</span>
          <span>Built for real-world designation workflows</span>
        </div>
      </div>
    </footer>
  );
}