import { XMarkIcon, BellIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNotification } from "../context/NotificationContext";

const NotificationPanel = ({ isOpen, onClose }) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    unreadNotificationsCount,
  } = useNotification();

  if (!isOpen) return null;

  const formatTime = (timestamp) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notifTime) / 60000);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440)
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
      default:
        return "ℹ";
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-600";
      case "error":
        return "bg-red-100 text-red-600";
      case "warning":
        return "bg-yellow-100 text-yellow-600";
      case "info":
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <BellIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">
              Notifications
            </h2>
            {unreadNotificationsCount > 0 && (
              <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadNotificationsCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={markAllNotificationsAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tout marquer comme lu
            </button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <BellIcon className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Aucune notification</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? "bg-blue-50" : ""
                  }`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getNotificationColor(
                        notification.type
                      )}`}
                    >
                      <span className="text-lg font-bold">
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="flex-shrink-0 text-gray-400 hover:text-red-600 transition-colors"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
