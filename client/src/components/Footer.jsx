import { Link } from "react-router-dom";
import { Shield, Award, ExternalLink, Globe2, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-md">
                MinT
              </div>
              <div>
                <div className="text-sm font-extrabold text-white">
                  Federal Democratic Republic
                </div>
                <div className="text-xs font-bold text-teal-400">
                  Ministry of Innovation & Tech
                </div>
              </div>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The national sovereign technology infrastructure and registry for Ethiopian startups and ecosystem builders under Proclamation No. 1396/2025.
            </p>
            <div className="pt-2 text-[11px] text-slate-500">
              Approved by House of Peoples&apos; Representatives
            </div>
          </div>

          {/* Statutory Links */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Statutory Services
            </div>
            <ul className="space-y-2">
              <li>
                <Link to="/register" className="hover:text-teal-400 transition-colors">
                  Startup Designation Application
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-teal-400 transition-colors">
                  Official Designated Registry
                </Link>
              </li>
              <li>
                <Link to="/builders" className="hover:text-teal-400 transition-colors">
                  Ecosystem Builder Hubs
                </Link>
              </li>
              <li>
                <Link to="/opportunities" className="hover:text-teal-400 transition-colors">
                  National Innovation Grants
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Framework */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Legal Framework
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-slate-300 font-semibold">Proclamation 1396/2025</span>
              </li>
              <li>
                <span className="text-slate-400">3-Year Corporate Tax Relief</span>
              </li>
              <li>
                <span className="text-slate-400">Foreign Exchange Prioritization</span>
              </li>
              <li>
                <span className="text-slate-400">Intellectual Property Fast-Track</span>
              </li>
              <li>
                <span className="text-slate-400">Sandboxes & Regulatory Exemptions</span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">
              Ministry Headquarters
            </div>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>Churchill Road, Addis Ababa, Ethiopia</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-teal-400 shrink-0" />
                <span>startup.registry@mint.gov.et</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400 shrink-0" />
                <span>+251 (0) 11 126 5737</span>
              </li>
              <li className="flex items-center gap-2">
                <Globe2 className="w-4 h-4 text-teal-400 shrink-0" />
                <span>mint.gov.et</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Ministry of Innovation and Technology (MinT), Ethiopia. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Sovereign Digital Infrastructure</span>
            <span>·</span>
            <span>Official Government Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
