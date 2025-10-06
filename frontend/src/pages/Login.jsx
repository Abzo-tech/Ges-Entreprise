import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import {
  EyeIcon,
  EyeSlashIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Validation en temps réel
  useEffect(() => {
    const errors = {};

    // Validation email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Format d\'email invalide';
    }

    // Validation mot de passe
    if (formData.password && formData.password.length < 6) {
      errors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }

    setValidationErrors(errors);
  }, [formData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Effacer l'erreur générale quand l'utilisateur tape
    if (error) setError('');
    if (success) setSuccess('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation finale
    if (Object.keys(validationErrors).length > 0) {
      setError('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/auth/login', {
        email: formData.email,
        motDePasse: formData.password
      });

      const token = response?.data?.token;

      if (token) {
        setSuccess('Connexion réussie ! Redirection en cours...');
        login(token);

        // Petit délai pour montrer le message de succès
        setTimeout(() => {
          navigate('/dashboard');
        }, 1000);
      } else {
        setError('Erreur lors de la connexion : token manquant');
      }
    } catch (error) {
      console.error('Login error:', error);

      // Gestion des erreurs spécifiques
      if (error.response?.status === 401) {
        setError('Email ou mot de passe incorrect');
      } else if (error.response?.status === 429) {
        setError('Trop de tentatives. Veuillez réessayer plus tard');
      } else if (error.response?.data?.error) {
        setError(error.response.data.error);
      } else {
        setError('Erreur de connexion. Vérifiez votre connexion internet');
      }
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background image couvrant toute la page */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
        style={{
          backgroundImage: `url('http://localhost:3000/assets/6bd30f48-9518-4651-8e8e-de9e6982718e.jpeg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          imageRendering: "auto",
        }}
      />
      {/* Overlay sombre pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Contenu centré */}
      <div className="relative z-10 w-full max-w-sm px-4 py-2">
        {/* Logo et titre */}
        <div className="text-center mb-6">
          <BuildingOfficeIcon className="h-12 w-12 mx-auto mb-4 text-white" />
          <h1 className="text-3xl font-bold text-white mb-2">
            GES Entreprises
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Gestion moderne et efficace de votre entreprise
          </p>
        </div>

        {/* Carte de connexion */}
        <div className="bg-white/75 backdrop-blur-sm rounded-2xl shadow-2xl p-5">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Bienvenue</h2>
            <p className="text-gray-600 text-sm">
              Connectez-vous à votre compte
            </p>
          </div>

          {/* Messages d'erreur/succès */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <ExclamationTriangleIcon className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <p className="text-green-700 text-sm">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Champ Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1 p-l-1"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input h-10 text-gray-900 ${
                  validationErrors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="votre.email@exemple.com"
                autoComplete="email"
                disabled={loading}
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Champ Mot de passe */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mot de passe
              </label>
              <div className="relative ">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`form-input pr-10 h-10 text-gray-900 ${
                    validationErrors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : ""
                  }`}
                  placeholder="Votre mot de passe"
                  autoComplete="current-password"
                  disabled={loading}
                />
                <button
                  id='deco'
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-0 pr-7 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 no-underline" />
                  ) : (
                    <EyeIcon className="h-5 w-5 no-underline" />
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-600 flex items-center">
                  <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                  {validationErrors.password}
                </p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading || Object.keys(validationErrors).length > 0}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed text-white font-medium rounded-lg flex items-center justify-center text-sm transition-colors"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-4 h-4 mr-2"></div>
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </button>
          </form>

          {/* Informations de test */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h3 className="text-xs font-medium text-gray-900 mb-2">
              Comptes de démonstration :
            </h3>
            <div className="space-y-1 text-xs text-gray-600">
              <div>
                <strong>Super Admin :</strong> superadmin@salary.com
              </div>
              <div>
                <strong>Admin :</strong> admin@techcorp.com
              </div>
              <div>
                <strong>Caissier :</strong> caissier@financeplus.com
              </div>
              <div className="mt-1">
                <strong>Mot de passe :</strong> password123
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
