import { CheckCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
        <p className="text-sm text-slate-500">© 2026 Bronco Health Analytics. All clinical claims are synthesized from peer-reviewed research.</p>
        <div className="flex items-center gap-2 text-emerald-600 font-medium">
           <CheckCircle size={18} /> Verified 86% Predictive Accuracy
        </div>
      </div>
    </footer>
  );
}