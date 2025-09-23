"use client";

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface DriveSimulationPopupProps {
  onClose: () => void;
  onAccept?: () => void;
}

const DriveSimulationPopup = ({ onClose, onAccept }: DriveSimulationPopupProps) => {
  const [progress, setProgress] = useState(100);
  const [isAccepted, setIsAccepted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          onClose();
          return 0;
        }
        return prev - (100 / 180); // 180 seconds = 3 minutes
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onClose]);

  const handleAccept = () => {
    setIsAccepted(true);
    onAccept?.();
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-start justify-center pt-16 z-50 px-5">
      <div className="bg-white rounded-lg shadow-lg w-full mx-5 p-6 relative" style={{ maxWidth: '340px' }}>
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold text-black">$25.33</h2>
            <p className="text-sm text-gray-600">46 mins</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Trip Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="text-sm text-gray-600">14 min (4.2 Miles)</div>
              <div className="text-sm text-black font-medium">Pickup vehicle</div>
              <div className="text-sm text-black">2729 De Soto Ave, Costa Mesa</div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="text-sm text-gray-600">6 min (1.8 miles)</div>
              <div className="text-sm text-black font-medium">Oilstop Drive Thru Oil Change</div>
              <div className="text-sm text-black">3045 Bristol St, Costa Mesa</div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-transparent mt-2 flex-shrink-0"></div>
            <div>
              <div className="text-sm text-gray-600">20 min (wait with vehicle)</div>
              <div className="text-sm text-black font-medium">Auzo Quick Lube</div>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
            <div>
              <div className="text-sm text-gray-600">6 min (1.8 miles)</div>
              <div className="text-sm text-black font-medium">Deliver vehicle</div>
              <div className="text-sm text-black">2729 De Soto Ave, Costa Mesa</div>
            </div>
          </div>
        </div>

        {/* Accept Button with Progress */}
        <div className="relative">
          <button
            onClick={handleAccept}
            disabled={isAccepted}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${
              isAccepted
                ? 'bg-gray-600 text-white'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isAccepted ? 'Accepted' : 'Accept'}
          </button>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 h-1 bg-gray-400 rounded-b-lg transition-all duration-1000 ease-linear"
               style={{ width: `${progress}%` }}>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriveSimulationPopup;