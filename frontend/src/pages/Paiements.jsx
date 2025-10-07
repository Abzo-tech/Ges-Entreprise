import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import Pagination from '../components/Pagination';
import { BuildingOfficeIcon } from '@heroicons/react/24/outline';

const Paiements = () => {
  const { user, selectedEnterpriseData } = useAuth();
  const primaryColor = selectedEnterpriseData?.couleurPrincipale || "#4f46e5";

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  const [paiements, setPaiements] = useState([]);
  const [total, setTotal] = useState(0);
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
    modePaiement: '',
    datePaiement: '',
    partial: false,
  });
  const [employes, setEmployes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPaiements();
    fetchEmployes();
  }, [filters, currentPage]);

  const fetchPaiements = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.employe) params.append('employe', filters.employe);
      if (filters.date) params.append('date', filters.date);
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      const response = await api.get(`/paiements?${params.toString()}`);
      setPaiements(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError('Erreur lors du chargement des paiements');
      setPaiements([]);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/employes?limit=1000'); // Load up to 1000 employees for dropdown
      setEmployes(response.data || []);
    } catch (err) {
      console.error('Erreur lors du chargement des employés', err);
      setEmployes([]);
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
        employeId: Number(formData.employeId),
        montant: Number(formData.montant),
        modePaiement: formData.modePaiement,
        datePaiement: new Date(formData.datePaiement).toISOString(),
        statut: formData.partial ? 'PARTIEL' : 'PAYE',
      };
      await api.post('/paiements', data);
      setShowRecordForm(false);
      setFormData({
        employeId: '',
        montant: '',
        modePaiement: '',
        datePaiement: '',
        partial: false,
      });
      setCurrentPage(1);
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
      modePaiement: '',
      datePaiement: '',
      partial: false,
    });
  };

  const totalPages = Math.ceil(total / itemsPerPage);
  const employesList = Array.isArray(employes.data) ? employes.data : Array.isArray(employes) ? employes : [];

  return (
    <div
      className="max-w-8xl  py-2 sm:px-6 lg:px-8"
      style={{ overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <style>
        {`
          ::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>
      <div className="px-4 py-4 sm:px-0">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Gestion des Paiements
          </h1>
          {(user?.role === 'ADMIN' || user?.role === 'CAISSIER' || user?.role === 'SUPER_ADMIN') && (
            <button
              onClick={handleRecordPaiement}
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
              Enregistrer un paiement
            </button>
          )}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
        {/* Filtres */}
        <div className="bg-white shadow rounded-lg p-4 mb-6">
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
              >
                <option value="">Tous</option>
                <option value="PAYE">Payé</option>
                <option value="PARTIEL">Partiel</option>
                <option value="EN_ATTENTE">En attente</option>
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
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
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
              />
            </div>
          </div>
        </div>

        {/* Liste des paiements */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {loading ? (
            <div className="px-6 py-4 text-center">Chargement...</div>
          ) : (
            <div className="max-h-96 overflow-y-auto scrollbar-hide">
            <ul className="divide-y divide-gray-200 scrollbar-hide">
              {paiements.map((paiement) => (
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
                          {paiement.employe
                            ? `${paiement.employe.prenom} ${paiement.employe.nom}`
                            : "Employé inconnu"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {paiement.montant} € • {paiement.modePaiement} •{" "}
                          {new Date(paiement.datePaiement).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          paiement.statut === "PAYE"
                            ? "bg-green-100 text-green-800"
                            : paiement.statut === "PARTIEL"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {paiement.statut === "PAYE" ? "Payé" : paiement.statut === "PARTIEL" ? "Partiel" : "En attente"}
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

      {/* Modal pour enregistrer */}
      {showRecordForm && (user?.role === 'ADMIN' || user?.role === 'CAISSIER' || user?.role === 'SUPER_ADMIN') && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setShowRecordForm(false)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={(e) => e.stopPropagation()}>
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                  >
                    <option value="">Sélectionner un employé</option>
                    {employesList.map((emp) => (
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Mode de paiement
                  </label>
                  <select
                    name="modePaiement"
                    value={formData.modePaiement}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
                  >
                    <option value="">Sélectionner un mode</option>
                    <option value="VIREMENT">Virement bancaire</option>
                    <option value="CHEQUE">Chèque</option>
                    <option value="ESPECES">Espèces</option>
                    <option value="ORANGE_MONEY">Orange Money</option>
                    <option value="WAVE">Wave</option>
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
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm "
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
                    <span className="ml-2 text-sm text-gray-700">
                      Paiement partiel
                    </span>
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowRecordForm(false)}
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
