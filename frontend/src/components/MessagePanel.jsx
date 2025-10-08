import {
  XMarkIcon,
  ChatBubbleLeftIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useNotification } from "../context/NotificationContext";

const MessagePanel = ({ isOpen, onClose }) => {
  const {
    messages,
    markMessageAsRead,
    markAllMessagesAsRead,
    deleteMessage,
    unreadMessagesCount,
  } = useNotification();

  if (!isOpen) return null;

  const formatTime = (timestamp) => {
    const now = new Date();
    const msgTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - msgTime) / 60000);

    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440)
      return `Il y a ${Math.floor(diffInMinutes / 60)} h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)} j`;
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
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
            <ChatBubbleLeftIcon className="h-6 w-6 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            {unreadMessagesCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadMessagesCount}
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
        {messages.length > 0 && (
          <div className="p-3 border-b border-gray-200">
            <button
              onClick={markAllMessagesAsRead}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Tout marquer comme lu
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ChatBubbleLeftIcon className="h-16 w-16 mb-4" />
              <p className="text-lg font-medium">Aucun message</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !message.read ? "bg-red-50" : ""
                  }`}
                  onClick={() => markMessageAsRead(message.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                      {getInitials(message.from)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {message.from}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      <p className="text-sm font-medium text-gray-700 mt-1">
                        {message.subject}
                      </p>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {message.content}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
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

export default MessagePanel;
