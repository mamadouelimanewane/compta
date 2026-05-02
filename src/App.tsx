import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NouveauDossier from './pages/fichier/NouveauDossier';
import OuvrirDossier from './pages/fichier/OuvrirDossier';
import ParametresSociete from './pages/fichier/ParametresSociete';
import PlanComptable from './pages/structure/PlanComptable';
import PlanTiers from './pages/structure/PlanTiers';
import PlanAnalytique from './pages/structure/PlanAnalytique';
import CodesJournaux from './pages/structure/CodesJournaux';
import TauxTaxes from './pages/structure/TauxTaxes';
import Banques from './pages/structure/Banques';
import ModelesSaisie from './pages/structure/ModelesSaisie';
import ModelesReglement from './pages/structure/ModelesReglement';
import SaisieJournal from './pages/traitement/SaisieJournal';
import SaisiePiece from './pages/traitement/SaisiePiece';
import SaisieLot from './pages/traitement/SaisieLot';
import SaisieIA from './pages/traitement/SaisieIA';
import Lettrage from './pages/traitement/Lettrage';
import InterrogationTiers from './pages/traitement/InterrogationTiers';
import RapprochementBancaire from './pages/traitement/RapprochementBancaire';
import ClotureJournaux from './pages/traitement/ClotureJournaux';
import FinExercice from './pages/traitement/FinExercice';
import Balance from './pages/etat/Balance';
import GrandLivre from './pages/etat/GrandLivre';
import Bilan from './pages/etat/Bilan';
import CompteResultat from './pages/etat/CompteResultat';
import Brouillard from './pages/etat/Brouillard';
import DeclarationTVA from './pages/etat/DeclarationTVA';
import Facturation from './pages/vente/Facturation';
import Budget from './pages/gestion/Budget';
import Tresorerie from './pages/gestion/Tresorerie';
import GestionUtilisateurs from './pages/admin/GestionUtilisateurs';
import ProcureToPay from './pages/achat/ProcureToPay';
import ClotureMensuelle from './pages/traitement/ClotureMensuelle';
import WarRoom from './pages/innovation/WarRoom';
import AuditIntegrite from './pages/admin/AuditIntegrite';
import UEMOACompliance from './pages/uemoa/UEMOACompliance';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="nouveau" element={<NouveauDossier />} />
          <Route path="ouvrir" element={<OuvrirDossier />} />
          <Route path="parametres" element={<ParametresSociete />} />
          
          {/* Structure */}
          <Route path="structure/plan-comptable" element={<PlanComptable />} />
          <Route path="structure/plan-tiers" element={<PlanTiers />} />
          <Route path="structure/plan-analytique" element={<PlanAnalytique />} />
          <Route path="structure/codes-journaux" element={<CodesJournaux />} />
          <Route path="structure/taux-taxes" element={<TauxTaxes />} />
          <Route path="structure/banques" element={<Banques />} />
          <Route path="structure/modeles-saisie" element={<ModelesSaisie />} />
          <Route path="structure/modeles-reglement" element={<ModelesReglement />} />
          
          {/* Traitement */}
          <Route path="traitement/saisie-journal" element={<SaisieJournal />} />
          <Route path="traitement/saisie-piece" element={<SaisiePiece />} />
          <Route path="traitement/saisie-lot" element={<SaisieLot />} />
          <Route path="traitement/saisie-ia" element={<SaisieIA />} />
          <Route path="traitement/lettrage" element={<Lettrage />} />
          <Route path="traitement/interrogation-tiers" element={<InterrogationTiers />} />
          <Route path="traitement/rapprochement" element={<RapprochementBancaire />} />
          <Route path="traitement/cloture" element={<ClotureJournaux />} />
          <Route path="traitement/fin-exercice" element={<FinExercice />} />
          
          {/* Etat */}
          <Route path="etat/balance" element={<Balance />} />
          <Route path="etat/grand-livre" element={<GrandLivre />} />
          <Route path="etat/bilan" element={<Bilan />} />
          <Route path="etat/compte-resultat" element={<CompteResultat />} />
          <Route path="etat/brouillard" element={<Brouillard />} />
          <Route path="etat/declaration-tva" element={<DeclarationTVA />} />

          {/* Gestion Commerciale */}
          <Route path="vente/facturation" element={<Facturation />} />

          {/* Contrôle de Gestion */}
          <Route path="gestion/budget" element={<Budget />} />
          <Route path="gestion/tresorerie" element={<Tresorerie />} />

          {/* Administration */}
          <Route path="admin/utilisateurs" element={<GestionUtilisateurs />} />

          {/* Achats */}
          <Route path="achat/procure-to-pay" element={<ProcureToPay />} />

          {/* Clôture Mensuelle */}
          <Route path="traitement/cloture-mensuelle" element={<ClotureMensuelle />} />

          {/* Innovation / Intelligence */}
          <Route path="intelligence/war-room" element={<WarRoom />} />
          <Route path="intelligence/audit-integrite" element={<AuditIntegrite />} />

          {/* Régional UEMOA */}
          <Route path="uemoa/compliance" element={<UEMOACompliance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
