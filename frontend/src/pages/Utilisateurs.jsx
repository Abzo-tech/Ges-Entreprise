import { useState, useEffect } from 'react';
import api from '../services/api';

const Utilisateurs = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [filters, setFilters] = useState({
    role: '',
    actif: '',
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: '',
    entreprises: [],
  });
  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    fetchUtilisateurs();
    fetchEntreprises();
  }, [filters]);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.role) params.append('role', filters.role);
      if (filters.actif !== '') params.append('actif', filters.actif === 'actif' ? 'true' : 'false');
      const response = await api.get(`/utilisateurs?${params.toString()}`);
      setUtilisateurs(response.data || response || []);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await api.get('/entreprises');
      setEntreprises(response.data || response || []);
    } catch (err) {
      console.error('Erreur lors du chargement des entreprises', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === 'entreprises') {
      const entreprisesIds = Array.from(e.target.selectedOptions, option => Number(option.value));
      setFormData({ ...formData, [name]: entreprisesIds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setError('');
      if (editingUser) {
        await api.put(`/utilisateurs/${editingUser.id}`, formData);
      } else {
        await api.post('/utilisateurs', formData);
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        prenom: '',
        nom: '',
        email: '',
        role: '',
        entreprises: [],
      });
      fetchUtilisateurs();
    } catch (err) {
      setError('Erreur lors de la sauvegarde de l\'utilisateur');
      console.error(err);
    }
  };

  const handleToggleActive = async (id) => {
    if (window.confirm('Confirmer le changement de statut ?')) {
      try {
        await api.put(`/utilisateurs/${id}/actif`);
        fetchUtilisateurs();
      } catch (err) {
        setError('Erreur lors du changement de statut');
        console.error(err);
      }
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      try {
        await api.delete(`/utilisateurs/${id}`);
        fetchUtilisateurs();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setFormData({
      prenom: '',
      nom: '',
      email: '',
      role: '',
      entreprises: [],
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setShowForm(true);
    setFormData({
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      role: user.role,
      entreprises: user.entreprises ? user.entreprises.map(ent => ent.id) : [],
    });
  };

  const filteredUtilisateurs = Array.isArray(utilisateurs) ? utilisateurs : (utilisateurs.data || []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
            <button
              onClick={handleAddUser}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Ajouter un utilisateur
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Rôle
                </label>
                <select
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tous</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="Utilisateur">Utilisateur</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="actif"
                  value={filters.actif}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tous</option>
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
          </div>

          {/* Liste des utilisateurs */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredUtilisateurs.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {user.prenom?.[0] || ''}{user.nom?.[0] || ''}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.prenom} {user.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          <div className="text-sm text-gray-500">
                            Rôle: {user.role}
                          </div>
                          {user.entreprises && user.entreprises.length > 0 && (
                            <div className="text-sm text-gray-500">
                              Entreprises: {user.entreprises.map(ent => ent.nom).join(', ')}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.actif ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.actif ? 'Actif' : 'Inactif'}
                        </span>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id)}
                          className={`text-sm px-2 py-1 rounded ${
                            user.actif ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                          }`}
                        >
                          {user.actif ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
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
                {editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
              </h3>
              <form onSubmit={handleSubmitForm}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
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
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Rôle
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner un rôle</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    <option value="Utilisateur">Utilisateur</option>
                  </select>
                </div>
                {formData.role === 'Admin' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Entreprises (sélection multiple)
                    </label>
                    <select
                      name="entreprises"
                      multiple
                      value={formData.entreprises}
                      onChange={handleFormChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {entreprises.map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.nom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleAddUser}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    {editingUser ? 'Modifier' : 'Ajouter'}
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

export default Utilisateurs;
