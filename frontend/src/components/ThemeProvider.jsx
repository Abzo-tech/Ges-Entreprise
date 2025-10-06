import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { selectedEnterpriseData } = useAuth();

  // Génère une palette complète à partir de la couleur principale
  const generateThemeFromColor = (primaryColor) => {
    const hex = primaryColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);

    // Fonctions utilitaires pour manipuler les couleurs - versions plus foncées et professionnelles
    const lighten = (amount) => {
      const factor = 1 + (amount * 0.3); // Réduire l'effet de éclaircissement
      return `rgb(${Math.min(255, Math.round(r * factor))}, ${Math.min(255, Math.round(g * factor))}, ${Math.min(255, Math.round(b * factor))})`;
    };

    const darken = (amount) => {
      const factor = 1 - (amount * 1.2); // Augmenter l'effet d'assombrissement
      return `rgb(${Math.max(0, Math.round(r * factor))}, ${Math.max(0, Math.round(g * factor))}, ${Math.max(0, Math.round(b * factor))})`;
    };

    const adjustHue = (degrees) => {
      // Conversion RGB vers HSL, ajustement de la teinte, conversion retour HSL vers RGB
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;

      if (max === min) {
        h = s = 0; // achromatic
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
      }

      // Ajustement de la teinte
      h = (h + degrees / 360) % 1;
      if (h < 0) h += 1;

      // Conversion HSL vers RGB
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };

      let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      let p = 2 * l - q;

      const newR = Math.round(hue2rgb(p, q, h + 1/3) * 255);
      const newG = Math.round(hue2rgb(p, q, h) * 255);
      const newB = Math.round(hue2rgb(p, q, h - 1/3) * 255);

      return `rgb(${newR}, ${newG}, ${newB})`;
    };

    return {
      // Couleurs principales
      primary: primaryColor,
      primaryRgb: `${r}, ${g}, ${b}`,

      // Variations de la couleur principale
      primary50: lighten(0.8),
      primary100: lighten(0.6),
      primary200: lighten(0.4),
      primary300: lighten(0.2),
      primary400: lighten(0.1),
      primary500: primaryColor,
      primary600: darken(0.1),
      primary700: darken(0.2),
      primary800: darken(0.3),
      primary900: darken(0.4),

      // Couleurs secondaires (complémentaires)
      secondary: adjustHue(180), // Couleur complémentaire
      secondary50: lighten(0.8),
      secondary100: lighten(0.6),
      secondary200: lighten(0.4),
      secondary300: lighten(0.2),
      secondary400: lighten(0.1),
      secondary500: adjustHue(180),
      secondary600: darken(0.1),
      secondary700: darken(0.2),
      secondary800: darken(0.3),
      secondary900: darken(0.4),

      // Couleurs d'accent (analogues)
      accent: adjustHue(30), // Couleur analogue
      accent50: lighten(0.8),
      accent100: lighten(0.6),
      accent200: lighten(0.4),
      accent300: lighten(0.2),
      accent400: lighten(0.1),
      accent500: adjustHue(30),
      accent600: darken(0.1),
      accent700: darken(0.2),
      accent800: darken(0.3),
      accent900: darken(0.4),

      // Couleurs de fond - versions plus foncées et professionnelles
      background: lighten(0.85),
      surface: lighten(0.92),
      surfaceSecondary: lighten(0.88),

      // Couleurs de texte
      textPrimary: darken(0.8),
      textSecondary: darken(0.6),
      textTertiary: darken(0.4),

      // Couleurs de bordure
      border: lighten(0.85),
      borderLight: lighten(0.9),
      borderDark: darken(0.1),

      // Couleurs d'état
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6',

      // Ombres et effets
      shadow: `rgba(${r}, ${g}, ${b}, 0.1)`,
      shadowLight: `rgba(${r}, ${g}, ${b}, 0.05)`,
      shadowDark: `rgba(${r}, ${g}, ${b}, 0.2)`,
    };
  };

  function getDefaultTheme() {
    return generateThemeFromColor('#6366f1'); // Couleur par défaut
  }

  const [theme, setTheme] = useState(getDefaultTheme());

  useEffect(() => {
    if (selectedEnterpriseData?.couleurPrincipale) {
      const newTheme = generateThemeFromColor(selectedEnterpriseData.couleurPrincipale);
      setTheme(newTheme);

      // Appliquer les variables CSS globales
      const root = document.documentElement;
      Object.entries(newTheme).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      // Appliquer des classes CSS dynamiques
      document.body.className = `theme-${selectedEnterpriseData.nom.toLowerCase().replace(/\s+/g, '-')}`;
    } else {
      // Thème par défaut (super admin)
      const defaultTheme = getDefaultTheme();
      setTheme(defaultTheme);

      const root = document.documentElement;
      Object.entries(defaultTheme).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });

      document.body.className = 'theme-default';
    }
  }, [selectedEnterpriseData]);

  const value = {
    theme,
    selectedEnterpriseData,
    generateThemeFromColor,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};