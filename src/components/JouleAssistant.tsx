import { useState, useEffect } from 'react';
import { Bot, X, Send, Sparkles, Zap, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function JouleAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState<{ role: 'ai' | 'user', text: string, type?: 'insight' | 'warning' | 'success' }[]>([
    { role: 'ai', text: "Bonjour ! Je suis Joule, votre assistant financier DIAWDI. Comment puis-je vous aider aujourd'hui ?", type: 'success' }
  ]);
  
  const currentDossierId = useStore(state => state.currentDossierId);
  const lignes = useStore(state => state.lignesEcriture).filter(l => l.dossierId === currentDossierId);

  const handleSend = () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setMessage('');

    setTimeout(() => {
      let aiResponse = "Je n'ai pas assez de données pour répondre précisément. Essayez de me demander une analyse de ma trésorerie.";
      let type: any = 'insight';

      if (userMessage.toLowerCase().includes('trésorerie') || userMessage.toLowerCase().includes('argent')) {
        const solde = lignes.reduce((sum, l) => sum + (l.debit - l.credit), 0);
        aiResponse = `Votre solde de trésorerie actuel est de ${solde.toLocaleString()} FCFA. L'analyse prédictive indique une stabilité pour les 30 prochains jours.`;
        type = 'insight';
      } else if (userMessage.toLowerCase().includes('clôture')) {
        aiResponse = "La clôture annuelle est disponible dans le menu Traitement. N'oubliez pas d'imprimer votre grand-livre avant de lancer la procédure.";
        type = 'warning';
      }

      setHistory(prev => [...prev, { role: 'ai', text: aiResponse, type }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-96 h-[500px] bg-slate-950 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col overflow-hidden mb-4 animate-in slide-in-from-bottom-10 duration-500 backdrop-blur-2xl">
          <div className="p-6 bg-indigo-600 flex justify-between items-center text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-indigo-200">DIAWDI AI</p>
                <p className="text-sm font-bold">Joule Intelligence</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {history.map((h, i) => (
              <div key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${h.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white/10 text-slate-300'}`}>
                  {h.type === 'insight' && <TrendingUp size={16} className="text-emerald-400 mb-2" />}
                  {h.type === 'warning' && <AlertTriangle size={16} className="text-amber-400 mb-2" />}
                  {h.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-white/5 border-t border-white/10 flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              placeholder="Posez une question financière..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group relative ${isOpen ? 'bg-slate-900 text-white' : 'bg-indigo-600 text-white'}`}
      >
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-slate-50 animate-pulse"></div>
        )}
        {isOpen ? <X size={28} /> : <Bot size={28} className="group-hover:rotate-12 transition-transform" />}
      </button>
    </div>
  );
}
