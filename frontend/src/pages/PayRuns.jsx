import { useState, useEffect } from "react";
import api from "../services/api";
import Pagination from "../components/Pagination";
import { useAuth } from "../context/AuthContext";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { z } from "zod";

// Schema de validation pour PayRun
const payRunFormSchema = z
  .object({
    nom: z
      .string()
      .min(1, "Le nom est requis")
      .max(100, "Le nom ne peut pas dépasser 100 caractères"),
    periodeDebut: z.string().min(1, "La période de début est requise"),
    periodeFin: z.string().min(1, "La période de fin est requise"),
    entrepriseId: z.string().min(1, "L'entreprise est requise"),
  })
  .refine(
    (data) => {
      const debut = new Date(data.periodeDebut);
      const fin = new Date(data.periodeFin);
      return fin >= debut;
    },
    {
      message: "La période de fin doit être après la période de début",
      path: ["periodeFin"],
    }
  );

const PayRuns = () => {
  const { selectedEnterpriseData } = useAuth();
  const primaryColor = selectedEnterpriseData?.couleurPrincipale || "#4f46e5";

  const darkenColor = (color, percent) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = ((num >> 8) & 0x00ff) - amt;
    const B = (num & 0x0000ff) - amt;
    return (
      "#" +
      (
        0x1000000 +
        (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 1 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
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
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [payRunToDelete, setPayRunToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    periodeDebut: "",
    periodeFin: "",
    entrepriseId: "",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPayRuns();
    fetchEntreprises();
  }, [currentPage]);

  const fetchPayRuns = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      const response = await api.get(`/payruns?${params.toString()}`);
      console.log("PayRuns response:", response);
      const responseData = response.data;
      setPayRuns(Array.isArray(responseData.data) ? responseData.data : []);
      setTotal(responseData.total || 0);
    } catch (err) {
      setError("Erreur lors du chargement des pay runs");
      console.error("PayRuns error:", err);
      setPayRuns([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await api.get("/entreprises");
      console.log("Entreprises response:", response);
      const data = response.data.data;
      setEntreprises(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises", err);
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
      const response = await api.get(
        `/employes?entrepriseId=${selectedEntreprise.id}&typeContrat=JOURNALIERE`
      );
      console.log("Journaliers response:", response);
      const data = response.data.data;
      setJournaliers(Array.isArray(data) ? data : []);
      // Initialiser les jours travaillés à 0
      const initialJours = {};
      (Array.isArray(data) ? data : []).forEach((emp) => {
        initialJours[emp.id] = 0;
      });
      setJoursTravailles(initialJours);
    } catch (err) {
      console.error("Erreur lors du chargement des journaliers", err);
      setJournaliers([]);
      setJoursTravailles({});
    }
  };

  const handleCreatePayRun = () => {
    setShowCreateForm(true);
    setFormData({
      nom: "",
      periodeDebut: "",
      periodeFin: "",
      entrepriseId: "",
    });
    setSelectedEntreprise(null);
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (e.target.name === "entrepriseId") {
      setSelectedEntreprise(
        entreprises.find((ent) => ent.id === Number(e.target.value)) || null
      );
    }
    // Effacer l'erreur du champ modifié
    if (formErrors[e.target.name]) {
      setFormErrors({ ...formErrors, [e.target.name]: "" });
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
    setError("");
    setFormErrors({});

    try {
      // Validation avec Zod
      payRunFormSchema.parse(formData);

      const data = {
        nom: formData.nom,
        periodeDebut: formData.periodeDebut,
        periodeFin: formData.periodeFin,
        entrepriseId: Number(formData.entrepriseId),
        joursTravailles,
      };

      console.log("Sending PayRun data:", data);
      await api.post("/payruns", data);

      setShowCreateForm(false);
      setFormData({
        nom: "",
        periodeDebut: "",
        periodeFin: "",
        entrepriseId: "",
      });
      setSelectedEntreprise(null);
      setJoursTravailles({});
      setCurrentPage(1);
      fetchPayRuns();
    } catch (err) {
      if (err.name === "ZodError" && err.errors && Array.isArray(err.errors)) {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setFormErrors(fieldErrors);
      } else {
        const errorMessage =
          err.response?.data?.errors?.[0]?.message ||
          err.response?.data?.error ||
          "Erreur lors de la création de la pay run";
        setError(errorMessage);
        console.error("PayRun creation error:", err);
      }
    }
  };

  const handleApprovePayRun = async (id) => {
    try {
      await api.put(`/payruns/${id}/approve`);
      fetchPayRuns();
    } catch (err) {
      setError("Erreur lors de l'approbation");
      console.error(err);
    }
  };

  const handleDeletePayRun = async (id) => {
    setPayRunToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/payruns/${payRunToDelete}`);
      setShowDeleteConfirm(false);
      setPayRunToDelete(null);
      fetchPayRuns();
    } catch (err) {
      setError("Erreur lors de la suppression");
      console.error(err);
      setShowDeleteConfirm(false);
      setPayRunToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setPayRunToDelete(null);
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
        style={{
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
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
                              {payRun.periode} • {payRun.nombreEmployes}{" "}
                              employés • {payRun.masseSalariale} €
                            </div>
                            <div className="text-sm text-gray-500">
                              Créé le{" "}
                              {new Date(
                                payRun.dateCreation
                              ).toLocaleDateString()}
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
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreateForm(false)}
        >
          <div
            className="relative mx-auto p-6 border max-w-4xl w-full shadow-2xl rounded-lg bg-white max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">
                Créer une pay run
              </h3>
              <form onSubmit={handleSubmitForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Entreprise <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="entrepriseId"
                      value={formData.entrepriseId}
                      onChange={handleFormChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.entrepriseId
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner une entreprise</option>
                      {entreprises.map((ent) => (
                        <option key={ent.id} value={ent.id}>
                          {ent.nom}
                        </option>
                      ))}
                    </select>
                    {formErrors.entrepriseId && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.entrepriseId}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nom"
                      value={formData.nom}
                      onChange={handleFormChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.nom ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="Ex: PayRun Mars 2024"
                    />
                    {formErrors.nom && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.nom}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Période de début <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="periodeDebut"
                      value={formData.periodeDebut}
                      onChange={handleFormChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.periodeDebut
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.periodeDebut && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.periodeDebut}
                      </p>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Période de fin <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="periodeFin"
                      value={formData.periodeFin}
                      onChange={handleFormChange}
                      className={`mt-1 block w-full border rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        formErrors.periodeFin
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                    />
                    {formErrors.periodeFin && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.periodeFin}
                      </p>
                    )}
                  </div>
                </div>
                {journaliers.length > 0 && (
                  <div className="mb-4 mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Jours travaillés (employés journaliers)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-3">
                      {journaliers.map((emp) => (
                        <div
                          key={emp.id}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-700 font-medium">
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
                            className="w-16 border-gray-300 rounded-md shadow-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setFormErrors({});
                      setError("");
                    }}
                    className="px-5 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-sm font-medium text-white border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    style={{ backgroundColor: primaryColor }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = darkenColor(
                        primaryColor,
                        20
                      ))
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = primaryColor)
                    }
                  >
                    Créer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4"
          onClick={cancelDelete}
        >
          <div
            className="relative mx-auto p-6 border w-96 shadow-2xl rounded-lg bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Confirmer la suppression
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Êtes-vous sûr de vouloir supprimer cette pay run ? Cette action
                est irréversible.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayRuns;
