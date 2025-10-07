/**
 * Script de test pour valider les types de fichiers acceptés pour les logos
 * Ce script simule la validation côté client
 */

// Simulation de la validation côté client
function validateLogoFile(file) {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  const maxSize = 5 * 1024 * 1024; // 5MB

  const errors = [];

  // Vérification du type
  if (!allowedTypes.includes(file.type)) {
    errors.push(
      "Format non autorisé. Seuls les formats JPEG et PNG sont acceptés"
    );
  }

  // Vérification de la taille
  if (file.size > maxSize) {
    errors.push("Le fichier ne doit pas dépasser 5MB");
  }

  return {
    valid: errors.length === 0,
    errors: errors,
  };
}

// Tests
console.log("=== Tests de validation des logos ===\n");

// Test 1: Fichier JPEG valide
console.log("Test 1: Fichier JPEG valide");
const jpegFile = {
  type: "image/jpeg",
  size: 2 * 1024 * 1024,
  name: "logo.jpg",
};
const result1 = validateLogoFile(jpegFile);
console.log(`Résultat: ${result1.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result1.valid) console.log(`Erreurs: ${result1.errors.join(", ")}`);
console.log("");

// Test 2: Fichier PNG valide
console.log("Test 2: Fichier PNG valide");
const pngFile = { type: "image/png", size: 1 * 1024 * 1024, name: "logo.png" };
const result2 = validateLogoFile(pngFile);
console.log(`Résultat: ${result2.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result2.valid) console.log(`Erreurs: ${result2.errors.join(", ")}`);
console.log("");

// Test 3: Fichier GIF (doit être rejeté)
console.log("Test 3: Fichier GIF (doit être rejeté)");
const gifFile = { type: "image/gif", size: 1 * 1024 * 1024, name: "logo.gif" };
const result3 = validateLogoFile(gifFile);
console.log(`Résultat: ${result3.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result3.valid) console.log(`Erreurs: ${result3.errors.join(", ")}`);
console.log("");

// Test 4: Fichier WebP (doit être rejeté)
console.log("Test 4: Fichier WebP (doit être rejeté)");
const webpFile = {
  type: "image/webp",
  size: 1 * 1024 * 1024,
  name: "logo.webp",
};
const result4 = validateLogoFile(webpFile);
console.log(`Résultat: ${result4.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result4.valid) console.log(`Erreurs: ${result4.errors.join(", ")}`);
console.log("");

// Test 5: Fichier JPEG trop volumineux (doit être rejeté)
console.log("Test 5: Fichier JPEG trop volumineux (doit être rejeté)");
const largeJpegFile = {
  type: "image/jpeg",
  size: 10 * 1024 * 1024,
  name: "logo-large.jpg",
};
const result5 = validateLogoFile(largeJpegFile);
console.log(`Résultat: ${result5.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result5.valid) console.log(`Erreurs: ${result5.errors.join(", ")}`);
console.log("");

// Test 6: Fichier SVG (doit être rejeté)
console.log("Test 6: Fichier SVG (doit être rejeté)");
const svgFile = { type: "image/svg+xml", size: 500 * 1024, name: "logo.svg" };
const result6 = validateLogoFile(svgFile);
console.log(`Résultat: ${result6.valid ? "✅ ACCEPTÉ" : "❌ REJETÉ"}`);
if (!result6.valid) console.log(`Erreurs: ${result6.errors.join(", ")}`);
console.log("");

// Résumé
console.log("=== Résumé des tests ===");
const allResults = [result1, result2, result3, result4, result5, result6];
const passed = allResults.filter((r) => r.valid).length;
const failed = allResults.filter((r) => !r.valid).length;

console.log(`Tests réussis (fichiers acceptés): ${passed}/6`);
console.log(`Tests échoués (fichiers rejetés): ${failed}/6`);
console.log("");
console.log("Attendu: 2 fichiers acceptés (JPEG et PNG), 4 fichiers rejetés");
console.log(
  `Résultat: ${
    passed === 2 && failed === 4
      ? "✅ TOUS LES TESTS PASSENT"
      : "❌ CERTAINS TESTS ÉCHOUENT"
  }`
);
