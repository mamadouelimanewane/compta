import { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Landmark, FileCheck, PhoneCall, ShieldCheck, Globe, ArrowUpRight, Download } from 'lucide-react';

export default function UEMOACompliance() {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);

  const [activeTab, setActiveTab] = useState<'DSF' | 'Taxes' | 'MobileMoney'>('DSF');

  const stats = {
    caAnnucl: lignesEcriture.filter(l => comptes.find(c => c.id === l.compteGeneralId)?.numero.startsWith('7')).reduce((s, l) => s + l.credit - l.debit, 0),
    tvaCollectee: lignesEcriture.filter(l => comptes.find(c => c.id === l.compteGeneralId)?.numero.startsWith('443')).reduce((s, l) => s + l.credit - l.debit, 0),
    brcAPayer: lignesEcriture.filter(l => comptes.find(c => c.id === l.compteGeneralId)?.numero.startsWith('447')).reduce((s, l) => s + l.credit - l.debit, 0),
  };

  const dsfTables = [
    { id: 1, label: 'Bilan Actif', desc: 'Situation patrimoniale des emplois' },
    { id: 2, label: 'Bilan Passif', desc: 'Situation des ressources et capitaux' },
    { id: 3, label: 'Compte de Résultat', desc: 'Formation du résultat net OHADA' },
    { id: 4, label: 'Tableau des Flux de Trésorerie (TFT)', desc: 'Analyse des mouvements de cash' },
    { id: 11, label: 'Tableau des Immobilisations', desc: 'Suivi des actifs immobilisés' },
    { id: 13, label: 'Tableau des Amortissements', desc: 'Suivi des dépréciations cumulées' },
  ];

  const devise = currentDossier?.devisePrincipale || 'FCFA';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600">
            <Globe size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">ZONE UEMOA & SÉNÉGAL</h1>
            <p className="text-slate-500 text-sm font-medium">Conformité SYSCOHADA Révisé & Fiscalité Locale</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <div className="text-right border-r border-slate-200 pr-4 mr-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Taux TVA Sénégal</p>
            <p className="text-sm font-black text-slate-800 tracking-wider">18.0%</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Prochaine Échéance</p>
            <p className="text-sm font-black text-rose-600 tracking-wider">15 PROCHAIN</p>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-2xl w-fit">
        {[
          { id: 'DSF', label: 'Liasse Fiscale DSF', icon: <FileCheck size={14} /> },
          { id: 'Taxes', label: 'Impôts & Retenues', icon: <Landmark size={14} /> },
          { id: 'MobileMoney', label: 'Mobile Money Engine', icon: <PhoneCall size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'DSF' | 'Taxes' | 'MobileMoney')}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${activeTab === tab.id ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            {tab.icon} <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {activeTab === 'DSF' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {dsfTables.map(table => (
            <div key={table.id} className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-indigo-300 transition-all group shadow-sm hover:shadow-xl">
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black bg-slate-100 px-2 py-1 rounded-md text-slate-500 uppercase tracking-widest">Tableau {table.id}</span>
                <button className="text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight size={18} /></button>
              </div>
              <h3 className="font-black text-slate-800 text-lg mb-1">{table.label}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">{table.desc}</p>
              <button className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center">
                <Download size={12} className="mr-2" /> Générer pour Sen-Etafi
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'Taxes' && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Suivi TVA (Code 443/445)</h4>
              <p className="text-3xl font-black text-slate-900 mb-2">{stats.tvaCollectee.toLocaleString()} <span className="text-sm font-medium text-slate-500">{devise}</span></p>
              <div className="flex items-center text-xs font-bold text-emerald-600">
                <ShieldCheck size={14} className="mr-1" /> PRÊT POUR TÉLÉDÉCLARATION
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Retenues à la Source (BRC)</h4>
              <p className="text-3xl font-black text-rose-600 mb-2">{stats.brcAPayer.toLocaleString()} <span className="text-sm font-medium text-slate-500">{devise}</span></p>
              <div className="flex items-center text-xs font-bold text-rose-500">
                ⚠️ À PAYER AVANT LE 15
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">CEL (Contribution Éco.)</h4>
              <p className="text-3xl font-black text-slate-900 mb-2">Calcul auto...</p>
              <p className="text-xs text-slate-400">Basé sur CA {stats.caAnnucl.toLocaleString()} {devise}</p>
            </div>
          </div>

          <div className="bg-indigo-900 rounded-3xl p-8 text-white">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black">Certificats de Retenues à la Source</h3>
                <p className="text-indigo-200 text-sm">Gérez et téléchargez les attestations pour vos prestataires (BRC / BRS)</p>
              </div>
              <button className="px-6 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-400">Nouvelle Attestation</button>
            </div>
            <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-indigo-300">Prestataire</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-indigo-300">Montant Brut</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-indigo-300">Retenue (5%)</th>
                    <th className="px-6 py-4 font-bold uppercase tracking-widest text-indigo-300">Statut</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="px-6 py-4 font-bold">DIGITAL SERVICES SN</td>
                    <td className="px-6 py-4">1 500 000 {devise}</td>
                    <td className="px-6 py-4 text-amber-400">75 000 {devise}</td>
                    <td className="px-6 py-4"><span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full font-bold">DÉCLARÉ</span></td>
                    <td className="px-6 py-4 text-right"><Download size={14} className="cursor-pointer hover:text-indigo-400" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'MobileMoney' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl animate-in zoom-in-95 duration-500">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex justify-center space-x-8 mb-8">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 font-black text-xs">ORANGE</div>
              <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 font-black text-xs">WAVE</div>
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 font-black text-xs">FREE</div>
            </div>
            <h3 className="text-2xl font-black text-slate-900">Synchronisation Mobile Money Engine</h3>
            <p className="text-slate-500 text-sm">
              Réconciliez vos flux de paiements mobiles directement avec votre journal de banque. 
              Importez vos fichiers Wave Business ou Orange Money Merchants et l'IA Diamond s'occupe du lettrage automatique.
            </p>
            <div className="pt-8 border-t border-slate-100 flex flex-col items-center">
              <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center hover:bg-slate-800 shadow-xl shadow-slate-200">
                Connecter un compte Marchand <ArrowUpRight size={18} className="ml-2" />
              </button>
              <p className="text-[10px] text-slate-400 mt-4 uppercase font-bold tracking-widest">Supporte : Wave, Orange Money, Free Money, Wizall</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
