import React, { useState, useEffect } from 'react';
import { Clock, Users, RefreshCw, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import Chatbot from './Chatbot.tsx'; // Added .tsx extension
import Modals from './Modals.tsx';   // Added .tsx extension

// Mock data
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    department: 'General',
    priority: 'medium',
    status: 'waiting',
    estimatedWaitTime: 30,
    queuePosition: 2,
  },
  {
    id: '2',
    name: 'Jane Doe',
    department: 'General',
    priority: 'medium',
    status: 'waiting',
    estimatedWaitTime: 30,
    queuePosition: 1,
  },
];

const mockDepartments = [
  { id: '1', name: 'Emergency', currentLoad: 75, averageWaitTime: 5, patientsWaiting: 0 },
  { id: '2', name: 'General', currentLoad: 50, averageWaitTime: 30, patientsWaiting: 2 },
];

// ... (rest of the file remains unchanged)

interface Patient {
  id: string;
  name: string;
  department: string;
  priority: Priority;
  status: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
}

type Priority = 'low' | 'medium' | 'high' | 'emergency' | '';

const PatientDashboard: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [departments, setDepartments] = useState(mockDepartments);
  const [user, setUser] = useState({
    role: 'patient',
    name: 'John Smith',
    patientId: '1',
    email: 'john.smith@example.com',
    phoneNumber: '123-456-7890',
    gender: 'male',
    age: 35,
    diseases: ['Hypertension'],
    avatarUrl: 'https://via.placeholder.com/150',
  });
  const [patientId, setPatientId] = useState<string>('');
  const [searchResult, setSearchResult] = useState<any>(null);
  const [currentPatient, setCurrentPatient] = useState<Patient | null>(null);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    department: '',
    date: '',
    time: '',
    reason: ''
  });
  const [appointments, setAppointments] = useState<any[]>([
    user.patientId === '1' ? [
      {
        id: 'appt1',
        patientId: '1',
        patientName: 'John Smith',
        department: 'General',
        date: '2025-03-04',
        time: '10:20',
        reason: 'hello',
        status: 'scheduled',
        createdAt: new Date('2025-03-04T07:10:00').toISOString(),
      },
    ] : [],
  ]);
  const [hasBookedAppointment, setHasBookedAppointment] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const initialAppointments = user.patientId === '1' ? [
      {
        id: 'appt1',
        patientId: '1',
        patientName: 'John Smith',
        department: 'General',
        date: '2025-03-04',
        time: '10:20',
        reason: 'hello',
        status: 'scheduled',
        createdAt: new Date('2025-03-04T07:10:00').toISOString(),
      },
    ] : [];
    setAppointments(initialAppointments);
    setHasBookedAppointment(initialAppointments.length > 0);

    if (user?.role === 'patient' && user?.patientId && hasBookedAppointment) {
      const patient = patients.find(p => p.id === user.patientId);
      if (patient) {
        let updatedPatient = { ...patient };
        if (patient.department === 'Emergency') {
          updatedPatient.priority = 'emergency';
          updatedPatient.status = 'in-progress';
          updatedPatient.estimatedWaitTime = 5;
        } else if (patient.department === 'General') {
          updatedPatient.priority = 'medium';
          updatedPatient.status = 'waiting';
          updatedPatient.estimatedWaitTime = 30;
        }
        setCurrentPatient(updatedPatient);
        setSearchResult({ patient: updatedPatient });
      }
    }
  }, [user, patients, hasBookedAppointment]);

  useEffect(() => {
    if (cancelSuccess) {
      const timer = setTimeout(() => setCancelSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [cancelSuccess]);

  const handleSearch = () => {
    if (!patientId.trim()) {
      setSearchResult({ error: 'Please enter a patient ID' });
      return;
    }
    
    const patient = patients.find(p => p.id === patientId);
    if (patient && hasBookedAppointment) {
      let updatedPatient = { ...patient };
      if (patient.department === 'Emergency') {
        updatedPatient.priority = 'emergency';
        updatedPatient.status = 'in-progress';
        updatedPatient.estimatedWaitTime = 5;
      } else if (patient.department === 'General') {
        updatedPatient.priority = 'medium';
        updatedPatient.status = 'waiting';
        updatedPatient.estimatedWaitTime = 30;
      }
      setSearchResult({ patient: updatedPatient });
    } else {
      setSearchResult({ error: 'Patient not found or no appointment booked yet' });
    }
  };

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now().toString(),
      patientId: user?.patientId || patientId,
      patientName: user.name,
      ...appointmentForm,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };
    
    const updatedPatients = patients.map(p => 
      p.id === user.patientId 
        ? { 
            ...p, 
            department: newAppointment.department,
            priority: newAppointment.department === 'Emergency' ? 'emergency' : 'medium',
            status: 'waiting',
            estimatedWaitTime: newAppointment.department === 'Emergency' ? 5 : 30,
            queuePosition: newAppointment.department === 'Emergency' ? 1 : 2,
          }
        : p
    );
    setPatients(updatedPatients);

    setAppointments(prevAppointments => [...prevAppointments, newAppointment]);
    console.log('Appointment booked:', newAppointment);
    setIsAppointmentModalOpen(false);
    setAppointmentForm({ department: '', date: '', time: '', reason: '' });
    setHasBookedAppointment(true);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      console.log('Attempting to cancel appointment with ID:', appointmentId);
      const updatedAppointments = appointments.filter(apt => apt.id !== appointmentId);
      console.log('Updated appointments after cancellation:', updatedAppointments);

      const newHasBookedAppointment = updatedAppointments.length > 0;
      setHasBookedAppointment(newHasBookedAppointment);

      let updatedPatients = [...patients];
      if (!newHasBookedAppointment && user.patientId) {
        updatedPatients = patients.map(p => 
          p.id === user.patientId 
            ? { 
                ...p, 
                department: '',
                priority: '' as Priority,
                status: '',
                estimatedWaitTime: undefined,
                queuePosition: undefined,
              }
            : p
        );
      }
      setPatients(updatedPatients);
      setAppointments(updatedAppointments);
      setCurrentPatient(null);
      setSearchResult(null);
      setCancelSuccess('Appointment canceled successfully!');
      console.log('Patient queue status after cancellation:', updatedPatients);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'scheduled': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSignOut = () => {
    console.log('User signed out');
    setUser({ role: '', name: '', patientId: '', email: '', phoneNumber: '', gender: '', age: 0, diseases: [], avatarUrl: '' });
    setIsProfileModalOpen(false);
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || '';
  };

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg className="h-6 w-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            MediQueue
          </h1>
          <nav className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">Dashboard</a>
            <a href="#" className="text-gray-600 hover:text-blue-600">Live Queue</a>
          </nav>
        </div>
        <div className="flex gap-2 items-center">
          <button 
            onClick={() => setIsAppointmentModalOpen(true)}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <Calendar size={16} className="mr-2" />
            Book Appointment
          </button>
          <button 
            onClick={() => {
              setPatients([...mockPatients]);
              setDepartments([...mockDepartments]);
            }}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="Patient Avatar"
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold border-2 border-gray-300">
                {getInitials(user.name)}
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Modals */}
      <Modals
        isAppointmentModalOpen={isAppointmentModalOpen}
        setIsAppointmentModalOpen={setIsAppointmentModalOpen}
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        appointmentForm={appointmentForm}
        setAppointmentForm={setAppointmentForm}
        departments={departments}
        user={user}
        handleAppointmentSubmit={handleAppointmentSubmit}
        handleSignOut={handleSignOut}
      />

      {/* Cancellation Success Message */}
      {cancelSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          {cancelSuccess}
        </div>
      )}

      {/* Chatbot */}
      <Chatbot
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        user={user}
        patients={patients}
        departments={departments}
        appointments={appointments}
        hasBookedAppointment={hasBookedAppointment}
        currentPatient={currentPatient}
        searchResult={searchResult}
      />

      {/* Queue Status and Other Sections */}
      {hasBookedAppointment && user.patientId === '1' && (
        <>
          {currentPatient && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Your Queue Status</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold text-lg">{currentPatient.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-gray-600">Department: {currentPatient.department}</p>
                    <p className="text-gray-600">
                      Status: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(currentPatient.status)}`}>
                        {currentPatient.status.replace('-', ' ')}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">
                      Priority: 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(currentPatient.priority)}`}>
                        {currentPatient.priority}
                      </span>
                    </p>
                    {currentPatient.status === 'waiting' && currentPatient.department !== 'Emergency' && (
                      <>
                        <p className="text-gray-600">Queue Position: {currentPatient.queuePosition}</p>
                        <p className="text-gray-600">Estimated Wait: {currentPatient.estimatedWaitTime} minutes</p>
                      </>
                    )}
                    {currentPatient.department === 'Emergency' && (
                      <p className="text-gray-600">Estimated Wait: {currentPatient.estimatedWaitTime || 5} minutes or less (priority emergency)</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {!currentPatient && user.patientId === '1' && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-3">Find Your Queue Status</h2>
              <div className="flex flex-col md:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter your Patient ID"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSearch}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Check Status
                </button>
              </div>

              {searchResult && !currentPatient && (
                <div className="mt-4">
                  {searchResult.error ? (
                    <p className="text-red-500">{searchResult.error}</p>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h3 className="font-semibold text-lg">{searchResult.patient.name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div>
                          <p className="text-gray-600">Department: {searchResult.patient.department}</p>
                          <p className="text-gray-600">
                            Status: 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(searchResult.patient.status)}`}>
                              {searchResult.patient.status.replace('-', ' ')}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Priority: 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(searchResult.patient.priority)}`}>
                              {searchResult.patient.priority}
                            </span>
                          </p>
                          {searchResult.patient.status === 'waiting' && searchResult.patient.department !== 'Emergency' && (
                            <>
                              <p className="text-gray-600">Queue Position: {searchResult.patient.queuePosition}</p>
                              <p className="text-gray-600">Estimated Wait: {searchResult.patient.estimatedWaitTime} minutes</p>
                            </>
                          )}
                          {searchResult.patient.department === 'Emergency' && (
                            <p className="text-gray-600">Estimated Wait: {searchResult.patient.estimatedWaitTime || 5} minutes or less (priority emergency)</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {(currentPatient || searchResult?.patient) && appointments.length > 0 && user.patientId === '1' && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Your Appointments</h2>
              <div className="space-y-4">
                {appointments
                  .filter(apt => apt.patientId === user.patientId)
                  .map((appointment) => (
                    <div key={appointment.id} className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-600">Department: {appointment.department}</p>
                          <p className="text-gray-600">
                            Status: 
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </p>
                          <p className="text-gray-600">Reason: {appointment.reason}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">
                            Date: {format(new Date(appointment.date), 'MMMM dd, yyyy')}
                          </p>
                          <p className="text-gray-600">Time: {appointment.time}</p>
                          <p className="text-gray-600 text-sm">
                            Booked: {format(new Date(appointment.createdAt), 'MMM dd, yyyy HH:mm')}
                          </p>
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="mt-2 flex items-center px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                          >
                            <Trash2 size={16} className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {user.patientId === '1' && (
              <>
                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-3">
                    <Users size={20} className="text-blue-500 mr-2" />
                    <h2 className="text-lg font-semibold">Current Queue</h2>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {patients.filter(p => p.status === 'waiting' && p.department).length}
                  </div>
                  <p className="text-gray-600">Patients waiting</p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-4">
                  <div className="flex items-center mb-3">
                    <Clock size={20} className="text-green-500 mr-2" />
                    <h2 className="text-lg font-semibold">Average Wait Time</h2>
                  </div>
                  <div className="text-3xl font-bold text-gray-800">
                    {departments.length > 0 
                      ? `${Math.round(departments.reduce((acc, dept) => acc + dept.averageWaitTime, 0) / departments.length)} min`
                      : 'N/A'}
                  </div>
                  <p className="text-gray-600">Across all departments</p>
                </div>
              </>
            )}
          </div>

          {user.patientId === '1' && (
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-lg font-semibold mb-4">Department Status</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Wait Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients Waiting</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {departments.map((dept) => (
                      <tr key={dept.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.averageWaitTime} min</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.patientsWaiting}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PatientDashboard;