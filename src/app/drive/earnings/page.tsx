"use client";

import DriverNav from '@/components/DriverNav';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Mock job data
const mockJobs = [
  {
    id: 'trip-001',
    date: '01/15/2025',
    address: '123 Main St, Anytown',
    amount: 25.33,
    service: 'Oil Change',
    vehicle: '2025 Cadillac Escalade',
    customer: 'Audra Gussin',
    duration: '46 mins',
    distance: '4.2 miles'
  },
  {
    id: 'trip-002',
    date: '01/15/2025',
    address: '456 Oak Ave, Downtown',
    amount: 31.50,
    service: 'Full Service Wash',
    vehicle: '2024 BMW X5',
    customer: 'Michael Johnson',
    duration: '52 mins',
    distance: '6.8 miles'
  },
  {
    id: 'trip-003',
    date: '01/15/2025',
    address: '789 Pine Rd, Westside',
    amount: 18.75,
    service: 'Quick Wash',
    vehicle: '2023 Honda Accord',
    customer: 'Sarah Williams',
    duration: '28 mins',
    distance: '3.1 miles'
  },
  {
    id: 'trip-004',
    date: '01/14/2025',
    address: '321 Elm St, Eastbrook',
    amount: 42.00,
    service: 'Oil Change + Wash',
    vehicle: '2025 Tesla Model S',
    customer: 'David Chen',
    duration: '65 mins',
    distance: '8.9 miles'
  },
  {
    id: 'trip-005',
    date: '01/14/2025',
    address: '654 Maple Dr, Northtown',
    amount: 22.25,
    service: 'Interior Detail',
    vehicle: '2024 Audi Q7',
    customer: 'Emily Rodriguez',
    duration: '38 mins',
    distance: '5.3 miles'
  },
  {
    id: 'trip-006',
    date: '01/14/2025',
    address: '987 Cedar Ln, Southside',
    amount: 28.90,
    service: 'Full Service',
    vehicle: '2023 Mercedes GLE',
    customer: 'Robert Taylor',
    duration: '45 mins',
    distance: '4.7 miles'
  },
  {
    id: 'trip-007',
    date: '01/13/2025',
    address: '147 Birch St, Central',
    amount: 35.80,
    service: 'Premium Wash',
    vehicle: '2024 Lexus RX',
    customer: 'Jessica Brown',
    duration: '58 mins',
    distance: '7.2 miles'
  },
  {
    id: 'trip-008',
    date: '01/13/2025',
    address: '258 Spruce Ave, Riverside',
    amount: 19.50,
    service: 'Basic Wash',
    vehicle: '2023 Toyota Camry',
    customer: 'Mark Anderson',
    duration: '32 mins',
    distance: '3.8 miles'
  },
  {
    id: 'trip-009',
    date: '01/13/2025',
    address: '369 Willow Rd, Hillside',
    amount: 26.75,
    service: 'Exterior Detail',
    vehicle: '2024 Ford Explorer',
    customer: 'Lisa Garcia',
    duration: '41 mins',
    distance: '5.1 miles'
  },
  {
    id: 'trip-010',
    date: '01/12/2025',
    address: '741 Poplar St, Lakeside',
    amount: 33.25,
    service: 'Oil Change',
    vehicle: '2025 Jeep Grand Cherokee',
    customer: 'Daniel Martinez',
    duration: '49 mins',
    distance: '6.4 miles'
  },
  {
    id: 'trip-011',
    date: '01/12/2025',
    address: '852 Ash Dr, Woodland',
    amount: 21.40,
    service: 'Quick Detail',
    vehicle: '2023 Nissan Altima',
    customer: 'Amanda Wilson',
    duration: '35 mins',
    distance: '4.2 miles'
  },
  {
    id: 'trip-012',
    date: '01/12/2025',
    address: '963 Hickory Ln, Valley',
    amount: 29.60,
    service: 'Full Service',
    vehicle: '2024 Chevrolet Tahoe',
    customer: 'Christopher Lee',
    duration: '47 mins',
    distance: '5.9 miles'
  },
  {
    id: 'trip-013',
    date: '01/11/2025',
    address: '159 Dogwood St, Garden',
    amount: 37.15,
    service: 'Premium Detail',
    vehicle: '2025 Range Rover',
    customer: 'Michelle Thompson',
    duration: '62 mins',
    distance: '8.1 miles'
  },
  {
    id: 'trip-014',
    date: '01/11/2025',
    address: '268 Magnolia Ave, Creek',
    amount: 24.80,
    service: 'Interior Wash',
    vehicle: '2023 Subaru Outback',
    customer: 'Kevin White',
    duration: '39 mins',
    distance: '4.6 miles'
  },
  {
    id: 'trip-015',
    date: '01/11/2025',
    address: '379 Sycamore Rd, Heights',
    amount: 32.50,
    service: 'Oil + Wash',
    vehicle: '2024 Infiniti QX80',
    customer: 'Stephanie Davis',
    duration: '54 mins',
    distance: '7.3 miles'
  },
  {
    id: 'trip-016',
    date: '01/10/2025',
    address: '486 Redwood Dr, Vista',
    amount: 20.95,
    service: 'Express Wash',
    vehicle: '2023 Hyundai Sonata',
    customer: 'Brian Miller',
    duration: '29 mins',
    distance: '3.7 miles'
  },
  {
    id: 'trip-017',
    date: '01/10/2025',
    address: '597 Cypress St, Ridge',
    amount: 27.30,
    service: 'Exterior Detail',
    vehicle: '2024 Volvo XC90',
    customer: 'Nicole Jackson',
    duration: '43 mins',
    distance: '5.5 miles'
  },
  {
    id: 'trip-018',
    date: '01/10/2025',
    address: '608 Juniper Ln, Park',
    amount: 34.75,
    service: 'Full Detail',
    vehicle: '2025 Porsche Cayenne',
    customer: 'Ryan Moore',
    duration: '56 mins',
    distance: '6.8 miles'
  },
  {
    id: 'trip-019',
    date: '01/09/2025',
    address: '719 Sequoia Ave, Forest',
    amount: 23.65,
    service: 'Basic Service',
    vehicle: '2023 Kia Sorento',
    customer: 'Ashley Harris',
    duration: '37 mins',
    distance: '4.9 miles'
  },
  {
    id: 'trip-020',
    date: '01/09/2025',
    address: '820 Chestnut Rd, Grove',
    amount: 30.10,
    service: 'Premium Wash',
    vehicle: '2024 Genesis GV80',
    customer: 'Justin Clark',
    duration: '48 mins',
    distance: '6.1 miles'
  },
  {
    id: 'trip-021',
    date: '01/09/2025',
    address: '931 Walnut St, Manor',
    amount: 25.85,
    service: 'Interior Clean',
    vehicle: '2023 Mazda CX-5',
    customer: 'Megan Lewis',
    duration: '40 mins',
    distance: '5.2 miles'
  },
  {
    id: 'trip-022',
    date: '01/08/2025',
    address: '042 Pecan Dr, Meadow',
    amount: 38.40,
    service: 'Full Service + Wax',
    vehicle: '2025 Lincoln Navigator',
    customer: 'Gregory Young',
    duration: '67 mins',
    distance: '8.7 miles'
  },
  {
    id: 'trip-023',
    date: '01/08/2025',
    address: '153 Almond Ave, Orchard',
    amount: 22.70,
    service: 'Quick Detail',
    vehicle: '2023 Volkswagen Atlas',
    customer: 'Rachel King',
    duration: '36 mins',
    distance: '4.4 miles'
  },
  {
    id: 'trip-024',
    date: '01/08/2025',
    address: '264 Palm Rd, Coastal',
    amount: 31.90,
    service: 'Oil Change',
    vehicle: '2024 Acura MDX',
    customer: 'Jonathan Wright',
    duration: '51 mins',
    distance: '6.6 miles'
  },
  {
    id: 'trip-025',
    date: '01/07/2025',
    address: '375 Pine Valley Dr, Summit',
    amount: 26.20,
    service: 'Express Detail',
    vehicle: '2023 Buick Enclave',
    customer: 'Samantha Lopez',
    duration: '42 mins',
    distance: '5.7 miles'
  }
];

const EarningsPage = () => {
  const totalEarnings = mockJobs.reduce((sum, job) => sum + job.amount, 0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-1 pb-24">
        <div className="p-6 space-y-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/drive"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900">Earnings</h1>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold">Recent Jobs</h2>
              <p className="text-sm text-gray-600">{mockJobs.length} completed trips</p>
            </div>

            <div className="divide-y divide-gray-100">
              {mockJobs.map((job) => (
                <Link
                  key={job.id}
                  href={`/drive/earnings/${job.id}`}
                  className="block p-3 hover:bg-gray-50 transition-colors no-underline"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-sm font-medium text-gray-900">
                        {job.date}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        ${job.amount.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      <DriverNav />
    </div>
  );
};

export default EarningsPage;