import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import QRScanner from '../components/QRScanner';
import {
  ClockIcon,
  UserGroupIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PlayIcon,
  StopIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Pointages = () => {
  const { user, selectedEntreprise, selectedEnterpriseData } = useAuth();
  const primaryColor = selectedEnterpriseData?.couleurPrincipale || "#4f46e5";

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  };
  const [pointages, setPointages] = useState([]);
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    employeId: '',
    statut: '',
    startDate: '',
    endDate: ''
  });
  const [showForm, setShowForm] = useState(false);
  const [editingPointage, setEditingPointage] = useState(null);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [formData, setFormData] = useState({
    employeId: '',
    datePointage: format(new Date(), 'yyyy-MM-dd'),
    heureArrivee: '',
    heureDepart: '',
    pauseDebut: '',
    pauseFin: '',
    statut: 'PRESENT',
    commentaires: ''
  });

  useEffect(() => {
    if (selectedEntreprise) {
      fetchPointages();
      fetchEmployes();
    }
  }, [selectedEntreprise, filters]);

  const fetchPointages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.employeId) params.append('employeId', filters.employeId);
      if (filters.statut) params.append('statut', filters.statut);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/pointages/entreprise/${selectedEntreprise}?${params}`);
      setPointages(response.data.data);
    } catch (err) {
      setError('Erreur lors du chargement des pointages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployes = async () => {
    try {
      const response = await api.get('/employes');
      setEmployes(response.data.data);
    } catch (err) {
      console.error('Erreur lors du chargement des employés:', err);
    }
  };

  const handleClockIn = async (employeId) => {
    try {
      await api.post(`/pointages/clock-in/${employeId}`);
      fetchPointages();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du pointage arrivée');
    }
  };

  const handleClockOut = async (employeId) => {
    try {
      await api.post(`/pointages/clock-out/${employeId}`);
      fetchPointages();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du pointage départ');
    }
  };

  const handleQRScanSuccess = async (qrData) => {
    try {
      setShowQRScanner(false);

      // Essayer d'abord le check-in
      try {
        await api.post('/pointages/qr/check-in', { qrData });
        fetchPointages();
        return;
      } catch (checkInError) {
        // Si check-in échoue, essayer check-out
        try {
          await api.post('/pointages/qr/check-out', { qrData });
          fetchPointages();
          return;
        } catch (checkOutError) {
          // Si les deux échouent, afficher l'erreur la plus pertinente
          throw checkInError;
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors du pointage QR');
    }
  };

  const handleQRScanError = (error) => {
    console.error('QR Scan error:', error);
    setError('Erreur du scanner QR');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        employeId: parseInt(formData.employeId),
        datePointage: new Date(formData.datePointage),
        heureArrivee: formData.heureArrivee ? new Date(`${formData.datePointage}T${formData.heureArrivee}`) : null,
        heureDepart: formData.heureDepart ? new Date(`${formData.datePointage}T${formData.heureDepart}`) : null,
        pauseDebut: formData.pauseDebut ? new Date(`${formData.datePointage}T${formData.pauseDebut}`) : null,
        pauseFin: formData.pauseFin ? new Date(`${formData.datePointage}T${formData.pauseFin}`) : null,
      };

      if (editingPointage) {
        await api.put(`/pointages/${editingPointage.id}`, data);
      } else {
        await api.post('/pointages', data);
      }

      setShowForm(false);
      setEditingPointage(null);
      resetForm();
      fetchPointages();
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la sauvegarde');
    }
  };

  const resetForm = () => {
    setFormData({
      employeId: '',
      datePointage: format(new Date(), 'yyyy-MM-dd'),
      heureArrivee: '',
      heureDepart: '',
      pauseDebut: '',
      pauseFin: '',
      statut: 'PRESENT',
      commentaires: ''
    });
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case 'PRESENT': return 'bg-green-100 text-green-800';
      case 'ABSENT': return 'bg-red-100 text-red-800';
      case 'RETARD': return 'bg-yellow-100 text-yellow-800';
      case 'CONGE': return 'bg-blue-100 text-blue-800';
      case 'MALADIE': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (statut) => {
    switch (statut) {
      case 'PRESENT': return <CheckCircleIcon className="h-4 w-4" />;
      case 'ABSENT': return <XCircleIcon className="h-4 w-4" />;
      case 'RETARD': return <ExclamationTriangleIcon className="h-4 w-4" />;
      default: return <ClockIcon className="h-4 w-4" />;
    }
  };

  if (!selectedEntreprise) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Veuillez sélectionner une entreprise pour voir les pointages</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 m-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Pointages</h1>
          <p className="text-gray-600">Suivi des heures de travail des employés</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowQRScanner(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <QrCodeIcon className="h-5 w-5 mr-2" />
            Scanner QR
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: primaryColor }}
            onMouseEnter={(e) => e.target.style.backgroundColor = darkenColor(primaryColor, 20)}
            onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
          >
            <ClockIcon className="h-5 w-5 mr-2" />
            Nouveau Pointage
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select
            value={filters.employeId}
            onChange={(e) => setFilters({...filters, employeId: e.target.value})}
            className="form-input"
          >
            <option value="">Tous les employés</option>
            {employes.map(employe => (
              <option key={employe.id} value={employe.id}>
                {employe.prenom} {employe.nom}
              </option>
            ))}
          </select>

          <select
            value={filters.statut}
            onChange={(e) => setFilters({...filters, statut: e.target.value})}
            className="form-input"
          >
            <option value="">Tous les statuts</option>
            <option value="PRESENT">Présent</option>
            <option value="ABSENT">Absent</option>
            <option value="RETARD">Retard</option>
            <option value="CONGE">Congé</option>
            <option value="MALADIE">Maladie</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({...filters, startDate: e.target.value})}
            className="form-input"
            placeholder="Date début"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({...filters, endDate: e.target.value})}
            className="form-input"
            placeholder="Date fin"
          />
        </div>
      </div>

      {/* Liste des pointages */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="loading-spinner mx-auto"></div>
            <p className="mt-2 text-gray-600">Chargement des pointages...</p>
          </div>
        ) : pointages.length === 0 ? (
          <div className="p-8 text-center">
            <ClockIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucun pointage trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Employé
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Arrivée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Départ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Heures
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pointages.map((pointage) => (
                  <tr key={pointage.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {pointage.employe.prenom[0]}{pointage.employe.nom[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {pointage.employe.prenom} {pointage.employe.nom}
                          </div>
                          <div className="text-sm text-gray-500">
                            {pointage.employe.poste}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(pointage.datePointage), 'dd/MM/yyyy', { locale: fr })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pointage.heureArrivee ? format(new Date(pointage.heureArrivee), 'HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {pointage.heureDepart ? format(new Date(pointage.heureDepart), 'HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div>
                        <div>{pointage.heuresTravaillees?.toFixed(2) || 0} h travaillées</div>
                        {pointage.heuresSupplementaires > 0 && (
                          <div className="text-orange-600">
                            +{pointage.heuresSupplementaires.toFixed(2)} h sup.
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pointage.statut)}`}>
                        {getStatusIcon(pointage.statut)}
                        <span className="ml-1">{pointage.statut}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {!pointage.heureArrivee && (
                        <button
                          onClick={() => handleClockIn(pointage.employeId)}
                          className="text-green-600 hover:text-green-900"
                          title="Pointer arrivée"
                        >
                          <PlayIcon className="h-5 w-5" />
                        </button>
                      )}
                      {pointage.heureArrivee && !pointage.heureDepart && (
                        <button
                          onClick={() => handleClockOut(pointage.employeId)}
                          className="text-red-600 hover:text-red-900"
                          title="Pointer départ"
                        >
                          <StopIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          setEditingPointage(pointage);
                          setFormData({
                            employeId: pointage.employeId.toString(),
                            datePointage: format(new Date(pointage.datePointage), 'yyyy-MM-dd'),
                            heureArrivee: pointage.heureArrivee ? format(new Date(pointage.heureArrivee), 'HH:mm') : '',
                            heureDepart: pointage.heureDepart ? format(new Date(pointage.heureDepart), 'HH:mm') : '',
                            pauseDebut: pointage.pauseDebut ? format(new Date(pointage.pauseDebut), 'HH:mm') : '',
                            pauseFin: pointage.pauseFin ? format(new Date(pointage.pauseFin), 'HH:mm') : '',
                            statut: pointage.statut,
                            commentaires: pointage.commentaires || ''
                          });
                          setShowForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Modifier"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPointage ? 'Modifier le Pointage' : 'Nouveau Pointage'}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingPointage(null);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="form-label">Employé</label>
                    <select
                      value={formData.employeId}
                      onChange={(e) => setFormData({...formData, employeId: e.target.value})}
                      className="form-input"
                      required
                    >
                      <option value="">Sélectionner un employé</option>
                      {employes.map(employe => (
                        <option key={employe.id} value={employe.id}>
                          {employe.prenom} {employe.nom}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={formData.datePointage}
                      onChange={(e) => setFormData({...formData, datePointage: e.target.value})}
                      className="form-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Heure d'arrivée</label>
                    <input
                      type="time"
                      value={formData.heureArrivee}
                      onChange={(e) => setFormData({...formData, heureArrivee: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Heure de départ</label>
                    <input
                      type="time"
                      value={formData.heureDepart}
                      onChange={(e) => setFormData({...formData, heureDepart: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Début de pause</label>
                    <input
                      type="time"
                      value={formData.pauseDebut}
                      onChange={(e) => setFormData({...formData, pauseDebut: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Fin de pause</label>
                    <input
                      type="time"
                      value={formData.pauseFin}
                      onChange={(e) => setFormData({...formData, pauseFin: e.target.value})}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label className="form-label">Statut</label>
                    <select
                      value={formData.statut}
                      onChange={(e) => setFormData({...formData, statut: e.target.value})}
                      className="form-input"
                    >
                      <option value="PRESENT">Présent</option>
                      <option value="ABSENT">Absent</option>
                      <option value="RETARD">Retard</option>
                      <option value="CONGE">Congé</option>
                      <option value="MALADIE">Maladie</option>
                      <option value="FORMATION">Formation</option>
                      <option value="MISSION">Mission</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="form-label">Commentaires</label>
                    <textarea
                      value={formData.commentaires}
                      onChange={(e) => setFormData({...formData, commentaires: e.target.value})}
                      className="form-input"
                      rows={3}
                      placeholder="Commentaires optionnels..."
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingPointage(null);
                      resetForm();
                    }}
                    className="btn-outline"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = darkenColor(primaryColor, 20)}
                    onMouseLeave={(e) => e.target.style.backgroundColor = primaryColor}
                  >
                    {editingPointage ? 'Modifier' : 'Créer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showQRScanner && (
        <QRScanner
          onScanSuccess={handleQRScanSuccess}
          onScanError={handleQRScanError}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  );
};

export default Pointages;
