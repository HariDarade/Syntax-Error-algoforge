import React, { useState, useEffect } from 'react';
import { Clock, Users, RefreshCw, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Chatbot from './Chatbot.tsx';
import Modals from './Modals.tsx';

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

const mockHospitals = ['City Hospital', 'Green Valley Medical Center', 'Sunrise Clinic', 'Metro Health'];
const mockConsultancyTypes = ['In-Person', 'Telemedicine'];

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
    hospital: '',
    consultancyType: '',
    date: '',
    time: '',
    reason: '',
  });
  const [appointments, setAppointments] = useState<any[]>([
    user.patientId === '1'
      ? [
          {
            id: 'appt1',
            patientId: '1',
            patientName: 'John Smith',
            department: 'General',
            hospital: 'City Hospital',
            consultancyType: 'In-Person',
            date: '2025-03-04',
            time: '10:20',
            reason: 'hello',
            status: 'scheduled',
            createdAt: new Date('2025-03-04T07:10:00').toISOString(),
          },
        ]
      : [],
  ]);
  const [hasBookedAppointment, setHasBookedAppointment] = useState(false);
  const [cancelSuccess, setCancelSuccess] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const activeAppointments = appointments.filter((apt) => apt.status !== 'cancelled');
    setHasBookedAppointment(activeAppointments.length > 0);

    if (user?.role === 'patient' && user?.patientId && activeAppointments.length > 0) {
      const patient = patients.find((p) => p.id === user.patientId);
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
    } else {
      setCurrentPatient(null);
    }
  }, [user, patients, appointments]);

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

    const patient = patients.find((p) => p.id === patientId);
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
    if (
      !appointmentForm.department ||
      !appointmentForm.hospital ||
      !appointmentForm.consultancyType ||
      !appointmentForm.date ||
      !appointmentForm.time ||
      !appointmentForm.reason
    ) {
      alert('Please fill in all fields');
      return;
    }

    const newAppointment = {
      id: Date.now().toString(),
      patientId: user?.patientId || patientId,
      patientName: user.name,
      department: appointmentForm.department,
      hospital: appointmentForm.hospital,
      consultancyType: appointmentForm.consultancyType,
      date: appointmentForm.date,
      time: appointmentForm.time,
      reason: appointmentForm.reason,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
    };

    const updatedPatients = patients.map((p) =>
      p.id === user.patientId
        ? {
            ...p,
            department: newAppointment.department,
            priority: newAppointment.department === 'Emergency' ? 'emergency' : 'medium',
            status: 'waiting',
            estimatedWaitTime: newAppointment.department === 'Emergency' ? 5 : 30,
            queuePosition: newAppointment.department === 'Emergency' ? 1 : patients.filter((pt) => pt.department === newAppointment.department && pt.status === 'waiting').length + 1,
          }
        : p
    );
    setPatients(updatedPatients);

    setAppointments((prevAppointments) => [...prevAppointments, newAppointment]);
    console.log('Appointment booked:', newAppointment);
    setIsAppointmentModalOpen(false);
    setAppointmentForm({ department: '', hospital: '', consultancyType: '', date: '', time: '', reason: '' });
    setHasBookedAppointment(true);

    const updatedDepartments = departments.map((dept) =>
      dept.name === newAppointment.department
        ? { ...dept, patientsWaiting: dept.patientsWaiting + 1 }
        : dept
    );
    setDepartments(updatedDepartments);
  };

  const handleCancelAppointment = (appointmentId: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      console.log('Attempting to cancel appointment with ID:', appointmentId);
      const appointmentToCancel = appointments.find((apt) => apt.id === appointmentId);
      const updatedAppointments = appointments.filter((apt) => apt.id !== appointmentId);
      console.log('Updated appointments after cancellation:', updatedAppointments);

      const newHasBookedAppointment = updatedAppointments.length > 0;
      setHasBookedAppointment(newHasBookedAppointment);

      let updatedPatients = [...patients];
      if (!newHasBookedAppointment && user.patientId) {
        updatedPatients = patients.map((p) =>
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
      } else {
        const canceledPatient = patients.find((p) => p.id === user.patientId);
        if (canceledPatient && canceledPatient.department) {
          const remainingPatientsInDept = patients
            .filter((p) => p.department === canceledPatient.department && p.status === 'waiting' && p.id !== user.patientId)
            .sort((a, b) => (a.queuePosition || 0) - (b.queuePosition || 0));
          updatedPatients = patients.map((p) => {
            if (p.department === canceledPatient.department && p.status === 'waiting' && p.id !== user.patientId) {
              const newPosition = remainingPatientsInDept.findIndex((pt) => pt.id === p.id) + 1;
              return { ...p, queuePosition: newPosition };
            }
            if (p.id === user.patientId) {
              return {
                ...p,
                department: '',
                priority: '' as Priority,
                status: '',
                estimatedWaitTime: undefined,
                queuePosition: undefined,
              };
            }
            return p;
          });
        }
      }
      setPatients(updatedPatients);
      setAppointments(updatedAppointments);
      setCurrentPatient(null);
      setSearchResult(null);
      setCancelSuccess('Appointment canceled successfully!');
      console.log('Patient queue status after cancellation:', updatedPatients);

      if (appointmentToCancel) {
        const updatedDepartments = departments.map((dept) =>
          dept.name === appointmentToCancel.department
            ? { ...dept, patientsWaiting: Math.max(0, dept.patientsWaiting - 1) }
            : dept
        );
        setDepartments(updatedDepartments);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200';
      case 'in-progress':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      case 'completed':
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
      case 'cancelled':
        return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
      case 'scheduled':
        return 'bg-purple-200 text-purple-800 dark:bg-purple-700 dark:text-purple-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'low':
        return 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200';
      case 'medium':
        return 'bg-blue-200 text-blue-800 dark:bg-blue-700 dark:text-blue-200';
      case 'high':
        return 'bg-orange-200 text-orange-800 dark:bg-orange-700 dark:text-orange-200';
      case 'emergency':
        return 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200';
      default:
        return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleSignOut = () => {
    console.log('User signed out');
    setUser({
      role: '',
      name: '',
      patientId: '',
      email: '',
      phoneNumber: '',
      gender: '',
      age: 0,
      diseases: [],
      avatarUrl: '',
    });
    setIsProfileModalOpen(false);
  };

  const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name[0]?.toUpperCase() || '';
  };

  // Function to navigate to Virtual Rooms
  const handleVirtualRooms = () => {
    navigate('/virtual-rooms');
  };

  return (
    <div className="min-h-screen p-4 md:p-6 transition-colors duration-300 bg-gray-100">
      <div
        className={`transition-all duration-300 ${
          isAppointmentModalOpen || isProfileModalOpen || isChatOpen ? 'blur-sm' : ''
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold flex items-center text-gray-800 dark:text-gray-100">
              <svg
                className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
              MediQueue
            </h1>
            <nav className="flex space-x-6">
              <a
                href="#"
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 font-medium"
              >
                Dashboard
              </a>
            </nav>
          </div>
          <div className="flex gap-3 items-center">
            <button
              onClick={() => setIsAppointmentModalOpen(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              <Calendar size={18} className="mr-2" />
              Book Appointment
            </button>
            <button
              onClick={() => {
                setPatients([...mockPatients]);
                setDepartments([...mockDepartments]);
              }}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
            >
              <RefreshCw size={18} className="mr-2" />
              Refresh
            </button>
            <button
              onClick={handleVirtualRooms}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-lg shadow-md hover:from-purple-600 hover:to-violet-600 transition-all duration-300 transform hover:scale-105"
            >
              Virtual Rooms
            </button>
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center transform hover:scale-105 transition-transform duration-200"
            >
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt="Patient Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-blue-500 dark:border-blue-400 shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-blue-500 dark:bg-blue-600 flex items-center justify-center text-white font-semibold text-lg border-2 border-blue-500 dark:border-blue-400 shadow-md">
                  {getInitials(user.name)}
                </div>
              )}
            </button>
          </div>
        </div>

        {cancelSuccess && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-800 border border-green-400 dark:border-green-600 text-green-700 dark:text-green-200 rounded-lg shadow-md animate-fade-in">
            {cancelSuccess}
          </div>
        )}

        {hasBookedAppointment && user.patientId === '1' && currentPatient && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Queue Status</h2>
              <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">{currentPatient.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Department: <span className="font-medium">{currentPatient.department}</span>
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      Status:
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          currentPatient.status
                        )}`}
                      >
                        {currentPatient.status.replace('-', ' ')}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      Priority:
                      <span
                        className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                          currentPatient.priority
                        )}`}
                      >
                        {currentPatient.priority}
                      </span>
                    </p>
                    {currentPatient.status === 'waiting' && currentPatient.department !== 'Emergency' && (
                      <>
                        <p className="text-gray-600 dark:text-gray-300">
                          Queue Position: <span className="font-medium">{currentPatient.queuePosition}</span>
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          Estimated Wait: <span className="font-medium">{currentPatient.estimatedWaitTime} minutes</span>
                        </p>
                      </>
                    )}
                    {currentPatient.department === 'Emergency' && (
                      <p className="text-gray-600 dark:text-gray-300">
                        Estimated Wait:{' '}
                        <span className="font-medium">
                          {currentPatient.estimatedWaitTime || 5} minutes or less (priority emergency)
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {!currentPatient && user.patientId === '1' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Find Your Queue Status</h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <input
                    type="text"
                    placeholder="Enter your Patient ID"
                    value={patientId}
                    onChange={(e) => setPatientId(e.target.value)}
                    className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-all duration-200"
                  />
                  <button
                    onClick={handleSearch}
                    className="px-5 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 transform hover:scale-105"
                  >
                    Check Status
                  </button>
                </div>

                {searchResult && !currentPatient && (
                  <div className="mt-5">
                    {searchResult.error ? (
                      <p className="text-red-500 dark:text-red-400">{searchResult.error}</p>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg">
                        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-200">
                          {searchResult.patient.name}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">
                              Department: <span className="font-medium">{searchResult.patient.department}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Status:
                              <span
                                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  searchResult.patient.status
                                )}`}
                              >
                                {searchResult.patient.status.replace('-', ' ')}
                              </span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">
                              Priority:
                              <span
                                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                                  searchResult.patient.priority
                                )}`}
                              >
                                {searchResult.patient.priority}
                              </span>
                            </p>
                            {searchResult.patient.status === 'waiting' &&
                              searchResult.patient.department !== 'Emergency' && (
                                <>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Queue Position:{' '}
                                    <span className="font-medium">{searchResult.patient.queuePosition}</span>
                                  </p>
                                  <p className="text-gray-600 dark:text-gray-300">
                                    Estimated Wait:{' '}
                                    <span className="font-medium">{searchResult.patient.estimatedWaitTime} minutes</span>
                                  </p>
                                </>
                              )}
                            {searchResult.patient.department === 'Emergency' && (
                              <p className="text-gray-600 dark:text-gray-300">
                                Estimated Wait:{' '}
                                <span className="font-medium">
                                  {searchResult.patient.estimatedWaitTime || 5} minutes or less (priority emergency)
                                </span>
                              </p>
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
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Your Appointments</h2>
                <div className="space-y-4">
                  {appointments
                    .filter((apt) => apt.patientId === user.patientId && apt.status !== 'cancelled')
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="bg-gray-50 dark:bg-gray-700 p-5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">
                              Department: <span className="font-medium">{appointment.department}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Hospital: <span className="font-medium">{appointment.hospital}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Consultancy Type: <span className="font-medium">{appointment.consultancyType}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Status:
                              <span
                                className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                  appointment.status
                                )}`}
                              >
                                {appointment.status}
                              </span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Reason: <span className="font-medium">{appointment.reason}</span>
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600 dark:text-gray-300">
                              Date:{' '}
                              <span className="font-medium">
                                {format(new Date(appointment.date), 'MMMM dd, yyyy')}
                              </span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-300">
                              Time: <span className="font-medium">{appointment.time}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">
                              Booked:{' '}
                              <span className="font-medium">
                                {format(new Date(appointment.createdAt), 'MMM dd, yyyy HH:mm')}
                              </span>
                            </p>
                            <button
                              onClick={() => handleCancelAppointment(appointment.id)}
                              className="mt-3 flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md hover:from-red-600 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
                            >
                              <Trash2 size={16} className="mr-2" />
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
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      <Users size={24} className="text-blue-500 dark:text-blue-400 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Current Queue</h2>
                    </div>
                    <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                      {patients.filter((p) => p.status === 'waiting' && p.department).length}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Patients waiting</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 transform hover:shadow-xl transition-shadow duration-300">
                    <div className="flex items-center mb-4">
                      <Clock size={24} className="text-green-500 dark:text-green-400 mr-3" />
                      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Average Wait Time</h2>
                    </div>
                    <div className="text-4xl font-bold text-gray-800 dark:text-gray-100">
                      {departments.length > 0
                        ? `${Math.round(
                            departments.reduce((acc, dept) => acc + dept.averageWaitTime, 0) / departments.length
                          )} min`
                        : 'N/A'}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mt-2">Across all departments</p>
                  </div>
                </>
              )}
            </div>

            {user.patientId === '1' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 transform hover:shadow-xl transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Department Status</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Avg. Wait Time
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Patients Waiting
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {departments.map((dept) => (
                        <tr
                          key={dept.id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                            {dept.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {dept.averageWaitTime} min
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                            {dept.patientsWaiting}
                          </td>
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

      <Modals
        isAppointmentModalOpen={isAppointmentModalOpen}
        setIsAppointmentModalOpen={setIsAppointmentModalOpen}
        isProfileModalOpen={isProfileModalOpen}
        setIsProfileModalOpen={setIsProfileModalOpen}
        appointmentForm={appointmentForm}
        setAppointmentForm={setAppointmentForm}
        departments={departments}
        hospitals={mockHospitals}
        consultancyTypes={mockConsultancyTypes}
        user={user}
        handleAppointmentSubmit={handleAppointmentSubmit}
        handleSignOut={handleSignOut}
      />
    </div>
  );
};

export default PatientDashboard;