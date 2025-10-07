import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, Eye, Search } from 'lucide-react';
import { z } from 'zod';
import Pagination from '../components/Pagination';
import LogoUploader from '../components/LogoUploader';
import FormField from '../components/FormField';

// Schema de validation pour l'entreprise
const entrepriseFormSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères'),
  adresse: z.string().min(1, 'L\'adresse est requise').max(255, 'L\'adresse ne peut pas dépasser 255 caractères'),
  secteur: z.string().min(1, 'Le secteur est requis').max(50, 'Le secteur ne peut pas dépasser 50 caractères'),
  logo: z.any().optional(),
  couleurPrincipale: z.string().regex(/^#[0-9A-F]{6}$/i, 'Couleur invalide').optional(),
  devise: z.enum(['XOF', 'EUR', 'USD']).optional(),
  typePeriode: z.enum(['MENSUELLE', 'HEBDOMADAIRE', 'JOURNALIERE']).optional(),
  numeroServiceClient: z.string().max(20, 'Le numéro ne peut pas dépasser 20 caractères').optional(),
});

const Entreprises = () => {
  const { user, selectEntreprise } = useAuth();
  const navigate = useNavigate();
  const [entreprises, setEntreprises] = useState([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    secteur: '',
    nom: '',
  });
  const itemsPerPage = 500;
  const [showForm, setShowForm] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    secteur: '',
    logo: null,
    couleurPrincipale: '#6366f1',
    devise: 'XOF',
    typePeriode: 'MENSUELLE',
    numeroServiceClient: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchEntreprises();
  }, [filters, currentPage]);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.secteur) params.append('secteur', filters.secteur);
      if (filters.nom) params.append('nom', filters.nom);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());

      const response = await api.get(`/entreprises?${params.toString()}`);
      console.log('Entreprises response:', response.data);
      setEntreprises(response.data.data);
      setTotal(response.data.total);
    } catch (err) {
      console.error('Error fetching entreprises:', err);
    } finally {
      setLoading(false);
    }
  };


  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1);
  };



  const handleFormChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: '' });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors({});

    try {
      // Validation avec Zod
      const validationData = { ...formData };
      delete validationData.logo; // Ne pas valider le fichier
      entrepriseFormSchema.parse(validationData);

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          submitData.append(key, formData[key]);
        }
      });

      if (editingEntreprise) {
        await api.put(`/entreprises/${editingEntreprise.id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/entreprises', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      setShowForm(false);
      setEditingEntreprise(null);
      setFormData({
        nom: '',
        adresse: '',
        secteur: '',
        logo: null,
        couleurPrincipale: '#6366f1',
        devise: 'XOF',
        typePeriode: 'MENSUELLE',
        numeroServiceClient: '',
      });
      setCurrentPage(1);
      fetchEntreprises();
    } catch (err) {
      if (err.name === 'ZodError') {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setFormErrors(fieldErrors);
      } else {
        console.error(err);
      }
    }
  };

  const handleDeleteEntreprise = async (id) => {
    try {
      await api.delete(`/entreprises/${id}`);
      fetchEntreprises();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddEntreprise = () => {
    setEditingEntreprise(null);
    setShowForm(true);
    setFormData({
      nom: '',
      adresse: '',
      secteur: '',
      logo: null,
      couleurPrincipale: '#6366f1',
      devise: 'XOF',
      typePeriode: 'MENSUELLE',
      numeroServiceClient: '',
    });
  };

  const handleEditEntreprise = (ent) => {
    setEditingEntreprise(ent);
    setShowForm(true);
    setFormData({
      nom: ent.nom,
      adresse: ent.adresse,
      secteur: ent.secteur,
      logo: null, // Pour l'edit, on ne pré-remplit pas le file input
      couleurPrincipale: ent.couleurPrincipale || '#6366f1',
      devise: ent.devise || 'XOF',
      typePeriode: ent.typePeriode || 'MENSUELLE',
      numeroServiceClient: ent.numeroServiceClient || '',
    });
  };

  const filteredEntreprises = entreprises;

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto py-2 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Gestion des Entreprises
              </h1>
              {total > 0 && (
                <p className="text-xs text-gray-600">
                  {total} entreprise{total > 1 ? "s" : ""} au total
                </p>
              )}
            </div>
            <button
              onClick={handleAddEntreprise}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
            >
              Ajouter une entreprise
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-4 sm:px-6 lg:px-8">
        <div className="px-4 py-4 sm:px-0">

          {/* Filtres */}
          <div className="bg-white shadow rounded-lg p-2 mb-2 max-w-30 sticky top-12 z-10">
            {/* <h2 className="text-sm font-medium text-gray-900 mb-2">Filtres</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                {/* <label className="block text-sm font-medium text-gray-700">
                  Secteur
                </label> */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="secteur"
                    value={filters.secteur}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm "
                    placeholder="Rechercher par secteur (ex: Technologie)"
                  />
                </div>
              </div>
              <div className="relative">
                {/* <label className="block text-sm font-medium text-gray-700">
                  Nom
                </label> */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    name="nom"
                    value={filters.nom}
                    onChange={handleFilterChange}
                    className="mt-1 block w-full pl-10 pr-4 py-2 border-gray-300 rounded-md shadow-sm "
                    placeholder="Rechercher par nom d'entreprise"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Liste des entreprises */}
          <div className="bg-white shadow rounded-lg ">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[60vh]">
                  {filteredEntreprises.map((ent) => (
                    <div
                      key={ent.id}
                      className="bg-gray-50 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0 h-16 w-16">
                          {ent.logo ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000'}${ent.logo}`}
                              alt={`${ent.nom} logo`}
                              className="h-16 w-16 rounded-full object-cover border-2 border-white shadow-md"
                            />
                          ) : (
                            <div
                              className="h-16 w-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md"
                              style={{
                                backgroundColor:
                                  ent.couleurPrincipale || "#6366f1",
                              }}
                            >
                              {ent.nom[0]}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {ent.nom}
                          </h3>
                          <p className="text-sm text-gray-600">{ent.secteur}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Adresse:</span>{" "}
                          {ent.adresse}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Employés:</span>{" "}
                          {ent._count?.employes || 0}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Devise:</span>{" "}
                          {ent.devise}
                        </p>
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Période:</span>{" "}
                          {ent.typePeriode}
                        </p>
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        {user?.role === "SUPER_ADMIN" && (
                          <button
                            onClick={() => {
                              selectEntreprise(ent.id);
                              navigate('/dashboard');
                            }}
                            className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-md transition-colors"
                            title="Sélectionner l'entreprise"
                          >
                            <Eye size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditEntreprise(ent)}
                          className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                          title="Modifier"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteEntreprise(ent.id)}
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Pagination */}
            {totalPages >= 1 && (
              <div className="">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            {/* Informations de pagination */}
            {total > 0 && (
              <div className="bg-gray-50 px-6 py-3 rounded-lg">
                <p className="text-sm text-gray-600 text-center">
                  Affichage de{" "}
                  {Math.min((currentPage - 1) * itemsPerPage + 1, total)} à{" "}
                  {Math.min(currentPage * itemsPerPage, total)} sur {total}{" "}
                  entreprises
                </p>
              </div>
            )}
          </div>


        </div>
      </main>

      {/* Modal pour ajouter/modifier */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingEntreprise
                    ? "Modifier l'entreprise"
                    : "Nouvelle entreprise"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>


              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 gap-6">
                  <FormField
                    label="Nom de l'entreprise"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleFormChange}
                    onBlur={() => {
                      // Validation en temps réel
                      if (formData.nom.length < 1) {
                        setFormErrors(prev => ({ ...prev, nom: 'Le nom est requis' }));
                      } else if (formData.nom.length > 100) {
                        setFormErrors(prev => ({ ...prev, nom: 'Le nom ne peut pas dépasser 100 caractères' }));
                      } else {
                        setFormErrors(prev => ({ ...prev, nom: '' }));
                      }
                    }}
                    error={formErrors.nom}
                    placeholder="Ex: TechCorp"
                    required
                  />

                  <FormField
                    label="Adresse"
                    name="adresse"
                    type="text"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    onBlur={() => {
                      if (formData.adresse.length < 1) {
                        setFormErrors(prev => ({ ...prev, adresse: 'L\'adresse est requise' }));
                      } else if (formData.adresse.length > 255) {
                        setFormErrors(prev => ({ ...prev, adresse: 'L\'adresse ne peut pas dépasser 255 caractères' }));
                      } else {
                        setFormErrors(prev => ({ ...prev, adresse: '' }));
                      }
                    }}
                    error={formErrors.adresse}
                    placeholder="123 Rue de l'Innovation"
                    required
                  />

                  <FormField
                    label="Secteur d'activité"
                    name="secteur"
                    type="text"
                    value={formData.secteur}
                    onChange={handleFormChange}
                    onBlur={() => {
                      if (formData.secteur.length < 1) {
                        setFormErrors(prev => ({ ...prev, secteur: 'Le secteur est requis' }));
                      } else if (formData.secteur.length > 50) {
                        setFormErrors(prev => ({ ...prev, secteur: 'Le secteur ne peut pas dépasser 50 caractères' }));
                      } else {
                        setFormErrors(prev => ({ ...prev, secteur: '' }));
                      }
                    }}
                    error={formErrors.secteur}
                    placeholder="Ex: Technologie, Finance..."
                    required
                  />

                  <LogoUploader
                    entrepriseId={editingEntreprise?.id}
                    currentLogo={editingEntreprise?.logo}
                    onLogoChange={(logoPath) => {
                      setFormData(prev => ({ ...prev, logo: logoPath }));
                    }}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Couleur principale
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        name="couleurPrincipale"
                        value={formData.couleurPrincipale}
                        onChange={handleFormChange}
                        className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                      />
                      <span className="text-sm text-gray-600">
                        {formData.couleurPrincipale}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Devise
                      </label>
                      <select
                        name="devise"
                        value={formData.devise}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                      >
                        <option value="XOF">XOF</option>
                        <option value="EUR">EUR</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Période
                      </label>
                      <select
                        name="typePeriode"
                        value={formData.typePeriode}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                      >
                        <option value="MENSUELLE">Mensuelle</option>
                        <option value="HEBDOMADAIRE">Hebdomadaire</option>
                        <option value="JOURNALIERE">Journalière</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Service client (optionnel)
                    </label>
                    <input
                      type="text"
                      name="numeroServiceClient"
                      value={formData.numeroServiceClient}
                      onChange={handleFormChange}
                      placeholder="Ex: 33-800-90-11"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg "
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-primary-600 border border-transparent rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    {editingEntreprise ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Entreprises;
