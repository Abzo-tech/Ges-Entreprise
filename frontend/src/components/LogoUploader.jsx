import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import api from "../services/api";

const LogoUploader = ({
  entrepriseId,
  currentLogo,
  onLogoChange,
  className = "",
  autoUpload = true, // Nouveau prop pour contrôler l'upload automatique
}) => {
  const { user } = useAuth();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(currentLogo || null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validation côté client - Seuls JPEG et PNG sont acceptés
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      setError(
        "Format non autorisé. Seuls les formats JPEG et PNG sont acceptés"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB
      setError("Le fichier ne doit pas dépasser 5MB");
      return;
    }

    setError("");

    // Créer un aperçu
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Upload automatique seulement si autoUpload est true ET entrepriseId existe
    if (autoUpload && entrepriseId) {
      uploadLogo(file);
    } else {
      // Sinon, on passe juste le fichier au parent via onLogoChange
      onLogoChange(file);
    }
  };

  const uploadLogo = async (file) => {
    if (!entrepriseId) {
      setError("ID entreprise manquant");
      return;
    }

    setIsUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await api.post(
        `/files/upload/logo/${entrepriseId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newLogoPath = response.data.logoPath;
      setPreview(
        `${
          import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
        }${newLogoPath}`
      );
      onLogoChange(newLogoPath);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      setError(
        error.response?.data?.error || "Erreur lors de l'upload du logo"
      );
      setPreview(currentLogo || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentLogo) return;

    try {
      await api.delete("/files/logo", {
        data: { logoPath: currentLogo },
      });

      setPreview(null);
      onLogoChange(null);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      setError("Erreur lors de la suppression du logo");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const canUpload = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="form-label">Logo de l'entreprise</label>
        {error && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            {error}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {/* Zone d'upload/apercu */}
        <div
          className={`
            relative w-24 h-24 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-all duration-200
            ${
              preview
                ? "border-gray-300 bg-gray-50"
                : "border-gray-300 hover:border-primary-400 hover:bg-primary-50"
            }
            ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            ${!canUpload ? "cursor-not-allowed opacity-50" : ""}
          `}
          onClick={canUpload ? triggerFileSelect : undefined}
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <div className="loading-spinner w-6 h-6"></div>
              <span className="text-xs text-gray-500 mt-1">Upload...</span>
            </div>
          ) : preview ? (
            <div className="relative w-full h-full">
              <img
                src={preview}
                alt="Logo aperçu"
                className="w-full h-full object-cover rounded-lg"
              />
              {canUpload && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Supprimer le logo"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-gray-400">
              <ImageIcon className="h-8 w-8 mb-1" />
              <span className="text-xs">Logo</span>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={!canUpload || isUploading}
          />
        </div>

        {/* Informations et actions */}
        <div className="flex-1">
          <div className="text-sm text-gray-600 space-y-1">
            <p>• Formats acceptés: JPEG, PNG</p>
            <p>• Taille maximale: 5MB</p>
            <p>• Dimensions recommandées: 200x200px</p>
          </div>

          {canUpload && (
            <button
              type="button"
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="btn-outline-primary mt-3 text-sm px-3 py-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              {preview ? "Changer le logo" : "Ajouter un logo"}
            </button>
          )}
        </div>
      </div>

      {/* Message d'aide */}
      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
        <strong>Conseil:</strong> Utilisez un logo avec un fond transparent pour
        un meilleur rendu. Le logo sera automatiquement redimensionné et
        optimisé.
      </div>
    </div>
  );
};

export default LogoUploader;
