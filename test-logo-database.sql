-- ============================================
-- Script SQL de Test : Vérification Logo Upload
-- ============================================
-- Ce script permet de vérifier que les logos
-- sont correctement enregistrés en base de données
-- ============================================

-- 1. Vérifier les 10 dernières entreprises créées
-- (pour voir si les logos sont enregistrés)
SELECT 
    id,
    nom,
    logo,
    secteur,
    created_at,
    CASE 
        WHEN logo IS NULL THEN '❌ Pas de logo'
        WHEN logo LIKE 'uploads/logos/%' THEN '✅ Logo enregistré'
        ELSE '⚠️  Format inattendu'
    END as statut_logo
FROM entreprise 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================

-- 2. Compter les entreprises avec et sans logo
SELECT 
    COUNT(*) as total_entreprises,
    COUNT(logo) as avec_logo,
    COUNT(*) - COUNT(logo) as sans_logo,
    ROUND(COUNT(logo) * 100.0 / COUNT(*), 2) as pourcentage_avec_logo
FROM entreprise;

-- ============================================

-- 3. Vérifier une entreprise spécifique (remplacer 10 par l'ID)
SELECT 
    id,
    nom,
    adresse,
    secteur,
    logo,
    couleurPrincipale,
    devise,
    typePeriode,
    numeroServiceClient,
    created_at,
    updated_at
FROM entreprise 
WHERE id = 10;

-- ============================================

-- 4. Lister toutes les entreprises avec logo
SELECT 
    id,
    nom,
    logo,
    LENGTH(logo) as longueur_chemin,
    created_at
FROM entreprise 
WHERE logo IS NOT NULL
ORDER BY created_at DESC;

-- ============================================

-- 5. Vérifier les logos avec des chemins invalides
-- (devrait être vide si tout fonctionne correctement)
SELECT 
    id,
    nom,
    logo,
    '⚠️  Chemin invalide' as alerte
FROM entreprise 
WHERE logo IS NOT NULL 
  AND logo NOT LIKE 'uploads/logos/%'
  AND logo NOT LIKE 'http%';

-- ============================================

-- 6. Statistiques par secteur avec logos
SELECT 
    secteur,
    COUNT(*) as total,
    COUNT(logo) as avec_logo,
    COUNT(*) - COUNT(logo) as sans_logo,
    ROUND(COUNT(logo) * 100.0 / COUNT(*), 2) as pourcentage_logo
FROM entreprise 
GROUP BY secteur
ORDER BY total DESC;

-- ============================================

-- 7. Entreprises créées/modifiées récemment (dernières 24h)
-- Utile pour tester les nouveaux uploads
SELECT 
    id,
    nom,
    logo,
    CASE 
        WHEN logo IS NULL THEN '❌'
        ELSE '✅'
    END as a_logo,
    created_at,
    updated_at
FROM entreprise 
WHERE created_at >= datetime('now', '-1 day')
   OR updated_at >= datetime('now', '-1 day')
ORDER BY COALESCE(updated_at, created_at) DESC;

-- ============================================

-- 8. Vérifier l'intégrité des chemins de logos
-- (tous les logos doivent suivre le pattern uploads/logos/ID-timestamp.ext)
SELECT 
    id,
    nom,
    logo,
    CASE 
        WHEN logo IS NULL THEN 'OK - Pas de logo'
        WHEN logo LIKE 'uploads/logos/' || id || '-%' THEN 'OK - Format correct'
        WHEN logo LIKE 'http%' THEN 'OK - URL externe'
        ELSE '⚠️  Format incorrect'
    END as validation
FROM entreprise 
WHERE logo IS NOT NULL;

-- ============================================

-- 9. Trouver les doublons de logos (ne devrait pas arriver)
SELECT 
    logo,
    COUNT(*) as nombre_entreprises,
    GROUP_CONCAT(id) as ids_entreprises
FROM entreprise 
WHERE logo IS NOT NULL
GROUP BY logo
HAVING COUNT(*) > 1;

-- ============================================

-- 10. Dernière entreprise créée (pour test rapide)
SELECT 
    id,
    nom,
    logo,
    created_at,
    CASE 
        WHEN logo IS NULL THEN '❌ Pas de logo - Vérifier si c''est normal'
        WHEN logo LIKE 'uploads/logos/%' THEN '✅ Logo enregistré correctement'
        ELSE '⚠️  Format inattendu : ' || logo
    END as resultat_test
FROM entreprise 
ORDER BY created_at DESC 
LIMIT 1;

-- ============================================
-- TESTS APRÈS UPLOAD
-- ============================================

-- Après avoir créé une entreprise avec logo, exécuter :
-- SELECT id, nom, logo FROM entreprise ORDER BY id DESC LIMIT 1;
-- 
-- Résultat attendu :
-- id | nom         | logo
-- 11 | Test Corp   | uploads/logos/11-1234567890.jpg
--
-- Si logo est NULL, le bug n'est pas corrigé !
-- Si logo contient le chemin, le bug est corrigé ! ✅

-- ============================================
-- NETTOYAGE (OPTIONNEL)
-- ============================================

-- Supprimer les entreprises de test (ATTENTION : irréversible !)
-- DELETE FROM entreprise WHERE nom LIKE '%Test%';

-- Réinitialiser les logos à NULL pour une entreprise spécifique
-- UPDATE entreprise SET logo = NULL WHERE id = 10;

-- ============================================