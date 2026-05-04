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
import Budget from './pages/gestion/BudgetAvance';
import Tresorerie from './pages/gestion/Tresorerie';
import GestionUtilisateurs from './pages/admin/GestionUtilisateurs';
import ProcureToPay from './pages/achat/ProcureToPay';
import ClotureMensuelle from './pages/traitement/ClotureMensuelle';
import WarRoom from './pages/innovation/WarRoom';
import AuditIntegrite from './pages/admin/AuditIntegrite';
import Immobilisations from './pages/structure/Immobilisations';
import SecurityHub from './pages/admin/SecurityHub';
import UEMOACompliance from './pages/uemoa/UEMOACompliance';
import LiasseFiscale from './pages/etat/LiasseFiscale';
import StatistiquesGlobales from './pages/intelligence/StatistiquesGlobales';
import Importer from './pages/fichier/Importer';
import Exporter from './pages/fichier/Exporter';
import MiseEnPage from './pages/fichier/MiseEnPage';
import Imprimer from './pages/fichier/Imprimer';
import Informations from './pages/fichier/Informations';
import Communication from './pages/fichier/Communication';
import Personnalisation from './pages/fenetre/Personnalisation';
import Navigation from './pages/fenetre/Navigation';
import AideEnLigne from './pages/aide/AideEnLigne';
import JournalTraitement from './pages/edition/JournalTraitement';
import Collaborateurs from './pages/structure/Collaborateurs';
import RechercheEcritures from './pages/traitement/RechercheEcritures';
import PlanComptableEtat from './pages/etat/PlanComptableEtat';
import JournauxEtat from './pages/etat/JournauxEtat';
import EtatsAnalytiques from './pages/etat/EtatsAnalytiques';
import EtatPieces from './pages/etat/EtatPieces';
import AnalyseVentesAchats from './pages/etat/AnalyseVentesAchats';
import AnalyseFinanciere from './pages/etat/AnalyseFinanciere';
import CoutIndustriel from './pages/gestion/CoutIndustriel';
import SuiviTiers from './pages/etat/SuiviTiers';
import ComparatifMultiExercices from './pages/etat/ComparatifMultiExercices';
import RapprochementBancaireEtat from './pages/etat/RapprochementBancaireEtat';

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
          <Route path="structure/immobilisations" element={<Immobilisations />} />
          <Route path="structure/collaborateurs" element={<Collaborateurs />} />
          
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
          <Route path="traitement/recherche-ecritures" element={<RechercheEcritures />} />
          <Route path="traitement/cloture-mensuelle" element={<ClotureMensuelle />} />
          
          {/* Etat */}
          <Route path="etat/balance" element={<Balance />} />
          <Route path="etat/grand-livre" element={<GrandLivre />} />
          <Route path="etat/bilan" element={<Bilan />} />
          <Route path="etat/compte-resultat" element={<CompteResultat />} />
          <Route path="etat/brouillard" element={<Brouillard />} />
          <Route path="etat/declaration-tva" element={<DeclarationTVA />} />
          <Route path="etat/plan-comptable" element={<PlanComptableEtat />} />
          <Route path="etat/journaux" element={<JournauxEtat />} />
          <Route path="etat/analytique" element={<EtatsAnalytiques />} />
          <Route path="etat/etat-pieces" element={<EtatPieces />} />
          <Route path="etat/analyse-ventes-achats" element={<AnalyseVentesAchats />} />
          <Route path="etat/analyse-financiere" element={<AnalyseFinanciere />} />
          <Route path="etat/suivi-tiers" element={<SuiviTiers />} />
          <Route path="etat/comparatif" element={<ComparatifMultiExercices />} />
          <Route path="etat/rapprochement-bancaire" element={<RapprochementBancaireEtat />} />

          {/* Gestion Commerciale */}
          <Route path="vente/facturation" element={<Facturation />} />
          <Route path="achat/procure-to-pay" element={<ProcureToPay />} />

          {/* Contrôle de Gestion */}
          <Route path="gestion/budget" element={<Budget />} />
          <Route path="gestion/tresorerie" element={<Tresorerie />} />
          <Route path="gestion/cout-industriel" element={<CoutIndustriel />} />

          {/* Innovation / Intelligence */}
          <Route path="intelligence/war-room" element={<WarRoom />} />
          <Route path="intelligence/audit-integrite" element={<AuditIntegrite />} />

          {/* Administration */}
          <Route path="admin/utilisateurs" element={<GestionUtilisateurs />} />
          <Route path="admin/security" element={<SecurityHub />} />

          {/* Régional UEMOA & Fiscalité */}
          <Route path="uemoa/compliance" element={<UEMOACompliance />} />
          <Route path="etat/liasse-fiscale" element={<LiasseFiscale />} />

          {/* Fichier Tools */}
          <Route path="fichier/importer" element={<Importer />} />
          <Route path="fichier/exporter" element={<Exporter />} />
          <Route path="fichier/mise-en-page" element={<MiseEnPage />} />
          <Route path="fichier/imprimer" element={<Imprimer />} />
          <Route path="fichier/informations" element={<Informations />} />
          <Route path="fichier/communication" element={<Communication />} />
          
          {/* Intelligence & Analytics */}
          <Route path="intelligence/statistiques" element={<StatistiquesGlobales />} />
          
          {/* Fenêtre & Aide */}
          <Route path="fenetre/personnalisation" element={<Personnalisation />} />
          <Route path="fenetre/navigation" element={<Navigation />} />
          <Route path="aide/en-ligne" element={<AideEnLigne />} />
          
          <Route path="edition/journal-traitement" element={<JournalTraitement />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

