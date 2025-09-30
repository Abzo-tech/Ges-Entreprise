import { useState, useEffect } from 'react';
import api from '../services/api';

const Paiements = () => {
  const [paiements, setPaiements] = useState([]);
  const [filters, setFilters] = useState({
    statut: '',
    employe: '',
    date: '',
  });
  const [showRecordForm, setShowRecordForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    employeId: '',
    montant: '',
    methode: '',
    datePaiement: '',
    reference: '',
    partial: false,
  });
  const [employes, setEmployes] = useState([]);

  useEffect(() => {
    fetchPaiements();
    fetchEmployes();
  }, [filters]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.employe) params.append('employe', filters.employe);
      if (filters.date) params.append('date', filters.date);
      const response = await api.get(`/paiements?${params.toString()}`);
      setPaiements(response);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/employes');
      setEmployes(response);
    } catch (err) {
      console.error('Erreur lors du chargement des employés', err);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmitRecord = async (e) => {
    e.preventDefault();
    try {
      setError('');
      const data = {
        ...formData,
        employeId: Number(formData.employeId),
        montant: Number(formData.montant),
      };
      await api.post('/paiements', data);
      setShowRecordForm(false);
      setFormData({
        employeId: '',
        montant: '',
        methode: '',
        datePaiement: '',
        reference: '',
        partial: false,
      });
      fetchPaiements();
    } catch (err) {
      setError('Erreur lors de l\'enregistrement du paiement');
      console.error(err);
    }
  };

  const handleViewReceipt = async (id) => {
    try {
      const response = await api.get(`/paiements/${id}/receipt`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reçu-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors de l\'export du reçu PDF');
      console.error(err);
    }
  };

  const handleRecordPaiement = () => {
    setShowRecordForm(true);
    setFormData({
      employeId: '',
      montant: '',
      methode: '',
      datePaiement: '',
      reference: '',
      partial: false,
    });
  };

  const filteredPaiements = paiements;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Paiements</h1>
          <button
            onClick={handleRecordPaiement}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
          >
            Enregistrer un paiement
          </button>
        </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* Filtres */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Filtres</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Statut
                </label>
                <select
                  name="statut"
                  value={filters.statut}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Tous</option>
                  <option value="Effectué">Effectué</option>
                  <option value="En attente">En attente</option>
                  <option value="Échec">Échec</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Employé
                </label>
                <input
                  type="text"
                  name="employe"
                  value={filters.employe}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Filtrer par employé"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <input
                  type="month"
                  name="date"
                  value={filters.date}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Liste des paiements */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredPaiements.map((paiement) => (
                  <li key={paiement.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-purple-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-purple-700">
                              €
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {paiement.employe ? `${paiement.employe.prenom} ${paiement.employe.nom}` : 'Employé inconnu'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {paiement.montant} € • {paiement.methode} • {new Date(paiement.datePaiement).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500">
                            Référence: {paiement.reference}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          paiement.statut === 'Effectué' ? 'bg-green-100 text-green-800' :
                          paiement.statut === 'En attente' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {paiement.statut}
                        </span>
                        <button
                          onClick={() => handleViewReceipt(paiement.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Voir reçu
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      {/* Modal pour enregistrer */}
      {showRecordForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Enregistrer un paiement
              </h3>
              <form onSubmit={handleSubmitRecord}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Employé
                  </label>
                  <select 
                    name="employeId"
                    value={formData.employeId}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner un employé</option>
                    {employes.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.prenom} {emp.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Montant (€)
                  </label>
                  <input
                    type="number"
                    name="montant"
                    value={formData.montant}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Méthode de paiement
                  </label>
                  <select 
                    name="methode"
                    value={formData.methode}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="Virement bancaire">Virement bancaire</option>
                    <option value="Chèque">Chèque</option>
                    <option value="Espèces">Espèces</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Date de paiement
                  </label>
                  <input
                    type="date"
                    name="datePaiement"
                    value={formData.datePaiement}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Référence
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleFormChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Référence optionnelle"
                  />
                </div>
                <div className="mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="partial"
                      checked={formData.partial}
                      onChange={handleFormChange}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Paiement partiel</span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleRecordPaiement}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
                  >
                    Enregistrer
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

export default Paiements;
