import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../components/ThemeProvider';
import QRScanner from '../components/QRScanner';
import api from '../services/api';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

const VigileDashboard = () => {
  const { user, selectedEntreprise } = useAuth();
  const { theme } = useTheme();
  const [lastScan, setLastScan] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const handleQRScanSuccess = async (data) => {
    try {
      const { employeId } = data;

      // Check if it's check-in or check-out based on current time
      const now = new Date();
      const currentHour = now.getHours();

      // Assume check-in before 12 PM, check-out after
      const isCheckIn = currentHour < 12;

      const endpoint = isCheckIn ? '/pointages/qr/check-in' : '/pointages/qr/check-out';
      const action = isCheckIn ? 'Arrivée' : 'Départ';

      const response = await api.post(endpoint, {
        employeId: parseInt(employeId),
        entrepriseId: selectedEntreprise?.id
      });

      const scanResult = {
        id: Date.now(),
        employeId,
        employeName: response.data.employeName || `Employé ${employeId}`,
        action,
        timestamp: now.toLocaleString(),
        success: true,
        message: `${action} enregistrée avec succès`
      };

      setLastScan(scanResult);
      setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]); // Keep last 10 scans

    } catch (error) {
      console.error('Erreur lors du scan QR:', error);

      const scanResult = {
        id: Date.now(),
        employeId: data.employeId,
        employeName: `Employé ${data.employeId}`,
        action: 'Erreur',
        timestamp: new Date().toLocaleString(),
        success: false,
        message: error.response?.data?.message || 'Erreur lors de l\'enregistrement'
      };

      setLastScan(scanResult);
      setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
    }
  };

  const handleQRScanError = (error) => {
    console.error('Erreur du scanner QR:', error);
    const scanResult = {
      id: Date.now(),
      employeId: null,
      employeName: 'Erreur',
      action: 'Erreur',
      timestamp: new Date().toLocaleString(),
      success: false,
      message: 'Erreur du scanner QR'
    };

    setLastScan(scanResult);
    setScanHistory(prev => [scanResult, ...prev.slice(0, 9)]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pointage par QR Code</h1>
          <p className="text-gray-600 mt-2">
            Bienvenue {user?.nom}, scannez les QR codes des employés pour enregistrer leurs pointages
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Scanner Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Scanner QR Code
            </h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <QRScanner
                onScanSuccess={handleQRScanSuccess}
                onScanError={handleQRScanError}
                onClose={() => {}} // No close action needed
              />
            </div>
            <div className="mt-4 text-sm text-gray-600">
              <p>• Placez le QR code dans le cadre</p>
              <p>• Assurez-vous d'avoir une bonne luminosité</p>
              <p>• Le système détecte automatiquement arrivée/départ</p>
            </div>
          </div>

          {/* Scan Results Section */}
          <div className="space-y-6">
            {/* Last Scan Result */}
            {lastScan && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Dernier Scan
                </h2>
                <div className={`p-4 rounded-lg ${lastScan.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border`}>
                  <div className="flex items-center">
                    {lastScan.success ? (
                      <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                    ) : (
                      <XCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {lastScan.employeName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {lastScan.action} - {lastScan.timestamp}
                      </p>
                      <p className={`text-sm font-medium ${lastScan.success ? 'text-green-600' : 'text-red-600'}`}>
                        {lastScan.message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scan History */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Historique des Scans
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {scanHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    Aucun scan effectué
                  </p>
                ) : (
                  scanHistory.map((scan) => (
                    <div
                      key={scan.id}
                      className={`p-3 rounded-lg border ${
                        scan.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            {scan.employeName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {scan.action}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">
                            {scan.timestamp}
                          </p>
                          {scan.success ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-600 mx-auto mt-1" />
                          ) : (
                            <XCircleIcon className="h-5 w-5 text-red-600 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VigileDashboard;
