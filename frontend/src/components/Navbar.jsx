import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import NotificationPanel from "./NotificationPanel";
import MessagePanel from "./MessagePanel";
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  BellIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";

const Navbar = () => {
  const { logout, selectedEnterpriseData, selectEntreprise, user } = useAuth();
  const { unreadNotificationsCount, unreadMessagesCount } = useNotification();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = selectedEnterpriseData
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/employes", label: "Employés" },
        { to: "/payruns", label: "Pay Runs" },
        { to: "/payslips", label: "Bulletins" },
        { to: "/paiements", label: "Paiements" },
      ]
    : [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/entreprises", label: "Entreprises" },
        { to: "/employes", label: "Employés" },
        { to: "/payruns", label: "Pay Runs" },
        { to: "/payslips", label: "Bulletins" },
        { to: "/paiements", label: "Paiements" },
        { to: "/utilisateurs", label: "Utilisateurs" },
      ];

  return (
    <nav
      className="max-w-8xl relative  shadow-lg border-b border-neutral-200"
      style={{
        backgroundColor: selectedEnterpriseData?.couleurPrincipale
          ? selectedEnterpriseData.couleurPrincipale
          : "#4f46e5",
        color: "white",
      }}
    >
      <div className="w-[99%]   ">
        <div className="flex justify-end items-center h-16">
          {/* User Info & Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Messages */}
            <button
              onClick={() => setShowMessages(true)}
              className="p-2 text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors relative"
            >
              <ChatBubbleLeftIcon className="h-6 w-6" />
              {unreadMessagesCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadMessagesCount}
                </span>
              )}
            </button>

            {/* Notifications */}
            <button
              onClick={() => setShowNotifications(true)}
              className="p-2 text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors relative"
            >
              <BellIcon className="h-6 w-6" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-yellow-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* User Info */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <UserCircleIcon className="h-8 w-8 text-white" />
                <div className="text-right">
                  <p className="text-sm font-medium text-white">
                    {user?.nom || "Utilisateur"}
                  </p>
                  <p className="text-xs text-white text-opacity-80 capitalize">
                    {user?.role === "SUPER_ADMIN"
                      ? "Super Admin"
                      : user?.role === "ADMIN"
                      ? "Admin"
                      : user?.role === "CAISSIER"
                      ? "Caissier"
                      : "Utilisateur"}
                  </p>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-3 py-2 text-sm font-medium text-white bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all duration-200"
              >
                Déconnexion
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-white text-opacity-80 hover:text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              {mobileOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white bg-opacity-95 border-t border-neutral-200 animate-slide-down">
              {/* User Info Mobile */}
              <div className="px-3 py-3 border-b border-gray-200 mb-2">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-10 w-10 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user?.nom || "Utilisateur"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.role === "SUPER_ADMIN"
                        ? "Super Admin"
                        : user?.role === "ADMIN"
                        ? "Admin"
                        : user?.role === "CAISSIER"
                        ? "Caissier"
                        : "Utilisateur"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary-50 text-primary-600"
                        : "text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100"
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                <button
                  onClick={() => {
                    setShowMessages(true);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <ChatBubbleLeftIcon className="h-5 w-5" />
                  <span>
                    Messages{" "}
                    {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
                  </span>
                </button>
                <button
                  onClick={() => {
                    setShowNotifications(true);
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <BellIcon className="h-5 w-5" />
                  <span>
                    Notifications{" "}
                    {unreadNotificationsCount > 0 &&
                      `(${unreadNotificationsCount})`}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-base font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg transition-all duration-200"
                >
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification and Message Panels */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
      <MessagePanel
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
      />
    </nav>
  );
};

export default Navbar;
