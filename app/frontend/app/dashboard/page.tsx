"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import PatientHeader from "@/components/dashboard/PatientHeader";
import RiskScoreCard from "@/components/dashboard/RiskScoreCard";
import ConsultationIntervention from "@/components/dashboard/ConsultationIntervention";
import { Zap, Activity, Heart, Loader2, ArrowLeft, Printer, ShieldCheck } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const [apiData, setApiData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedInsights = localStorage.getItem("assessment_insights");
    try {
      if (savedInsights) {
        setApiData(JSON.parse(savedInsights));
      }
    } catch (e) {
      console.error("Failed to parse local storage data", e);
    }
    // Simulation of processing time
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleGoHome = () => {
    localStorage.removeItem("assessment_insights");
    router.push("/");
  };

  // --- BULLETPROOF DATA MERGING ---
  // This section ensures that even if apiData is {}, null, or missing keys, the UI won't crash.
  
  const patient = {
    name: apiData?.patientData?.name || "Guest Patient",
    age: apiData?.patientData?.age || "--",
    gender: apiData?.patientData?.gender || "Not Specified",
    occupation: apiData?.patientData?.occupation || "Consultant",
  };

  const report = {
    score: typeof apiData?.score === 'number' ? apiData.score : 0,
    status: apiData?.status || "Inconclusive / Pending",
    analysis: apiData?.consultation?.analysis || "Our engine is currently unable to synthesize a narrative. Based on raw markers, we recommend a general focus on digital-work-life balance.",
    steps: Array.isArray(apiData?.consultation?.steps) ? apiData.consultation.steps : [
      "Prioritize 7-8 hours of consistent sleep to allow neural recovery.",
      "Implement a 20-20-20 rule to reduce digital eye strain and mental fatigue.",
      "Balance caffeine intake with increased water consumption throughout the work day."
    ],
    insights: Array.isArray(apiData?.consultation?.insights) ? apiData.consultation.insights : [
      "Your current screen-to-sleep ratio is a primary driver of fatigue.",
      "Work productivity levels show a strong correlation with physical activity.",
      "Small adjustments in digital habits could yield significant stress reduction."
    ],
    closing_note: apiData?.consultation?.closing_note || "Health is a journey of small, consistent physiological choices."
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h2 className="text-xl font-serif italic text-slate-700">Generating Consultation Report...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFEFF] text-slate-900">
      <div className="relative max-w-6xl mx-auto py-12 px-6">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-12">
          <button onClick={handleGoHome} className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Exit Portal</span>
          </button>
          <button onClick={() => window.print()} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <Printer className="w-4 h-4" /> Print
          </button>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
          
          <section className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm">
            <PatientHeader data={patient} />
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-5">
              <RiskScoreCard score={report.score} label={report.status} />
            </div>
            <div className="lg:col-span-7">
              <ConsultationIntervention 
                description={report.analysis} 
                steps={report.steps} 
              />
            </div>
          </div>

          {/* Insights Grid with safety check */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {report.insights.slice(0, 3).map((insight, i) => (
               <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
                 <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-6">
                   {i === 0 ? <Zap className="text-indigo-500" /> : i === 1 ? <Activity className="text-emerald-500" /> : <Heart className="text-rose-500" />}
                 </div>
                 <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Insight 0{i+1}</h4>
                 <p className="text-slate-600 text-sm leading-relaxed">{insight}</p>
               </div>
             ))}
          </div>

          <footer className="text-center py-12 border-t border-slate-100">
             <ShieldCheck className="w-6 h-6 text-slate-200 mx-auto mb-4" />
             <p className="font-serif italic text-lg text-slate-500 max-w-xl mx-auto mb-6">"{report.closing_note}"</p>
             <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.3em]">AI-Inferred Wellness Report</p>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}