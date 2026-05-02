import { useState, useRef } from 'react';
import { Scan, Upload, FileText, CheckCircle, Zap, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function SaisieIA() {
  const [dragActive, setDragActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanComplete, setScanComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [extractedData, setExtractedData] = useState({
    fournisseur: '',
    date: '',
    numeroFacture: '',
    montantHT: 0,
    montantTVA: 0,
    montantTTC: 0,
  });

  // Simulated OCR Process
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    e.preventDefault();
    setIsScanning(true);
    setScanComplete(false);
    
    // Simulate API delay for OCR
    setTimeout(() => {
      setExtractedData({
        fournisseur: 'SOCIÉTÉ GÉNÉRALE DE TÉLÉCOMS (SGT)',
        date: format(new Date(), 'yyyy-MM-dd'),
        numeroFacture: 'FA-' + Math.floor(Math.random() * 100000),
        montantHT: 1500.00,
        montantTVA: 270.00, // 18%
        montantTTC: 1770.00,
      });
      setIsScanning(false);
      setScanComplete(true);
    }, 2500);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-slate-900 flex items-center">
          <Zap className="mr-2 text-amber-500 fill-amber-500" />
          Saisie Intelligente par IA (OCR)
        </h1>
      </div>

      {!scanComplete && !isScanning && (
        <div 
          className={`flex-1 border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-colors ${dragActive ? 'border-primary bg-indigo-50' : 'border-slate-300 bg-white hover:bg-slate-50'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="application/pdf,image/png,image/jpeg"
          />
          <div className="p-6 bg-indigo-50 rounded-full text-primary mb-6">
            <Upload size={48} />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Glissez une facture PDF ou Image ici</h2>
          <p className="text-slate-500 text-center max-w-md">
            Notre intelligence artificielle analysera le document, extraira les montants et générera l'écriture comptable automatiquement.
          </p>
        </div>
      )}

      {isScanning && (
        <div className="flex-1 bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center">
          <Scan className="w-16 h-16 text-primary animate-pulse mb-6" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Analyse IA en cours...</h2>
          <p className="text-slate-500 flex items-center">
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Extraction des données du document (Fournisseur, HT, TVA, TTC)
          </p>
          
          <div className="w-64 h-2 bg-slate-100 rounded-full mt-8 overflow-hidden">
            <div className="h-full bg-primary animate-pulse w-full origin-left" style={{ animationDuration: '2.5s' }}></div>
          </div>
        </div>
      )}

      {scanComplete && (
        <div className="flex-1 grid grid-cols-2 gap-6">
          {/* Document Preview Panel */}
          <div className="bg-slate-800 rounded-xl p-6 flex flex-col text-white shadow-inner relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <CheckCircle size={16} className="mr-1" />
              Document analysé à 98%
            </div>
            
            <div className="flex items-center mb-6 text-slate-300">
              <FileText className="mr-2" />
              <span className="font-medium">Aperçu du document</span>
            </div>
            
            <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-8 space-y-6">
              <div className="w-3/4 h-8 bg-white/10 rounded"></div>
              <div className="w-1/2 h-4 bg-white/5 rounded"></div>
              <div className="w-1/3 h-4 bg-white/5 rounded"></div>
              
              <div className="pt-8 space-y-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <div className="w-1/2 h-4 bg-white/10 rounded"></div>
                  <div className="w-1/4 h-4 bg-white/10 rounded"></div>
                </div>
                <div className="flex justify-between pt-4">
                  <div className="w-1/4 h-6 bg-white/20 rounded"></div>
                  <div className="w-1/3 h-6 bg-emerald-500/40 rounded"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Extracted Data Panel */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col">
            <div className="border-b border-slate-200 px-6 py-4 flex justify-between items-center bg-indigo-50/50">
              <h3 className="font-semibold text-slate-800">Écriture générée</h3>
              <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-bold uppercase">Achat</span>
            </div>
            
            <div className="p-6 space-y-6 flex-1 overflow-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Fournisseur</label>
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md font-medium">
                    {extractedData.fournisseur}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">N° Pièce</label>
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md font-medium">
                    {extractedData.numeroFacture}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <div className="px-3 py-2 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-md font-medium">
                    {format(new Date(extractedData.date), 'dd/MM/yyyy')}
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 text-slate-600">
                      <th className="py-2 w-24">Compte</th>
                      <th className="py-2">Libellé</th>
                      <th className="py-2 text-right w-28">Débit</th>
                      <th className="py-2 text-right w-28">Crédit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    <tr>
                      <td className="py-3 text-indigo-600">604000</td>
                      <td className="py-3">Achats d'études et prestations</td>
                      <td className="py-3 text-right">{extractedData.montantHT.toFixed(2)}</td>
                      <td className="py-3 text-right"></td>
                    </tr>
                    <tr>
                      <td className="py-3 text-indigo-600">445660</td>
                      <td className="py-3">TVA déductible sur autres B&S</td>
                      <td className="py-3 text-right">{extractedData.montantTVA.toFixed(2)}</td>
                      <td className="py-3 text-right"></td>
                    </tr>
                    <tr>
                      <td className="py-3 text-emerald-600 font-bold">401000</td>
                      <td className="py-3">Frs - {extractedData.fournisseur}</td>
                      <td className="py-3 text-right"></td>
                      <td className="py-3 text-right font-bold text-emerald-700">{extractedData.montantTTC.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="border-t border-slate-200 p-4 bg-slate-50 flex justify-end space-x-3">
              <button 
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-100 transition-colors"
                onClick={() => setScanComplete(false)}
              >
                Annuler
              </button>
              <button 
                className="px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 font-medium transition-colors shadow-sm flex items-center"
                onClick={() => {
                  alert("Écriture validée et enregistrée dans le journal des Achats !");
                  setScanComplete(false);
                }}
              >
                <CheckCircle size={18} className="mr-2" /> Valider l'écriture
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
