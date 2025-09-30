"use client";

import { useState } from 'react';
import { Navigation, Settings, MapPin, List, ArrowUp, Car, Phone, Check, CreditCard, X, Camera } from 'lucide-react';
import DriverNav from '@/components/DriverNav';
import DriveSimulationPopup from '@/components/DriveSimulationPopup';

const OnlineMapPage = () => {
  const [showSimulation, setShowSimulation] = useState(false);
  const [isRideAccepted, setIsRideAccepted] = useState(false);
  const [currentStep, setCurrentStep] = useState('directions'); // 'directions', 'pickup', 'service', 'serviceDetails', 'delivery', 'deliveryDetails', or 'jobComplete'
  const [serviceChecks, setServiceChecks] = useState({
    syntheticOil: false,
    payment: false,
    receipt: false
  });
  const [vehicleChecks, setVehicleChecks] = useState({
    vin: false,
    mileage: false
  });
  const [deliveryChecks, setDeliveryChecks] = useState({
    vin: false,
    mileage: false,
    deliveredKeys: false
  });
  const [showPaymentCard, setShowPaymentCard] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(''); // For showing payment status
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [cameraType, setCameraType] = useState(''); // 'vin', 'mileage', or 'receipt'
  const [vinInput, setVinInput] = useState('');
  const [mileageInput, setMileageInput] = useState('');
  const [showCapturedPhoto, setShowCapturedPhoto] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState('');
  const [showInputModal, setShowInputModal] = useState(false);

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
                  <MapPin className="w-8 h-8 text-black" />
                </div>
              </div>
            </>
          )}

          {/* Directions card overlay (shown when ride is accepted but not on job complete) */}
          {isRideAccepted && currentStep !== 'jobComplete' && (
            <div
              className={`absolute top-4 left-4 right-4 p-4 rounded-lg shadow-lg z-20 transition-colors ${
                currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails'
                  ? 'bg-white text-black'
                  : 'bg-black text-white cursor-pointer hover:bg-gray-900'
              }`}
              onClick={() => {
                // Only allow card click navigation for steps without Start buttons
                if (currentStep === 'directions') setCurrentStep('pickup');
                else if (currentStep === 'service') setCurrentStep('serviceDetails');
                else if (currentStep === 'delivery') setCurrentStep('deliveryDetails');
                // Don't navigate on click for pickup, serviceDetails, or deliveryDetails - use Start button instead
              }}
            >
              <div className="flex items-start space-x-4">
                {/* First section: Icon with distance */}
                <div className="flex flex-col items-center">
                  {currentStep === 'directions' ? (
                    <ArrowUp className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  ) : currentStep === 'pickup' ? (
                    <MapPin className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  ) : currentStep === 'service' ? (
                    <ArrowUp className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  ) : currentStep === 'serviceDetails' ? (
                    <MapPin className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  ) : currentStep === 'delivery' ? (
                    <ArrowUp className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  ) : (
                    <MapPin className={`w-6 h-6 mb-1 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                  )}
                  <span className={`text-xs ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {currentStep === 'service' ? '0.6 mi' : currentStep === 'delivery' ? '1.8 mi' : '0.5 mi'}
                  </span>
                </div>

                {/* Direction/Pickup/Service details */}
                <div className="flex-1">
                  <div className="text-lg font-semibold mb-1">
                    {currentStep === 'directions' ? 'Head West' :
                     currentStep === 'pickup' ? 'Pickup vehicle' :
                     currentStep === 'service' ? 'Take Mendoza Dr' :
                     currentStep === 'serviceDetails' ? 'Oilstop Drive Thru Oil Change' :
                     currentStep === 'delivery' ? 'Head north' :
                     'Deliver vehicle'}
                  </div>
                  <div className={`text-sm mb-3 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-gray-600' : 'text-gray-300'}`}>
                    {currentStep === 'directions' ? 'Toward SW Birch St' :
                     currentStep === 'pickup' ? (
                      <>
                        <div>2729 De Soto Ave</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className={`w-3 h-3 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-gray-600' : 'text-gray-300'}`} />
                          <span>Audra Gussin</span>
                        </div>
                      </>
                    ) : currentStep === 'service' ? 'To Baker St' :
                     currentStep === 'serviceDetails' ? '3045 Bristol St, Costa Mesa' :
                     currentStep === 'delivery' ? 'Toward Paularino Ave' :
                     (
                      <>
                        <div>2729 De Soto Ave</div>
                        <div className="flex items-center space-x-1 mt-1">
                          <Phone className={`w-3 h-3 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-gray-600' : 'text-gray-300'}`} />
                          <span>Audra Gussin</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Second section: Info with icon */}
                  <div className="flex items-start space-x-2">
                    {currentStep === 'directions' ? (
                      <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    ) : currentStep === 'pickup' ? (
                      <Car className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    ) : currentStep === 'service' ? (
                      <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    ) : currentStep === 'serviceDetails' ? (
                      <Settings className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    ) : currentStep === 'delivery' ? (
                      <MapPin className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    ) : (
                      <Car className={`w-4 h-4 mt-0.5 flex-shrink-0 ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-black' : 'text-white'}`} />
                    )}
                    <div className="flex-1">
                      <div className="text-sm font-medium">
                        {currentStep === 'directions' ? 'Pickup on' :
                         currentStep === 'pickup' ? 'Vehicle details' :
                         currentStep === 'service' ? 'Oilstop Drive Thru Oil Change' :
                         currentStep === 'serviceDetails' ? 'Service details' :
                         currentStep === 'delivery' ? 'Deliver to' :
                         'Vehicle details'}
                      </div>
                      <div className={`text-sm ${currentStep === 'pickup' || currentStep === 'serviceDetails' || currentStep === 'deliveryDetails' ? 'text-gray-600' : 'text-gray-300'}`}>
                        {currentStep === 'directions' ? '2729 De Soto Ave' :
                         currentStep === 'pickup' ? '2025 Cadillac Escalade (Black)' :
                         currentStep === 'service' ? '3045 Bristol St, Costa Mesa' :
                         currentStep === 'serviceDetails' ? 'Auzo Quick Lube' :
                         currentStep === 'delivery' ? '2729 De Soto Ave, Costa Mesa' :
                         '2025 Cadillac Escalade (Black)'}
                      </div>

                      {/* Vehicle checklist - only show in pickup state */}
                      {currentStep === 'pickup' && (
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 grid grid-cols-3 gap-2 pb-1 border-b border-gray-300">
                            <div>Task</div>
                            <div>Status</div>
                            <div className="text-right">Action</div>
                          </div>
                          <div className="space-y-1 pt-2">
                            {/* VIN row */}
                            <div className="grid grid-cols-3 gap-2 items-center text-sm py-1">
                              <div className="text-gray-600">VIN</div>
                              <div className="text-xs">
                                {vehicleChecks.vin ? 'Complete' : 'Pending'}
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraType('vin');
                                    setShowInputModal(true);
                                  }}
                                  className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Photo
                                </button>
                              </div>
                            </div>

                            {/* Mileage row */}
                            <div className="grid grid-cols-3 gap-2 items-center text-sm py-1">
                              <div className="text-gray-600">Mileage</div>
                              <div className="text-xs">
                                {vehicleChecks.mileage ? 'Complete' : 'Pending'}
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraType('mileage');
                                    setShowInputModal(true);
                                  }}
                                  className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Photo
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Delivery checklist - only show in deliveryDetails state */}
                      {currentStep === 'deliveryDetails' && (
                        <>
                        <div className="mt-3">
                          <div className="text-xs text-gray-500 grid grid-cols-3 gap-2 pb-1 border-b border-gray-300">
                            <div>Task</div>
                            <div>Status</div>
                            <div className="text-right">Action</div>
                          </div>
                          <div className="space-y-1 pt-2">
                            {/* Vehicle Image row */}
                            <div className="grid grid-cols-3 gap-2 items-center text-sm py-1">
                              <div className="text-gray-600">Vehicle Image</div>
                              <div className="text-xs">
                                {deliveryChecks.vin ? 'Complete' : 'Pending'}
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraType('deliveryVin');
                                    setShowCamera(true);
                                  }}
                                  className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Photo
                                </button>
                              </div>
                            </div>

                            {/* Mileage row */}
                            <div className="grid grid-cols-3 gap-2 items-center text-sm py-1">
                              <div className="text-gray-600">Mileage</div>
                              <div className="text-xs">
                                {deliveryChecks.mileage ? 'Complete' : 'Pending'}
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraType('deliveryMileage');
                                    setShowInputModal(true);
                                  }}
                                  className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Photo
                                </button>
                              </div>
                            </div>

                            {/* Delivered Keys row */}
                            <div className="grid grid-cols-3 gap-2 items-center text-sm py-1">
                              <div className="text-gray-600">Delivered Keys</div>
                              <div className="text-xs">
                                {deliveryChecks.deliveredKeys ? 'Complete' : 'Pending'}
                              </div>
                              <div className="text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDeliveryChecks(prev => ({...prev, deliveredKeys: !prev.deliveredKeys}));
                                  }}
                                  className="bg-black text-white px-3 py-1 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  {deliveryChecks.deliveredKeys ? 'Undo' : 'Done'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Complete job button - only show when all delivery tasks are complete */}
                        <div className="mt-5">
                            <button
                              disabled={!deliveryChecks.vin || !deliveryChecks.mileage || !deliveryChecks.deliveredKeys}
                              onClick={() => setCurrentStep('jobComplete')}
                              className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                deliveryChecks.vin && deliveryChecks.mileage && deliveryChecks.deliveredKeys
                                  ? 'bg-white text-black hover:bg-gray-100'
                                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              Complete Job
                            </button>
                          </div>
                        </>
                      )}

                      {/* Service checklist - only show in serviceDetails */}
                      {currentStep === 'serviceDetails' && (
                        <div className="mt-3 space-y-3">
                            {/* Synthetic oil row */}
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-3 flex-1">
                                <input
                                  type="checkbox"
                                  checked={serviceChecks.syntheticOil}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    setServiceChecks(prev => ({...prev, syntheticOil: !prev.syntheticOil}));
                                  }}
                                  className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                />
                                <div className="flex flex-col">
                                  <span className="text-sm text-gray-900">Synthetic oil</span>
                                  <span className="text-xs text-gray-500">Max $99</span>
                                </div>
                              </div>
                              <span className={`text-xs font-medium ${serviceChecks.syntheticOil ? 'text-green-600' : 'text-gray-400'}`}>
                                {serviceChecks.syntheticOil ? 'Complete' : 'Pending'}
                              </span>
                            </div>

                            {/* Payment row */}
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="text-sm text-gray-900">Payment</div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`text-xs font-medium ${serviceChecks.payment ? 'text-green-600' : 'text-gray-400'}`}>
                                  {serviceChecks.payment ? 'Complete' : 'Pending'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowPaymentCard(true);
                                  }}
                                  className="bg-black text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Pay
                                </button>
                              </div>
                            </div>

                            {/* Receipt row */}
                            <div className="flex items-center justify-between py-2 border-b border-gray-200">
                              <div className="flex items-center space-x-3 flex-1">
                                <div className="text-sm text-gray-900">Receipt</div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <span className={`text-xs font-medium ${serviceChecks.receipt ? 'text-green-600' : 'text-gray-400'}`}>
                                  {serviceChecks.receipt ? 'Complete' : 'Pending'}
                                </span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCameraType('receipt');
                                    setShowCamera(true);
                                  }}
                                  className="bg-black text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                                  Photo
                                </button>
                              </div>
                            </div>
                        </div>
                      )}

                    </div>
                  </div>

                  {/* Next section - show in pickup and serviceDetails states */}
                  {currentStep === 'pickup' && (
                    <div className="flex items-start space-x-2 mt-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500">Next</div>
                        <div className="text-sm text-gray-700 mb-5">Oilstop Drive Thru Oil Change</div>
                        <button
                          disabled={!vehicleChecks.vin || !vehicleChecks.mileage}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (vehicleChecks.vin && vehicleChecks.mileage) {
                              setCurrentStep('service');
                            }
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            vehicleChecks.vin && vehicleChecks.mileage
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}>
                          Start
                        </button>
                      </div>
                    </div>
                  )}

                  {currentStep === 'serviceDetails' && (
                    <div className="flex items-start space-x-2 mt-3">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-500">Next</div>
                        <div className="text-sm text-gray-700 mb-2">Deliver Vehicle</div>
                        <div className="text-sm text-gray-700 mb-5">2729 De Soto Ave, Costa Mesa</div>
                        <button
                          disabled={!serviceChecks.syntheticOil || !serviceChecks.payment || !serviceChecks.receipt}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (serviceChecks.syntheticOil && serviceChecks.payment && serviceChecks.receipt) {
                              setCurrentStep('delivery');
                            }
                          }}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            serviceChecks.syntheticOil && serviceChecks.payment && serviceChecks.receipt
                              ? 'bg-black text-white hover:bg-gray-800'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                        >
                          Start
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Job Completion Card */}
          {isRideAccepted && currentStep === 'jobComplete' && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-full max-w-sm px-4">
              <div className="bg-white rounded-lg shadow-lg p-6">
                {/* Header with close button */}
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-black">Job Complete!</h2>
                  <button
                    onClick={() => {
                      setIsRideAccepted(false);
                      setCurrentStep('directions');
                      setServiceChecks({ syntheticOil: false, payment: false, receipt: false });
                      setVehicleChecks({ vin: false, mileage: false });
                      setDeliveryChecks({ vin: false, mileage: false, deliveredKeys: false });
                      setCapturedPhotos([]);
                      setPaymentStatus('');
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Earnings */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-green-600 mb-2">$25.33</div>
                  <div className="text-sm text-gray-600">Amount earned</div>
                </div>

                {/* Trip Summary */}
                <div className="space-y-4 mb-6">
                  <h3 className="text-lg font-semibold text-black">Trip Summary</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service</span>
                      <span className="text-black font-medium">Oil Change</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Vehicle</span>
                      <span className="text-black font-medium">2025 Cadillac Escalade</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Time</span>
                      <span className="text-black font-medium">46 mins</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Distance</span>
                      <span className="text-black font-medium">4.2 miles</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer</span>
                      <span className="text-black font-medium">Audra Gussin</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-semibold">Total Earned</span>
                      <span className="text-black font-bold text-lg">$25.33</span>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    setIsRideAccepted(false);
                    setCurrentStep('directions');
                    setServiceChecks({ syntheticOil: false, payment: false, receipt: false });
                    setVehicleChecks({ vin: false, mileage: false });
                    setDeliveryChecks({ vin: false, mileage: false, deliveredKeys: false });
                    setCapturedPhotos([]);
                    setPaymentStatus('');
                  }}
                  className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Simulate drive/reset link */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            {isRideAccepted ? (
              <button
                onClick={() => {
                  setIsRideAccepted(false);
                  setCurrentStep('directions');
                }}
                className="text-blue-600 underline text-sm"
              >
                reset
              </button>
            ) : (
              <button
                onClick={() => setShowSimulation(true)}
                className="text-blue-600 underline text-sm"
              >
                simulate drive
              </button>
            )}
          </div>
        </div>

        {/* Payment Status Notification */}
        {paymentStatus && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-30">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span className="text-sm font-medium">{paymentStatus}</span>
            </div>
          </div>
        )}
      </main>

      {/* Bottom navigation - show overlay when ride accepted, otherwise show driver nav */}
      {isRideAccepted && currentStep !== 'jobComplete' ? (
        <div className="sticky bottom-0 z-10 bg-white border-t border-gray-200 px-4" style={{ height: '95px' }}>
          <div className="relative flex items-center h-full">
            <button className="absolute left-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-sm font-semibold text-black">
                {currentStep === 'directions' ? '14 min (4.2 mi)' :
                 currentStep === 'pickup' ? 'Vehicle Verification' :
                 currentStep === 'service' ? '6 min (1.8 mi)' :
                 currentStep === 'serviceDetails' ? 'Service In Progress' :
                 '6 min (1.8 mi)'}
              </div>
              <div className="text-sm font-medium text-black">
                {currentStep === 'directions' ? 'En route to pickup' :
                 currentStep === 'pickup' ? 'Document VIN & Mileage' :
                 currentStep === 'service' ? 'En route to service' :
                 currentStep === 'serviceDetails' ? 'Oil Change - Auzo Quick Lube' :
                 'Returning to customer'}
              </div>
            </div>
            <button className="absolute right-0 p-2 rounded-full bg-gray-100 hover:bg-gray-200">
              <List className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      ) : !isRideAccepted ? (
        <DriverNav />
      ) : null}

      {showSimulation && (
        <DriveSimulationPopup
          onClose={() => setShowSimulation(false)}
          onAccept={() => setIsRideAccepted(true)}
        />
      )}

      {/* Virtual Stripe Payment Card */}
      {showPaymentCard && (
        <div className="fixed bg-white z-50 flex flex-col rounded-3xl overflow-hidden" style={{ width: '375px', height: '812px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          <div className="flex-1 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-6 h-6 text-black" />
                <h2 className="text-lg font-semibold text-black">Payment</h2>
              </div>
              <button
                onClick={() => setShowPaymentCard(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Virtual Card */}
            <div className="bg-black rounded-lg p-4 mb-6 text-white">
              <div className="flex justify-between items-start mb-8">
                <div className="text-sm text-gray-300">Virtual Card</div>
                <div className="text-right">
                  <div className="text-xs text-gray-300">stripe</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-lg font-mono tracking-wider text-white">
                  •••• •••• •••• 4242
                </div>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="text-xs text-gray-300">CARDHOLDER</div>
                  <div className="text-sm font-medium text-white">AUZO DRIVER</div>
                </div>
                <div>
                  <div className="text-xs text-gray-300">EXPIRES</div>
                  <div className="text-sm font-medium text-white">12/28</div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Service</span>
                <span className="font-medium text-black">Oil Change</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-medium text-black">$89.99</span>
              </div>
              <div className="border-t border-gray-200 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-black">Total</span>
                  <span className="font-semibold text-lg text-black">$89.99</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <button
              onClick={() => {
                setServiceChecks(prev => ({...prev, payment: true}));
                setPaymentStatus('Payment Complete');
                setShowPaymentCard(false);
                // Clear status after 3 seconds
                setTimeout(() => setPaymentStatus(''), 3000);
              }}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Pay $89.99
            </button>

            <div className="text-xs text-gray-500 text-center mt-3">
              Secured by Stripe • Virtual card payment
            </div>
          </div>
        </div>
      )}

      {/* Input Modal for VIN/Mileage Entry */}
      {showInputModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full p-6" style={{ maxWidth: '356px' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Camera className="w-6 h-6 text-black" />
                <h2 className="text-lg font-semibold text-black">
                  {cameraType === 'vin' || cameraType === 'deliveryVin' ? 'Capture VIN' : 'Capture Mileage'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowInputModal(false);
                  setVinInput('');
                  setMileageInput('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              {cameraType === 'vin' || cameraType === 'deliveryVin'
                ? 'Enter the VIN below and take a photo'
                : 'Enter the mileage below and take a photo'}
            </p>

            {/* Step 1: Input Field */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-900 mb-2">
                Step 1: Enter the {cameraType === 'vin' || cameraType === 'deliveryVin' ? 'VIN' : 'mileage'}
              </div>
              <input
                type="text"
                value={cameraType === 'vin' || cameraType === 'deliveryVin' ? vinInput : mileageInput}
                onChange={(e) => {
                  if (cameraType === 'vin' || cameraType === 'deliveryVin') {
                    setVinInput(e.target.value);
                  } else {
                    setMileageInput(e.target.value);
                  }
                }}
                placeholder={cameraType === 'vin' || cameraType === 'deliveryVin' ? 'Enter VIN' : 'Enter mileage'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-lg"
                autoFocus
              />
            </div>

            {/* Step 2: Instructions */}
            <div className="mb-6">
              <div className="text-sm font-medium text-gray-900 mb-2">Step 2: Take a photo</div>
              <div className="p-3 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-700">
                  {cameraType === 'vin' && 'Locate the VIN plate on the driver\'s side door jamb. Ensure all 17 characters are clearly visible and in focus.'}
                  {cameraType === 'deliveryVin' && 'Take a photo of the vehicle exterior showing its current condition. This documents the vehicle state at delivery.'}
                  {(cameraType === 'mileage' || cameraType === 'deliveryMileage') && 'Photograph the odometer reading on the dashboard. Make sure all numbers are clear, in focus, and fully visible.'}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => {
                const inputValue = (cameraType === 'vin' || cameraType === 'deliveryVin') ? vinInput : mileageInput;
                if (inputValue) {
                  setShowInputModal(false);
                  setShowCamera(true);
                }
              }}
              disabled={!(cameraType === 'vin' || cameraType === 'deliveryVin' ? vinInput : mileageInput)}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                (cameraType === 'vin' || cameraType === 'deliveryVin' ? vinInput : mileageInput)
                  ? 'bg-black text-white hover:bg-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Open Camera
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Camera Interface */}
      {showCamera && !showCapturedPhoto && (
        <div className="fixed bg-black z-50 flex flex-col" style={{ width: '375px', height: '812px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Camera View */}
          <div className="flex-1 relative bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900">
            {/* Simulated camera feed with grid overlay */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="cameraGrid" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cameraGrid)" />
              </svg>
            </div>

            {/* Context overlay at top */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    setShowCamera(false);
                    setVinInput('');
                    setMileageInput('');
                  }}
                  className="text-white hover:text-gray-300"
                >
                  <X className="w-8 h-8" />
                </button>
                <div className="text-white text-center">
                  <div className="text-lg font-semibold">
                    {cameraType === 'vin' || cameraType === 'deliveryVin' ? 'Capture VIN' :
                     cameraType === 'mileage' || cameraType === 'deliveryMileage' ? 'Capture Mileage' :
                     'Capture Receipt'}
                  </div>
                  {(cameraType === 'mileage' || cameraType === 'deliveryMileage') && mileageInput && (
                    <div className="text-3xl font-bold mt-2">{mileageInput} mi</div>
                  )}
                  {(cameraType === 'vin' || cameraType === 'deliveryVin') && vinInput && (
                    <div className="text-sm font-mono mt-2 tracking-wider">{vinInput}</div>
                  )}
                </div>
                <div className="w-8" /> {/* Spacer for centering */}
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center text-white text-sm bg-black/50 rounded-lg p-3 mx-4">
                {cameraType === 'vin' && 'Position VIN plate in frame'}
                {cameraType === 'deliveryVin' && 'Capture vehicle exterior condition'}
                {(cameraType === 'mileage' || cameraType === 'deliveryMileage') && 'Frame the odometer clearly'}
                {cameraType === 'receipt' && 'Ensure receipt is clearly visible'}
              </div>
            </div>

            {/* Center focus indicator */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-64 h-48 border-2 border-white/50 rounded-lg relative">
                {/* Corner brackets */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
              </div>
            </div>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
              <div className="flex items-center justify-center space-x-12">
                {/* Photos captured indicator */}
                <div className="text-white text-center">
                  <div className="w-12 h-12 rounded-lg border-2 border-white/50 flex items-center justify-center">
                    <span className="text-sm font-semibold">{capturedPhotos.length}</span>
                  </div>
                  <div className="text-xs mt-1 opacity-75">Photos</div>
                </div>

                {/* Shutter button */}
                <button
                  onClick={() => {
                    const newPhoto = `${cameraType}_${Date.now()}.jpg`;
                    setCurrentPhoto(newPhoto);
                    setShowCapturedPhoto(true);
                  }}
                  className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 hover:bg-gray-100 transition-all transform active:scale-95"
                >
                  <div className="w-full h-full rounded-full border-2 border-black/10"></div>
                </button>

                {/* Spacer for symmetry */}
                <div className="w-12 h-12"></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post-Capture Photo Preview */}
      {showCapturedPhoto && (
        <div className="fixed bg-black z-50 flex flex-col" style={{ width: '375px', height: '812px', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
          {/* Photo preview */}
          <div className="flex-1 relative bg-gray-900 flex items-center justify-center">
            {/* Simulated captured photo */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800">
              <div className="text-center text-white">
                <Camera className="w-24 h-24 mx-auto mb-4 opacity-50" />
                <div className="text-xl font-semibold">Photo Captured</div>
                <div className="text-sm opacity-75 mt-2">
                  {cameraType === 'vin' || cameraType === 'deliveryVin' ? 'VIN Photo' :
                   cameraType === 'mileage' || cameraType === 'deliveryMileage' ? `${mileageInput} miles` :
                   'Receipt Photo'}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom action buttons */}
          <div className="bg-black p-6 space-y-3">
            <button
              onClick={() => {
                setCapturedPhotos(prev => [...prev, currentPhoto]);

                // Auto-check the corresponding checkbox
                if (cameraType === 'vin') {
                  setVehicleChecks(prev => ({...prev, vin: true}));
                } else if (cameraType === 'mileage') {
                  setVehicleChecks(prev => ({...prev, mileage: true}));
                } else if (cameraType === 'receipt') {
                  setServiceChecks(prev => ({...prev, receipt: true}));
                } else if (cameraType === 'deliveryVin') {
                  setDeliveryChecks(prev => ({...prev, vin: true}));
                } else if (cameraType === 'deliveryMileage') {
                  setDeliveryChecks(prev => ({...prev, mileage: true}));
                }

                setShowCapturedPhoto(false);
                setShowCamera(false);
                setCurrentPhoto('');
                setVinInput('');
                setMileageInput('');
              }}
              className="w-full bg-white text-black py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Use Photo
            </button>
            <button
              onClick={() => {
                setShowCapturedPhoto(false);
                setCurrentPhoto('');
              }}
              className="w-full bg-transparent border-2 border-white text-white py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Retake
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnlineMapPage;