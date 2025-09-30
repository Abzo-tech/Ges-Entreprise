# Modernisation du Frontend avec Tailwind CSS

## Étapes à suivre pour rendre l'application moderne et cohérente

- [x] **Mettre à jour tailwind.config.js** : Étendre le thème avec des couleurs personnalisées (primary: indigo, neutral: slate, success: green, error: red), ajouter la police Inter, et configurer pour des ombres/arrondis cohérents.
- [x] **Ajouter styles globaux dans src/index.css** : Importer Google Fonts pour Inter, ajouter transitions fluides (* { transition: all 0.2s ease; }), et variables CSS pour le thème (ex. --primary: #6366f1).
- [x] **Moderniser Layout.jsx** : Remplacer bg-gray-100 par un gradient subtil (from-slate-50 to-white), ajouter padding consistant (py-8 px-4), et wrapper pour loading global si nécessaire.
- [x] **Améliorer Navbar.jsx** : Ajouter états actifs (bg-indigo-50 text-indigo-600), icône logo (Heroicon), menu mobile complet (state pour dropdown avec backdrop et animations), et dropdown profil pour logout.
- [ ] **Standardiser Employes.jsx** : Corriger bindings form (inputs liés à formData), implémenter API calls pour edit/delete/toggle, ajouter barre de recherche sticky, pagination (composant simple), table moderne (hover rows, sorting), modals avec validation/erreurs, boutons cohérents (gradient indigo).
- [ ] **Mettre à jour PayRuns.jsx** : Appliquer patterns CRUD : filtres avancés, table responsive, modals pour add/edit, actions API, skeletons loading.
- [ ] **Mettre à jour Utilisateurs.jsx** : Même modernisation : focus sur rôles/permissions, table avec badges, forms sécurisés.
- [ ] **Mettre à jour Entreprises.jsx** : Table/liste avec détails, modals pour adresses/secteurs, cohérence visuelle.
- [ ] **Mettre à jour Payslips.jsx** : Affichage bulletins (PDF preview si possible), table avec totaux, filtres par période.
- [ ] **Mettre à jour Paiements.jsx** : Table paiements avec statuts (badges colorés), filtres par mode/date, actions (mark as paid).
- [ ] **Adapter Dashboard.jsx** : Vérifier cohérence avec nouveau thème (mettre à jour grays vers slates si needed), ajouter animations subtiles.
- [ ] **Améliorer Login.jsx** : Gradient fond, focus ring indigo, bouton animé, sans changer la logique.
- [ ] **Tests et validation** : Relancer dev server, tester navigation/login, pages CRUD (add/edit/delete), responsive (mobile/desktop), pas d'erreurs console, cohérence visuelle globale.

## Notes
- Thème : Indigo principal (#6366f1), slate neutre, green success, red error.
- UX : Transitions hover (duration-200), rounded-xl, shadows-md, Inter font pour typographie moderne.
- Pas de nouvelles dépendances ; utiliser Tailwind/Heroicons existants.
- Après chaque étape majeure, marquer comme fait et tester.
