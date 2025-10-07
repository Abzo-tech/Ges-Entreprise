import { useState, useEffect } from 'react';
import api from '../services/api';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const PayRuns = () => {
  const { selectedEnterpriseData } = useAuth();
  const primaryColor = selectedEnterpriseData?.couleurPrincipale || "#4f46e5";

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  const [payRuns, setPayRuns] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
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
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayRuns();
    fetchEntreprises();
  }, [currentPage]);

  const fetchPayRuns = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      const response = await api.get(`/payruns?${params.toString()}`);
      console.log('PayRuns response:', response);
      const responseData = response.data;
      setPayRuns(Array.isArray(responseData.data) ? responseData.data : []);
      setTotal(responseData.total || 0);
    } catch (err) {
      setError('Erreur lors du chargement des pay runs');
      console.error('PayRuns error:', err);
      setPayRuns([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await api.get('/entreprises');
      console.log('Entreprises response:', response);
      const data = response.data.data;
      setEntreprises(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Erreur lors du chargement des entreprises', err);
      setEntreprises([]);
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
      const response = await api.get(`/employes?entrepriseId=${selectedEntreprise.id}&typeContrat=Freelance`);
      console.log('Journaliers response:', response);
      const data = response.data.data;
      setJournaliers(Array.isArray(data) ? data : []);
      // Initialiser les jours travaillés à 0
      const initialJours = {};
      (Array.isArray(data) ? data : []).forEach(emp => {
        initialJours[emp.id] = 0;
      });
      setJoursTravailles(initialJours);
    } catch (err) {
      console.error('Erreur lors du chargement des journaliers', err);
      setJournaliers([]);
      setJoursTravailles({});
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
      setCurrentPage(1);
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

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="min-h-screen max-w-8xl bg-white">
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <header className="bg-white shadow w-[100%]">
        <div className="max-w-8xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Gestion des Pay Runs
            </h1>
            <button
              onClick={handleCreatePayRun}
              className="text-white px-4 py-2 rounded-md"
              style={{
                backgroundColor: primaryColor,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = darkenColor(primaryColor, 20);
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = primaryColor;
              }}
            >
              Créer une pay run
            </button>
          </div>
        </div>
      </header>
      <main
        className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8"
        style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
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
              <div className="max-h-96 overflow-y-auto scrollbar-hide">
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
                              {payRun.periode} • {payRun.nombreEmployes} employés
                              • {payRun.masseSalariale} €
                            </div>
                            <div className="text-sm text-gray-500">
                              Créé le{" "}
                              {new Date(payRun.dateCreation).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payRun.statut === "Brouillon"
                                ? "bg-yellow-100 text-yellow-800"
                                : payRun.statut === "Approuvé"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {payRun.statut}
                          </span>
                          {payRun.statut === "Brouillon" && (
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
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </main>

      {/* Modal pour créer */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setShowCreateForm(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                  />
                </div>
                {journaliers.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jours travaillés (employés journaliers)
                    </label>
                    {journaliers.map((emp) => (
                      <div
                        key={emp.id}
                        className="flex items-center justify-between mb-2"
                      >
                        <span className="text-sm text-gray-600">
                          {emp.prenom} {emp.nom}
                        </span>
                        <input
                          type="number"
                          min="0"
                          max="31"
                          value={joursTravailles[emp.id] || 0}
                          onChange={(e) =>
                            handleJoursChange(emp.id, e.target.value)
                          }
                          className="w-20 border-gray-300 rounded-md shadow-sm  text-center"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = darkenColor(primaryColor, 20)}
                    onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
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
