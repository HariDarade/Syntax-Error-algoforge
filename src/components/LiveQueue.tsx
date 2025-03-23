import React, { useState, useEffect } from 'react';
import { useQueue } from '../context/QueueContext';
import { Clock, Bell, AlertCircle } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion'; // For animations

// Mock data (same as before)
const mockPatients = [
  {
    id: '1',
    name: 'John Smith',
    department: 'Emergency',
    priority: 'emergency',
    status: 'waiting',
    estimatedWaitTime: 5,
    queuePosition: 1,
    arrivalTime: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Jane Doe',
    department: 'Radiology',
    priority: 'low',
    status: 'waiting',
    estimatedWaitTime: 30,
    queuePosition: 1,
    arrivalTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    name: 'Alice Brown',
    department: 'Cardiology',
    priority: 'medium',
    status: 'waiting',
    estimatedWaitTime: 10,
    queuePosition: 1,
    arrivalTime: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: '4',
    name: 'Bob Johnson',
    department: 'Orthopedics',
    priority: 'medium',
    status: 'waiting',
    estimatedWaitTime: 35,
    queuePosition: 1,
    arrivalTime: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
];

const mockDepartments = [
  { id: '1', name: 'Emergency', currentLoad: 75, averageWaitTime: 30, patientsWaiting: 4 },
  { id: '2', name: 'Radiology', currentLoad: 40, averageWaitTime: 40, patientsWaiting: 2 },
  { id: '3', name: 'Cardiology', currentLoad: 20, averageWaitTime: 20, patientsWaiting: 1 },
  { id: '4', name: 'Orthopedics', currentLoad: 60, averageWaitTime: 35, patientsWaiting: 3 },
];

interface Patient {
  id: string;
  name: string;
  department: string;
  priority: string;
  status: string;
  estimatedWaitTime?: number;
  queuePosition?: number;
  arrivalTime?: string;
}

const LiveQueue: React.FC = () => {
  const { patients: contextPatients, departments: contextDepartments, loading, error, refreshData } = useQueue();
  const [patients, setPatients] = useState<Patient[]>(contextPatients || mockPatients);
  const [departments, setDepartments] = useState(contextDepartments || mockDepartments);
  const [patientId, setPatientId] = useState<string>('');
  const [notifications, setNotifications] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<any>(null);
  const [lastUpdated, setLastUpdated] = useState<string>(format(new Date(), 'h:mm:ss a'));

  // Simulate real-time updates (since we removed manual refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        refreshData();
        setLastUpdated(format(new Date(), 'h:mm:ss a')); // Update timestamp
        if (patientId && searchResult?.patient) {
          handleSearch();
        }

        // Simulate dynamic changes (e.g., patients moving to "in-progress" or "completed")
        setPatients((prevPatients) =>
          prevPatients.map((patient) => {
            if (patient.status === 'waiting' && Math.random() < 0.1) {
              // 10% chance to move to "in-progress"
              return { ...patient, status: 'in-progress', arrivalTime: new Date().toISOString() };
            }
            if (patient.status === 'in-progress' && Math.random() < 0.05) {
              // 5% chance to move to "completed"
              return { ...patient, status: 'completed' };
            }
            return patient;
          })
        );
      } catch (err) {
        console.error('Auto-refresh failed:', err);
      }
    }, 10000); // Refresh every 10 seconds for a more dynamic feel

    return () => clearInterval(interval);
  }, [refreshData, patientId, searchResult]);

  useEffect(() => {
    setPatients(contextPatients || mockPatients);
    setDepartments(contextDepartments || mockDepartments);
  }, [contextPatients, contextDepartments]);

  const handleSearch = () => {
    if (!patientId.trim()) {
      setSearchResult({ error: 'Please enter a patient ID' });
      return;
    }

    const patient = patients.find((p) => p.id === patientId);
    if (patient) {
      setSearchResult({ patient });
      if (patient.status === 'waiting') {
        setNotifications(true);
      } else if (patient.status === 'in-progress') {
        setNotifications(false);
      }
    } else {
      setSearchResult({ error: 'Patient not found' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-200 text-green-800';
      case 'medium':
        return 'bg-blue-200 text-blue-800';
      case 'high':
        return 'bg-orange-200 text-orange-800';
      case 'emergency':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const getQueuePosition = (patient: Patient) => {
    if (patient.status !== 'waiting') return null;
    const departmentPatients = patients
      .filter((p) => p.department === patient.department && p.status === 'waiting')
      .sort((a, b) => {
        const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    return departmentPatients.findIndex((p) => p.id === patient.id) + 1;
  };

  const getEstimatedTime = (patient: Patient) => {
    if (patient.status !== 'waiting') return null;
    const department = departments.find((d) => d.name === patient.department);
    if (!department) return null;

    let baseTime = department.averageWaitTime;
    const position = getQueuePosition(patient);

    switch (patient.priority) {
      case 'low':
        baseTime *= 1.5;
        break;
      case 'medium':
        baseTime *= 1;
        break;
      case 'high':
        baseTime *= 0.7;
        break;
      case 'emergency':
        baseTime *= 0.3;
        break;
    }

    if (position) baseTime *= position / 2;

    return Math.max(1, Math.round(baseTime));
  };

  const handleNotificationToggle = () => {
    if (searchResult?.patient?.status === 'waiting') {
      setNotifications(!notifications);
      if (notifications) {
        alert('Notifications turned off for your queue position.');
      } else {
        alert('You will be notified when it’s your turn. Check back or listen for updates!');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  const waitingPatients = patients
    .filter((p) => p.status === 'waiting')
    .sort((a, b) => {
      const priorityOrder = { emergency: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      return (a.estimatedWaitTime || 0) - (b.estimatedWaitTime || 0);
    });

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Live Queue Updates</h1>
        <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
      </div>

      {/* Patient Lookup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Track Your Position</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Enter your Patient ID"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
          />
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Find My Position
          </button>
        </div>

        <AnimatePresence>
          {searchResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4"
            >
              {searchResult.error ? (
                <p className="text-red-500">{searchResult.error}</p>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">{searchResult.patient.name}</h3>
                      <p className="text-gray-600">Patient ID: {searchResult.patient.id}</p>
                      <p className="text-gray-600">Department: {searchResult.patient.department}</p>
                      <p className="text-gray-600">
                        Priority:{' '}
                        <span
                          className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            searchResult.patient.priority
                          )}`}
                        >
                          {searchResult.patient.priority}
                        </span>
                      </p>
                    </div>
                    <div className="text-center mt-4 sm:mt-0">
                      {searchResult.patient.status === 'waiting' && (
                        <>
                          <div className="text-4xl font-bold text-blue-600">
                            {getQueuePosition(searchResult.patient)}
                          </div>
                          <p className="text-sm text-gray-600">Current Position</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div
                    className={`p-4 rounded-lg ${getStatusColor(searchResult.patient.status)} mb-4 shadow-sm`}
                  >
                    <p className="text-lg font-semibold">
                      Status: {searchResult.patient.status.replace('-', ' ').toUpperCase()}
                    </p>
                    {searchResult.patient.status === 'waiting' && (
                      <p className="text-sm mt-1">
                        Estimated wait time:{' '}
                        <strong>{getEstimatedTime(searchResult.patient) || 'N/A'} minutes</strong>
                      </p>
                    )}
                    {searchResult.patient.status === 'in-progress' && searchResult.patient.arrivalTime && (
                      <p className="text-sm mt-1">
                        Started at:{' '}
                        <strong>{format(parseISO(searchResult.patient.arrivalTime), 'h:mm a')}</strong>
                      </p>
                    )}
                  </div>

                  {searchResult.patient.status === 'in-progress' && searchResult.patient.arrivalTime && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="font-medium text-blue-800">
                        <Bell size={16} className="inline mr-2" />
                        Now Serving: You are currently being seen.
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Started at {format(parseISO(searchResult.patient.arrivalTime), 'h:mm a')}
                      </p>
                      <p className="text-sm text-blue-600 mt-1">
                        Please proceed to your assigned room in {searchResult.patient.department}.
                      </p>
                    </div>
                  )}

                  {searchResult.patient.status === 'waiting' && (
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center">
                        <Clock size={20} className="text-blue-500 mr-2" />
                        <span>
                          Estimated wait time:{' '}
                          <strong>{getEstimatedTime(searchResult.patient) || 'N/A'} minutes</strong>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="notifications"
                          checked={notifications}
                          onChange={handleNotificationToggle}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="notifications" className="text-sm">
                          Notify me when it's my turn
                        </label>
                      </div>
                    </div>
                  )}

                  {searchResult.patient.status === 'completed' && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <p className="font-medium text-green-800">
                        Your appointment has been completed. Thank you for visiting.
                      </p>
                    </div>
                  )}

                  {searchResult.patient.status === 'cancelled' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="font-medium text-red-800">
                        Your appointment has been cancelled. Please check with reception.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Current Queue Display */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-lg p-6 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Current Queue Status</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => (
            <motion.div
              key={dept.id}
              whileHover={{ scale: 1.02 }}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="font-semibold text-lg mb-2 text-gray-800">{dept.name}</h3>
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-600">Patients waiting: {dept.patientsWaiting}</span>
                <span className="text-gray-600">Avg. wait: {dept.averageWaitTime} min</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                <motion.div
                  className={`h-3 rounded-full ${
                    dept.currentLoad > 75
                      ? 'bg-red-500'
                      : dept.currentLoad > 50
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${dept.currentLoad}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <AnimatePresence>
                  {waitingPatients
                    .filter((p) => p.department === dept.name)
                    .map((patient, index) => (
                      <motion.div
                        key={patient.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`flex justify-between items-center p-2 rounded-md ${
                          index === 0 ? 'bg-blue-50' : 'bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            {getQueuePosition(patient) || index + 1}
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                              patient.priority
                            )}`}
                          >
                            {patient.priority}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          ~{getEstimatedTime(patient) || 'N/A'} min
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
                {waitingPatients.filter((p) => p.department === dept.name).length === 0 && (
                  <p className="text-sm text-gray-500 italic">No patients currently waiting</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Now Serving */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white rounded-lg shadow-lg p-6"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Now Serving</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {departments.map((dept) => {
            const inProgress = patients.filter(
              (p) => p.department === dept.name && p.status === 'in-progress' && p.arrivalTime
            );
            return (
              <motion.div
                key={dept.id}
                whileHover={{ scale: 1.02 }}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <h3 className="font-semibold text-lg mb-2 text-gray-800">{dept.name}</h3>
                {inProgress.length > 0 ? (
                  <div className="space-y-2">
                    <AnimatePresence>
                      {inProgress.map((patient) => (
                        <motion.div
                          key={patient.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="bg-blue-50 p-3 rounded-md"
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{patient.id}</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                                patient.priority
                              )}`}
                            >
                              {patient.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Started at {format(parseISO(patient.arrivalTime!), 'h:mm a')}
                          </p>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">No patients currently being served</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LiveQueue;