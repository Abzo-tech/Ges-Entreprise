import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BuildingOfficeIcon,
  HomeIcon,
  UsersIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
  CreditCardIcon,
  UserGroupIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    {
      to: '/dashboard',
      label: 'Dashboard',
      icon: HomeIcon
    },
    {
      to: '/entreprises',
      label: 'Entreprises',
      icon: BuildingStorefrontIcon
    },
    {
      to: '/employes',
      label: 'Employés',
      icon: UsersIcon
    },
    {
      to: '/payruns',
      label: 'Pay Runs',
      icon: DocumentTextIcon
    },
    {
      to: '/payslips',
      label: 'Bulletins',
      icon: DocumentTextIcon
    },
    {
      to: '/paiements',
      label: 'Paiements',
      icon: CreditCardIcon
    },
    {
      to: '/utilisateurs',
      label: 'Utilisateurs',
      icon: UserGroupIcon
    }
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
      <div className={`
        fixed inset-y-0 left-0 z-50 w-[16%] h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-neutral-200">
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-neutral-900">GES Entreprises</span>
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 transition-colors"
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
                      ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-600'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                  }`
                }
              >
                <Icon className="h-7 w-7" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          {/* Logout */}
          <div className="pt-4 border-t border-neutral-200">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 w-full px-4 py-3 text-xl font-medium text-error-800 hover:text-error-900 hover:bg-error-50 rounded-lg transition-all duration-200"
            >
              <ArrowRightOnRectangleIcon className="h-7 w-7" />
              <span>Déconnexion</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
