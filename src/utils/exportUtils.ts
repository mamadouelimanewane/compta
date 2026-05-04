/**
 * DIAWDI Azure Elite - Universal Export Engine
 * Handles CSV (Excel compatible), PDF Print formatting and FEC (Fichier des Écritures Comptables)
 */

export const exportToCSV = (data: any[], filename: string) => {
  if (data.length === 0) return;
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(';'),
    ...data.map(row => 
      headers.map(header => {
        const val = row[header] === null || row[header] === undefined ? '' : row[header];
        if (typeof val === 'number') return val.toString().replace('.', ',');
        const escaped = ('' + val).replace(/"/g, '""');
        return `"${escaped}"`;
      }).join(';')
    )
  ];
  const csvContent = "\uFEFF" + csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const generateFEC = (lignes: any[], _dossiers: any[], journaux: any[], comptes: any[]) => {
  const headers = [
    "JournalCode", "JournalLib", "EcritureNum", "EcritureDate", 
    "CompteNum", "CompteLib", "CompteAuxNum", "CompteAuxLib",
    "PieceRef", "PieceDate", "EcritureLib", "Debit", "Credit", 
    "EcritureLet", "ValidDate", "Montantdevise", "Deviselib"
  ];

  const rows = lignes.map(l => {
    const jnl = journaux.find((j: any) => j.id === l.journalId || j.code === l.journalId);
    const cpt = comptes.find((c: any) => c.id === l.compteGeneralId || c.numero === l.compteGeneralId);
    
    return [
      jnl?.code || 'GEN',
      jnl?.intitule || 'Journal General',
      l.numeroPiece,
      l.date.replace(/-/g, ''),
      cpt?.numero || '000000',
      cpt?.intitule || 'Compte Inconnu',
      '', // Auxiliaire optional
      '', 
      l.reference,
      l.date.replace(/-/g, ''),
      l.libelle,
      l.debit.toString().replace('.', ','),
      l.credit.toString().replace('.', ','),
      l.lettrage || '',
      new Date().toISOString().split('T')[0].replace(/-/g, ''), // Validation date
      '',
      ''
    ].join('\t'); // FEC usually Tab delimited
  });

  const content = [headers.join('\t'), ...rows].join('\r\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `FEC_${new Date().getFullYear()}.txt`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const triggerPrint = () => {
  window.print();
};

