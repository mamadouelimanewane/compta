import { useStore } from '../store/useStore';
import { 
  FileText, Zap, BookOpen, Clock, CheckCircle, 
  Plus, ArrowRight, ShieldCheck, Database, LayoutDashboard,
  Calendar, Users, Building
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadDemoOHADA } from '../utils/loadDemoData';

export default function Dashboard() {
  const navigate = useNavigate();
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  if (!currentDossierId) return (
    <div className="h-full flex flex-col items-center justify-center p-12 bg-white rounded-[3rem] border-4 border-dashed border-slate-100 animate-in fade-in zoom-in duration-700">
       <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 mb-8">
          <Database size={56} strokeWidth={1.5} />
       </div>
       <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter">Bienvenue sur DIAWDI Azure</h2>
       <p className="text-slate-500 max-w-md text-center font-medium mb-10 italic">Ouvrez un dossier pour accéder à votre espace de travail professionnel.</p>
       <button onClick={loadDemoOHADA} className="btn-elite flex items-center gap-3">
          <Zap size={18} /> CHARGER DÉMO OHADA
       </button>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-1000 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Workspace</h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
             <ShieldCheck size={18} className="text-emerald-500" /> Session active : {currentDossier?.raisonSociale}
          </p>
        </div>
        <button 
          onClick={() => navigate('/intelligence/statistiques')}
          className="px-8 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-black shadow-xl transition-all"
        >
           <LayoutDashboard size={18} /> ACCÉDER AUX STATISTIQUES
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Actions Rapides */}
         <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
               {[
                 { label: 'Saisie Journal', path: '/traitement/saisie-journal', icon: <FileText />, color: 'indigo' },
                 { label: 'Saisie IA', path: '/traitement/saisie-ia', icon: <Zap />, color: 'amber' },
                 { label: 'Plan Tiers', path: '/structure/plan-tiers', icon: <Users />, color: 'emerald' },
                 { label: 'Banques', path: '/structure/banques', icon: <Building />, color: 'blue' },
                 { label: 'Immos', path: '/structure/immobilisations', icon: <Database />, color: 'rose' },
                 { label: 'Budget', path: '/gestion/budget', icon: <Calendar />, color: 'slate' },
               ].map((act, i) => (
                 <button 
                   key={i}
                   onClick={() => navigate(act.path)}
                   className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center gap-4 group"
                 >
                    <div className={`w-12 h-12 rounded-2xl bg-${act.color}-50 text-${act.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform`}>
                       {act.icon}
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{act.label}</span>
                 </button>
               ))}
            </div>

            <div className="card-elite">
               <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-3">
                  <Clock className="text-indigo-600" /> Dernières Écritures
               </h3>
               <div className="space-y-4">
                  {lignes.slice(-5).reverse().map((l, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-[10px] text-slate-400">
                             {l.date.substring(5, 10).replace('-', '/')}
                          </div>
                          <div>
                             <p className="text-sm font-black text-slate-900">{l.libelle}</p>
                             <p className="text-[10px] font-bold text-indigo-600 uppercase">Pièce {l.numeroPiece}</p>
                          </div>
                       </div>
                       <p className="font-black text-slate-900">{(l.debit || l.credit).toLocaleString()}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Liste Journaux & Status */}
         <div className="space-y-8">
            <div className="card-elite bg-indigo-600 text-white border-none shadow-indigo-100">
               <h3 className="text-lg font-black mb-6">État des Journaux</h3>
               <div className="space-y-4">
                  {journaux.slice(0, 5).map((j, i) => (
                    <div key={i} className="flex justify-between items-center p-4 bg-white/10 rounded-2xl border border-white/10">
                       <div className="flex items-center gap-3">
                          <BookOpen size={16} className="text-indigo-200" />
                          <span className="text-xs font-black uppercase tracking-widest">{j.code}</span>
                       </div>
                       <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                    </div>
                  ))}
               </div>
               <button onClick={() => navigate('/traitement/saisie-journal')} className="w-full mt-6 py-4 bg-white text-indigo-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-all">
                  VOIR TOUS LES JOURNAUX
               </button>
            </div>

            <div className="card-elite border-dashed border-2 border-slate-200 flex flex-col items-center justify-center text-center p-10">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                  <Plus size={32} />
               </div>
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Post-it / Note</p>
               <p className="text-[10px] text-slate-400 italic mt-2">Cliquez pour ajouter une note de service.</p>
            </div>
         </div>
      </div>
    </div>
  );
}

