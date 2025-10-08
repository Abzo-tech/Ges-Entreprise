import { createContext, useContext, useState, useCallback } from "react";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);

  // Ajouter une notification
  const addNotification = useCallback((notification) => {
    const id = Date.now();
    const newNotification = {
      id,
      ...notification,
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
    return id;
  }, []);

  // Ajouter un message
  const addMessage = useCallback((message) => {
    const id = Date.now();
    const newMessage = {
      id,
      ...message,
      timestamp: new Date(),
      read: false,
    };
    setMessages((prev) => [newMessage, ...prev]);
    return id;
  }, []);

  // Marquer une notification comme lue
  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  }, []);

  // Marquer un message comme lu
  const markMessageAsRead = useCallback((id) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, read: true } : msg))
    );
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  }, []);

  // Marquer tous les messages comme lus
  const markAllMessagesAsRead = useCallback(() => {
    setMessages((prev) => prev.map((msg) => ({ ...msg, read: true })));
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  }, []);

  // Supprimer un message
  const deleteMessage = useCallback((id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  }, []);

  // Compter les notifications non lues
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Compter les messages non lus
  const unreadMessagesCount = messages.filter((m) => !m.read).length;

  const value = {
    notifications,
    messages,
    addNotification,
    addMessage,
    markNotificationAsRead,
    markMessageAsRead,
    markAllNotificationsAsRead,
    markAllMessagesAsRead,
    deleteNotification,
    deleteMessage,
    unreadNotificationsCount,
    unreadMessagesCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
