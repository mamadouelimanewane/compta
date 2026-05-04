import { Percent, Plus, Search, ShieldAlert } from 'lucide-react';

export default function TauxTaxes() {
  const taxes = [
    { code: 'TVA18', libelle: 'TVA Normale (UEMOA)', taux: 18, compte: '445710' },
    { code: 'TVA0', libelle: 'Exonéré / Export', taux: 0, compte: '445700' },
  ];

  return (
    <div className="space-y-10 p-4 animate-in fade-in duration-700 h-full flex flex-col pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-rose-600 rounded-2xl text-white shadow-xl">
                <Percent size={32} />
             </div>
             Taux de Taxes & TVA
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Configuration des régimes fiscaux et taux de taxation en vigueur.</p>
        </div>
        <button className="px-8 py-4 bg-rose-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-rose-700 shadow-xl transition-all">
           <Plus size={18} /> AJOUTER UN TAUX
        </button>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl flex-1 flex flex-col overflow-hidden">
         <div className="p-8 border-b border-slate-50">
            <div className="relative group max-w-md">
               <Search className="absolute left-4 top-4 text-slate-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Filtrer les codes taxes..."
                 className="w-full pl-14 pr-6 py-4 bg-slate-50 border-none rounded-2xl font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 shadow-inner"
               />
            </div>
         </div>
         
         <div className="flex-1 overflow-auto p-4">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">
                     <th className="px-8 py-6">Code Taxe</th>
                     <th className="px-8 py-6">Libellé</th>
                     <th className="px-8 py-6 text-right">Taux (%)</th>
                     <th className="px-8 py-6">Compte Rattaché</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {taxes.map((tax, i) => (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                       <td className="px-8 py-5 text-sm font-black text-rose-600">{tax.code}</td>
                       <td className="px-8 py-5 text-xs font-bold text-slate-700">{tax.libelle}</td>
                       <td className="px-8 py-5 text-sm font-black text-right text-slate-900">{tax.taux}%</td>
                       <td className="px-8 py-5 text-xs font-mono text-slate-400 font-bold">{tax.compte}</td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         <div className="bg-rose-50 p-8 flex items-center gap-4 text-rose-800">
            <ShieldAlert size={24} />
            <p className="text-xs font-black uppercase tracking-widest">Vérification de conformité fiscale UEMOA / OHADA</p>
         </div>
      </div>
    </div>
  );
}
