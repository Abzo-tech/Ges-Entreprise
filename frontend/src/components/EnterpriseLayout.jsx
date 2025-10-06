import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import EnterpriseSidebar from './EnterpriseSidebar';
import Navbar from './Navbar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const EnterpriseLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { selectedEnterpriseData } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Couleurs par défaut si non définies
  const primaryColor = selectedEnterpriseData?.couleurPrincipale || '#6366f1';

  return (
    <div className="h-screen w-full flex overflow-hidden" style={{ backgroundColor: 'var(--color-primary-50)' }}>
      {/* Sidebar */}
      <EnterpriseSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Mobile header - only for mobile when navbar is hidden */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 shadow-lg border-b" style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl transition-all duration-200 shadow-sm"
            style={{
              color: 'var(--color-text-secondary)',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.target.style.color = 'var(--color-primary)';
              e.target.style.backgroundColor = 'var(--color-primary-50)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = 'var(--color-text-secondary)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full shadow-xl flex flex-col" style={{ backgroundColor: 'var(--color-surface)' }}>
            <div className="flex-1 animate-fade-in overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EnterpriseLayout;