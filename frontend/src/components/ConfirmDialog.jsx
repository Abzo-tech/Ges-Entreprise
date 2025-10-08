import {
  XMarkIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmer",
  cancelText = "Annuler",
  type = "warning",
}) => {
  if (!isOpen) return null;

  const typeStyles = {
    warning: {
      icon: "text-yellow-600",
      button: "bg-yellow-600 hover:bg-yellow-700",
      bg: "bg-yellow-50",
    },
    danger: {
      icon: "text-red-600",
      button: "bg-red-600 hover:bg-red-700",
      bg: "bg-red-50",
    },
    info: {
      icon: "text-blue-600",
      button: "bg-blue-600 hover:bg-blue-700",
      bg: "bg-blue-50",
    },
  };

  const style = typeStyles[type] || typeStyles.warning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={`flex items-center space-x-3 flex-1`}>
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full ${style.bg} flex items-center justify-center`}
              >
                <ExclamationTriangleIcon className={`h-6 w-6 ${style.icon}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 ml-15">
            <p className="text-gray-600">{message}</p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`px-4 py-2 text-white ${style.button} rounded-lg transition-colors`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
