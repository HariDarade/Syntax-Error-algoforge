import React, { useState } from 'react';
import { useQueue } from '../context/QueueContext';
import { 
  Users, 
  Clock, 
  PlayCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  PlusCircle 
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import StaffChatbot from './StaffChatbot';
import AddPatientModal from './AddPatientModal';

const StaffPanel: React.FC = () => {
  const { 
    patients, 
    departments, 
    loading, 
    error, 
    refreshData, 
    updatePatientStatus,
    addPatient
  } = useQueue();

  const [showAddPatient, setShowAddPatient] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    department: departments[0]?.name || '',
    priority: 'medium' as const
  });
  const [filter, setFilter] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  const handleAddPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatient.name || !newPatient.department) return;
    
    await addPatient(newPatient.name, newPatient.department, newPatient.priority);
    setNewPatient({
      name: '',
      department: departments[0]?.name || '',
      priority: 'medium'
    });
    setShowAddPatient(false);
  };

  const handleStatusChange = async (patientId: string, newStatus: string) => {
    await updatePatientStatus(patientId, newStatus as any);
  };

  const filteredPatients = patients.filter(patient => {
    if (filter === 'all') return true;
    return patient.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Staff Panel</h1>
        <div className="flex space-x-2">
          <button 
            onClick={refreshData}
            className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
          <button 
            onClick={() => setShowAddPatient(true)}
            className="flex items-center px-3 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <PlusCircle size={16} className="mr-2" />
            Add Patient
          </button>
          <Link 
            to="/inventory"
            className="flex items-center px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            <PlusCircle size={16} className="mr-2" />
            Manage Inventory
          </Link>
        </div>
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        showAddPatient={showAddPatient}
        setShowAddPatient={setShowAddPatient}
        newPatient={newPatient}
        setNewPatient={setNewPatient}
        departments={departments}
        handleAddPatient={handleAddPatient}
      />

      {/* Chatbot */}
      <StaffChatbot
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        patients={patients}
        departments={departments}
        addPatient={addPatient}
        updatePatientStatus={updatePatientStatus}
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <Users size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">Total Patients</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">{patients.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <Clock size={20} className="text-yellow-500 mr-2" />
            <h2 className="text-lg font-semibold">Waiting</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {patients.filter(p => p.status === 'waiting').length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <PlayCircle size={20} className="text-blue-500 mr-2" />
            <h2 className="text-lg font-semibold">In Progress</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {patients.filter(p => p.status === 'in-progress').length}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center mb-2">
            <CheckCircle size={20} className="text-green-500 mr-2" />
            <h2 className="text-lg font-semibold">Completed</h2>
          </div>
          <div className="text-3xl font-bold text-gray-800">
            {patients.filter(p => p.status === 'completed').length}
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Patient Queue</h2>
          <div className="flex space-x-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Patients</option>
              <option value="waiting">Waiting</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Arrival Time</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Queue Pos.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{patient.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{patient.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                      {patient.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(patient.priority)}`}>
                      {patient.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(parseISO(patient.arrivalTime), 'MMM d, h:mm a')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {patient.queuePosition || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      {patient.status === 'waiting' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'in-progress')}
                          className="text-blue-600 hover:text-blue-900"
                          title="Start"
                        >
                          <PlayCircle size={18} />
                        </button>
                      )}
                      {patient.status === 'in-progress' && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'completed')}
                          className="text-green-600 hover:text-green-900"
                          title="Complete"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {(patient.status === 'waiting' || patient.status === 'in-progress') && (
                        <button
                          onClick={() => handleStatusChange(patient.id, 'cancelled')}
                          className="text-red-600 hover:text-red-900"
                          title="Cancel"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Department Status */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Department Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept) => (
            <div key={dept.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">{dept.name}</h3>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-600">Current Load</p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                    <div 
                      className={`h-2.5 rounded-full ${
                        dept.currentLoad > 75 ? 'bg-red-500' : 
                        dept.currentLoad > 50 ? 'bg-yellow-500' : 'bg-green-500'
                      }`} 
                      style={{ width: `${dept.currentLoad}%` }}
                    ></div>
                  </div>
                  <span className="text-xs mt-1 inline-block">{dept.currentLoad}%</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Wait Time</p>
                    <p className="font-medium">{dept.averageWaitTime} min</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patients Waiting</p>
                    <p className="font-medium">{dept.patientsWaiting}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StaffPanel;