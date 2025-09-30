import { useState, useEffect } from 'react';
import api from '../services/api';

const PayRuns = () => {
  const [payRuns, setPayRuns] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [entreprises, setEntreprises] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState(null);
  const [journaliers, setJournaliers] = useState([]);
  const [joursTravailles, setJoursTravailles] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    periodeDebut: '',
    periodeFin: '',
    entrepriseId: '',
  });

  useEffect(() => {
    fetchPayRuns();
    fetchEntreprises();
  }, []);

  const fetchPayRuns = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get('/payruns');
      setPayRuns(response);
    } catch (err) {
      setError('Erreur lors du chargement des pay runs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await api.get('/entreprises');
      setEntreprises(response);
    } catch (err) {
      console.error('Erreur lors du chargement des entreprises', err);
    }
  };

  // Charger les employés journaliers quand une entreprise est sélectionnée
  useEffect(() => {
    if (selectedEntreprise) {
      fetchJournaliers();
    } else {
      setJournaliers([]);
      setJoursTravailles({});
    }
  }, [selectedEntreprise]);

  const fetchJournaliers = async () => {
    try {
      const response = await api.get(`/employes?entrepriseId=${selectedEntreprise}&typeContrat=Freelance`);
      setJournaliers(response);
      // Initialiser les jours travaillés à 0
      const initialJours = {};
      response.forEach(emp => {
        initialJours[emp.id] = 0;
      });
      setJoursTravailles(initialJours);
    } catch (err) {
      console.error('Erreur lors du chargement des journaliers', err);
    }
  };

  const handleCreatePayRun = () => {
    setShowCreateForm(true);
    setFormData({ nom: '', periodeDebut: '', periodeFin: '', entrepriseId: '' });
    setSelectedEntreprise(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === 'entrepriseId') {
      setSelectedEntreprise(entreprises.find(ent => ent.id === Number(e.target.value)) || null);
    }
  };

  const handleJoursChange = (empId, value) => {
    setJoursTravailles({
      ...joursTravailles,
      [empId]: Number(value),
    });
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = {
        ...formData,
        entrepriseId: Number(formData.entrepriseId),
        joursTravailles,
      };
      await api.post('/payruns', data);
      setShowCreateForm(false);
      setFormData({ nom: '', periodeDebut: '', periodeFin: '', entrepriseId: '' });
      setSelectedEntreprise(null);
      setJoursTravailles({});
      fetchPayRuns();
    } catch (err) {
      setError('Erreur lors de la création de la pay run');
      console.error(err);
    }
  };

  const handleApprovePayRun = async (id) => {
    try {
      await api.put(`/payruns/${id}/approve`);
      fetchPayRuns();
    } catch (err) {
      setError('Erreur lors de l\'approbation');
      console.error(err);
    }
  };

  const handleDeletePayRun = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette pay run ?')) {
      try {
        await api.delete(`/payruns/${id}`);
        fetchPayRuns();
      } catch (err) {
        setError('Erreur lors de la suppression');
        console.error(err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Gestion des Pay Runs</h1>
            <button
              onClick={handleCreatePayRun}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Créer une pay run
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
          {/* Liste des pay runs */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {payRuns.map((payRun) => (
                  <li key={payRun.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              PR
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payRun.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payRun.periode} • {payRun.nombreEmployes} employés • {payRun.masseSalariale} €
                          </div>
                          <div className="text-sm text-gray-500">
                            Créé le {new Date(payRun.dateCreation).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payRun.statut === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' :
                          payRun.statut === 'Approuvé' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payRun.statut}
                        </span>
                        {payRun.statut === 'Brouillon' && (
                          <button
                            onClick={() => handleApprovePayRun(payRun.id)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Approuver
                          </button>
                        )}
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Voir détails
                        </button>
                        <button
                          onClick={() => handleDeletePayRun(payRun.id)}
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

      {/* Modal pour créer */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Créer une pay run
              </h3>
              <form onSubmit={handleSubmitForm}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Entreprise
                  </label>
                  <select
                    name="entrepriseId"
                    value={formData.entrepriseId}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une entreprise</option>
                    {entreprises.map((ent) => (
                      <option key={ent.id} value={ent.id}>
                        {ent.nom}
                      </option>
                    ))}
                  </select>
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
                    placeholder="Ex: PayRun Mars 2024"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Période de début
                  </label>
                  <input
                    type="date"
                    name="periodeDebut"
                    value={formData.periodeDebut}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Période de fin
                  </label>
                  <input
                    type="date"
                    name="periodeFin"
                    value={formData.periodeFin}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                {journaliers.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jours travaillés (employés journaliers)
                    </label>
                    {journaliers.map((emp) => (
                      <div key={emp.id} className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">{emp.prenom} {emp.nom}</span>
                        <input
                          type="number"
                          min="0"
                          max="31"
                          value={joursTravailles[emp.id] || 0}
                          onChange={(e) => handleJoursChange(emp.id, e.target.value)}
                          className="w-20 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCreatePayRun}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Créer
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

export default PayRuns;
