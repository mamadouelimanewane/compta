import { useState } from 'react';
import { 
  Globe, TrendingUp, Search, Compass, 
  Target, BarChart3, ShieldCheck, Zap,
  ArrowRight, Users, ExternalLink,
  Database, RefreshCw, AlertTriangle,
  FileText, Download, Printer
} from 'lucide-react';
import BrandHeader from '../../components/BrandHeader';

export default function MarketIntelligence() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStressed, setIsStressed] = useState(false);
  const [marketData, setMarketData] = useState({
    avgTurnover: 500000000,
    avgMargin: 25,
    sectorGrowth: 5.5,
    competitorsCount: 12
  });

  const handlePrintNote = () => {
    setIsGenerating(true);
    setTimeout(() => {
      window.print();
      setIsGenerating(false);
    }, 1000);
  };

  const handleStressTest = () => {
    setIsStressed(!isStressed);
  };

  const sectors = [
    { name: 'Commerce de Détail', perf: '+4.2%', color: 'text-emerald-500', trend: 'up' },
    { name: 'Services aux Entreprises', perf: '+8.5%', color: 'text-indigo-500', trend: 'up' },
    { name: 'Industrie / Manufacturier', perf: '-1.2%', color: 'text-rose-500', trend: 'down' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="px-3 py-1 bg-slate-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} className="text-indigo-400" /> DEEPMIND ENGINE v1.2
             </div>
             <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                Agnostic Market Intelligence
             </div>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Compass size={32} />
             </div>
             Deepmind Market Analyzer
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Injectez vos données de marché pour une analyse comparative personnalisée.</p>
        </div>
        <div className="flex gap-4">
           <button 
             onClick={handleStressTest}
             className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl ${isStressed ? 'bg-rose-600 text-white' : 'bg-white text-rose-600 border border-rose-100 hover:bg-rose-50'}`}
           >
              <AlertTriangle size={18} /> {isStressed ? 'ARRÊTER STRESS-TEST' : 'LANCER STRESS-TEST'}
           </button>
           <button 
             onClick={handlePrintNote}
             className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-indigo-700 transition-all shadow-xl"
           >
              {isGenerating ? <RefreshCw size={18} className="animate-spin" /> : <FileText size={18} />}
              GÉNÉRER NOTE STRATÉGIQUE
           </button>
           <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl">
              <RefreshCw size={18} /> RELANCER L'ANALYSE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
         {/* Formulaire d'injection de données */}
         <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl space-y-8">
               <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-indigo-600">
                  <Database size={18} /> Données de Marché
               </h3>
               {isStressed && (
                 <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl space-y-2 animate-pulse">
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest flex items-center gap-2">
                       <Zap size={12} /> SCÉNARIO DE CRISE ACTIF
                    </p>
                    <p className="text-[10px] font-bold text-rose-900/60 italic">Inflation +15% | Baisse Consommation -20%</p>
                 </div>
               )}
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">CA Moyen Secteur</label>
                     <input 
                        type="number" 
                        value={marketData.avgTurnover}
                        onChange={(e) => setMarketData({...marketData, avgTurnover: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Marge Brute (%)</label>
                     <input 
                        type="number" 
                        value={marketData.avgMargin}
                        onChange={(e) => setMarketData({...marketData, avgMargin: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Croissance Annuelle (%)</label>
                     <input 
                        type="number" 
                        value={marketData.sectorGrowth}
                        onChange={(e) => setMarketData({...marketData, sectorGrowth: Number(e.target.value)})}
                        className="w-full px-6 py-3 bg-slate-50 border-none rounded-xl text-xs font-black text-slate-900 focus:ring-2 focus:ring-indigo-500"
                     />
                  </div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 leading-relaxed italic">
                  L'IA utilisera ces références pour calculer vos écarts de performance.
               </p>
            </div>
         </div>

         {/* Analyse Comparative */}
         <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                  <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                     <TrendingUp size={150} />
                  </div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Gap Analysis IA {isStressed && <span className="text-rose-600 ml-2">(Simulé en Crise)</span>}</h3>
                  <div className="space-y-8">
                     <div>
                        <div className="flex justify-between items-end mb-2">
                           <p className="text-xs font-black text-slate-900 uppercase">Résilience de Trésorerie</p>
                           <span className={`text-xl font-black ${isStressed ? 'text-rose-600' : 'text-indigo-600'}`}>{isStressed ? 'Faible' : 'Excellente'}</span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                           <div className={`h-full ${isStressed ? 'bg-rose-500' : 'bg-indigo-500'}`} style={{ width: isStressed ? '25%' : '85%' }}></div>
                        </div>
                     </div>
                     <div className={`p-6 rounded-[2rem] border flex items-center gap-4 ${isStressed ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'}`}>
                        {isStressed ? <AlertTriangle size={24} className="text-rose-500" /> : <Zap size={24} className="text-emerald-500" />}
                        <div>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${isStressed ? 'text-rose-800' : 'text-emerald-800'}`}>{isStressed ? 'Impact Rentabilité' : 'Surperformance Marge'}</p>
                           <p className="text-sm font-black text-slate-900">{isStressed ? 'Votre marge chuterait de 12.4% en cas de stagflation.' : `Votre marge est ${(32 - marketData.avgMargin).toFixed(1)}% supérieure au marché.`}</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl space-y-8">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Conseil Stratégique Deepmind</h3>
                  <div className="space-y-6">
                     <div className="flex gap-4">
                        <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                           <Target size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-relaxed">
                           Au vu de votre CA actuel ({ (125000000).toLocaleString() } CFA), vous avez un potentiel d'acquisition sur 2 concurrents directs.
                        </p>
                     </div>
                     <div className="flex gap-4">
                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                           <AlertTriangle size={20} />
                        </div>
                        <p className="text-sm font-bold text-slate-300 leading-relaxed italic">
                           Risque identifié : La croissance du secteur ({ marketData.sectorGrowth }%) est plus rapide que la vôtre (4.2%). Risque de perte de parts de marché.
                        </p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-8">
               <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                  <BarChart3 size={24} className="text-indigo-600" /> Matrice de Positionnement
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { label: 'Efficacité Opérationnelle', val: 'Elite', color: 'text-amber-500' },
                    { label: 'Croissance Organique', val: 'Moyenne', color: 'text-slate-400' },
                    { label: 'Rétention Clients', val: 'Excellente', color: 'text-emerald-500' },
                  ].map((m, i) => (
                    <div key={i} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center space-y-2">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                       <p className={`text-xl font-black ${m.color}`}>{m.val}</p>
                    </div>
                  ))}
               </div>
            </div>
         </div>
      </div>

      {/* Section imprimable masquée à l'écran */}
      <div className="hidden print:block print:p-12 bg-white min-h-screen">
         <BrandHeader title="Note de Synthèse Stratégique" subtitle="Analyse Comparative de Marché (Agnostic Deepmind)" />
         
         <div className="space-y-10">
            <section className="space-y-4">
               <h3 className="text-sm font-black border-b-2 border-slate-900 pb-2 uppercase tracking-widest">1. Résumé de l'Analyse Comparative</h3>
               <p className="text-xs leading-relaxed text-slate-700">
                  La présente note analyse la position compétitive de l'entreprise par rapport aux données de marché injectées ({marketData.avgTurnover.toLocaleString()} CFA de CA moyen). 
                  L'entreprise affiche une **surperformance notable** au niveau de sa marge brute ({ (32 - marketData.avgMargin).toFixed(1) }% au-dessus du secteur).
               </p>
            </section>

            <section className="space-y-4">
               <h3 className="text-sm font-black border-b-2 border-slate-900 pb-2 uppercase tracking-widest">2. Matrice de Positionnement IA</h3>
               <div className="grid grid-cols-3 gap-6">
                  <div className="p-4 border border-slate-200 rounded-xl text-center">
                     <p className="text-[10px] font-black uppercase text-slate-400">Efficacité</p>
                     <p className="text-sm font-black text-indigo-600">ELITE</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl text-center">
                     <p className="text-[10px] font-black uppercase text-slate-400">Croissance</p>
                     <p className="text-sm font-black text-slate-400">MOYENNE</p>
                  </div>
                  <div className="p-4 border border-slate-200 rounded-xl text-center">
                     <p className="text-[10px] font-black uppercase text-slate-400">Rétention</p>
                     <p className="text-sm font-black text-emerald-600">EXCELLENTE</p>
                  </div>
               </div>
            </section>

            <section className="space-y-4">
               <h3 className="text-sm font-black border-b-2 border-slate-900 pb-2 uppercase tracking-widest">3. Recommandations Stratégiques Deepmind</h3>
               <div className="p-6 bg-slate-50 rounded-2xl space-y-4">
                  <div className="flex gap-4">
                     <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                     <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        **Expansion Externe** : Au vu de votre CA actuel, vous avez un potentiel d'acquisition sur 2 concurrents directs pour consolider vos parts de marché.
                     </p>
                  </div>
                  <div className="flex gap-4">
                     <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5"></div>
                     <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        **Accélération de Croissance** : Le secteur croît à {marketData.sectorGrowth}%. Il est impératif d'augmenter votre investissement marketing pour ne pas perdre de terrain face aux nouveaux entrants.
                     </p>
                  </div>
               </div>
            </section>

            <div className="pt-20 flex justify-between items-end border-t border-slate-100">
               <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-4">Cachet & Signature</p>
                  <div className="w-40 h-20 border-2 border-dashed border-slate-200 rounded-xl"></div>
               </div>
               <p className="text-[10px] font-bold text-slate-400 italic">Généré par Diamond Deepmind Engine 1.2 - Document Confidentiel</p>
            </div>
         </div>
      </div>
    </div>
  );
}
