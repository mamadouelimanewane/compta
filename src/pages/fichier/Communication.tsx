import { useStore } from '../../store/useStore';
import { Send, Download, RefreshCcw, ShieldCheck } from 'lucide-react';

export default function Communication() {
  const currentDossierId = useStore(state => state.currentDossierId);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
                <Send size={32} />
             </div>
             Communication Bancaire & EDI
          </h1>
          <p className="text-slate-500 font-medium mt-2">Échangez vos données avec vos partenaires (Banques, Expert-Comptable, Administration).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-center space-y-6 hover:border-indigo-200 transition-all cursor-pointer group">
           <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Download size={32} />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900">Réception Relevés (EBICS)</h3>
              <p className="text-xs text-slate-500 mt-2">Intégration automatique des relevés bancaires.</p>
           </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-center space-y-6 hover:border-indigo-200 transition-all cursor-pointer group">
           <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <Send size={32} />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900">Envoi Virements (SEPA/UEMOA)</h3>
              <p className="text-xs text-slate-500 mt-2">Transmission sécurisée des ordres de paiement.</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-xl text-center space-y-6 hover:border-indigo-200 transition-all cursor-pointer group">
           <div className="w-16 h-16 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <ShieldCheck size={32} />
           </div>
           <div>
              <h3 className="text-lg font-black text-slate-900">Télédéclaration Fiscale</h3>
              <p className="text-xs text-slate-500 mt-2">Liaison directe avec l'administration fiscale.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
