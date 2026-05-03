import { useStore } from '../store/useStore';

export const loadDemoOHADA = () => {
  const store = useStore.getState();
  
  const newDossier = store.createDossier({
    raisonSociale: "SOCIÉTÉ D'EXEMPLE OHADA SA",
    adresse: "BP 1234 Plateau",
    ville: "Abidjan",
    siret: "CI-ABJ-2026-B-12345",
    codeNaf: "Commerce de gros",
    dateDebutExercice: "2026-01-01",
    dateFinExercice: "2026-12-31",
    longueurComptes: 6,
    devisePrincipale: "FCFA"
  });

  const dossierId = newDossier.id;
  
  const ohadaComptes = [
    { numero: "101100", intitule: "Capital social", nature: "Capitaux", type: "Détail" },
    { numero: "131000", intitule: "Résultat net", nature: "Capitaux", type: "Détail" },
    { numero: "162000", intitule: "Emprunts bancaires", nature: "Capitaux", type: "Détail" },
    { numero: "211000", intitule: "Frais de recherche", nature: "Immobilisation", type: "Détail" },
    { numero: "231000", intitule: "Bâtiments", nature: "Immobilisation", type: "Détail" },
    { numero: "244000", intitule: "Matériel de transport", nature: "Immobilisation", type: "Détail" },
    { numero: "311000", intitule: "Marchandises", nature: "Autre", type: "Détail" },
    { numero: "401100", intitule: "Fournisseurs d'exploitation", nature: "Tiers", type: "Total" },
    { numero: "411100", intitule: "Clients d'exploitation", nature: "Tiers", type: "Total" },
    { numero: "421000", intitule: "Personnel, avances", nature: "Tiers", type: "Détail" },
    { numero: "431000", intitule: "Sécurité sociale", nature: "Tiers", type: "Détail" },
    { numero: "443100", intitule: "TVA facturée sur ventes", nature: "Autre", type: "Détail" },
    { numero: "445200", intitule: "TVA récupérable s/achats", nature: "Autre", type: "Détail" },
    { numero: "521100", intitule: "Banque SGBCI", nature: "Trésorerie", type: "Détail" },
    { numero: "521200", intitule: "Banque Ecobank", nature: "Trésorerie", type: "Détail" },
    { numero: "571000", intitule: "Caisse principale", nature: "Trésorerie", type: "Détail" },
    { numero: "601100", intitule: "Achat de marchandises", nature: "Charge", type: "Détail" },
    { numero: "605000", intitule: "Eau et Electricité", nature: "Charge", type: "Détail" },
    { numero: "613000", intitule: "Locations", nature: "Charge", type: "Détail" },
    { numero: "631000", intitule: "Frais bancaires", nature: "Charge", type: "Détail" },
    { numero: "661000", intitule: "Rémunération du personnel", nature: "Charge", type: "Détail" },
    { numero: "701100", intitule: "Ventes de marchandises", nature: "Produit", type: "Détail" },
    { numero: "706000", intitule: "Services vendus", nature: "Produit", type: "Détail" },
    { numero: "771000", intitule: "Gains de change", nature: "Produit", type: "Détail" },
  ];

  ohadaComptes.forEach(c => {
    store.addCompte({
      dossierId: dossierId,
      numero: c.numero,
      intitule: c.intitule,
      nature: c.nature as any,
      type: c.type as 'Détail' | 'Total',
      saisieAnalytique: false,
      saisieEcheance: false,
      lettrageAutomatique: c.nature === 'Tiers',
    });
  });

  const updatedComptes = useStore.getState().comptes.filter(c => c.dossierId === dossierId);
  const clientCompteId = updatedComptes.find(c => c.numero === "411100")?.id;
  const fournCompteId = updatedComptes.find(c => c.numero === "401100")?.id;

  if (clientCompteId) {
    store.addCompteTiers({ dossierId: dossierId, numero: "CL001", intitule: "SUPERMARCHÉ PROSUMA", type: "Client", compteGeneralId: clientCompteId });
    store.addCompteTiers({ dossierId: dossierId, numero: "CL002", intitule: "ENTREPRISE BTP SA", type: "Client", compteGeneralId: clientCompteId });
  }
  if (fournCompteId) {
    store.addCompteTiers({ dossierId: dossierId, numero: "FR001", intitule: "FOURNISSEUR MATERIEL INFORMATIQUE", type: "Fournisseur", compteGeneralId: fournCompteId });
    store.addCompteTiers({ dossierId: dossierId, numero: "FR002", intitule: "CIE (Electricité)", type: "Fournisseur", compteGeneralId: fournCompteId });
  }

  const journaux = useStore.getState().journaux.filter(j => j.dossierId === dossierId);
  const journalVenteId = journaux.find(j => j.code === "VTE")?.id;
  const journalAchatId = journaux.find(j => j.code === "ACH")?.id;
  const journalBanqueId = journaux.find(j => j.code === "BQ")?.id;

  const compteVente = updatedComptes.find(c => c.numero === "701100")?.id;
  const compteClient = updatedComptes.find(c => c.numero === "411100")?.id;
  const compteTVA = updatedComptes.find(c => c.numero === "443100")?.id;
  const compteBanque = updatedComptes.find(c => c.numero === "521100")?.id;
  const compteAchat = updatedComptes.find(c => c.numero === "601100")?.id;
  const compteFourn = updatedComptes.find(c => c.numero === "401100")?.id;

  if (journalVenteId && compteVente && compteClient && compteTVA) {
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalVenteId, date: "2026-01-15", numeroPiece: "FA-001", reference: "Prosuma", compteGeneralId: compteClient, libelle: "Vente marchandises", debit: 1180000, credit: 0 });
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalVenteId, date: "2026-01-15", numeroPiece: "FA-001", reference: "Prosuma", compteGeneralId: compteVente, libelle: "Vente marchandises", debit: 0, credit: 1000000 });
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalVenteId, date: "2026-01-15", numeroPiece: "FA-001", reference: "Prosuma", compteGeneralId: compteTVA, libelle: "TVA 18%", debit: 0, credit: 180000 });
  }

  if (journalAchatId && compteAchat && compteFourn) {
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalAchatId, date: "2026-01-10", numeroPiece: "FA-ACH-01", reference: "Mat Info", compteGeneralId: compteAchat, libelle: "Achat PC Portable", debit: 500000, credit: 0 });
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalAchatId, date: "2026-01-10", numeroPiece: "FA-ACH-01", reference: "Mat Info", compteGeneralId: compteFourn, libelle: "Achat PC Portable", debit: 0, credit: 500000 });
  }

  const compteLoyer = updatedComptes.find(c => c.numero === "613000")?.id;
  if (journalBanqueId && compteLoyer && compteBanque) {
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalBanqueId, date: "2026-01-20", numeroPiece: "VIR-001", reference: "Loyer Janvier", compteGeneralId: compteLoyer, libelle: "Paiement loyer", debit: 200000, credit: 0 });
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalBanqueId, date: "2026-01-20", numeroPiece: "VIR-001", reference: "Loyer Janvier", compteGeneralId: compteBanque, libelle: "Paiement loyer", debit: 0, credit: 200000 });
  }

  if (journalBanqueId && compteClient && compteBanque) {
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalBanqueId, date: "2026-02-05", numeroPiece: "CHQ-123", reference: "Paiement FA-001", compteGeneralId: compteBanque, libelle: "Encaissement Prosuma", debit: 1180000, credit: 0 });
    store.addLigneEcriture({ dossierId: dossierId, journalId: journalBanqueId, date: "2026-02-05", numeroPiece: "CHQ-123", reference: "Paiement FA-001", compteGeneralId: compteClient, libelle: "Encaissement Prosuma", debit: 0, credit: 1180000 });
  }

  alert("Dossier OHADA SYSCOA 'SOCIÉTÉ D'EXEMPLE' généré avec succès !");
  window.location.reload();
};
