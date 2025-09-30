import { useState, useEffect } from 'react';
import api from '../services/api';

const Entreprises = () => {
  const [entreprises, setEntreprises] = useState([]);
  const [filters, setFilters] = useState({
    secteur: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingEntreprise, setEditingEntreprise] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    adresse: '',
    secteur: '',
    logo: '',
    devise: 'XOF',
    typePeriode: 'MENSUELLE',
    numeroServiceClient: '',
  });

  useEffect(() => {
    fetchEntreprises();
  }, [filters]);

  const fetchEntreprises = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.secteur) params.append('secteur', filters.secteur);
      const response = await api.get(`/entreprises?${params.toString()}`);
      setEntreprises(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des entreprises');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingEntreprise) {
        await api.put(`/entreprises/${editingEntreprise.id}`, formData);
      } else {
        await api.post('/entreprises', formData);
      }
      setShowForm(false);
      setEditingEntreprise(null);
      setFormData({
        nom: '',
        adresse: '',
        secteur: '',
        logo: '',
        devise: 'XOF',
        typePeriode: 'MENSUELLE',
        numeroServiceClient: '',
      });
      fetchEntreprises();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'entreprise');
      console.error(err);
    }
  };

  const handleDeleteEntreprise = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
      try {
        await api.delete(`/entreprises/${id}`);
        fetchEntreprises();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const handleAddEntreprise = () => {
    setEditingEntreprise(null);
    setShowForm(true);
    setFormData({
      nom: '',
      adresse: '',
      secteur: '',
      logo: '',
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
      logo: ent.logo || '',
      devise: ent.devise || 'XOF',
      typePeriode: ent.typePeriode || 'MENSUELLE',
      numeroServiceClient: ent.numeroServiceClient || '',
    });
  };

  const filteredEntreprises = entreprises;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Entreprises</h1>
            <button
              onClick={handleAddEntreprise}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Ajouter une entreprise
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* Filtres */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Secteur
                </label>
                <input
                  type="text"
                  name="secteur"
                  value={filters.secteur}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Filtrer par secteur"
                />
              </div>
            </div>
          </div>

          {/* Liste des entreprises */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredEntreprises.map((ent) => (
                  <li key={ent.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {ent.nom[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {ent.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ent.adresse}
                          </div>
                          <div className="text-sm text-gray-500">
                            Secteur: {ent.secteur} • {ent.nombreEmployes} employés
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEntreprise(ent)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteEntreprise(ent.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {/* Modal pour ajouter/modifier */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingEntreprise ? 'Modifier l\'entreprise' : 'Ajouter une entreprise'}
              </h3>
              <form onSubmit={handleSubmitForm}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Adresse
                  </label>
                  <input
                    type="text"
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Secteur
                  </label>
                  <input
                    type="text"
                    name="secteur"
                    value={formData.secteur}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo (URL)
                  </label>
                  <input
                    type="text"
                    name="logo"
                    value={formData.logo}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Devise
                  </label>
                  <select
                    name="devise"
                    value={formData.devise}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="XOF">XOF (Franc CFA)</option>
                    <option value="EUR">EUR (Euro)</option>
                    <option value="USD">USD (Dollar)</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Type de Période
                  </label>
                  <select
                    name="typePeriode"
                    value={formData.typePeriode}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="MENSUELLE">Mensuelle</option>
                    <option value="HEBDOMADAIRE">Hebdomadaire</option>
                    <option value="JOURNALIERE">Journalière</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Numéro Service Client
                  </label>
                  <input
                    type="text"
                    name="numeroServiceClient"
                    value={formData.numeroServiceClient}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleAddEntreprise}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    {editingEntreprise ? 'Modifier' : 'Ajouter'}
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
