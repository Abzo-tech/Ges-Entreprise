import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BuildingOfficeIcon,
  HomeIcon,
  UsersIcon,
  DocumentTextIcon,
  CreditCardIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

const EnterpriseSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, selectedEnterpriseData, selectEntreprise } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleBackToSuperAdmin = () => {
    selectEntreprise(null);
    navigate("/dashboard");
  };

  const primaryColor = selectedEnterpriseData?.couleurPrincipale || "#4f46e5";

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: HomeIcon,
    },
    {
      to: "/employes",
      label: "Employés",
      icon: UsersIcon,
    },
    {
      to: "/pointages",
      label: "Pointages",
      icon: ClockIcon,
    },
    {
      to: "/payruns",
      label: "Pay Runs",
      icon: DocumentTextIcon,
    },
    {
      to: "/payslips",
      label: "Bulletins",
      icon: DocumentTextIcon,
    },
    {
      to: "/paiements",
      label: "Paiements",
      icon: CreditCardIcon,
    },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-[16%] h-full shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        style={{
          backgroundColor: selectedEnterpriseData?.couleurPrincipale
            ? selectedEnterpriseData.couleurPrincipale
            : "#4f46e5",
          color: "white",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between h-16 px-6"
          style={{
            backgroundColor: selectedEnterpriseData?.couleurPrincipale
              ? selectedEnterpriseData.couleurPrincipale
              : "#4f46e5",
          }}
        >
          <div className="flex items-center space-x-3">
            {selectedEnterpriseData?.logo && (
              <img
                src={`${import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000'}${selectedEnterpriseData.logo}`}
                alt="Logo entreprise"
                className="h-8 w-8 rounded-full object-cover"
              />
            )}
            <h2 className="text-lg font-semibold text-white truncate">
              {selectedEnterpriseData?.nom || 'Entreprise'}
            </h2>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{
              color: "rgba(255, 255, 255, 0.8)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "white";
              e.target.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "rgba(255, 255, 255, 0.8)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-5 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-lg text-xl font-medium transition-all duration-200 ${
                    isActive
                      ? "border-l-4 bg-white bg-opacity-20"
                      : "text-white text-opacity-90 hover:text-white hover:bg-white hover:bg-opacity-10"
                  }`
                }
                style={({ isActive }) => ({
                  borderLeftColor: isActive ? "white" : undefined,
                })}
              >
                <Icon className="h-7 w-7 text-white" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Back to Super Admin */}
          <div className="pt-4">
            <button
              onClick={handleBackToSuperAdmin}
              className="flex items-center space-x-2 w-full px-3 py-2 text-sm font-medium text-white rounded-lg transition-all duration-200 hover:bg-white hover:bg-opacity-20"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Retour Super Admin</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default EnterpriseSidebar;
