import { ShieldCheck, Globe, MapPin, Phone, Mail } from 'lucide-react';
import { useStore } from '../store/useStore';

interface BrandHeaderProps {
  title: string;
  subtitle?: string;
}

export default function BrandHeader({ title, subtitle }: BrandHeaderProps) {
  const currentDossierId = useStore(state => state.currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  return (
    <div className="flex justify-between items-start pb-8 border-b-2 border-slate-900 mb-10">
      <div className="flex gap-6">
        <div className="w-20 h-20 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl">
           <ShieldCheck size={48} />
        </div>
        <div className="space-y-1">
           <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">{currentDossier?.raisonSociale || 'DIAWDI CORPORATE'}</h2>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Globe size={12} className="text-indigo-600" /> SIÈGE SOCIAL / RÉGION UEMOA
           </p>
           <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500 pt-2">
              <span className="flex items-center gap-1"><MapPin size={10} /> {currentDossier?.adresse || 'Dakar, Sénégal'}</span>
              <span className="flex items-center gap-1"><Phone size={10} /> +221 33 800 00 00</span>
              <span className="flex items-center gap-1"><Mail size={10} /> contact@diawdi.sn</span>
           </div>
        </div>
      </div>
      
      <div className="text-right space-y-1">
         <h1 className="text-3xl font-black text-slate-900 tracking-tighter">{title}</h1>
         {subtitle && <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.2em]">{subtitle}</p>}
         <p className="text-[10px] font-bold text-slate-400 pt-4 uppercase">Document Certifié par Diamond Seal 2.0</p>
      </div>
    </div>
  );
}
