import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  salaryByDepartment,
  paymentTrends,
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
        className="border-l-4 p-4 mb-4 rounded-r-lg mx-4"
        style={{
          backgroundColor: "var(--color-error-50)",
          borderColor: "var(--color-error-400)",
          color: "var(--color-error-700)",
        }}
      >
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 " />
          <span>{error}</span>
        </div>
      </div>
    )}

    {/* KPIs */}
    <div
      className={`grid grid-cols-1 md:grid-cols-2 ${
        isSuperAdmin && !isEnterpriseView ? "lg:grid-cols-6" : "lg:grid-cols-4"
      } gap-6 mb-16 px-6 animate-fade-in`}
    >
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-600">
              <CurrencyDollarIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-xs text-gray-600">Masse salariale</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? "..." : formatCurrency(kpis?.salaryMass)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-600">
              <CheckCircleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-xs text-gray-600">Montant payé</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : formatCurrency(kpis?.paidAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-600">
              <ExclamationTriangleIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-xs text-gray-600">Restant à payer</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : formatCurrency(kpis?.remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-4">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-600">
              <UsersIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-xs text-gray-600">Employés actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? "..." : kpis?.activeEmployees || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSuperAdmin && !isEnterpriseView && (
        <>
          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-indigo-600">
                  <ChartBarIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-xs text-gray-600">Entreprises</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : kpis?.totalCompanies || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-pink-600">
                  <UsersIcon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-xs text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? "..." : kpis?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    {/* Charts Container with Invisible Scroll */}
    <div className="px-6 mb-8">
      <div className="max-h-[1200px] overflow-y-auto scrollbar-hide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          {/* Chart Section - Évolution de la masse salariale */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 mr-2 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Évolution de la masse salariale
                </h2>
              </div>
              <p className="mb-6 text-gray-600">6 derniers mois</p>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (salaryData || []).length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mb-2 text-gray-400" />
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salaryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
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
                      stroke="#3B82F6"
                      strokeWidth={3}
                      dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Upcoming Payments */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <CalendarIcon className="h-6 w-6 mr-2 text-orange-600" />
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
                          <p className="text-xs text-gray-600">
                            {payment.period}
                          </p>
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

        {/* Additional Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
          {/* Bar Chart - Salaires par département */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 mr-2 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Salaires par département
                </h2>
              </div>
              <p className="mb-6 text-gray-600">
                Comparaison des salaires moyens
              </p>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                </div>
              ) : (salaryByDepartment || []).length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mb-2 text-gray-400" />
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salaryByDepartment}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis
                      dataKey="department"
                      stroke="#6B7280"
                      fontSize={12}
                    />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [
                        formatCurrency(value),
                        "Salaire moyen",
                      ]}
                    />
                    <Legend />
                    <Bar
                      dataKey="salaire"
                      fill="#10B981"
                      radius={[8, 8, 0, 0]}
                      name="Salaire moyen"
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Area Chart - Tendances de paiement */}
          <div className="bg-white rounded-lg shadow-lg border border-gray-200">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <ChartBarIcon className="h-6 w-6 mr-2 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Tendances de paiement
                </h2>
              </div>
              <p className="mb-6 text-gray-600">
                Évolution des paiements effectués vs restants
              </p>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
                </div>
              ) : (paymentTrends || []).length === 0 ? (
                <div className="flex flex-col justify-center items-center h-64 text-gray-500">
                  <ChartBarIcon className="h-12 w-12 mb-2 text-gray-400" />
                  <p>Aucune donnée disponible</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={paymentTrends}>
                    <defs>
                      <linearGradient
                        id="colorPaye"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#8B5CF6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorRestant"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#F59E0B"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#F59E0B"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#FFFFFF",
                        border: "1px solid #E5E7EB",
                        borderRadius: "8px",
                      }}
                      formatter={(value) => [formatCurrency(value), ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="paye"
                      stroke="#8B5CF6"
                      fillOpacity={1}
                      fill="url(#colorPaye)"
                      name="Payé"
                    />
                    <Area
                      type="monotone"
                      dataKey="restant"
                      stroke="#F59E0B"
                      fillOpacity={1}
                      fill="url(#colorRestant)"
                      name="Restant"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
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
  const [salaryByDepartment, setSalaryByDepartment] = useState(null);
  const [paymentTrends, setPaymentTrends] = useState(null);
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

        // Fetch additional chart data (with fallback to demo data if endpoints don't exist)
        try {
          const departmentResponse = await api.get(
            "/dashboard/salary-by-department"
          );
          setSalaryByDepartment(departmentResponse.data || []);
        } catch {
          // Demo data for salary by department
          setSalaryByDepartment([
            { department: "IT", salaire: 45000 },
            { department: "RH", salaire: 35000 },
            { department: "Finance", salaire: 42000 },
            { department: "Marketing", salaire: 38000 },
            { department: "Ventes", salaire: 40000 },
          ]);
        }

        try {
          const trendsResponse = await api.get("/dashboard/payment-trends");
          setPaymentTrends(trendsResponse.data || []);
        } catch {
          // Demo data for payment trends
          setPaymentTrends([
            { month: "Jan", paye: 85000, restant: 15000 },
            { month: "Fév", paye: 92000, restant: 12000 },
            { month: "Mar", paye: 88000, restant: 18000 },
            { month: "Avr", paye: 95000, restant: 10000 },
            { month: "Mai", paye: 90000, restant: 14000 },
            { month: "Juin", paye: 98000, restant: 8000 },
          ]);
        }
      } catch (err) {
        console.error(
          "Erreur lors du chargement des données du tableau de bord:",
          err
        );
        setError("Erreur lors du chargement des données");
        setKpis({});
        setSalaryData([]);
        setUpcomingPayments([]);
        setSalaryByDepartment([]);
        setPaymentTrends([]);
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
    <div className="w-full h-full bg-white overflow-y-auto scrollbar-hide">
      <DashboardContent
        kpis={kpis}
        salaryData={salaryData}
        upcomingPayments={upcomingPayments}
        salaryByDepartment={salaryByDepartment}
        paymentTrends={paymentTrends}
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
