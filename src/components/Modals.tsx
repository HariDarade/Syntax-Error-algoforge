import React from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AppointmentForm {
  department: string;
  date: string;
  time: string;
  reason: string;
}

interface User {
  role: string;
  name: string;
  patientId: string;
  email: string;
  phoneNumber: string;
  gender: string;
  age: number;
  diseases: string[];
  avatarUrl: string;
}

interface ModalsProps {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (open: boolean) => void;
  isProfileModalOpen: boolean;
  setIsProfileModalOpen: (open: boolean) => void;
  appointmentForm: AppointmentForm;
  setAppointmentForm: (form: AppointmentForm) => void;
  departments: any[];
  user: User;
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
  user,
  handleAppointmentSubmit,
  handleSignOut,
}) => {
  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || '';
  };

  return (
    <>
      {/* Profile Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Profile</h2>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="text-gray-600 hover:text-gray-800 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="flex flex-col items-center mb-6">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Patient Avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500 shadow-md"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center text-white text-3xl font-semibold border-4 border-blue-500 shadow-md">
                  {getInitials(user.name)}
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold text-gray-800">{user.name}</h3>
              <p className="text-gray-500">Patient ID: {user.patientId}</p>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Email:</span>
                <span className="text-gray-600">{user.email}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Phone Number:</span>
                <span className="text-gray-600">{user.phoneNumber}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Gender:</span>
                <span className="text-gray-600 capitalize">{user.gender}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Age:</span>
                <span className="text-gray-600">{user.age}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-semibold text-gray-700">Diseases:</span>
                <span className="text-gray-600">{user.diseases.length > 0 ? user.diseases.join(', ') : 'None'}</span>
              </div>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Sign out
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Modal */}
      {isAppointmentModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Book an Appointment</h2>
            <form onSubmit={handleAppointmentSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Department</label>
                <select
                  value={appointmentForm.department}
                  onChange={(e) => setAppointmentForm({...appointmentForm, department: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Date</label>
                <input
                  type="date"
                  value={appointmentForm.date}
                  onChange={(e) => setAppointmentForm({...appointmentForm, date: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Time</label>
                <input
                  type="time"
                  value={appointmentForm.time}
                  onChange={(e) => setAppointmentForm({...appointmentForm, time: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Reason</label>
                <textarea
                  value={appointmentForm.reason}
                  onChange={(e) => setAppointmentForm({...appointmentForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAppointmentModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Modals;