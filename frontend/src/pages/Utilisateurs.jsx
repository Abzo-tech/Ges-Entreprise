import { useState, useEffect } from "react";
import api from "../services/api";
import Pagination from "../components/Pagination";
import ConfirmDialog from "../components/ConfirmDialog";
import { useNotification } from "../context/NotificationContext";
import { z } from "zod";

// Schema de validation pour l'utilisateur
const utilisateurFormSchema = z.object({
  prenom: z
    .string()
    .min(1, "Le prénom est requis")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),
  nom: z
    .string()
    .min(1, "Le nom est requis")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),
  email: z.string().email("Email invalide"),
  role: z.enum(["Super Admin", "Admin", "Utilisateur"], {
    errorMap: () => ({ message: "Rôle invalide" }),
  }),
  entreprises: z.array(z.number()).optional(),
});

const Utilisateurs = () => {
  const { addNotification } = useNotification();
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    role: "",
    actif: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    role: "",
    entreprises: [],
  });
  const [entreprises, setEntreprises] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
    type: "warning",
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUtilisateurs();
    fetchEntreprises();
  }, [filters, currentPage]);

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const fetchUtilisateurs = async () => {
    try {
      setLoading(true);
      setError("");
      const params = new URLSearchParams();
      if (filters.role) params.append("role", filters.role);
      if (filters.actif !== "")
        params.append("actif", filters.actif === "actif" ? "true" : "false");
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      const response = await api.get(`/utilisateurs?${params.toString()}`);
      setUtilisateurs(response.data.data || []);
      setTotal(response.data.total || 0);
    } catch (err) {
      setError("Erreur lors du chargement des utilisateurs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEntreprises = async () => {
    try {
      const response = await api.get("/entreprises");
      console.log("Entreprises response:", response);
      const data = response.data;
      setEntreprises(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Erreur lors du chargement des entreprises", err);
      setEntreprises([]);
    }
  };

  const handleConfirm = (title, message, action, type = "warning") => {
    setConfirmConfig({
      title,
      message,
      onConfirm: action,
      type,
    });
    setShowConfirm(true);
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
    setCurrentPage(1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name === "entreprises") {
      const entreprisesIds = Array.from(e.target.selectedOptions, (option) =>
        Number(option.value)
      );
      setFormData({ ...formData, [name]: entreprisesIds });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" });
    }
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setFormErrors({});
    setError("");

    try {
      // Validation avec Zod
      utilisateurFormSchema.parse(formData);

      if (editingUser) {
        await api.put(`/utilisateurs/${editingUser.id}`, formData);
        addNotification({
          type: "success",
          title: "Utilisateur modifié",
          message: `L'utilisateur ${formData.prenom} ${formData.nom} a été modifié avec succès.`,
        });
      } else {
        await api.post("/utilisateurs", formData);
        addNotification({
          type: "success",
          title: "Utilisateur créé",
          message: `L'utilisateur ${formData.prenom} ${formData.nom} a été créé avec succès.`,
        });
      }
      setShowForm(false);
      setEditingUser(null);
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        role: "",
        entreprises: [],
      });
      fetchUtilisateurs();
    } catch (err) {
      if (err.name === "ZodError") {
        const fieldErrors = {};
        err.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setFormErrors(fieldErrors);
      } else {
        setError("Erreur lors de la sauvegarde de l'utilisateur");
        addNotification({
          type: "error",
          title: "Erreur",
          message: "Erreur lors de la sauvegarde de l'utilisateur",
        });
        console.error(err);
      }
    }
  };

  const handleToggleActive = async (id) => {
    const user = utilisateurs.find((u) => u.id === id);
    handleConfirm(
      "Changement de statut",
      `Êtes-vous sûr de vouloir ${
        user?.actif ? "désactiver" : "activer"
      } cet utilisateur ?`,
      async () => {
        try {
          await api.put(`/utilisateurs/${id}/actif`);
          addNotification({
            type: "success",
            title: "Statut modifié",
            message: `L'utilisateur a été ${
              user?.actif ? "désactivé" : "activé"
            } avec succès.`,
          });
          fetchUtilisateurs();
        } catch (err) {
          setError("Erreur lors du changement de statut");
          addNotification({
            type: "error",
            title: "Erreur",
            message: "Erreur lors du changement de statut",
          });
          console.error(err);
        }
      },
      "warning"
    );
  };

  const handleDeleteUser = async (id) => {
    const user = utilisateurs.find((u) => u.id === id);
    handleConfirm(
      "Supprimer l'utilisateur",
      `Êtes-vous sûr de vouloir supprimer l'utilisateur ${user?.prenom} ${user?.nom} ? Cette action est irréversible.`,
      async () => {
        try {
          await api.delete(`/utilisateurs/${id}`);
          addNotification({
            type: "success",
            title: "Utilisateur supprimé",
            message: `L'utilisateur ${user?.prenom} ${user?.nom} a été supprimé avec succès.`,
          });
          fetchUtilisateurs();
        } catch (err) {
          setError("Erreur lors de la suppression");
          addNotification({
            type: "error",
            title: "Erreur",
            message: "Erreur lors de la suppression de l'utilisateur",
          });
          console.error(err);
        }
      },
      "danger"
    );
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setShowForm(true);
    setFormData({
      prenom: "",
      nom: "",
      email: "",
      role: "",
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
      entreprises: user.entreprises
        ? user.entreprises.map((ent) => ent.id)
        : [],
    });
  };

  const totalPages = Math.ceil(total / itemsPerPage);

  return (
    <div className="min-h-screen w-8xl bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-[100%] mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">
              Gestion des Utilisateurs
            </h1>
            <button
              onClick={handleAddUser}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Ajouter un utilisateur
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[100%] mx-auto py-2 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          {/* Filtres */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
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
              <ul className="divide-y divide-gray-200 max-h-97 overflow-y-auto scrollbar-hide">
                {utilisateurs.map((user) => (
                  <li key={user.id} className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-700">
                              {user.prenom?.[0] || ""}
                              {user.nom?.[0] || ""}
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
                              Entreprises:{" "}
                              {user.entreprises
                                .map((ent) => ent.nom)
                                .join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.actif
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.actif ? "Actif" : "Inactif"}
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
                            user.actif
                              ? "text-red-600 hover:text-red-900"
                              : "text-green-600 hover:text-green-900"
                          }`}
                        >
                          {user.actif ? "Désactiver" : "Activer"}
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

      {/* Modal pour ajouter/modifier */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingUser
                    ? "Modifier l'utilisateur"
                    : "Nouvel utilisateur"}
                </h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmitForm} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prénom
                      </label>
                      <input
                        type="text"
                        name="prenom"
                        value={formData.prenom}
                        onChange={handleFormChange}
                        placeholder="Jean"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          formErrors.prenom
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                      />
                      {formErrors.prenom && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.prenom}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nom
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleFormChange}
                        placeholder="Dupont"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                          formErrors.nom ? "border-red-300" : "border-gray-300"
                        }`}
                      />
                      {formErrors.nom && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.nom}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="jean.dupont@email.com"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        formErrors.email ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {formErrors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rôle
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleFormChange}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                        formErrors.role ? "border-red-300" : "border-gray-300"
                      }`}
                    >
                      <option value="">Sélectionner un rôle</option>
                      <option value="Super Admin">Super Admin</option>
                      <option value="Admin">Admin</option>
                      <option value="Utilisateur">Utilisateur</option>
                    </select>
                    {formErrors.role && (
                      <p className="mt-1 text-sm text-red-600">
                        {formErrors.role}
                      </p>
                    )}
                  </div>

                  {formData.role === "Admin" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Entreprises associées
                      </label>
                      <select
                        name="entreprises"
                        multiple
                        value={formData.entreprises}
                        onChange={handleFormChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      >
                        {entreprises.map((ent) => (
                          <option key={ent.id} value={ent.id}>
                            {ent.nom}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500">
                        Maintenez Ctrl pour sélectionner plusieurs entreprises
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-white bg-primary-600 border border-transparent rounded-lg shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                  >
                    {editingUser ? "Modifier" : "Créer"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmation */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          if (confirmConfig.onConfirm) {
            confirmConfig.onConfirm();
          }
          setShowConfirm(false);
        }}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </div>
  );
};

export default Utilisateurs;
