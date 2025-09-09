
import { Navigation } from 'lucide-react';

const ServiceMap = () => {
  return (
    <div className="absolute inset-0">
      {/* Map-style background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-100 via-blue-50 to-gray-100">
        {/* Street-like pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-30">
          <defs>
            <pattern id="streets" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <rect width="120" height="120" fill="transparent"/>
              <path d="M 0 60 L 120 60 M 60 0 L 60 120" stroke="#9CA3AF" strokeWidth="2"/>
              <path d="M 0 30 L 120 30 M 0 90 L 120 90 M 30 0 L 30 120 M 90 0 L 90 120" stroke="#D1D5DB" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#streets)"/>
        </svg>
        
        {/* Parks/green areas */}
        <div className="absolute top-1/4 left-1/6 w-24 h-16 bg-green-200 rounded-lg opacity-60"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-12 bg-green-200 rounded-lg opacity-60"></div>
        
        {/* Water body */}
        <div className="absolute bottom-1/4 left-1/4 w-32 h-8 bg-blue-200 rounded-full opacity-70"></div>
        
        
        {/* Navigation compass */}
        <div className="absolute top-4 right-4 bg-white/90 rounded-full p-3 shadow-lg">
          <Navigation className="w-6 h-6 text-gray-700" />
        </div>
      </div>
      
      <div className="absolute inset-0 bg-background/20" />
    </div>
  );
};

export default ServiceMap;
