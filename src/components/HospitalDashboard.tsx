import React, { useEffect, useState } from 'react';
import { Building, Edit, Trash2, Plus, Search, Download, BarChart2 } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import toast, { Toaster } from 'react-hot-toast';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Hospital {
  username: string;
  email: string;
  role: 'patient' | 'admin' | 'hospital';
  hospitalId?: string;
  hospitalName?: string;
  hospitalPhone?: string;
  employeeId?: string;
  staffDepartment?: string;
  status?: 'Active' | 'Inactive';
}

interface AuditLogEntry {
  action: string;
  timestamp: string;
  details: string;
}

const HospitalDashboard: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('username');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editHospital, setEditHospital] = useState<Hospital | null>(null);
  const [newHospital, setNewHospital] = useState({
    username: '',
    email: '',
    password: '',
    hospitalId: '',
    hospitalName: '',
    hospitalPhone: '',
    employeeId: '',
    staffDepartment: '',
    status: 'Active' as 'Active' | 'Inactive',
  });
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    if (Object.keys(storedUsers).length === 0) {
      const sampleHospitals = {
        'hospital1': {
          username: 'hospital1',
          email: 'hospital1@example.com',
          password: 'hospital123',
          role: 'hospital',
          hospitalId: 'H001',
          hospitalName: 'City Hospital',
          hospitalPhone: '123-456-7890',
          employeeId: 'E001',
          staffDepartment: 'Cardiology',
          status: 'Active',
        },
        'hospital2': {
          username: 'hospital2',
          email: 'hospital2@example.com',
          password: 'hospital123',
          role: 'hospital',
          hospitalId: 'H002',
          hospitalName: 'Green Valley Hospital',
          hospitalPhone: '234-567-8901',
          employeeId: 'E002',
          staffDepartment: 'Neurology',
          status: 'Inactive',
        },
        'hospital3': {
          username: 'hospital3',
          email: 'hospital3@example.com',
          password: 'hospital123',
          role: 'hospital',
          hospitalId: 'H003',
          hospitalName: 'Sunrise Medical Center',
          hospitalPhone: '345-678-9012',
          employeeId: 'E003',
          staffDepartment: 'Pediatrics',
          status: 'Active',
        },
        'hospital4': {
          username: 'hospital4',
          email: 'hospital4@example.com',
          password: 'hospital123',
          role: 'hospital',
          hospitalId: 'H004',
          hospitalName: 'Lakeside Hospital',
          hospitalPhone: '456-789-0123',
          employeeId: 'E004',
          staffDepartment: 'Cardiology',
          status: 'Active',
        },
        'hospital5': {
          username: 'hospital5',
          email: 'hospital5@example.com',
          password: 'hospital123',
          role: 'hospital',
          hospitalId: 'H005',
          hospitalName: 'Riverfront Clinic',
          hospitalPhone: '567-890-1234',
          employeeId: 'E005',
          staffDepartment: 'Orthopedics',
          status: 'Inactive',
        },
      };
      localStorage.setItem('users', JSON.stringify(sampleHospitals));
    }

    fetchHospitals();
    const savedAuditLog = JSON.parse(localStorage.getItem('auditLog') || '[]');
    setAuditLog(savedAuditLog);
  }, []);

  const fetchHospitals = () => {
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    const hospitalList: Hospital[] = Object.values(storedUsers)
      .filter((user: Hospital) => user.role === 'hospital')
      .map((user: Hospital) => ({
        username: user.username,
        email: user.email,
        role: user.role,
        hospitalId: user.hospitalId,
        hospitalName: user.hospitalName,
        hospitalPhone: user.hospitalPhone,
        employeeId: user.employeeId,
        staffDepartment: user.staffDepartment,
        status: user.status || 'Active',
      }));
    setHospitals(hospitalList);
  };

  const addAuditLog = (action: string, details: string) => {
    const newEntry: AuditLogEntry = {
      action,
      timestamp: new Date().toLocaleString(),
      details,
    };
    const updatedLog = [newEntry, ...auditLog].slice(0, 10);
    setAuditLog(updatedLog);
    localStorage.setItem('auditLog', JSON.stringify(updatedLog));
  };

  const filteredHospitals = hospitals
    .filter(
      (hospital) =>
        (hospital.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
         hospital.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
         hospital.hospitalId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
         hospital.hospitalName?.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (departmentFilter ? hospital.staffDepartment === departmentFilter : true)
    )
    .sort((a, b) => {
      const key = sortBy as keyof Hospital;
      const aValue = a[key] || '';
      const bValue = b[key] || '';
      const comparison = aValue.toString().localeCompare(bValue.toString());
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleAddHospital = (e: React.FormEvent) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');

    if (storedUsers[newHospital.username]) {
      toast.error('Username already exists. Please choose a different username.');
      return;
    }

    const newHospitalData: Hospital = {
      username: newHospital.username,
      email: newHospital.email,
      role: 'hospital',
      hospitalId: newHospital.hospitalId,
      hospitalName: newHospital.hospitalName,
      hospitalPhone: newHospital.hospitalPhone,
      employeeId: newHospital.employeeId,
      staffDepartment: newHospital.staffDepartment,
      status: newHospital.status,
    };

    storedUsers[newHospital.username] = {
      ...newHospitalData,
      password: newHospital.password,
    };
    localStorage.setItem('users', JSON.stringify(storedUsers));
    fetchHospitals();
    setShowAddModal(false);
    setNewHospital({
      username: '',
      email: '',
      password: '',
      hospitalId: '',
      hospitalName: '',
      hospitalPhone: '',
      employeeId: '',
      staffDepartment: '',
      status: 'Active',
    });
    toast.success('Hospital added successfully!');
    addAuditLog('Add Hospital', `Added hospital: ${newHospital.username}`);
  };

  const handleEditHospital = (hospital: Hospital) => {
    setEditHospital(hospital);
    setShowEditModal(true);
  };

  const handleUpdateHospital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editHospital) return;

    const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
    storedUsers[editHospital.username] = {
      ...storedUsers[editHospital.username],
      email: editHospital.email,
      hospitalId: editHospital.hospitalId,
      hospitalName: editHospital.hospitalName,
      hospitalPhone: editHospital.hospitalPhone,
      employeeId: editHospital.employeeId,
      staffDepartment: editHospital.staffDepartment,
      status: editHospital.status,
    };
    localStorage.setItem('users', JSON.stringify(storedUsers));
    fetchHospitals();
    setShowEditModal(false);
    setEditHospital(null);
    toast.success('Hospital updated successfully!');
    addAuditLog('Edit Hospital', `Updated hospital: ${editHospital.username}`);
  };

  const handleDeleteHospital = (username: string) => {
    if (window.confirm(`Are you sure you want to delete the hospital "${username}"?`)) {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '{}');
      delete storedUsers[username];
      localStorage.setItem('users', JSON.stringify(storedUsers));
      fetchHospitals();
      toast.success('Hospital deleted successfully!');
      addAuditLog('Delete Hospital', `Deleted hospital: ${username}`);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Username', 'Email', 'Hospital ID', 'Hospital Name', 'Hospital Phone', 'Employee ID', 'Department', 'Status'];
    const rows = filteredHospitals.map((hospital) => [
      hospital.username,
      hospital.email,
      hospital.hospitalId || 'N/A',
      hospital.hospitalName || 'N/A',
      hospital.hospitalPhone || 'N/A',
      hospital.employeeId || 'N/A',
      hospital.staffDepartment || 'N/A',
      hospital.status || 'Active',
    ]);
    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'hospitals.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Hospital data exported successfully!');
    addAuditLog('Export CSV', 'Exported hospital data to CSV');
  };

  const departmentData = hospitals.reduce((acc, hospital) => {
    const dept = hospital.staffDepartment || 'Unknown';
    acc[dept] = (acc[dept] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const chartData = Object.entries(departmentData).map(([name, value]) => ({ name, value }));
  const statusData = hospitals.reduce(
    (acc, hospital) => {
      const status = hospital.status || 'Active';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    },
    { Active: 0, Inactive: 0 }
  );
  const statusChartData = Object.entries(statusData).map(([name, value]) => ({ name, value }));
  const COLORS = ['#4A90E2', '#28A745', '#FFBB28', '#FF8042', '#8884D8'];

  const departmentChartData = {
    labels: chartData.map((data) => data.name),
    datasets: [
      {
        data: chartData.map((data) => data.value),
        backgroundColor: COLORS,
        hoverBackgroundColor: COLORS,
      },
    ],
  };

  const statusChartDataForChartJS = {
    labels: statusChartData.map((data) => data.name),
    datasets: [
      {
        data: statusChartData.map((data) => data.value),
        backgroundColor: ['#4A90E2', '#FF8042'],
        hoverBackgroundColor: ['#4A90E2', '#FF8042'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#1A202C',
          font: {
            size: 12,
            family: "'Inter', sans-serif",
          },
        },
      },
      tooltip: {
        backgroundColor: '#FFFFFF',
        titleColor: '#1A202C',
        bodyColor: '#1A202C',
        borderColor: '#D3D3D3',
        borderWidth: 1,
      },
    },
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-inter bg-gray-100 text-gray-900">
      <Toaster position="top-right" />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hospital Management Dashboard</h1>
        </div>

        {/* Top Bar: Search, Filter, and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0 bg-white shadow-lg rounded-xl p-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-gray-900 border-gray-300"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full sm:w-48 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white text-gray-900 border-gray-300"
            >
              <option value="">Filter by Department</option>
              {Array.from(new Set(hospitals.map((h) => h.staffDepartment || 'Unknown'))).map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-md"
            >
              <Download className="h-5 w-5 mr-2" />
              Export CSV
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Hospital
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="shadow-lg rounded-xl p-6 bg-white transition-transform transform hover:scale-105 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 flex items-center text-gray-900">
              <BarChart2 className="h-5 w-5 mr-2 text-blue-600" />
              Statistics
            </h2>
            <p className="text-sm mb-2 text-gray-700">
              Total Hospitals: <span className="font-semibold">{hospitals.length}</span>
            </p>
            <p className="text-sm mb-2 text-gray-700">
              Active Hospitals: <span className="font-semibold">{statusData.Active}</span>
            </p>
            <p className="text-sm text-gray-700">
              Inactive Hospitals: <span className="font-semibold">{statusData.Inactive}</span>
            </p>
          </div>
          <div className="shadow-lg rounded-xl p-6 bg-white transition-transform transform hover:scale-105 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Hospitals by Department</h2>
            <div className="flex justify-center h-64">
              <Pie data={departmentChartData} options={chartOptions} />
            </div>
          </div>
          <div className="shadow-lg rounded-xl p-6 bg-white transition-transform transform hover:scale-105 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 text-gray-900">Hospital Status Distribution</h2>
            <div className="flex justify-center h-64">
              <Pie data={statusChartDataForChartJS} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Add Hospital Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-xl p-8 w-full max-w-3xl bg-white text-gray-900 animate-fade-in shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Add New Hospital</h2>
              <form onSubmit={handleAddHospital}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={newHospital.username}
                        onChange={(e) => setNewHospital({ ...newHospital, username: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="username"
                        aria-label="Username"
                      />
                      <label
                        htmlFor="username"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.username ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Username
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={newHospital.password}
                        onChange={(e) => setNewHospital({ ...newHospital, password: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="password"
                        aria-label="Password"
                      />
                      <label
                        htmlFor="password"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.password ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={newHospital.email}
                        onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="email"
                        aria-label="Email"
                      />
                      <label
                        htmlFor="email"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.email ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={newHospital.hospitalId}
                        onChange={(e) => setNewHospital({ ...newHospital, hospitalId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="hospitalId"
                        aria-label="Hospital ID"
                      />
                      <label
                        htmlFor="hospitalId"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.hospitalId ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital ID
                      </label>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        value={newHospital.hospitalName}
                        onChange={(e) => setNewHospital({ ...newHospital, hospitalName: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="hospitalName"
                        aria-label="Hospital Name"
                      />
                      <label
                        htmlFor="hospitalName"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.hospitalName ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital Name
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="tel"
                        value={newHospital.hospitalPhone}
                        onChange={(e) => setNewHospital({ ...newHospital, hospitalPhone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="hospitalPhone"
                        aria-label="Hospital Phone"
                      />
                      <label
                        htmlFor="hospitalPhone"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.hospitalPhone ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital Phone
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={newHospital.employeeId}
                        onChange={(e) => setNewHospital({ ...newHospital, employeeId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="employeeId"
                        aria-label="Employee ID"
                      />
                      <label
                        htmlFor="employeeId"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.employeeId ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Employee ID
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={newHospital.staffDepartment}
                        onChange={(e) => setNewHospital({ ...newHospital, staffDepartment: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="staffDepartment"
                        aria-label="Department"
                      />
                      <label
                        htmlFor="staffDepartment"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.staffDepartment ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Department
                      </label>
                    </div>
                  </div>
                </div>
                {/* Status Field (Full Width) */}
                <div className="mt-6">
                  <div className="relative">
                    <select
                      value={newHospital.status}
                      onChange={(e) => setNewHospital({ ...newHospital, status: e.target.value as 'Active' | 'Inactive' })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-gray-50 text-gray-900 border-gray-300"
                      id="status"
                      aria-label="Status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <label
                      htmlFor="status"
                      className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${newHospital.status ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                    >
                      Status
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Add Hospital
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Hospital Modal */}
        {showEditModal && editHospital && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="rounded-xl p-8 w-full max-w-3xl bg-white text-gray-900 animate-fade-in shadow-2xl">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Edit Hospital</h2>
              <form onSubmit={handleUpdateHospital}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="text"
                        disabled
                        value={editHospital.username}
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100 text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-username"
                        aria-label="Username"
                      />
                      <label
                        htmlFor="edit-username"
                        className="absolute left-4 -top-6 text-xs text-blue-500"
                      >
                        Username
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={editHospital.email}
                        onChange={(e) => setEditHospital({ ...editHospital, email: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-email"
                        aria-label="Email"
                      />
                      <label
                        htmlFor="edit-email"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.email ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Email
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={editHospital.hospitalId || ''}
                        onChange={(e) => setEditHospital({ ...editHospital, hospitalId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-hospitalId"
                        aria-label="Hospital ID"
                      />
                      <label
                        htmlFor="edit-hospitalId"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.hospitalId ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital ID
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={editHospital.hospitalName || ''}
                        onChange={(e) => setEditHospital({ ...editHospital, hospitalName: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-hospitalName"
                        aria-label="Hospital Name"
                      />
                      <label
                        htmlFor="edit-hospitalName"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.hospitalName ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital Name
                      </label>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="tel"
                        value={editHospital.hospitalPhone || ''}
                        onChange={(e) => setEditHospital({ ...editHospital, hospitalPhone: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-hospitalPhone"
                        aria-label="Hospital Phone"
                      />
                      <label
                        htmlFor="edit-hospitalPhone"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.hospitalPhone ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Hospital Phone
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={editHospital.employeeId || ''}
                        onChange={(e) => setEditHospital({ ...editHospital, employeeId: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-employeeId"
                        aria-label="Employee ID"
                      />
                      <label
                        htmlFor="edit-employeeId"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.employeeId ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Employee ID
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={editHospital.staffDepartment || ''}
                        onChange={(e) => setEditHospital({ ...editHospital, staffDepartment: e.target.value })}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-white text-gray-900 border-gray-300"
                        placeholder=" "
                        id="edit-staffDepartment"
                        aria-label="Department"
                      />
                      <label
                        htmlFor="edit-staffDepartment"
                        className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.staffDepartment ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                      >
                        Department
                      </label>
                    </div>
                  </div>
                </div>
                {/* Status Field (Full Width) */}
                <div className="mt-6">
                  <div className="relative">
                    <select
                      value={editHospital.status}
                      onChange={(e) => setEditHospital({ ...editHospital, status: e.target.value as 'Active' | 'Inactive' })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all peer bg-gray-50 text-gray-900 border-gray-300"
                      id="edit-status"
                      aria-label="Status"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <label
                      htmlFor="edit-status"
                      className={`absolute left-4 top-2 text-gray-500 transition-all duration-200 peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-6 peer-focus:text-xs peer-focus:text-blue-500 ${editHospital.status ? '-top-6 text-xs text-blue-500' : 'top-2 text-sm'}`}
                    >
                      Status
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all"
                  >
                    Update Hospital
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Hospital List */}
        <div className="shadow-lg rounded-xl bg-white animate-fade-in">
          <div className="px-6 py-5">
            <h2 className="text-lg font-bold text-gray-900">Registered Hospitals</h2>
            <p className="mt-1 text-sm text-gray-600">
              List of all hospitals in the MediQueue system.
            </p>
          </div>
          {filteredHospitals.length === 0 ? (
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600">No hospitals found.</p>
            </div>
          ) : (
            <div className="border-t border-gray-200 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="sticky top-0 bg-gray-100 z-10">
                  <tr>
                    {[
                      { key: 'username', label: 'Username' },
                      { key: 'email', label: 'Email' },
                      { key: 'hospitalId', label: 'Hospital ID' },
                      { key: 'hospitalName', label: 'Hospital Name' },
                      { key: 'hospitalPhone', label: 'Hospital Phone' },
                      { key: 'employeeId', label: 'Employee ID' },
                      { key: 'staffDepartment', label: 'Department' },
                      { key: 'status', label: 'Status' },
                    ].map((col) => (
                      <th
                        key={col.key}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-200 transition-colors"
                        onClick={() => {
                          setSortBy(col.key);
                          setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                        }}
                      >
                        {col.label} {sortBy === col.key && (sortOrder === 'asc' ? '↑' : '↓')}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-gray-200">
                  {filteredHospitals.map((hospital) => (
                    <tr key={hospital.username} className="transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hospital.username}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.hospitalId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.hospitalName || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.hospitalPhone || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.employeeId || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{hospital.staffDepartment || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            hospital.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {hospital.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditHospital(hospital)}
                          className="text-blue-600 hover:text-blue-800 mr-4 transition-colors"
                          title="Edit Hospital"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteHospital(hospital.username)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete Hospital"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log */}
        <div className="mt-8 shadow-lg rounded-xl p-6 bg-white animate-fade-in">
          <h2 className="text-lg font-bold mb-4 text-gray-900">Audit Log (Last 10 Actions)</h2>
          {auditLog.length === 0 ? (
            <p className="text-sm text-gray-600">No actions recorded yet.</p>
          ) : (
            <ul className="space-y-2">
              {auditLog.map((entry, index) => (
                <li key={index} className="text-sm text-gray-700">
                  <span className="font-semibold">{entry.timestamp}</span> - {entry.action}: {entry.details}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        .font-inter {
          font-family: 'Inter', sans-serif;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        /* Custom Scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #F5F7FA;
        }

        ::-webkit-scrollbar-thumb {
          background: #A0AEC0;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #718096;
        }
      `}</style>
    </div>
  );
};

export default HospitalDashboard;