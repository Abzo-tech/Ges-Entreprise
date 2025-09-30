import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  BuildingOfficeIcon, 
  Bars3Icon, 
  XMarkIcon,
  UserCircleIcon 
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/entreprises', label: 'Entreprises' },
    { to: '/employes', label: 'Employés' },
    { to: '/payruns', label: 'Pay Runs' },
    { to: '/payslips', label: 'Bulletins' },
    { to: '/paiements', label: 'Paiements' },
    { to: '/utilisateurs', label: 'Utilisateurs' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <Link to="/dashboard" className="text-xl font-bold text-neutral-900 hover:text-primary-600 transition-colors">
              GES Entreprises
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600 shadow-md'
                      : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 text-sm font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg shadow-md transition-all duration-200"
            >
              Déconnexion
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-neutral-700 hover:text-neutral-900 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
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
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-neutral-200 animate-slide-down">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    }`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-base font-medium text-white bg-error-600 hover:bg-error-700 rounded-lg transition-all duration-200 mt-2"
              >
                Déconnexion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
