import { useState } from 'react';
import { 
  Package, TrendingDown, ArrowUpRight, ArrowDownRight, 
  Search, Filter, AlertCircle, RefreshCcw, Layers, BarChart2
} from 'lucide-react';

export default function Stocks() {
  const [activeTab, setActiveTab] = useState<'articles' | 'mouvements'>('articles');

  const articles = [
    { id: 1, code: 'MAT-001', designation: 'Groupe Électrogène 250kVA', stock: 2, alerte: 1, valeur: 15000000, categorie: 'Matériel' },
    { id: 2, code: 'PIECE-45', designation: 'Filtre à Huile Industriel', stock: 15, alerte: 20, valeur: 450000, categorie: 'Pièces' },
    { id: 3, code: 'CONS-88', designation: 'Lubrifiant Synthétique (Fut 200L)', stock: 5, alerte: 3, valeur: 1200000, categorie: 'Consommables' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <Package size={32} />
             </div>
             Gestion des Stocks
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Contrôle d'inventaire multi-entrepôts et suivi des consommables.</p>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl">
              <Layers size={16} /> NOUVEL ARTICLE
           </button>
           <button className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm">
              <RefreshCcw size={16} /> INVENTAIRE
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {[
           { label: 'Valeur Totale Stock', value: '16,650,000', color: 'text-indigo-600', icon: <BarChart2 size={20} /> },
           { label: 'Articles en Rupture', value: '1', color: 'text-rose-600', icon: <AlertCircle size={20} /> },
           { label: 'Rotation Moyenne', value: '14 jours', color: 'text-emerald-600', icon: <ArrowUpRight size={20} /> },
           { label: 'Mouvements (Mois)', value: '124', color: 'text-slate-600', icon: <RefreshCcw size={20} /> },
         ].map((stat, i) => (
           <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl flex items-center justify-between">
              <div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                 <p className={`text-xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl text-slate-400">{stat.icon}</div>
           </div>
         ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
            <div className="flex gap-4">
               <button 
                 onClick={() => setActiveTab('articles')}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'articles' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
               >
                  Catalogue Articles
               </button>
               <button 
                 onClick={() => setActiveTab('mouvements')}
                 className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'mouvements' ? 'bg-slate-900 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}
               >
                  Mouvements de Stock
               </button>
            </div>
            <div className="relative group">
               <Search className="absolute left-4 top-3 text-slate-400" size={16} />
               <input 
                 type="text" 
                 placeholder="Rechercher..."
                 className="pl-12 pr-6 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold w-64 focus:ring-2 focus:ring-emerald-500 shadow-sm"
               />
            </div>
         </div>

         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Code / Catégorie</th>
                     <th className="px-8 py-6">Désignation</th>
                     <th className="px-8 py-6 text-right">Quantité</th>
                     <th className="px-8 py-6 text-center">Statut</th>
                     <th className="px-8 py-6 text-right">Valeur Estimée</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {articles.map(article => (
                    <tr key={article.id} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5">
                          <p className="text-xs font-black text-slate-900">{article.code}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{article.categorie}</p>
                       </td>
                       <td className="px-8 py-5 text-sm font-black text-slate-700">{article.designation}</td>
                       <td className="px-8 py-5 text-lg font-black text-right text-slate-900">{article.stock}</td>
                       <td className="px-8 py-5">
                          <div className={`mx-auto w-fit px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${article.stock <= article.alerte ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                             {article.stock <= article.alerte ? <AlertCircle size={14} /> : <ArrowUpRight size={14} />}
                             {article.stock <= article.alerte ? 'Alerte Stock' : 'Stock OK'}
                          </div>
                       </td>
                       <td className="px-8 py-5 text-sm font-black text-right text-slate-900">{article.valeur.toLocaleString()} CFA</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
