import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Bars3Icon } from "@heroicons/react/24/outline";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className="h-screen w-full flex overflow-hidden"
      style={{ backgroundColor: "#f8fafc" }}
    >
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Mobile header - only for mobile when navbar is hidden */}
        <div
          className="lg:hidden flex items-center justify-between h-16 px-4 shadow-lg border-b"
          style={{
            backgroundColor: "white",
            borderColor: "var(--color-border)",
          }}
        >
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl transition-all duration-200 shadow-sm"
            style={{
              color: "var(--color-text-secondary)",
              backgroundColor: "transparent",
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "var(--color-primary)";
              e.target.style.backgroundColor = "var(--color-primary-50)";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "var(--color-text-secondary)";
              e.target.style.backgroundColor = "transparent";
            }}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div
            className="w-full h-full shadow-xl flex flex-col"
            style={{ backgroundColor: "white" }}
          >
            <div className="flex-1 animate-fade-in overflow-hidden">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
