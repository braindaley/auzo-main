"use client";

import { useState } from 'react';
import { Navigation, Settings, MapPin, List } from 'lucide-react';
import DriverNav from '@/components/DriverNav';
import DriveSimulationPopup from '@/components/DriveSimulationPopup';

const OnlineMapPage = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  const [isRideAccepted, setIsRideAccepted] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 relative pb-24">
        {/* Map placeholder wireframe */}
        <div className="absolute inset-0 bg-gray-300">
          {/* Street grid pattern */}
          <svg className="absolute inset-0 w-full h-full opacity-40">
            <defs>
              <pattern id="mapStreets" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                <rect width="80" height="80" fill="transparent"/>
                <path d="M 0 40 L 80 40 M 40 0 L 40 80" stroke="#9CA3AF" strokeWidth="2"/>
                <path d="M 0 20 L 80 20 M 0 60 L 80 60 M 20 0 L 20 80 M 60 0 L 60 80" stroke="#D1D5DB" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#mapStreets)"/>
          </svg>


          {/* User location arrow in center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="rounded-full p-3 flex items-center justify-center">
              <Navigation className="w-8 h-8 text-black transform -rotate-45" />
            </div>
          </div>

          {/* Destination marker and route line (shown when ride is accepted) */}
          {isRideAccepted && (
            <>
              {/* Black line between locations */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <line
                  x1="50%"
                  y1="50%"
                  x2="75%"
                  y2="25%"
                  stroke="black"
                  strokeWidth="3"
                />
              </svg>

              {/* Destination marker */}
              <div className="absolute" style={{ top: '25%', left: '75%' }}>
                <div className="transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-red-500 rounded-full p-2 border-2 border-white shadow-lg">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Simulate drive link */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <button
              onClick={() => setShowSimulation(true)}
              className="text-blue-600 underline text-sm"
            >
              simulate drive
            </button>
          </div>
        </div>
      </main>

      {/* Bottom navigation - show overlay when ride accepted, otherwise show driver nav */}
      {isRideAccepted ? (
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-4" style={{ height: '95px' }}>
          <div className="relative flex items-center h-full">
            <button className="absolute left-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-sm font-semibold text-black">14 min (4.2 mi)</div>
              <div className="text-sm font-medium text-black">Pickup vehicle</div>
            </div>
            <button className="absolute right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      ) : (
        <DriverNav />
      )}

      {showSimulation && (
        <DriveSimulationPopup
          onClose={() => setShowSimulation(false)}
          onAccept={() => setIsRideAccepted(true)}
        />
      )}
    </div>
  );
};

export default OnlineMapPage;