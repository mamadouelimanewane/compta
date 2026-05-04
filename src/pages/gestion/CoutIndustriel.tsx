import { useStore } from '../../store/useStore';
import { Factory, TrendingUp, Settings, PieChart, Activity } from 'lucide-react';

export default function CoutIndustriel() {
  const currentDossierId = useStore(state => state.currentDossierId);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl">
                <Factory size={32} />
             </div>
             Coûts Industriels & Production
          </h1>
          <p className="text-slate-500 font-medium mt-2">Comptabilité analytique de production, calcul des marges par produit et coût de revient.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Coût de Production (Total)</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">12 450 000 <span className="text-sm text-slate-400">FCFA</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Marge Industrielle Moyenne</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">34.2 <span className="text-sm text-slate-400">%</span></h2>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl space-y-4">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Settings size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Frais Généraux Imputés</p>
            <h2 className="text-3xl font-black text-slate-900 mt-1">2 100 000 <span className="text-sm text-slate-400">FCFA</span></h2>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
               <PieChart className="text-rose-600" /> Répartition des Coûts par Centre (Section Analytique)
            </h3>
            <button className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest">Nouveau Centre</button>
         </div>

         <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left">
               <thead className="bg-slate-50">
                  <tr>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Centre de Coût</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Matières Premières</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Main d'Œuvre</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Frais Indirects</th>
                     <th className="px-6 py-4 text-xs font-black text-slate-500 uppercase tracking-widest">Coût de Revient Total</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 font-bold text-slate-900">Atelier Assemblage A</td>
                     <td className="px-6 py-4 text-slate-600">4,500,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">2,100,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">800,000 FCFA</td>
                     <td className="px-6 py-4 font-black text-indigo-600">7,400,000 FCFA</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 font-bold text-slate-900">Atelier Peinture B</td>
                     <td className="px-6 py-4 text-slate-600">1,200,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">1,800,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">600,000 FCFA</td>
                     <td className="px-6 py-4 font-black text-indigo-600">3,600,000 FCFA</td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-4 font-bold text-slate-900">Conditionnement</td>
                     <td className="px-6 py-4 text-slate-600">450,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">300,000 FCFA</td>
                     <td className="px-6 py-4 text-slate-600">700,000 FCFA</td>
                     <td className="px-6 py-4 font-black text-indigo-600">1,450,000 FCFA</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
