import { useState, useEffect } from 'react';
import api from '../services/api';

const Payslips = () => {
  const [payslips, setPayslips] = useState([]);
  const [filters, setFilters] = useState({
    statut: '',
    employe: '',
    payRun: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingPayslip, setEditingPayslip] = useState(null);
  const [formData, setFormData] = useState({
    salaireBrut: '',
    deductions: '',
    notes: '',
  });
  const [employes, setEmployes] = useState([]);
  const [payRuns, setPayRuns] = useState([]);

  useEffect(() => {
    fetchPayslips();
    fetchEmployes();
    fetchPayRuns();
  }, [filters]);

  const fetchPayslips = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams();
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.employe) params.append('employe', filters.employe);
      if (filters.payRun) params.append('payRun', filters.payRun);
      const response = await api.get(`/payslips?${params.toString()}`);
      setPayslips(response);
    } catch (err) {
      setError('Erreur lors du chargement des bulletins');
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

  const fetchPayRuns = async () => {
    try {
      const response = await api.get('/payruns');
      setPayRuns(response);
    } catch (err) {
      console.error('Erreur lors du chargement des pay runs', err);
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

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await api.put(`/payslips/${editingPayslip.id}`, formData);
      setShowEditForm(false);
      setEditingPayslip(null);
      setFormData({ salaireBrut: '', deductions: '', notes: '' });
      fetchPayslips();
    } catch (err) {
      setError('Erreur lors de la modification du bulletin');
      console.error(err);
    }
  };

  const handleExportPDF = async (id) => {
    try {
      const response = await api.get(`/payslips/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bulletin-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors de l\'export PDF');
      console.error(err);
    }
  };

  const handleBatchExport = async () => {
    try {
      const response = await api.get('/payslips/pdf/batch', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'bulletins-batch.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors de l\'export batch PDF');
      console.error(err);
    }
  };

  const handleEditPayslip = (payslip) => {
    if (payslip.statut !== 'Brouillon') {
      alert('Seuls les bulletins en brouillon peuvent être modifiés');
      return;
    }
    setEditingPayslip(payslip);
    setShowEditForm(true);
    setFormData({
      salaireBrut: payslip.salaireBrut,
      deductions: payslip.deductions,
      notes: payslip.notes || '',
    });
  };

  const filteredPayslips = payslips;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Bulletins de Paie</h1>
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
                  <option value="Brouillon">Brouillon</option>
                  <option value="Finalisé">Finalisé</option>
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
                  Pay Run
                </label>
                <input
                  type="text"
                  name="payRun"
                  value={filters.payRun}
                  onChange={handleFilterChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Filtrer par pay run"
                />
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={handleBatchExport}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Exporter tous les PDF
              </button>
            </div>
          </div>

          {/* Liste des payslips */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            {loading ? (
              <div className="px-6 py-4 text-center">Chargement...</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredPayslips.map((payslip) => (
                  <li key={payslip.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-green-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-green-700">
                              BP
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {payslip.employe ? `${payslip.employe.prenom} ${payslip.employe.nom}` : 'Employé inconnu'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {payslip.payRun ? payslip.payRun.nom : 'PayRun inconnu'} • {payslip.periode}
                          </div>
                          <div className="text-sm text-gray-500">
                            Brut: {payslip.salaireBrut} € • Déductions: {payslip.deductions} € • Net: {payslip.salaireNet} €
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          payslip.statut === 'Brouillon' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {payslip.statut}
                        </span>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          Voir
                        </button>
                        {payslip.statut === 'Brouillon' && (
                          <button
                            onClick={() => handleEditPayslip(payslip)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Modifier
                          </button>
                        )}
                        <button
                          onClick={() => handleExportPDF(payslip.id)}
                          className="text-purple-600 hover:text-purple-900"
                        >
                          Exporter PDF
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

      {/* Modal pour modifier */}
      {showEditForm && editingPayslip && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Modifier le bulletin de paie
              </h3>
              <form onSubmit={handleSubmitEdit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Salaire Brut (€)
                  </label>
                  <input
                    type="number"
                    name="salaireBrut"
                    value={formData.salaireBrut}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Déductions (€)
                  </label>
                  <input
                    type="number"
                    name="deductions"
                    value={formData.deductions}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditForm(false);
                      setEditingPayslip(null);
                      setFormData({ salaireBrut: '', deductions: '', notes: '' });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                  >
                    Modifier
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

export default Payslips;
