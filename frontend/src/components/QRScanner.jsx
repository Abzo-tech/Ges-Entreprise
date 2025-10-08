import React, { useState, useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onScanError, onClose }) => {
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(true);
  const scannerInstanceRef = useRef(null);
  const hasInitialized = useRef(false);

  const onScanSuccessWrapper = (decodedText, decodedResult) => {
    if (!scanning) return;

    console.log("📷 [QR SCANNER] QR code détecté:", decodedText);
    setScanning(false);

    try {
      // Le QR code peut être soit un JSON, soit juste un ID
      let qrData;

      try {
        // Essayer de parser comme JSON
        qrData = JSON.parse(decodedText);
        console.log("✅ [QR SCANNER] QR parsé comme JSON:", qrData);
      } catch {
        // Si ce n'est pas du JSON, c'est probablement juste un ID
        console.log(
          "⚠️ [QR SCANNER] Pas du JSON, tentative de parsing comme ID"
        );
        const employeId = parseInt(decodedText);

        if (employeId && !isNaN(employeId)) {
          qrData = {
            type: "pointage",
            employeId: employeId,
            timestamp: Date.now(),
          };
          console.log(
            "✅ [QR SCANNER] QR converti en format standard:",
            qrData
          );
        } else {
          console.error(
            "❌ [QR SCANNER] Impossible de parser comme ID:",
            decodedText
          );
          setError("QR code invalide pour le pointage");
          setTimeout(() => setScanning(true), 2000);
          return;
        }
      }

      // Vérifier que le QR code est valide
      if (
        qrData &&
        qrData.employeId &&
        (qrData.type === "pointage" || !qrData.type)
      ) {
        const qrDataString = JSON.stringify(qrData);
        console.log(
          "🚀 [QR SCANNER] Envoi des données au parent:",
          qrDataString
        );

        // Envoyer le QR data au format JSON string
        onScanSuccess(qrDataString);
      } else {
        console.error("❌ [QR SCANNER] QR code invalide:", qrData);
        setError("QR code invalide pour le pointage");
        setTimeout(() => setScanning(true), 2000);
      }
    } catch (err) {
      console.error("❌ [QR SCANNER] Erreur lors du traitement:", err);
      setError("Format QR code invalide");
      setTimeout(() => setScanning(true), 2000);
    }
  };

  const onScanErrorWrapper = (errorMessage) => {
    // Ignore NotFoundException as it's expected when no QR code is present
    if (errorMessage.includes("NotFoundException")) {
      return;
    }

    console.error("QR Scanner error:", errorMessage);
    setError("Erreur du scanner QR");
    if (onScanError) {
      onScanError(new Error(errorMessage));
    }
  };

  useEffect(() => {
    console.log(
      "📷 [QR SCANNER] useEffect appelé, hasInitialized:",
      hasInitialized.current
    );

    // Empêcher la double initialisation
    if (hasInitialized.current) {
      console.log("⚠️ [QR SCANNER] Scanner déjà initialisé, skip");
      return;
    }

    hasInitialized.current = true;
    console.log("🔵 [QR SCANNER] Initialisation du scanner...");

    const initScanner = async () => {
      try {
        // Nettoyer tout scanner existant
        const existingElement = document.getElementById("qr-reader");
        if (existingElement) {
          existingElement.innerHTML = "";
        }

        scannerInstanceRef.current = new Html5QrcodeScanner(
          "qr-reader",
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            showTorchButtonIfSupported: true,
            showZoomSliderIfSupported: true,
          },
          false
        );

        console.log("✅ [QR SCANNER] Scanner créé, lancement du render...");
        scannerInstanceRef.current.render(
          onScanSuccessWrapper,
          onScanErrorWrapper
        );
        console.log("✅ [QR SCANNER] Scanner rendu avec succès");
      } catch (error) {
        console.error("❌ [QR SCANNER] Erreur initialisation:", error);
      }
    };

    initScanner();

    return () => {
      console.log("🧹 [QR SCANNER] Cleanup du scanner...");
      if (scannerInstanceRef.current) {
        scannerInstanceRef.current.clear().catch(console.error);
        scannerInstanceRef.current = null;
      }
      hasInitialized.current = false;
    };
  }, []);

  const resetScanner = () => {
    setError("");
    setScanning(true);
  };

  const handleClose = () => {
    if (scannerInstanceRef.current) {
      scannerInstanceRef.current.clear().catch(console.error);
      scannerInstanceRef.current = null;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Scanner QR Code</h3>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          {scanning ? (
            <div id="qr-reader" className="w-full"></div>
          ) : (
            <div className="text-center py-8">
              <div className="text-green-600 text-4xl mb-2">✓</div>
              <p className="text-green-600 font-medium">
                QR Code scanné avec succès!
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="flex justify-between">
          <button
            onClick={resetScanner}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={scanning}
          >
            Réessayer
          </button>
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Fermer
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Placez le QR code dans le cadre pour scanner
        </p>
      </div>
    </div>
  );
};

export default QRScanner;
