import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

const QRCodeDisplay = ({ employeId, employeName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true);
        setError('');

        // Générer les données QR
        const qrData = JSON.stringify({
          type: "pointage",
          employeId: employeId,
          timestamp: Date.now()
        });

        // Générer le QR code
        const url = await QRCode.toDataURL(qrData, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });

        setQrCodeUrl(url);
      } catch (err) {
        setError('Erreur lors de la génération du QR code');
        console.error('QR Code generation error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (employeId) {
      generateQRCode();
    }
  }, [employeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Génération du QR code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-center">
          <p className="font-medium">Erreur</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center mb-4">
          QR Code de pointage
        </h3>
        <p className="text-sm text-gray-600 text-center mb-4">
          {employeName}
        </p>
        {qrCodeUrl && (
          <div className="flex justify-center">
            <img
              src={qrCodeUrl}
              alt={`QR Code pour ${employeName}`}
              className="border border-gray-300 rounded"
            />
          </div>
        )}
        <p className="text-xs text-gray-500 text-center mt-4">
          Scannez ce QR code pour pointer votre arrivée/départ
        </p>
      </div>
    </div>
  );
};

export default QRCodeDisplay;
