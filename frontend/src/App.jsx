import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./components/ThemeProvider";
import Layout from "./components/Layout";
import EnterpriseLayout from "./components/EnterpriseLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employes from "./pages/Employes";
import PayRuns from "./pages/PayRuns";
import Payslips from "./pages/Payslips";
import Paiements from "./pages/Paiements";
import Utilisateurs from "./pages/Utilisateurs";
import Entreprises from "./pages/Entreprises";
import Pointages from "./pages/Pointages";
import VigileDashboard from "./pages/VigileDashboard";
import "./App.css";

const PrivateRoute = ({ children }) => {
  const { token, selectedEntreprise } = useAuth();
  if (!token) return <Navigate to="/login" />;

  const LayoutComponent = selectedEntreprise ? EnterpriseLayout : Layout;
  return <LayoutComponent>{children}</LayoutComponent>;
};

const RoleBasedRoute = ({ children, allowedRoles = [] }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on role
    if (user.role === "VIGILE") {
      return <Navigate to="/vigile" />;
    }
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <RoleBasedRoute
                    allowedRoles={["SUPER_ADMIN", "ADMIN", "CAISSIER"]}
                  >
                    <Dashboard />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/vigile"
              element={
                <PrivateRoute>
                  <RoleBasedRoute allowedRoles={["VIGILE"]}>
                    <VigileDashboard />
                  </RoleBasedRoute>
                </PrivateRoute>
              }
            />
            <Route
              path="/employes"
              element={
                <PrivateRoute>
                  <Employes />
                </PrivateRoute>
              }
            />
            <Route
              path="/payruns"
              element={
                <PrivateRoute>
                  <PayRuns />
                </PrivateRoute>
              }
            />
            <Route
              path="/payslips"
              element={
                <PrivateRoute>
                  <Payslips />
                </PrivateRoute>
              }
            />
            <Route
              path="/paiements"
              element={
                <PrivateRoute>
                  <Paiements />
                </PrivateRoute>
              }
            />
            <Route
              path="/pointages"
              element={
                <PrivateRoute>
                  <Pointages />
                </PrivateRoute>
              }
            />
            <Route
              path="/utilisateurs"
              element={
                <PrivateRoute>
                  <Utilisateurs />
                </PrivateRoute>
              }
            />
            <Route
              path="/entreprises"
              element={
                <PrivateRoute>
                  <Entreprises />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
