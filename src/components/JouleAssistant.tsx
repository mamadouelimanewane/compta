import { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Bot, X, Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = ["Quel est mon résultat net ?", "Montre ma trésorerie", "Chiffre d'affaires ?", "Analyse mes charges"];

function analyzeQuery(q: string, d: { totalProduits: number; totalCharges: number; tresorerie: number; nbJournaux: number; nbComptes: number; devisePrincipale: string; raisonSociale: string }): string {
  const s = q.toLowerCase();
  const fmt = (n: number) => n.toLocaleString('fr-FR', { minimumFractionDigits: 2 });
  const res = d.totalProduits - d.totalCharges;

  if (s.includes('résultat') || s.includes('benefice') || s.includes('profit')) {
    return `**Résultat Net** de **${d.raisonSociale}** :\n\n- Produits : **${fmt(d.totalProduits)} ${d.devisePrincipale}**\n- Charges : **${fmt(d.totalCharges)} ${d.devisePrincipale}**\n- **Résultat : ${fmt(res)} ${d.devisePrincipale}**\n\n${res >= 0 ? '✅ Entreprise bénéficiaire.' : '⚠️ Entreprise déficitaire.'}`;
  }
  if (s.includes('trésorerie') || s.includes('tresorerie') || s.includes('solde') || s.includes('banque')) {
    return `💰 **Trésorerie Nette** :\n\n**${fmt(d.tresorerie)} ${d.devisePrincipale}**\n\n${d.tresorerie >= 0 ? '✅ Position positive.' : '🚨 Trésorerie négative !'}`;
  }
  if (s.includes("chiffre") || s.includes('vente') || s.includes("ca")) {
    const marge = d.totalProduits > 0 ? ((res / d.totalProduits) * 100).toFixed(1) : '0.0';
    return `📊 **Chiffre d'Affaires** :\n\n**${fmt(d.totalProduits)} ${d.devisePrincipale}**\n- Marge brute : **${marge}%**`;
  }
  if (s.includes('charge') || s.includes('dépense')) {
    const ratio = d.totalProduits > 0 ? (d.totalCharges / d.totalProduits * 100).toFixed(1) : '0';
    return `📉 **Charges Totales** :\n\n**${fmt(d.totalCharges)} ${d.devisePrincipale}**\n- Ratio charges/CA : **${ratio}%**\n\n${parseFloat(ratio) > 85 ? '⚠️ Ratio élevé, analysez vos postes.' : '✅ Ratio acceptable.'}`;
  }
  if (s.includes('journal')) return `📒 Vous avez **${d.nbJournaux} journaux** configurés. Consultez **Structure > Codes Journaux**.`;
  if (s.includes('compte')) return `📋 Votre plan comptable contient **${d.nbComptes} comptes** actifs.`;
  if (s.includes('bonjour') || s.includes('salut')) return `👋 Bonjour ! Je suis **Joule**, votre assistant IA. Posez-moi une question sur vos données financières !`;
  return `🤔 Je n'ai pas compris. Essayez : *"Quel est mon résultat ?"*, *"Ma trésorerie ?"*, *"Mon CA ?"*`;
}

export default function JouleAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', role: 'assistant', content: `👋 Bonjour ! Je suis **Joule**, votre assistant comptable IA.\n\nPosez-moi n'importe quelle question sur vos données financières !` }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const currentDossierId = useStore(state => state.currentDossierId);
  const comptes = useStore(state => state.comptes).filter(c => c.dossierId === currentDossierId);
  const lignesEcriture = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);
  const journaux = useStore(state => state.journaux).filter(j => j.dossierId === currentDossierId);
  const currentDossier = useStore(state => state.dossiers).find(d => d.id === currentDossierId);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const getData = () => {
    let p = 0, c = 0, t = 0;
    lignesEcriture.forEach(l => {
      const ct = comptes.find(ct => ct.id === l.compteGeneralId);
      if (!ct) return;
      if (ct.numero.startsWith('7')) p += l.credit - l.debit;
      else if (ct.numero.startsWith('6')) c += l.debit - l.credit;
      else if (ct.numero.startsWith('5')) t += l.debit - l.credit;
    });
    return { totalProduits: Math.max(0, p), totalCharges: Math.max(0, c), tresorerie: t, nbJournaux: journaux.length, nbComptes: comptes.length, devisePrincipale: currentDossier?.devisePrincipale || 'FCFA', raisonSociale: currentDossier?.raisonSociale || 'votre société' };
  };

  const send = (text?: string) => {
    const q = text || input;
    if (!q.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: q }]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const resp = analyzeQuery(q, getData());
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', content: resp }]);
      setIsTyping(false);
    }, 700);
  };

  const renderContent = (content: string) => content.split('\n').map((line, i) => {
    const html = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
    return <p key={i} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} className="leading-relaxed" />;
  });

  if (!currentDossierId) return null;

  return (
    <>
      <button onClick={() => setIsOpen(o => !o)} className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform print:hidden" title="Joule — Assistant IA">
        {isOpen ? <X size={22} /> : <Sparkles size={22} />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-88 h-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden print:hidden" style={{ width: '380px' }}>
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Bot size={18} /></div>
            <div>
              <h3 className="font-bold text-sm">Joule — Assistant Comptable IA</h3>
              <p className="text-xs text-indigo-200 flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1"></span>En ligne · Données temps réel</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-slate-50">
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0 mt-1"><Bot size={12} className="text-white" /></div>}
                <div className={`max-w-[82%] rounded-2xl px-3 py-2.5 text-sm space-y-0.5 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none shadow-sm border border-slate-100'}`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-2 flex-shrink-0"><Bot size={12} className="text-white" /></div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 shadow-sm border border-slate-100 flex space-x-1">
                  {[0, 150, 300].map(d => <div key={d} className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />)}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="px-3 py-2 bg-white border-t border-slate-100 flex overflow-x-auto gap-2" style={{ scrollbarWidth: 'none' }}>
            {SUGGESTIONS.map(s => <button key={s} onClick={() => send(s)} className="flex-shrink-0 text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full hover:bg-indigo-100 whitespace-nowrap">{s}</button>)}
          </div>
          <div className="p-3 bg-white border-t border-slate-200 flex space-x-2">
            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Posez votre question..." className="flex-1 px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
            <button onClick={() => send()} className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 flex-shrink-0"><Send size={14} /></button>
          </div>
        </div>
      )}
    </>
  );
}
