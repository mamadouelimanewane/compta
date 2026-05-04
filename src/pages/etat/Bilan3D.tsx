import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Box, Layers, Rotate3d, Maximize2, 
  ArrowLeft, Info, Zap, Sparkles 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Bilan3D() {
  const navigate = useNavigate();
  const [rotated, setRotated] = useState(false);

  const sections = [
    { label: 'Actif Immobilisé', value: 150000000, color: 'bg-indigo-600', height: 'h-40' },
    { label: 'Actif Circulant', value: 85000000, color: 'bg-indigo-400', height: 'h-24' },
    { label: 'Trésorerie Actif', value: 45000000, color: 'bg-indigo-200', height: 'h-16' },
    { label: 'Capitaux Propres', value: 120000000, color: 'bg-slate-900', height: 'h-32' },
    { label: 'Dettes', value: 160000000, color: 'bg-slate-400', height: 'h-48' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20 h-full flex flex-col overflow-hidden">
      <div className="flex justify-between items-end">
        <div>
          <button 
            onClick={() => navigate('/etat/bilan')}
            className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 hover:text-indigo-600 transition-colors"
          >
             <ArrowLeft size={14} /> Retour au Bilan Classique
          </button>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Rotate3d size={32} />
             </div>
             Vision 3D Topologique
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Visualisation volumétrique de la structure du bilan pour une analyse d'équilibre immédiate.</p>
        </div>
        <button 
          onClick={() => setRotated(!rotated)}
          className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
        >
           <Rotate3d size={18} /> {rotated ? 'VUE FRONTALE' : 'VUE ISOMÉTRIQUE'}
        </button>
      </div>

      <div className="flex-1 bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200 relative flex items-center justify-center perspective-[2000px] overflow-hidden">
         <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
            <Box size={600} strokeWidth={0.5} />
         </div>

         <motion.div 
            animate={{ 
              rotateX: rotated ? 45 : 0, 
              rotateY: rotated ? -30 : 0,
              scale: rotated ? 0.8 : 1
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="flex gap-20 items-end relative z-10"
         >
            {/* Actif */}
            <div className="space-y-8 text-center">
               <h3 className="text-xs font-black uppercase tracking-widest text-indigo-600">Structure de l'Actif</h3>
               <div className="flex items-end gap-1">
                  {sections.slice(0, 3).map((s, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.1, translateZ: 50 }}
                      className={`${s.color} ${s.height} w-24 rounded-2xl shadow-2xl relative group cursor-pointer border-r-8 border-b-8 border-black/10`}
                    >
                       <div className="absolute -top-12 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <p className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100">
                             {s.label}: {s.value.toLocaleString()}
                          </p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>

            <div className="h-64 w-px bg-slate-200"></div>

            {/* Passif */}
            <div className="space-y-8 text-center">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Structure du Passif</h3>
               <div className="flex items-end gap-1">
                  {sections.slice(3).map((s, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.1, translateZ: 50 }}
                      className={`${s.color} ${s.height} w-24 rounded-2xl shadow-2xl relative group cursor-pointer border-r-8 border-b-8 border-black/10`}
                    >
                       <div className="absolute -top-12 left-0 w-full opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          <p className="text-[10px] font-black uppercase bg-white px-3 py-1 rounded-full shadow-lg border border-slate-100">
                             {s.label}: {s.value.toLocaleString()}
                          </p>
                       </div>
                    </motion.div>
                  ))}
               </div>
            </div>
         </motion.div>

         <div className="absolute bottom-12 left-12 flex gap-8">
            <div className="flex items-center gap-3">
               <div className="p-3 bg-emerald-500 rounded-xl text-white shadow-lg">
                  <ShieldCheck size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Équilibre Actif/Passif</p>
                  <p className="text-sm font-black text-emerald-600">STABLE (Δ 0.0%)</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
               <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg">
                  <Sparkles size={20} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase">Ratio Solvabilité</p>
                  <p className="text-sm font-black text-amber-600">OPTIMAL (1.85)</p>
               </div>
            </div>
         </div>

         <div className="absolute top-12 right-12 max-w-xs space-y-4">
            <div className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white shadow-xl space-y-2">
               <div className="flex items-center gap-2 text-indigo-600">
                  <Zap size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Analyse IA</span>
               </div>
               <p className="text-[10px] font-bold text-slate-500 leading-relaxed italic">
                  La profondeur du bloc "Dettes" suggère un levier financier important. Votre capacité d'endettement résiduelle est estimée à 45M CFA.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}
