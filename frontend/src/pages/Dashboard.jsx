import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../components/ThemeProvider";
import api from "../services/api";
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon,
} from "@heroicons/react/24/outline";

const DashboardContent = ({
  kpis,
  salaryData,
  upcomingPayments,
  loading,
  formatCurrency,
  error,
  isSuperAdmin = false,
  isEnterpriseView = false,
  theme,
}) => (
  <>
    {error && (
      <div
        className="border-l-4 p-4 mb-6 rounded-r-lg mx-4"
        style={{
          backgroundColor: "var(--color-error-50)",
          borderColor: "var(--color-error-400)",
          color: "var(--color-error-700)",
        }}
      >
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 mr-" />
          <span>{error}</span>
        </div>
      </div>
    )}

    {/* KPIs */}
    <div
      className={`grid grid-cols-1 md:grid-cols-2 mt-4 ${
        isSuperAdmin && !isEnterpriseView ? "lg:grid-cols-6" : "lg:grid-cols-4"
      } gap-6 mb-8 px-6 animate-fade-in`}
    >
      <div className="card card-primary">
        <div className="p-6">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <CurrencyDollarIcon
                className="h-6 w-6"
                style={{ color: "white", stroke: "white" }}
              />
            </div>
            <div className="ml-4">
              <p className="form-label text-xs text-white">Masse salariale</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {loading ? "..." : formatCurrency(kpis?.salaryMass)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <CheckCircleIcon
                className="h-6 w-6"
                style={{ color: "white", stroke: "white" }}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="form-label text-xs text-white">Montant payé</p>
              <p className="text-2xl font-bold text-white mt-1">
                {loading ? "..." : formatCurrency(kpis?.paidAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <ExclamationTriangleIcon
                className="h-6 w-6"
                style={{ color: "white", stroke: "white" }}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="form-label text-xs text-white">Restant à payer</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {loading ? "..." : formatCurrency(kpis?.remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="p-6">
          <div className="flex items-center">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: theme.primary }}
            >
              <UsersIcon
                className="h-6 w-6"
                style={{ color: "white", stroke: "white" }}
              />
            </div>
            <div className="ml-4 flex-1">
              <p className="form-label text-xs text-white">Employés actifs</p>
              <p className="text-2xl font-bold mt-1 text-white">
                {loading ? "..." : kpis?.activeEmployees || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSuperAdmin && !isEnterpriseView && (
        <>
          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.primary }}
                >
                  <ChartBarIcon
                    className="h-6 w-6"
                    style={{ color: "white", stroke: "white" }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="form-label text-xs text-white">Entreprises</p>
                  <p className="text-2xl font-bold mt-1 text-white">
                    {loading ? "..." : kpis?.totalCompanies || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center">
                <div
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: theme.primary }}
                >
                  <UsersIcon
                    className="h-6 w-6"
                    style={{ color: "white", stroke: "white" }}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="form-label text-xs text-white">Utilisateurs</p>
                  <p className="text-2xl font-bold mt-1 text-white">
                    {loading ? "..." : kpis?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 px-6 animate-fade-in">
      {/* Chart Section */}
      <div className="card" style={{ backgroundColor: theme.background }}>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon
              className="h-6 w-6 mr-2"
              style={{ color: theme.textSecondary }}
            />
            <h2 className="text-xl font-semibold" style={{ color: theme.textPrimary }}>
              Évolution de la masse salariale
            </h2>
          </div>
          <p className="mb-6" style={{ color: theme.textSecondary }}>6 derniers mois</p>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: theme.textSecondary }}></div>
            </div>
          ) : (salaryData || []).length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64" style={{ color: theme.textSecondary }}>
              <ChartBarIcon className="h-12 w-12 mb-2" style={{ color: theme.accent }} />
              <p>Aucune donnée disponible</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={theme.border}
                />
                <XAxis
                  dataKey="month"
                  stroke={theme.textSecondary}
                  fontSize={12}
                />
                <YAxis stroke={theme.textSecondary} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.tooltipBackground,
                    border: `1px solid ${theme.border}`,
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [
                    formatCurrency(value),
                    "Masse salariale",
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="masse"
                  stroke={theme.primary}
                  strokeWidth={3}
                  dot={{ fill: theme.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: theme.primary, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="card" style={{ backgroundColor: "white" }}>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon
              className="h-6 w-6 mr-2"
              style={{ color: theme.textSecondary }}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              Prochains paiements
            </h2>
          </div>
          <p className="mb-6 text-gray-600">Paiements à effectuer</p>
          <div className="space-y-4 max-h-80 overflow-y-auto scrollbar-hide">
            {loading ? (
              <div className="text-center py-8 text-gray-600">
                Chargement...
              </div>
            ) : (upcomingPayments || []).length === 0 ? (
              <div className="text-center py-8 text-gray-600">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Aucun paiement en attente</p>
              </div>
            ) : (
              upcomingPayments.map((payment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mr-3 bg-gray-100">
                      <span className="font-medium text-sm text-gray-600">
                        {payment.employeeName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        {payment.employeeName}
                      </p>
                      <p className="text-xs text-gray-600">{payment.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-sm text-gray-900">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-xs text-gray-600">
                      Échéance: {payment.dueDate}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  </>
);

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [salaryData, setSalaryData] = useState(null);
  const [upcomingPayments, setUpcomingPayments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { token, user, selectedEntreprise, selectedEnterpriseData } = useAuth();
  const { theme } = useTheme();

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");
        const [kpisResponse, evolutionResponse, paymentsResponse] =
          await Promise.all([
            api.get("/dashboard/kpis"),
            api.get("/dashboard/salary-evolution"),
            api.get("/dashboard/upcoming-payments"),
          ]);

        setKpis(kpisResponse.data || {});
        setSalaryData(evolutionResponse.data || []);
        setUpcomingPayments(paymentsResponse.data || []);
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du tableau de bord:",
          err
        );
        setError("Erreur lors du chargement des données");
        setKpis({});
        setSalaryData([]);
        setUpcomingPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token, selectedEntreprise]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 0,
    }).format(value || 0);
  };

  // Render different dashboard views based on user role
  if (!user) {
    return <div>Chargement...</div>;
  }

  // Modern dashboard UI with role-based content
  const renderDashboardTitle = () => {
    if (selectedEntreprise) {
      return `Tableau de bord ${selectedEnterpriseData?.nom || "Entreprise"}`;
    }
    switch (user.role) {
      case "SUPER_ADMIN":
        return "Tableau de bord Super Admin";
      case "ADMIN":
      case "UTILISATEUR":
        return "Tableau de bord Admin";
      case "CAISSIER":
        return "Tableau de bord Caissier";
      default:
        return "Tableau de bord";
    }
  };

  const renderDashboardSubtitle = () => {
    if (selectedEntreprise) {
      return `Vue d'ensemble de la gestion salariale de ${
        selectedEnterpriseData?.nom || "l'entreprise"
      }`;
    }
    switch (user.role) {
      case "SUPER_ADMIN":
        return "Vue d'ensemble globale du système de gestion salariale";
      case "ADMIN":
      case "UTILISATEUR":
        return "Vue d'ensemble de votre gestion salariale";
      case "CAISSIER":
        return "Vue d'ensemble de votre gestion salariale";
      default:
        return "";
    }
  };

  return (
    <div
      className="w-full h-full"
      style={{ backgroundColor: "var(--color-primary-50)" }}
    >
      <DashboardContent
        kpis={kpis}
        salaryData={salaryData}
        upcomingPayments={upcomingPayments}
        loading={loading}
        formatCurrency={formatCurrency}
        error={error}
        isSuperAdmin={user.role === "SUPER_ADMIN"}
        isEnterpriseView={!!selectedEntreprise}
        theme={theme}
      />
    </div>
  );
};

export default Dashboard;
