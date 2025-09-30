import { useState } from 'react';
import Sidebar from './Sidebar';
import { Bars3Icon } from '@heroicons/react/24/outline';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white/80 backdrop-blur-sm shadow-lg border-b border-neutral-200">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-all duration-200 shadow-sm"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold text-neutral-900 bg-gradient-to-r from-primary-600 to-indigo-700 bg-clip-text text-transparent">GES Entreprises</h1>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="w-full h-full rounded-2xl bg-white/70 backdrop-blur-sm shadow-xl flex flex-col">
            <div className="flex-1 animate-fade-in p-4 overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
