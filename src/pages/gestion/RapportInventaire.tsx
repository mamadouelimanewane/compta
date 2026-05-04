import { useMemo } from 'react';
import { 
  FileText, Download, Printer, Filter, 
  ArrowLeft, Package, Calendar, TrendingUp 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BrandHeader from '../../components/BrandHeader';

export default function RapportInventaire() {
  const navigate = useNavigate();

  const inventoryData = [
    { id: 1, article: 'Groupe Électrogène 250kVA', code: 'MAT-001', qte: 2, pmp: 7500000, valeur: 15000000, derniereModif: '2024-03-01' },
    { id: 2, article: 'Filtre à Huile Industriel', code: 'PIECE-45', qte: 15, pmp: 30000, valeur: 450000, derniereModif: '2024-03-04' },
    { id: 3, article: 'Lubrifiant Synthétique (Fut 200L)', code: 'CONS-88', qte: 5, pmp: 240000, valeur: 1200000, derniereModif: '2024-02-28' },
  ];

  const totalValeur = useMemo(() => inventoryData.reduce((sum, item) => sum + item.valeur, 0), []);

  return (
    <div className="space-y-6 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-center mb-4">
        <button 
          onClick={() => navigate('/gestion/stocks')}
          className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors"
        >
           <ArrowLeft size={14} /> Retour au Stock
        </button>
        <div className="flex gap-4">
           <button 
             onClick={() => window.print()}
             className="px-6 py-3 bg-white text-slate-900 border border-slate-200 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-sm hover:bg-slate-50"
           >
              <Printer size={16} /> IMPRIMER
           </button>
           <button 
             onClick={() => window.print()}
             className="px-6 py-3 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl"
           >
              <Download size={16} /> EXPORTER (PDF)
           </button>
        </div>
      </div>

      <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl">
         <BrandHeader title="Rapport d'Inventaire" subtitle="Valorisation des Stocks" />

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl lg:col-span-2 flex justify-between items-center relative overflow-hidden">
            <div className="relative z-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Valeur Totale de l'Inventaire</p>
               <h2 className="text-4xl font-black text-slate-900">{totalValeur.toLocaleString()} <span className="text-sm opacity-30">CFA</span></h2>
            </div>
            <TrendingUp size={80} className="absolute -right-4 -bottom-4 text-emerald-500 opacity-10" />
         </div>
         <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
               <Package size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Articles</p>
               <p className="text-xl font-black text-slate-900">{inventoryData.length}</p>
            </div>
         </div>
         <div className="bg-slate-50 p-8 rounded-[2.5rem] flex items-center gap-6">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
               <Calendar size={24} />
            </div>
            <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dernier Inventaire</p>
               <p className="text-xl font-black text-slate-900">01/03/2024</p>
            </div>
         </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 overflow-hidden flex flex-col">
         <div className="p-8 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Filter size={16} className="text-slate-400" />
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Filtrer par Famille</span>
            </div>
         </div>
         <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 bg-slate-50/30">
                     <th className="px-8 py-6">Code Article</th>
                     <th className="px-8 py-6">Désignation</th>
                     <th className="px-8 py-6 text-right">Quantité</th>
                     <th className="px-8 py-6 text-right">PMP (Prix Moyen)</th>
                     <th className="px-8 py-6 text-right">Valeur Stock</th>
                     <th className="px-8 py-6 text-center">Dernier Mouv.</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {inventoryData.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5 text-xs font-black text-slate-900">{item.code}</td>
                       <td className="px-8 py-5 text-sm font-black text-slate-700">{item.article}</td>
                       <td className="px-8 py-5 text-sm font-black text-right">{item.qte}</td>
                       <td className="px-8 py-5 text-sm font-bold text-right text-slate-500">{item.pmp.toLocaleString()}</td>
                       <td className="px-8 py-5 text-sm font-black text-right text-indigo-600">{item.valeur.toLocaleString()}</td>
                       <td className="px-8 py-5 text-[10px] font-black text-slate-400 text-center uppercase">{item.derniereModif}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
