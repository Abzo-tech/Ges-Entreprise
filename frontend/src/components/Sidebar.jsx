import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

import { useTheme } from '../components/ThemeProvider';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: HomeIcon,
    },
    {
      to: "/entreprises",
      label: "Entreprises",
      icon: BuildingStorefrontIcon,
      roles: ["SUPER_ADMIN"], // Only super admin can see entreprises
    },
    {
      to: "/employes",
      label: "Employés",
      icon: UsersIcon,
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
    {
      to: "/utilisateurs",
      label: "Utilisateurs",
      icon: UserGroupIcon,
      roles: ["SUPER_ADMIN"], // Only super admin can see utilisateurs
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles) return true; // No role restriction
    return item.roles.includes(user?.role);
  });

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
        fixed inset-y-0 left-0 z-50 w-[16%] h-full shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
        style={{
          backgroundColor: theme.primary,
          borderRight: `1px solid ${theme.primaryDark}`,
          color: theme.textOnPrimary,
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between h-16 px-6 border-b"
          style={{
            borderColor: theme.primaryDark,
            backgroundColor: theme.primaryDark,
          }}
        >
          {user?.role === 'SUPER_ADMIN' && (
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="h-16 w-16 text-white" />
              <h1 className="text-lg font-bold text-white">Gestion des Entreprises</h1>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-colors"
            style={{
              color: theme.textOnPrimary,
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = theme.textOnPrimaryHover;
              e.target.style.backgroundColor = theme.textOnPrimaryBackgroundHover;
            }}
            onMouseLeave={(e) => {
              e.target.style.color = theme.textOnPrimary;
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-5 h-full">
          {filteredNavItems.map((item) => {
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
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
