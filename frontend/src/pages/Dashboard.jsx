import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const DashboardContent = ({ kpis, salaryData, upcomingPayments, loading, formatCurrency, error, isSuperAdmin = false }) => (
  <>
    {error && (
      <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 mb-6 rounded-r-lg mx-4">
        <div className="flex">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2" />
          <span>{error}</span>
        </div>
      </div>
    )}

    {/* KPIs */}
    <div className={`grid grid-cols-1 md:grid-cols-2 ${isSuperAdmin ? 'lg:grid-cols-6' : 'lg:grid-cols-4'} gap-6 mb-8 px-4`}>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white">
              <CurrencyDollarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 ">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Masse salariale</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : formatCurrency(kpis?.salaryMass)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg text-white">
              <CheckCircleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Montant payé</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : formatCurrency(kpis?.paidAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg text-white">
              <ExclamationTriangleIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Restant à payer</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : formatCurrency(kpis?.remainingAmount)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg text-white">
              <UsersIcon className="h-6 w-6" />
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Employés actifs</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {loading ? '...' : kpis?.activeEmployees || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isSuperAdmin && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Entreprises</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : kpis?.totalCompanies || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg text-white">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {loading ? '...' : kpis?.totalUsers || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 px-4">
      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <ChartBarIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Évolution de la masse salariale</h2>
          </div>
          <p className="text-gray-600 mb-6">6 derniers mois</p>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : (salaryData || []).length === 0 ? (
            <div className="flex flex-col justify-center items-center h-64 text-gray-500">
              <ChartBarIcon className="h-12 w-12 text-gray-400 mb-2" />
              <p>Aucune donnée disponible</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salaryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                  formatter={(value) => [formatCurrency(value), 'Masse salariale']}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="masse"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#6366f1', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Upcoming Payments */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <CalendarIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Prochains paiements</h2>
          </div>
          <p className="text-gray-600 mb-6">Paiements à effectuer</p>
          <div className="space-y-4 max-h-80 overflow-y-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Chargement...</div>
            ) : (upcomingPayments || []).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CalendarIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p>Aucun paiement en attente</p>
              </div>
            ) : (
              upcomingPayments.map((payment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-indigo-600 font-medium text-sm">
                        {payment.employeeName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{payment.employeeName}</p>
                      <p className="text-gray-500 text-xs">{payment.period}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-indigo-600 text-sm">
                      {formatCurrency(payment.amount)}
                    </p>
                    <p className="text-gray-500 text-xs">Échéance: {payment.dueDate}</p>
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
  const [error, setError] = useState('');
  const { token, user } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');
        const [kpisResponse, evolutionResponse, paymentsResponse] = await Promise.all([
          api.get('/dashboard/kpis'),
          api.get('/dashboard/salary-evolution'),
          api.get('/dashboard/upcoming-payments')
        ]);

        setKpis(kpisResponse.data || {});
        setSalaryData(evolutionResponse.data || []);
        setUpcomingPayments(paymentsResponse.data || []);
      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord:', err);
        setError('Erreur lors du chargement des données');
        setKpis({});
        setSalaryData([]);
        setUpcomingPayments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    }).format(value || 0);
  };

  // Render different dashboard views based on user role
  if (!user) {
    return <div>Chargement...</div>;
  }

  if (user.role === 'SUPER_ADMIN') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="mb-8 px-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Super Admin</h1>
          </div>
          <p className="text-gray-600 mt-1">Vue d'ensemble globale du système de gestion salariale</p>
        </div>
        <DashboardContent
          kpis={kpis}
          salaryData={salaryData}
          upcomingPayments={upcomingPayments}
          loading={loading}
          formatCurrency={formatCurrency}
          error={error}
          isSuperAdmin={true}
        />
      </div>
    );
  }

  if (user.role === 'ADMIN' || user.role === 'UTILISATEUR') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="mb-8 px-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Admin</h1>
          </div>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre gestion salariale</p>
        </div>
        <DashboardContent
          kpis={kpis}
          salaryData={salaryData}
          upcomingPayments={upcomingPayments}
          loading={loading}
          formatCurrency={formatCurrency}
          error={error}
        />
      </div>
    );
  }

  if (user.role === 'CAISSIER') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-slate-50 to-indigo-50 p-4">
        <div className="mb-8 px-4">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-indigo-600 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Caissier</h1>
          </div>
          <p className="text-gray-600 mt-1">Vue d'ensemble de votre gestion salariale</p>
        </div>
        <DashboardContent
          kpis={kpis}
          salaryData={salaryData}
          upcomingPayments={upcomingPayments}
          loading={loading}
          formatCurrency={formatCurrency}
          error={error}
        />
      </div>
    );
  }

  return <div>Rôle non reconnu</div>;
};

export default Dashboard;
