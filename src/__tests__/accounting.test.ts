import { describe, it, expect, beforeEach } from 'vitest';
import { useStore } from '../store/useStore';

describe('Calculs de Balance et Intégrité Comptable', () => {
  beforeEach(() => {
    // Reset store state if needed or use a clean dossier
    const state = useStore.getState();
    // For testing purposes, we can manually manipulate the state
  });

  it('devrait calculer correctement les soldes d\'une balance équilibrée', () => {
    const state = useStore.getState();
    const dossierId = 'test-dossier';
    
    // 1. Ajouter des comptes
    state.addCompte({ id: 'c1', dossierId, numero: '601000', intitule: 'Achats', nature: 'Charge' } as any);
    state.addCompte({ id: 'c2', dossierId, numero: '401000', intitule: 'Fournisseurs', nature: 'Tiers' } as any);

    // 2. Ajouter des écritures
    state.addLigneEcriture({
      id: 'l1', dossierId, journalId: 'HA', date: '2024-01-01',
      compteGeneralId: 'c1', debit: 1000, credit: 0, validee: true
    } as any);
    state.addLigneEcriture({
      id: 'l2', dossierId, journalId: 'HA', date: '2024-01-01',
      compteGeneralId: 'c2', debit: 0, credit: 1000, validee: true
    } as any);

    // 3. Vérifier les totaux
    const lignes = useStore.getState().lignesEcriture.filter(l => l.dossierId === dossierId);
    const totalDebit = lignes.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lignes.reduce((s, l) => s + l.credit, 0);

    expect(totalDebit).toBe(1000);
    expect(totalCredit).toBe(1000);
    expect(totalDebit - totalCredit).toBe(0);
  });

  it('devrait valider l\'intégrité d\'une balance multi-comptes avec soldes complexes', () => {
    const state = useStore.getState();
    const dossierId = 'complex-test';
    
    // Ajout comptes
    const comptes = [
      { id: 'ca1', dossierId, numero: '601000', intitule: 'Achats' },
      { id: 'ca2', dossierId, numero: '401000', intitule: 'Fournisseurs' },
      { id: 'ca3', dossierId, numero: '445700', intitule: 'TVA Collectée' },
      { id: 'ca4', dossierId, numero: '701000', intitule: 'Ventes' },
    ];
    comptes.forEach(c => state.addCompte(c as any));

    // Écritures Achat
    state.addLigneEcriture({ id: 'la1', dossierId, compteGeneralId: 'ca1', debit: 1000, credit: 0, date: '2024-01-01' } as any);
    state.addLigneEcriture({ id: 'la2', dossierId, compteGeneralId: 'ca2', debit: 0, credit: 1000, date: '2024-01-01' } as any);

    // Écritures Vente (avec TVA)
    state.addLigneEcriture({ id: 'lv1', dossierId, compteGeneralId: 'ca2', debit: 2360, credit: 0, date: '2024-01-02' } as any);
    state.addLigneEcriture({ id: 'lv2', dossierId, compteGeneralId: 'ca4', debit: 0, credit: 2000, date: '2024-01-02' } as any);
    state.addLigneEcriture({ id: 'lv3', dossierId, compteGeneralId: 'ca3', debit: 0, credit: 360, date: '2024-01-02' } as any);

    const lignes = useStore.getState().lignesEcriture.filter(l => l.dossierId === dossierId);
    const totalDebit = lignes.reduce((s, l) => s + l.debit, 0);
    const totalCredit = lignes.reduce((s, l) => s + l.credit, 0);

    // Vérification de l'équilibre général
    expect(totalDebit).toBe(3360);
    expect(totalCredit).toBe(3360);
    expect(totalDebit - totalCredit).toBe(0);

    // Vérification d'un solde spécifique (Fournisseur 401000)
    // Credit 1000 (achat) + Debit 2360 (paiement/autre) = 1360 DB
    const lignesFou = lignes.filter(l => l.compteGeneralId === 'ca2');
    const soldeFou = lignesFou.reduce((s, l) => s + (l.debit - l.credit), 0);
    expect(soldeFou).toBe(1360);
  });
});
