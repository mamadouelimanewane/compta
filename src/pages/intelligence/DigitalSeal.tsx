import { useState } from 'react';
import { 
  ShieldCheck, Lock, QrCode, Fingerprint, 
  CheckCircle2, AlertTriangle, FileText, 
  ExternalLink, Zap, ShieldAlert, RefreshCw,
  Printer, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DigitalSeal() {
  const [isSealing, setIsSealing] = useState(false);
  const [isSealed, setIsSealed] = useState(false);
  const [activeDoc, setActiveDoc] = useState('Bilan 2024 - Certifié');

  const documents = [
    { name: 'Bilan Annuel 2024', status: 'Certifié', date: '04/05/2026', hash: '8x2A...9zL1' },
    { name: 'Compte de Résultat 2024', status: 'Certifié', date: '04/05/2026', hash: '5k9P...4vQ3' },
    { name: 'Liasse Fiscale Q1 2025', status: 'En attente', date: '-', hash: '-' },
  ];

  const handleSeal = () => {
    setIsSealing(true);
    setTimeout(() => {
      setIsSealing(false);
      setIsSealed(true);
    }, 2000);
  };

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl">
                <ShieldCheck size={12} /> SCEAU DE DIAMANT™
             </div>
             <div className="px-3 py-1 bg-slate-900 text-slate-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/5">
                Certification Souveraine
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-950 shadow-2xl">
                <Fingerprint size={32} />
             </div>
             Digital Trust Hub
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic text-lg">Garantissez l'immuabilité et l'authenticité de vos états financiers auprès des tiers.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-50 transition-all shadow-xl border border-slate-100">
              <ExternalLink size={18} /> PORTAIL BANCAIRE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Moteur de Scellement */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-950 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-2xl border border-white/5">
               <div className="absolute top-0 right-0 p-12 opacity-10">
                  <Lock size={150} />
               </div>
               
               <div className="relative z-10 space-y-10">
                  <div className="flex justify-between items-start">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Document en cours d'audit</p>
                        <h2 className="text-3xl font-black">{activeDoc}</h2>
                     </div>
                     <div className={`p-4 rounded-2xl border transition-all ${isSealed ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}>
                        {isSealed ? <CheckCircle2 className="text-emerald-500" size={32} /> : <ShieldAlert className="text-slate-600" size={32} />}
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Hash</p>
                        <p className="text-xs font-mono text-indigo-300">{isSealed ? 'D41D8CD98F00B204E9800998ECF8427E' : 'Génération en attente...'}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Immuabilité</p>
                        <p className="text-xs font-black uppercase">{isSealed ? 'GARANTIE 100%' : 'Audit en cours'}</p>
                     </div>
                     <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Notaire Digital</p>
                        <p className="text-xs font-black uppercase text-emerald-400">Actif</p>
                     </div>
                  </div>

                  <div className="pt-10 flex justify-center">
                     {!isSealed ? (
                        <button 
                          onClick={handleSeal}
                          disabled={isSealing}
                          className="px-12 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_40px_rgba(99,102,241,0.4)] flex items-center gap-4 transition-all hover:scale-105"
                        >
                           {isSealing ? <RefreshCw className="animate-spin" /> : <Lock />}
                           {isSealing ? 'SCELLEMENT EN COURS...' : 'APPOSER LE SCEAU DE DIAMANT'}
                        </button>
                     ) : (
                        <div className="flex gap-4">
                           <button className="px-8 py-4 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-white/20 transition-all border border-white/10">
                              <Printer size={18} /> IMPRIMER CERTIFIÉ
                           </button>
                           <button className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-700 transition-all shadow-xl">
                              <Download size={18} /> TÉLÉCHARGER LE SCEAU
                           </button>
                        </div>
                     )}
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-10 space-y-8">
               <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Historique des Certifications</h3>
               <div className="space-y-4">
                  {documents.map((doc, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 group hover:bg-white hover:shadow-lg transition-all cursor-pointer">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${doc.status === 'Certifié' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                             <FileText size={20} />
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900">{doc.name}</p>
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{doc.hash}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <p className="text-[10px] font-black text-slate-400">{doc.date}</p>
                          <div className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${doc.status === 'Certifié' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                             {doc.status}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Portail de Vérification */}
         <div className="space-y-8">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl space-y-8 text-center relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600"></div>
               <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center justify-center gap-2">
                  <QrCode size={18} /> Vérification Instantanée
               </h4>
               
               <div className="p-8 bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-6 group cursor-pointer hover:border-indigo-400 transition-colors">
                  <QrCode size={120} className="text-slate-900 group-hover:scale-110 transition-transform duration-500" />
                  <p className="text-[10px] font-bold text-slate-400 italic">Scannez pour vérifier l'authenticité sur le portail Diamond</p>
               </div>

               <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 space-y-2">
                  <p className="text-xs font-black text-indigo-900">Document Authentifié</p>
                  <p className="text-[10px] font-bold text-indigo-600/70 leading-relaxed italic">
                     Ce document a été certifié par le Neural Guard de Diawdi le 04/05/2026 à 18:27. Aucune modification ultérieure détectée.
                  </p>
               </div>
            </div>

            <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-xl space-y-6 relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent pointer-events-none"></div>
               <div className="flex items-center gap-3">
                  <Zap className="text-indigo-400" size={20} />
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">Audit Immuable</h4>
               </div>
               <div className="space-y-4 relative z-10">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                     <motion.div 
                        initial={{ width: '0%' }}
                        animate={{ width: isSealed ? '100%' : '65%' }}
                        className="h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                     />
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                     {isSealed ? 'Intégrité des données verrouillée. Toute modification brisera le sceau.' : 'Analyse de l\'historique des écritures pour certification finale...'}
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
