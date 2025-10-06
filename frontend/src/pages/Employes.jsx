import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../components/ThemeProvider";
import api from "../services/api";
import Pagination from "../components/Pagination";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from "@heroicons/react/24/outline";

const Employes = () => {
  const { theme } = useTheme();
  const { user, selectedEntreprise } = useAuth();
  const [employes, setEmployes] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    statut: "",
    poste: "",
    typeContrat: "",
    actif: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [editingEmploye, setEditingEmploye] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    salaire: "",
    typeContrat: "",
    adresse: "",
    telephone: "",
    actif: true,
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployes();
  }, [filters, search, currentPage]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchEmployes = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (search) params.append("nom", search);
      if (filters.statut) params.append("statut", filters.statut);
      if (filters.poste) params.append("poste", filters.poste);
      if (filters.typeContrat)
        params.append("typeContrat", filters.typeContrat);
      if (filters.actif !== "") params.append("actif", filters.actif);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      const response = await api.get(`/employes?${params.toString()}`);
      setEmployes(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError("Erreur lors du chargement des employés");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nom.trim()) errors.nom = "Nom requis";
    if (!formData.prenom.trim()) errors.prenom = "Prénom requis";
    if (!formData.email.trim()) errors.email = "Email requis";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email invalide";
    if (!formData.poste.trim()) errors.poste = "Poste requis";
    if (!formData.salaire || formData.salaire <= 0)
      errors.salaire = "Salaire valide requis";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setError("");
      const dataToSend = { ...formData };

      // Déterminer l'entrepriseId appropriée
      if (selectedEntreprise) {
        // Si une entreprise est sélectionnée (mode entreprise), utiliser celle-ci
        dataToSend.entrepriseId = selectedEntreprise;
      } else if (
        user?.role !== "SUPER_ADMIN" &&
        user?.entreprises?.length > 0
      ) {
        // Pour les admins normaux, utiliser leur première entreprise assignée
        dataToSend.entrepriseId = user.entreprises[0];
      }

      if (editingEmploye) {
        await api.put(`/employes/${editingEmploye.id}`, dataToSend);
        setSuccess("Employé modifié avec succès");
      } else {
        await api.post("/employes", dataToSend);
        setSuccess("Employé ajouté avec succès");
      }
      setShowModal(false);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        salaire: "",
        typeContrat: "",
        adresse: "",
        telephone: "",
        actif: true,
      });
      setEditingEmploye(null);
      setFormErrors({});
      setCurrentPage(1);
      fetchEmployes();
    } catch (err) {
      setError("Erreur lors de la sauvegarde");
      console.error(err);
    }
  };

  const handleAddEmploye = () => {
    setShowModal(true);
    setEditingEmploye(null);
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      poste: "",
      salaire: "",
      typeContrat: "",
      adresse: "",
      telephone: "",
      actif: true,
    });
    setFormErrors({});
  };

  const handleEditEmploye = (employe) => {
    setEditingEmploye(employe);
    setFormData({
      nom: employe.nom || "",
      prenom: employe.prenom || "",
      email: employe.email || "",
      poste: employe.poste || "",
      salaire: employe.salaire || "",
      typeContrat: employe.typeContrat || "",
      adresse: employe.adresse || "",
      telephone: employe.telephone || "",
      actif: employe.actif || true,
    });
    setShowModal(true);
  };

  const handleDeleteEmploye = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?"))
      return;
    try {
      await api.delete(`/employes/${id}`);
      setSuccess("Employé supprimé avec succès");
      fetchEmployes();
    } catch (err) {
      if (err.response?.status === 400) {
        setError(
          "Impossible de supprimer cet employé car il a des données associées (bulletins, paiements)"
        );
      } else {
        setError("Erreur lors de la suppression");
      }
      console.error(err);
    }
  };

  const handleToggleActif = async (id, actif) => {
    try {
      await api.patch(`/employes/${id}/actif`);
      setSuccess(`Employé ${actif ? "désactivé" : "activé"} avec succès`);
      fetchEmployes();
    } catch (err) {
      setError("Erreur lors du changement de statut");
      console.error(err);
    }
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  const SkeletonLoader = () => (
    <div className="animate-pulse">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-neutral-100 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-neutral-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
              <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) return <SkeletonLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 m-6">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-6 w-6 text-neutral-500" />
          <h1 className="text-2xl font-bold text-neutral-900">Employés</h1>
        </div>
        <button
          onClick={handleAddEmploye}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all duration-200 mt-4 sm:mt-0"
          style={{
            backgroundColor: theme.primary,
            color: theme.textOnPrimary,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = theme.primaryHover)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = theme.primary)
          }
        >
          <PlusIcon className="h-5 w-5" />
          <span>Ajouter un employé</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 m-4">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher un employé..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              name="actif"
              value={filters.actif}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les statuts</option>
              <option value="true">Actifs</option>
              <option value="false">Inactifs</option>
            </select>
            <select
              name="typeContrat"
              value={filters.typeContrat}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Tous les contrats</option>
              <option value="HONORAIRE">Honoraires</option>
              <option value="MENSUEL">Mensuel</option>
              <option value="JOURNALIERE">Journalière</option>
            </select>
            <input
              type="text"
              name="poste"
              placeholder="Filtrer par poste"
              value={filters.poste}
              onChange={handleFilterChange}
              className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden m-6">
        <div className="">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Poste
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Salaire
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Contrat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-200">
              {employes && employes.length > 0 ? (
                employes.map((employe) => (
                  <tr
                    key={employe.id}
                    className="hover:bg-neutral-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {employe.prenom?.charAt(0)}
                            {employe.nom?.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900">
                            {employe.prenom} {employe.nom}
                          </div>
                          <div className="text-sm text-neutral-500">
                            {employe.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {employe.poste}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        {new Intl.NumberFormat("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        }).format(employe.salaire)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-neutral-100 text-neutral-800">
                        {employe.typeContrat}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          employe.actif
                            ? "bg-success-100 text-success-800"
                            : "bg-error-100 text-error-800"
                        }`}
                      >
                        {employe.actif ? "Actif" : "Inactif"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() =>
                          handleToggleActif(employe.id, employe.actif)
                        }
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                          employe.actif
                            ? "bg-error-100 text-error-800 hover:bg-error-200"
                            : "bg-success-100 text-success-800 hover:bg-success-200"
                        }`}
                      >
                        {employe.actif ? "Désactiver" : "Activer"}
                      </button>
                      <button
                        onClick={() => handleEditEmploye(employe)}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-medium hover:bg-primary-200 transition-all"
                      >
                        <PencilIcon className="h-4 w-4 inline mr-1" />
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteEmploye(employe.id)}
                        className="px-3 py-1 bg-error-100 text-error-800 rounded-lg text-xs font-medium hover:bg-error-200 transition-all"
                      >
                        <TrashIcon className="h-4 w-4 inline mr-1" />
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-neutral-500"
                  >
                    Aucun employé trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

      {/* Modal for Add/Edit */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-neutral-900 mb-6">
                {editingEmploye ? "Modifier l'employé" : "Ajouter un employé"}
              </h2>
              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 ${
                      formErrors.nom ? "border-error-300" : "border-neutral-300"
                    }`}
                  />
                  {formErrors.nom && (
                    <p className="mt-1 text-sm text-error-600">
                      {formErrors.nom}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 ${
                      formErrors.prenom
                        ? "border-error-300"
                        : "border-neutral-300"
                    }`}
                  />
                  {formErrors.prenom && (
                    <p className="mt-1 text-sm text-error-600">
                      {formErrors.prenom}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 ${
                      formErrors.email
                        ? "border-error-300"
                        : "border-neutral-300"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-error-600">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleFormChange}
                    placeholder="77-123-45-67"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Poste *
                  </label>
                  <input
                    type="text"
                    name="poste"
                    value={formData.poste}
                    onChange={handleFormChange}
                    className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 ${
                      formErrors.poste
                        ? "border-error-300"
                        : "border-neutral-300"
                    }`}
                  />
                  {formErrors.poste && (
                    <p className="mt-1 text-sm text-error-600">
                      {formErrors.poste}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Salaire *
                  </label>
                  <input
                    type="number"
                    name="salaire"
                    value={formData.salaire}
                    onChange={handleFormChange}
                    step="0.01"
                    min="0"
                    className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 ${
                      formErrors.salaire
                        ? "border-error-300"
                        : "border-neutral-300"
                    }`}
                  />
                  {formErrors.salaire && (
                    <p className="mt-1 text-sm text-error-600">
                      {formErrors.salaire}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Type de contrat
                  </label>
                  <select
                    name="typeContrat"
                    value={formData.typeContrat}
                    onChange={handleFormChange}
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400"
                  >
                    <option value="">Sélectionner</option>
                    <option value="HONORAIRE">Honoraires</option>
                    <option value="MENSUEL">Mensuel</option>
                    <option value="JOURNALIERE">Journalière</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    name="adresse"
                    value={formData.adresse}
                    onChange={handleFormChange}
                    rows="3"
                    className="w-full px-3 py-1.5 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="actif"
                    checked={formData.actif}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                  />
                  <label className="ml-2 block text-sm font-medium text-neutral-700">
                    Actif
                  </label>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-neutral-700 bg-neutral-100 border border-neutral-300 rounded-lg hover:bg-neutral-200 transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-primary-600 border border-transparent rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all"
                  >
                    {editingEmploye ? "Modifier" : "Ajouter"}
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

export default Employes;
