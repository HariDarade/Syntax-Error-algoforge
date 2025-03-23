import React from 'react';
import { Calendar, Clock, X } from 'lucide-react';

interface ModalsProps {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  appointmentForm: {
    department: string;
    hospital: string;
    consultancyType: string;
    date: string;
    time: string;
    reason: string;
  };
  setAppointmentForm: (form: any) => void;
  departments: { id: string; name: string; currentLoad: number; averageWaitTime: number; patientsWaiting: number }[];
  hospitals: string[];
  consultancyTypes: string[];
  user: any;
  handleAppointmentSubmit: (e: React.FormEvent) => void;
  handleSignOut: () => void;
}

const Modals: React.FC<ModalsProps> = ({
  isAppointmentModalOpen,
  setIsAppointmentModalOpen,
  isProfileModalOpen,
  setIsProfileModalOpen,
  appointmentForm,
  setAppointmentForm,
  departments,
  hospitals,
  consultancyTypes,
  user,
  handleAppointmentSubmit,
  handleSignOut,
}) => {
  return (
    <>
      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Book an Appointment</h2>
              <button onClick={() => setIsAppointmentModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAppointmentSubmit} className="space-y-4">
              {/* Hospital Selection (Moved above Department) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hospital</label>
                <select
                  value={appointmentForm.hospital}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, hospital: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Hospital</option>
                  {hospitals.map((hospital) => (
                    <option key={hospital} value={hospital}>
                      {hospital}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <select
                  value={appointmentForm.department}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, department: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.name}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Consultancy Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Consultancy Type</label>
                <select
                  value={appointmentForm.consultancyType}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, consultancyType: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select Consultancy Type</option>
                  {consultancyTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={appointmentForm.date}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="dd-mm-yyyy"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <div className="relative">
                  <input
                    type="time"
                    value={appointmentForm.time}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="--:--"
                  />
                  <Clock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter the reason for your appointment"
                />
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <button onClick={() => setIsProfileModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Patient Avatar"
                    className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-xl border-2 border-blue-500">
                    {user.name[0]?.toUpperCase() || 'U'}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user.name}</h3>
                  <p className="text-gray-600">Patient ID: {user.patientId}</p>
                </div>
              </div>
              <div>
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Phone:</span> {user.phoneNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Gender:</span> {user.gender}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Age:</span> {user.age}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Diseases:</span> {user.diseases.join(', ')}
                </p>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;