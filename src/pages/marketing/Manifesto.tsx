import { 
  ShieldCheck, Star, Award, Zap, 
  Lock, Globe, TrendingUp, Users,
  Printer, Download, ArrowRight,
  Diamond
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Manifesto() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white p-10 animate-in fade-in duration-1000 flex flex-col items-center">
      <div className="max-w-4xl w-full space-y-16">
        {/* Header Marketing */}
        <div className="flex justify-between items-center no-print">
           <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-xl text-white">
                 <Diamond size={24} />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase italic text-slate-950">Diawdi Elite</span>
           </div>
           <button 
             onClick={handlePrint}
             className="px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
           >
              <Printer size={18} /> IMPRIMER LE MANIFESTE
           </button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-6 pt-10">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-4"
           >
              L'excellence par la confiance
           </motion.div>
           <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-none">
              Manifeste de <br />
              <span className="text-indigo-600">Confiance Numérique</span>
           </h1>
           <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto italic">
              "Dans un monde d'incertitude, la transparence n'est plus une option, c'est un actif stratégique."
           </p>
        </div>

        {/* Corps du Manifeste */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-10 border-t border-slate-100">
           <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                 <ShieldCheck className="text-indigo-600" size={28} />
                 L'Engagement Diamond
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                 Chez **Diawdi Intelligence Suite**, nous croyons que la donnée financière est le cœur battant de votre entreprise. À travers notre technologie de **Sceau de Diamant**, nous nous engageons à rendre vos rapports infalsifiables. Chaque chiffre, chaque écriture est scellée par une empreinte numérique souveraine, garantissant une intégrité totale auprès de vos partenaires.
              </p>
              <div className="p-8 bg-slate-50 rounded-[3rem] space-y-4">
                 <div className="flex gap-4">
                    <Star className="text-amber-500 shrink-0" size={20} />
                    <p className="text-sm font-bold text-slate-800">Crédibilité Bancaire Instantanée</p>
                 </div>
                 <div className="flex gap-4">
                    <Star className="text-amber-500 shrink-0" size={20} />
                    <p className="text-sm font-bold text-slate-800">Transparence pour les Investisseurs</p>
                 </div>
                 <div className="flex gap-4">
                    <Star className="text-amber-500 shrink-0" size={20} />
                    <p className="text-sm font-bold text-slate-800">Conformité aux Standards Internationaux</p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tighter flex items-center gap-3">
                 <Zap className="text-indigo-600" size={28} />
                 Vers l'Élite Financière
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                 Adopter le Manifeste de Confiance Numérique, c'est choisir de faire partie de l'élite économique. C'est transformer la comptabilité — autrefois perçue comme une contrainte — en un levier de croissance exponentielle et un bouclier contre les risques de fraude.
              </p>
              <div className="grid grid-cols-2 gap-6">
                 <div className="p-6 border border-slate-100 rounded-3xl text-center">
                    <p className="text-3xl font-black text-indigo-600 mb-1">99.9%</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">Taux d'Intégrité</p>
                 </div>
                 <div className="p-6 border border-slate-100 rounded-3xl text-center">
                    <p className="text-3xl font-black text-indigo-600 mb-1">-80%</p>
                    <p className="text-[10px] font-black uppercase text-slate-400">Délai Audit</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Signature */}
        <div className="pt-20 border-t border-slate-100 flex flex-col items-center gap-10">
           <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-2xl">
                 <Award size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Certifié par</p>
                 <p className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Diawdi Neural Guard</p>
              </div>
           </div>
           
           <div className="text-center space-y-4">
              <p className="text-xs font-medium text-slate-400 max-w-lg">
                 Ce manifeste est un document d'engagement. Il accompagne chaque licence Diawdi Elite pour assurer la pérennité et la noblesse de votre gestion.
              </p>
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Document Officiel v1.0 - 2026</p>
           </div>
        </div>

        {/* Section Print-only Footer */}
        <div className="hidden print:block fixed bottom-10 left-0 right-0 text-center border-t border-slate-100 pt-6">
           <p className="text-[10px] font-bold text-slate-400 italic">Généré par Diawdi Intelligence Suite - www.diawdi.com</p>
        </div>
      </div>
    </div>
  );
}
