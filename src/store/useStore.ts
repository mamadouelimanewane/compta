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
  compteGeneralId: string; // The collective account (e.g., 411000 for clients)
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
  date: string; // YYYY-MM-DD
  numeroPiece: string;
  reference: string;
  compteGeneralId: string;
  compteTiersId?: string;
  libelle: string;
  debit: number;
  credit: number;
  validee: boolean;
  lettrage?: string;
  hash?: string; // Digital fingerprint for audit integrity
  notes?: string; // Collaborative notes / Post-it
}

interface AppState {
  currentDossierId: string | null;
  dossiers: DossierComptable[];
  comptes: CompteGeneral[];
  comptesTiers: CompteTiers[];
  journaux: Journal[];
  lignesEcriture: LigneEcriture[];
  
  // Actions
  setCurrentDossier: (id: string | null) => void;
  createDossier: (dossier: Omit<DossierComptable, 'id'>) => DossierComptable;
  addCompte: (compte: Omit<CompteGeneral, 'id' | 'dateCreation'>) => void;
  addCompteTiers: (compte: Omit<CompteTiers, 'id' | 'dateCreation'>) => void;
  addJournal: (journal: Omit<Journal, 'id'>) => void;
  addLigneEcriture: (ligne: Omit<LigneEcriture, 'id' | 'validee'>) => void;
  updateLigneEcriture: (id: string, updates: Partial<LigneEcriture>) => void;
  deleteLigneEcriture: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      currentDossierId: null,
      dossiers: [],
      comptes: [],
      comptesTiers: [],
      journaux: [],
      lignesEcriture: [],
      
      setCurrentDossier: (id) => set({ currentDossierId: id }),
      
      createDossier: (dossierData) => {
        const newDossier: DossierComptable = {
          ...dossierData,
          id: uuidv4(),
        };
        // Add default journals when creating a dossier
        const defaultJournaux: Journal[] = [
          { id: uuidv4(), dossierId: newDossier.id, code: 'ACH', intitule: 'Achats', type: 'Achat' },
          { id: uuidv4(), dossierId: newDossier.id, code: 'VTE', intitule: 'Ventes', type: 'Vente' },
          { id: uuidv4(), dossierId: newDossier.id, code: 'BQ', intitule: 'Banque', type: 'Trésorerie' },
          { id: uuidv4(), dossierId: newDossier.id, code: 'CAIS', intitule: 'Caisse', type: 'Trésorerie' },
          { id: uuidv4(), dossierId: newDossier.id, code: 'OD', intitule: 'Opérations Diverses', type: 'Général' },
          { id: uuidv4(), dossierId: newDossier.id, code: 'RAN', intitule: 'A-Nouveaux', type: 'Situation' }
        ];

        set((state) => ({
          dossiers: [...state.dossiers, newDossier],
          journaux: [...state.journaux, ...defaultJournaux],
          currentDossierId: newDossier.id
        }));
        return newDossier;
      },
      
      addCompte: (compteData) => {
        const newCompte: CompteGeneral = {
          ...compteData,
          id: uuidv4(),
          dateCreation: new Date().toISOString(),
        };
        set((state) => ({
          comptes: [...state.comptes, newCompte]
        }));
      },

      addCompteTiers: (compteData) => {
        const newCompteTiers: CompteTiers = {
          ...compteData,
          id: uuidv4(),
          dateCreation: new Date().toISOString(),
        };
        set((state) => ({
          comptesTiers: [...state.comptesTiers, newCompteTiers]
        }));
      },

      addJournal: (journalData) => {
        const newJournal: Journal = {
          ...journalData,
          id: uuidv4()
        };
        set((state) => ({
          journaux: [...state.journaux, newJournal]
        }));
      },

      addLigneEcriture: (ligneData) => {
        const id = uuidv4();
        // Simple hash generation based on content
        const content = `${ligneData.date}|${ligneData.numeroPiece}|${ligneData.compteGeneralId}|${ligneData.debit}|${ligneData.credit}|${ligneData.libelle}`;
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
          hash = ((hash << 5) - hash) + content.charCodeAt(i);
          hash |= 0;
        }
        
        const newLigne: LigneEcriture = {
          ...ligneData,
          id,
          validee: false,
          hash: Math.abs(hash).toString(16), // Store fingerprint
        };
        set((state) => ({
          lignesEcriture: [...state.lignesEcriture, newLigne]
        }));
      },

      updateLigneEcriture: (id, updates) => {
        set((state) => ({
          lignesEcriture: state.lignesEcriture.map(l => 
            l.id === id ? { ...l, ...updates } : l
          )
        }));
      },

      deleteLigneEcriture: (id) => {
        set((state) => ({
          lignesEcriture: state.lignesEcriture.filter(l => l.id !== id)
        }));
      }
    }),
    {
      name: 'compta-storage',
    }
  )
);
