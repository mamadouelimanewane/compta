export const PLAN_OHADA = [
  // CLASSE 1 : COMPTES DE RESSOURCES DURABLES
  { numero: '101', intitule: 'Capital social', type: 'Détail', nature: 'Capitaux' },
  { numero: '104', intitule: 'Primes liées au capital social', type: 'Détail', nature: 'Capitaux' },
  { numero: '111', intitule: 'Réserve légale', type: 'Détail', nature: 'Capitaux' },
  { numero: '118', intitule: 'Autres réserves', type: 'Détail', nature: 'Capitaux' },
  { numero: '121', intitule: 'Report à nouveau créditeur', type: 'Détail', nature: 'Capitaux' },
  { numero: '129', intitule: 'Report à nouveau débiteur', type: 'Détail', nature: 'Capitaux' },
  { numero: '131', intitule: 'Résultat net : Bénéfice', type: 'Détail', nature: 'Capitaux' },
  { numero: '139', intitule: 'Résultat net : Perte', type: 'Détail', nature: 'Capitaux' },
  { numero: '161', intitule: 'Emprunts obligataires', type: 'Détail', nature: 'Capitaux' },
  { numero: '162', intitule: 'Emprunts et dettes auprès des établissements de crédit', type: 'Détail', nature: 'Capitaux' },

  // CLASSE 2 : COMPTES D'ACTIF IMMOBILISÉ
  { numero: '211', intitule: 'Frais de recherche et de développement', type: 'Détail', nature: 'Immobilisation' },
  { numero: '212', intitule: 'Brevets, licences, concessions', type: 'Détail', nature: 'Immobilisation' },
  { numero: '213', intitule: 'Logiciels', type: 'Détail', nature: 'Immobilisation' },
  { numero: '215', intitule: 'Fonds commercial', type: 'Détail', nature: 'Immobilisation' },
  { numero: '221', intitule: 'Terrains', type: 'Détail', nature: 'Immobilisation' },
  { numero: '231', intitule: 'Bâtiments industriels', type: 'Détail', nature: 'Immobilisation' },
  { numero: '232', intitule: 'Bâtiments administratifs et commerciaux', type: 'Détail', nature: 'Immobilisation' },
  { numero: '241', intitule: 'Matériel et outillage industriel', type: 'Détail', nature: 'Immobilisation' },
  { numero: '244', intitule: 'Matériel de bureau', type: 'Détail', nature: 'Immobilisation' },
  { numero: '245', intitule: 'Matériel de transport', type: 'Détail', nature: 'Immobilisation' },

  // CLASSE 3 : COMPTES DE STOCKS
  { numero: '311', intitule: 'Marchandises', type: 'Détail', nature: 'Autre' },
  { numero: '321', intitule: 'Matières premières', type: 'Détail', nature: 'Autre' },
  { numero: '331', intitule: 'Fournitures de bureau', type: 'Détail', nature: 'Autre' },
  { numero: '361', intitule: 'Produits finis', type: 'Détail', nature: 'Autre' },

  // CLASSE 4 : COMPTES DE TIERS
  { numero: '401', intitule: 'Fournisseurs, dettes en compte', type: 'Détail', nature: 'Tiers' },
  { numero: '402', intitule: 'Fournisseurs, effets à payer', type: 'Détail', nature: 'Tiers' },
  { numero: '408', intitule: 'Fournisseurs, factures non parvenues', type: 'Détail', nature: 'Tiers' },
  { numero: '409', intitule: 'Fournisseurs débiteurs (avances et acomptes)', type: 'Détail', nature: 'Tiers' },
  { numero: '411', intitule: 'Clients', type: 'Détail', nature: 'Tiers' },
  { numero: '412', intitule: 'Clients, effets à recevoir', type: 'Détail', nature: 'Tiers' },
  { numero: '418', intitule: 'Clients, produits non encore facturés', type: 'Détail', nature: 'Tiers' },
  { numero: '421', intitule: 'Personnel, rémunérations dues', type: 'Détail', nature: 'Tiers' },
  { numero: '422', intitule: 'Personnel, fonds social', type: 'Détail', nature: 'Tiers' },
  { numero: '431', intitule: 'Sécurité sociale', type: 'Détail', nature: 'Tiers' },
  { numero: '441', intitule: 'État, impôts sur les bénéfices', type: 'Détail', nature: 'Tiers' },
  { numero: '443', intitule: 'État, TVA facturée', type: 'Détail', nature: 'Tiers' },
  { numero: '445', intitule: 'État, TVA récupérable', type: 'Détail', nature: 'Tiers' },

  // CLASSE 5 : COMPTES DE TRÉSORERIE
  { numero: '521', intitule: 'Banques locales', type: 'Détail', nature: 'Trésorerie' },
  { numero: '531', intitule: 'Chèques postaux', type: 'Détail', nature: 'Trésorerie' },
  { numero: '571', intitule: 'Caisse siège social', type: 'Détail', nature: 'Trésorerie' },

  // CLASSE 6 : COMPTES DE CHARGES DES ACTIVITÉS ORDINAIRES
  { numero: '601', intitule: 'Achats de marchandises', type: 'Détail', nature: 'Charge' },
  { numero: '602', intitule: 'Achats de matières premières', type: 'Détail', nature: 'Charge' },
  { numero: '605', intitule: 'Eau, gaz, électricité', type: 'Détail', nature: 'Charge' },
  { numero: '611', intitule: 'Transports sur achats', type: 'Détail', nature: 'Charge' },
  { numero: '622', intitule: 'Locations et charges locatives', type: 'Détail', nature: 'Charge' },
  { numero: '624', intitule: 'Entretien, réparations', type: 'Détail', nature: 'Charge' },
  { numero: '625', intitule: 'Primes d\'assurances', type: 'Détail', nature: 'Charge' },
  { numero: '632', intitule: 'Honoraires', type: 'Détail', nature: 'Charge' },
  { numero: '641', intitule: 'Impôts et taxes directs', type: 'Détail', nature: 'Charge' },
  { numero: '661', intitule: 'Rémunérations du personnel', type: 'Détail', nature: 'Charge' },
  { numero: '664', intitule: 'Charges sociales', type: 'Détail', nature: 'Charge' },
  { numero: '671', intitule: 'Intérêts des emprunts', type: 'Détail', nature: 'Charge' },

  // CLASSE 7 : COMPTES DE PRODUITS DES ACTIVITÉS ORDINAIRES
  { numero: '701', intitule: 'Ventes de marchandises', type: 'Détail', nature: 'Produit' },
  { numero: '702', intitule: 'Ventes de produits finis', type: 'Détail', nature: 'Produit' },
  { numero: '706', intitule: 'Services vendus', type: 'Détail', nature: 'Produit' },
  { numero: '771', intitule: 'Intérêts des prêts', type: 'Détail', nature: 'Produit' }
];
