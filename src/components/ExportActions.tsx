import { Download, Printer } from 'lucide-react';
import { exportToCSV, triggerPrint } from '../utils/exportUtils';

interface ExportActionsProps {
  data: any[];
  filename: string;
  title: string;
}

export default function ExportActions({ data, filename, title }: ExportActionsProps) {
  return (
    <div className="flex items-center gap-3 no-print">
      <button 
        onClick={() => exportToCSV(data, filename)}
        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-100 transition-all shadow-sm"
      >
        <Download size={14} /> Excel (CSV)
      </button>
      <button 
        onClick={() => triggerPrint()}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all shadow-sm"
      >
        <Printer size={14} /> Imprimer / PDF
      </button>
    </div>
  );
}
