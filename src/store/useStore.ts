import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface DossierComptable {
  id: string;
  raisonSociale: string;
  adresse?: string;
  codePostal?: string;
  ville?: string;
  siret?: string;
  codeNaf?: string;
  dateDebutExercice: string;
  dateFinExercice: string;
  longueurComptes: number;
  devisePrincipale: string;
}

export interface CompteGeneral {
  id: string;
  dossierId: string;
  numero: string;
  intitule: string;
  type: 'Détail' | 'Total';
  nature: 'Charge' | 'Produit' | 'Trésorerie' | 'Immobilisation' | 'Capitaux' | 'Tiers' | 'Autre';
  saisieAnalytique: boolean;
  saisieEcheance: boolean;
  lettrageAutomatique: boolean;
  dateCreation: string;
}

export interface CompteTiers {
  id: string;
  dossierId: string;
  numero: string;
  intitule: string;
  type: 'Client' | 'Fournisseur' | 'Salarié' | 'Autre';
  compteGeneralId: string;
  adresse?: string;
  dateCreation: string;
}

export interface Journal {
  id: string;
  dossierId: string;
  code: string;
  intitule: string;
  type: 'Achat' | 'Vente' | 'Trésorerie' | 'Général' | 'Situation';
}

export interface LigneEcriture {
  id: string;
  dossierId: string;
  journalId: string;
  date: string;
  numeroPiece: string;
  reference: string;
  compteGeneralId: string;
  compteTiersId?: string;
  libelle: string;
  debit: number;
  credit: number;
  validee: boolean;
  lettrage?: string;
  sectionAnalytique?: string;
  hash?: string;
  notes?: string;
}

export interface Taxe {
  id: string;
  dossierId: string;
  code: string;
  intitule: string;
  taux: number;
  compteRattacheId: string;
}

export interface BudgetPrevisionnel {
  id: string;
  dossierId: string;
  compteGeneralId: string;
  exercice: number;
  montantAnnuel: number;
  repartitionMensuelle: number[];
}

interface AppState {
  currentDossierId: string | null;
  dossiers: DossierComptable[];
  comptes: CompteGeneral[];
  comptesTiers: CompteTiers[];
  journaux: Journal[];
  taxes: Taxe[];
  lignesEcriture: LigneEcriture[];
  budgets: BudgetPrevisionnel[];
  
  setCurrentDossier: (id: string | null) => void;
  createDossier: (dossier: Omit<DossierComptable, 'id'>) => DossierComptable;
  updateDossier: (id: string, updates: Partial<DossierComptable>) => void;
  deleteDossier: (id: string) => void;
  addCompte: (compte: Omit<CompteGeneral, 'id' | 'dateCreation'>) => void;
  updateCompte: (id: string, updates: Partial<CompteGeneral>) => void;
  deleteCompte: (id: string) => void;
  addCompteTiers: (compte: Omit<CompteTiers, 'id' | 'dateCreation'>) => void;
  updateCompteTiers: (id: string, updates: Partial<CompteTiers>) => void;
  deleteCompteTiers: (id: string) => void;
  addJournal: (journal: Omit<Journal, 'id'>) => void;
  updateJournal: (id: string, updates: Partial<Journal>) => void;
  deleteJournal: (id: string) => void;
  addTaxe: (taxe: Omit<Taxe, 'id'>) => void;
  updateTaxe: (id: string, updates: Partial<Taxe>) => void;
  deleteTaxe: (id: string) => void;
  addLigneEcriture: (ligne: Omit<LigneEcriture, 'id' | 'hash'>) => void;
  updateLigneEcriture: (id: string, updates: Partial<LigneEcriture>) => void;
  deleteLigneEcriture: (id: string) => void;
  setBudget: (budget: Omit<BudgetPrevisionnel, 'id'>) => void;
  deleteBudget: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentDossierId: null,
      dossiers: [],
      comptes: [],
      comptesTiers: [],
      journaux: [],
      taxes: [],
      lignesEcriture: [],
      budgets: [],

      setCurrentDossier: (id) => set({ currentDossierId: id }),
      
      createDossier: (d) => {
        const newDossier = { ...d, id: uuidv4() };
        set(state => ({ dossiers: [...state.dossiers, newDossier] }));
        return newDossier;
      },
      updateDossier: (id, updates) => set(state => ({
        dossiers: state.dossiers.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDossier: (id) => set(state => ({
        dossiers: state.dossiers.filter(d => d.id !== id)
      })),

      addCompte: (c) => set(state => ({
        comptes: [...state.comptes, { ...c, id: uuidv4(), dateCreation: new Date().toISOString() }]
      })),
      updateCompte: (id, u) => set(state => ({
        comptes: state.comptes.map(c => c.id === id ? { ...c, ...u } : c)
      })),
      deleteCompte: (id) => set(state => ({
        comptes: state.comptes.filter(c => c.id !== id)
      })),

      addCompteTiers: (c) => set(state => ({
        comptesTiers: [...state.comptesTiers, { ...c, id: uuidv4(), dateCreation: new Date().toISOString() }]
      })),
      updateCompteTiers: (id, u) => set(state => ({
        comptesTiers: state.comptesTiers.map(c => c.id === id ? { ...c, ...u } : c)
      })),
      deleteCompteTiers: (id) => set(state => ({
        comptesTiers: state.comptesTiers.filter(c => c.id !== id)
      })),

      addJournal: (j) => set(state => ({
        journaux: [...state.journaux, { ...j, id: uuidv4() }]
      })),
      updateJournal: (id, u) => set(state => ({
        journaux: state.journaux.map(j => j.id === id ? { ...j, ...u } : j)
      })),
      deleteJournal: (id) => set(state => ({
        journaux: state.journaux.filter(j => j.id !== id)
      })),

      addTaxe: (t) => set(state => ({
        taxes: [...state.taxes, { ...t, id: uuidv4() }]
      })),
      updateTaxe: (id, u) => set(state => ({
        taxes: state.taxes.map(t => t.id === id ? { ...t, ...u } : t)
      })),
      deleteTaxe: (id) => set(state => ({
        taxes: state.taxes.filter(t => t.id !== id)
      })),

      addLigneEcriture: (l) => {
        const hashBase = `${l.date}|${l.compteGeneralId}|${l.debit}|${l.credit}|${l.sectionAnalytique || ''}`;
        const hash = btoa(hashBase);
        set(state => ({
          lignesEcriture: [...state.lignesEcriture, { ...l, id: uuidv4(), hash }]
        }));
      },
      updateLigneEcriture: (id, u) => set(state => ({
        lignesEcriture: state.lignesEcriture.map(l => l.id === id ? { ...l, ...u } : l)
      })),
      deleteLigneEcriture: (id) => set(state => ({
        lignesEcriture: state.lignesEcriture.filter(l => l.id !== id)
      })),

      setBudget: (b) => set(state => {
        const existing = state.budgets.find(exist => 
          exist.compteGeneralId === b.compteGeneralId && 
          exist.exercice === b.exercice && 
          exist.dossierId === b.dossierId
        );
        if (existing) {
          return {
            budgets: state.budgets.map(exist => 
              exist.id === existing.id ? { ...exist, ...b } : exist
            )
          };
        }
        return { budgets: [...state.budgets, { ...b, id: uuidv4() }] };
      }),
      deleteBudget: (id) => set(state => ({
        budgets: state.budgets.filter(b => b.id !== id)
      })),
    }),
    { name: 'compta-storage' }
  )
);
