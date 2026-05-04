import { useStore } from '../../store/useStore';
import { 
  TrendingUp, TrendingDown, PieChart, Printer, 
  Download, Sparkles, Activity, ShieldCheck, Target 
} from 'lucide-react';
import { useMemo } from 'react';
import { format } from 'date-fns';
import ExportActions from '../../components/ExportActions';

export default function CompteResultat() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const analysis = useMemo(() => {
    let chargesExploitation = 0; let produitsExploitation = 0;
    let chargesFinancieres = 0; let produitsFinanciers = 0;
    let chargesExceptionnelles = 0; let produitsExceptionnels = 0;

    lignes.forEach(ligne => {
      const c = comptes.find(compte => compte.id === ligne.compteGeneralId || compte.numero === ligne.compteGeneralId);
      if (!c) return;
      const solde = ligne.debit - ligne.credit;

      if (c.numero.startsWith('6')) {
        if (c.numero.startsWith('65') || c.numero.startsWith('66')) chargesFinancieres += solde;
        else if (c.numero.startsWith('67')) chargesExceptionnelles += solde;
        else chargesExploitation += solde;
      }
      else if (c.numero.startsWith('7')) {
        const prod = -solde;
        if (c.numero.startsWith('75') || c.numero.startsWith('76')) produitsFinanciers += prod;
        else if (c.numero.startsWith('77')) produitsExceptionnels += prod;
        else produitsExploitation += prod;
      }
    });

    const resExploitation = produitsExploitation - chargesExploitation;
    const resFinancier = produitsFinanciers - chargesFinancieres;
    const resExceptionnel = produitsExceptionnels - chargesExceptionnelles;
    const resNet = resExploitation + resFinancier + resExceptionnel;

    return {
      produitsExploitation, chargesExploitation, resExploitation,
      produitsFinanciers, chargesFinancieres, resFinancier,
      produitsExceptionnels, chargesExceptionnelles, resExceptionnel,
      resNet
    };
  }, [comptes, lignes]);

  const exportData = useMemo(() => [
    { Section: 'EXPLOITATION', Produits: analysis.produitsExploitation, Charges: analysis.chargesExploitation, Resultat: analysis.resExploitation },
    { Section: 'FINANCIER', Produits: analysis.produitsFinanciers, Charges: analysis.chargesFinancieres, Resultat: analysis.resFinancier },
    { Section: 'EXCEPTIONNEL', Produits: analysis.produitsExceptionnels, Charges: analysis.chargesExceptionnelles, Resultat: analysis.resExceptionnel },
    { Section: 'TOTAL', Produits: analysis.produitsExploitation + analysis.produitsFinanciers + analysis.produitsExceptionnels, Charges: analysis.chargesExploitation + analysis.chargesFinancieres + analysis.chargesExceptionnelles, Resultat: analysis.resNet },
  ], [analysis]);

  const formatCcy = (v: number) => Math.abs(v).toLocaleString('fr-FR', { minimumFractionDigits: 0 });

  const ResultBadge = ({ val }: { val: number }) => (
    <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest ${val >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
       {val >= 0 ? 'Bénéfice' : 'Perte'} : {formatCcy(val)}
    </div>
  );

  return (
    <div className="space-y-12 p-4 animate-in fade-in duration-1000 pb-20">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter flex items-center gap-4">
             <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-xl">
                <TrendingUp size={32} />
             </div>
             Compte de Résultat
          </h1>
          <p className="text-slate-500 font-medium mt-2 italic">Performance économique et rentabilité de l'exercice.</p>
        </div>
        <ExportActions 
          data={exportData} 
          filename={`resultat_${format(new Date(), 'yyyy-MM-dd')}`} 
          title="Compte de Résultat" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {/* Exploitation */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><Activity size={100} /></div>
               <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">I. Exploitation</h3>
                  <ResultBadge val={analysis.resExploitation} />
               </div>
               <div className="grid grid-cols-2 gap-20">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produits d'Exploitation</p>
                     <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-600 italic">Ventes de marchandises / PF</span>
                        <span className="text-lg font-black text-slate-900">{formatCcy(analysis.produitsExploitation)}</span>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Charges d'Exploitation</p>
                     <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-600 italic">Achats, Services, Salaires</span>
                        <span className="text-lg font-black text-slate-900">{formatCcy(analysis.chargesExploitation)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Financier */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-12 space-y-10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-5"><ShieldCheck size={100} /></div>
               <div className="flex justify-between items-center border-b-2 border-slate-900 pb-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tighter uppercase">II. Financier</h3>
                  <ResultBadge val={analysis.resFinancier} />
               </div>
               <div className="grid grid-cols-2 gap-20">
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Produits Financiers</p>
                     <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-600 italic">Intérêts, Gains de change</span>
                        <span className="text-lg font-black text-slate-900">{formatCcy(analysis.produitsFinanciers)}</span>
                     </div>
                  </div>
                  <div className="space-y-6">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Charges Financières</p>
                     <div className="flex justify-between items-end border-b border-slate-50 pb-2">
                        <span className="text-xs font-bold text-slate-600 italic">Intérêts, Pertes de change</span>
                        <span className="text-lg font-black text-slate-900">{formatCcy(analysis.chargesFinancieres)}</span>
                     </div>
                  </div>
               </div>
            </div>

            {/* Résultat Net Final */}
            <div className="bg-slate-950 rounded-[3rem] p-12 text-white shadow-2xl flex justify-between items-center relative overflow-hidden">
               <div className="absolute -left-10 -bottom-10 p-20 opacity-10"><Target size={200} /></div>
               <div>
                  <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.4em] mb-2">Résultat Net de l'Exercice</p>
                  <h2 className="text-5xl font-black tracking-tighter">{formatCcy(analysis.resNet)} <span className="text-sm font-medium opacity-40">{currentDossier?.devisePrincipale}</span></h2>
               </div>
               <div className={`p-8 rounded-[2.5rem] border-4 ${analysis.resNet >= 0 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-rose-500 text-rose-400 bg-rose-500/10'}`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-center mb-1">Performance</p>
                  <p className="text-2xl font-black">{analysis.resNet >= 0 ? 'EXCÉDENT' : 'DÉFICIT'}</p>
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <div className="card-elite bg-indigo-600 text-white">
               <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2"><Sparkles size={14} /> Insights IA Joule</h3>
               <div className="space-y-6">
                  <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                     <p className="text-[10px] font-black uppercase text-indigo-200 mb-2">Marge Brute</p>
                     <p className="text-xl font-black">{((analysis.produitsExploitation - analysis.chargesExploitation) / (analysis.produitsExploitation || 1) * 100).toFixed(1)}%</p>
                  </div>
                  <p className="text-[10px] font-bold text-indigo-100 italic leading-relaxed">
                     "Votre performance d'exploitation est solide. Attention toutefois à l'augmentation des charges financières."
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
