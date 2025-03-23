import React from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data for hospital details (extended from HospitalReports)
const hospitalData = [
  {
    id: '1',
    hospital: 'City Hospital',
    date: '2025-03-22',
    patientInflow: 120,
    resourceUsage: '80%',
    staffAllocation: '90%',
    status: 'Normal',
    address: '123 Main Street, Downtown, NY 10001',
    contact: '(212) 555-0101',
    departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'],
    bedCapacity: 300,
    currentOccupancy: 240,
  },
  {
    id: '2',
    hospital: 'Green Valley Medical Center',
    date: '2025-03-22',
    patientInflow: 95,
    resourceUsage: '65%',
    staffAllocation: '85%',
    status: 'Stable',
    address: '456 Green Road, Suburbia, CA 90210',
    contact: '(310) 555-0202',
    departments: ['Orthopedics', 'Oncology', 'General Surgery'],
    bedCapacity: 200,
    currentOccupancy: 130,
  },
  {
    id: '3',
    hospital: 'Sunrise Clinic',
    date: '2025-03-22',
    patientInflow: 150,
    resourceUsage: '90%',
    staffAllocation: '95%',
    status: 'Critical',
    address: '789 Sunrise Avenue, Coastal City, FL 33101',
    contact: '(305) 555-0303',
    departments: ['Dermatology', 'ENT', 'Emergency'],
    bedCapacity: 150,
    currentOccupancy: 140,
  },
  {
    id: '4',
    hospital: 'Northside General Hospital',
    date: '2025-03-22',
    patientInflow: 200,
    resourceUsage: '95%',
    staffAllocation: '92%',
    status: 'Critical',
    address: '101 Northside Blvd, Metropolis, IL 60601',
    contact: '(312) 555-0404',
    departments: ['Cardiology', 'Neurosurgery', 'Maternity'],
    bedCapacity: 400,
    currentOccupancy: 380,
  },
  {
    id: '5',
    hospital: 'Lakeside Medical Facility',
    date: '2025-03-22',
    patientInflow: 80,
    resourceUsage: '55%',
    staffAllocation: '70%',
    status: 'Normal',
    address: '202 Lake Drive, Lakeside Town, MI 48201',
    contact: '(313) 555-0505',
    departments: ['General Medicine', 'Pediatrics'],
    bedCapacity: 100,
    currentOccupancy: 55,
  },
  {
    id: '6',
    hospital: 'Riverfront Health Center',
    date: '2025-03-22',
    patientInflow: 110,
    resourceUsage: '75%',
    staffAllocation: '88%',
    status: 'Stable',
    address: '303 Riverfront Way, Riverside, TX 77001',
    contact: '(713) 555-0606',
    departments: ['Oncology', 'Radiology', 'Emergency'],
    bedCapacity: 250,
    currentOccupancy: 190,
  },
  {
    id: '7',
    hospital: 'Pinewood Regional Hospital',
    date: '2025-03-22',
    patientInflow: 175,
    resourceUsage: '88%',
    staffAllocation: '93%',
    status: 'Critical',
    address: '404 Pinewood Lane, Forest City, GA 30301',
    contact: '(404) 555-0707',
    departments: ['Cardiology', 'Orthopedics', 'ICU'],
    bedCapacity: 350,
    currentOccupancy: 310,
  },
  {
    id: '8',
    hospital: 'Maple Grove Clinic',
    date: '2025-03-22',
    patientInflow: 60,
    resourceUsage: '45%',
    staffAllocation: '65%',
    status: 'Normal',
    address: '505 Maple Street, Grove Town, OH 44101',
    contact: '(216) 555-0808',
    departments: ['General Practice', 'Dermatology'],
    bedCapacity: 80,
    currentOccupancy: 36,
  },
];

const HospitalDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Get hospital ID from URL

  // Find the hospital by ID
  const hospital = hospitalData.find((h) => h.id === id);

  if (!hospital) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Hospital Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">
          The hospital you're looking for does not exist.{' '}
          <Link to="/hospital-reports" className="text-blue-600 hover:underline">
            Go back to Hospital Reports
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{hospital.hospital}</h2>
        <Link
          to="/hospital-reports"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Back to Reports
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* General Information */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">General Information</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Address:</strong> {hospital.address}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Contact:</strong> {hospital.contact}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Departments:</strong> {hospital.departments.join(', ')}
          </p>
        </div>

        {/* Operational Statistics */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Operational Statistics</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Patient Inflow:</strong> {hospital.patientInflow}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Resource Usage:</strong> {hospital.resourceUsage}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Staff Allocation:</strong> {hospital.staffAllocation}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Status:</strong>{' '}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                hospital.status === 'Critical'
                  ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
                  : hospital.status === 'Stable'
                  ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                  : 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
              }`}
            >
              {hospital.status}
            </span>
          </p>
        </div>

        {/* Capacity Information */}
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">Capacity Information</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Bed Capacity:</strong> {hospital.bedCapacity}
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            <strong>Current Occupancy:</strong> {hospital.currentOccupancy}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            <strong>Occupancy Rate:</strong>{' '}
            {((hospital.currentOccupancy / hospital.bedCapacity) * 100).toFixed(1)}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default HospitalDetails;