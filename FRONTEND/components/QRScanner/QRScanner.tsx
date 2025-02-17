import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, X } from "lucide-react";
import { Html5QrcodeScanner, Html5QrcodeScanType } from "html5-qrcode";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const QRScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    if (scanning) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } }) // Use back camera
        .then(() => setHasPermission(true))
        .catch(() => {
          alert("Camera access denied! Please allow camera permissions.");
          setScanning(false);
        });
    }
  }, [scanning]);

  useEffect(() => {
    if (scanning && hasPermission) {
      const qrScanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 15,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA], // Corrected here
          rememberLastUsedCamera: true,
        },
        false
      );

      qrScanner.render(
        (decodedText) => {
          console.log("Scanned QR Code:", decodedText);

          // Redirect to /user-details page after successful scan
          navigate("/user-details");

          stopScanner();
        },
        (errorMessage) => {
          console.log("QR Scan Error:", errorMessage);
        }
      );

      setScanner(qrScanner);
    }
  }, [scanning, hasPermission, navigate]); // Added navigate as dependency

  const startScanner = () => {
    setScanning(true);
  };

  const stopScanner = () => {
    if (scanner) {
      scanner.clear();
    }
    setScanning(false);
    setHasPermission(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(80vh-550px)] p-3 pt-0">
      {/* QR Scanner Box */}
      <div className="w-full h-100 max-w-sm bg-gray-200 rounded-lg shadow-lg p-6 text-center flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">Start Shopping</h2>
        <p className="text-lg text-gray-600 mt-2">
          Start your session and enjoy shopping
        </p>

        {/* QR Code Icon */}
        <button
          onClick={startScanner}
          className="mt-6 p-5 rounded-lg bg-gray-300 hover:bg-gray-400 transition shadow-lg"
        >
          <QrCode size={150} className="text-gray-700" />
        </button>

        <p className="text-md pt-5 text-gray-600 mt-3">
          Click on the icon to scan the QR code
        </p>
      </div>

      {/* Scanner Modal */}
      <AnimatePresence>
        {scanning && hasPermission && (
          <>
            {/* Overlay */}
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Scanner Box */}
            <motion.div
              className="fixed inset-0 flex items-center justify-center z-50"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <div className="w-full max-w-sm bg-gray-200 bg-opacity-90 backdrop-blur-lg p-5 rounded-2xl shadow-2xl text-center border m-4 border-gray-300">
                <h2 className="text-3xl font-bold text-gray-800">
                  Scan a QR Code
                </h2>

                {/* QR Scanner Container */}
                <div
                  id="qr-reader"
                  className="w-full mt-6 rounded-lg overflow-hidden border border-gray-300 shadow-inner"
                />

                {/* Close Button */}
                <button
                  onClick={stopScanner}
                  className="mt-6 p-4 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg"
                >
                  <X size={36} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QRScanner;
