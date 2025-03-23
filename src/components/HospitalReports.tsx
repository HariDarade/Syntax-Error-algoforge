import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RefreshCw } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const HospitalReports: React.FC = () => {
  const [reports, setReports] = useState<any[]>([]); // Hospital reports data
  const [requests, setRequests] = useState<any[]>([]); // Hospital requests data
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]); // Track selected request IDs
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();

  // Mock data for hospital reports
  const mockReports = [
    {
      id: '1',
      hospital: 'City Hospital',
      date: '2025-03-22',
      patientInflow: 120,
      resourceUsage: '80%',
      staffAllocation: '90%',
      status: 'Normal',
      currentOccupancy: 240,
      bedCapacity: 300,
    },
    {
      id: '2',
      hospital: 'Green Valley Medical Center',
      date: '2025-03-22',
      patientInflow: 95,
      resourceUsage: '65%',
      staffAllocation: '85%',
      status: 'Stable',
      currentOccupancy: 130,
      bedCapacity: 200,
    },
    {
      id: '3',
      hospital: 'Sunrise Clinic',
      date: '2025-03-22',
      patientInflow: 80,
      resourceUsage: '70%',
      staffAllocation: '75%',
      status: 'Critical',
      currentOccupancy: 90,
      bedCapacity: 100,
    },
    {
      id: '4',
      hospital: 'Northside General Hospital',
      date: '2025-03-22',
      patientInflow: 110,
      resourceUsage: '85%',
      staffAllocation: '80%',
      status: 'Normal',
      currentOccupancy: 200,
      bedCapacity: 250,
    },
    {
      id: '5',
      hospital: 'Westside Medical Center',
      date: '2025-03-22',
      patientInflow: 100,
      resourceUsage: '75%',
      staffAllocation: '90%',
      status: 'Stable',
      currentOccupancy: 180,
      bedCapacity: 220,
    },
  ];

  // Mock data for hospital requests
  const mockRequests = [
    {
      id: '1',
      hospital: 'City Hospital',
      requestType: 'Resource Request',
      quantity: 50,
      status: 'Pending',
      date: '2025-03-22',
    },
    {
      id: '2',
      hospital: 'Green Valley Medical Center',
      requestType: 'Staff Request',
      quantity: 10,
      status: 'Pending',
      date: '2025-03-22',
    },
    {
      id: '3',
      hospital: 'Sunrise Clinic',
      requestType: 'Resource Request',
      quantity: 30,
      status: 'Approved',
      date: '2025-03-21',
    },
    {
      id: '4',
      hospital: 'Northside General Hospital',
      requestType: 'Staff Request',
      quantity: 15,
      status: 'Denied',
      date: '2025-03-20',
    },
    {
      id: '5',
      hospital: 'Westside Medical Center',
      requestType: 'Resource Request',
      quantity: 20,
      status: 'Pending',
      date: '2025-03-22',
    },
  ];

  // Function to simulate fetching hospital reports
  const fetchReports = async () => {
    setReports(mockReports);
  };

  // Function to simulate fetching hospital requests
  const fetchRequests = async () => {
    setRequests(mockRequests);
  };

  // Function to handle both fetches
  const fetchData = async () => {
    await Promise.all([fetchReports(), fetchRequests()]);
    setLastUpdated(new Date());
  };

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Auto-refreshing hospital reports and requests...');
      fetchData();
    }, 30000); // 30 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Function to create pie chart data for a hospital (using raw values)
  const getPieChartData = (report: any) => {
    const resourceUsage = parseInt(report.resourceUsage);
    const staffAllocation = parseInt(report.staffAllocation);
    const bedOccupancy = (report.currentOccupancy / report.bedCapacity) * 100;

    return {
      labels: ['Patient Inflow', 'Resource Usage', 'Staff Allocation', 'Bed Occupancy'],
      datasets: [
        {
          data: [report.patientInflow, resourceUsage, staffAllocation, bedOccupancy],
          backgroundColor: [
            'rgba(54, 162, 235, 0.6)', // Blue for Patient Inflow
            'rgba(255, 99, 132, 0.6)', // Red for Resource Usage
            'rgba(75, 192, 192, 0.6)', // Teal for Staff Allocation
            'rgba(255, 206, 86, 0.6)', // Yellow for Bed Occupancy
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  // Handle selecting/unselecting a request
  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests((prev) =>
      prev.includes(requestId)
        ? prev.filter((id) => id !== requestId)
        : [...prev, requestId]
    );
  };

  // Handle selecting/unselecting all requests on the current page
  const handleSelectAll = () => {
    const currentPageRequests = paginatedRequests.map((req) => req.id);
    const allSelected = currentPageRequests.every((id) => selectedRequests.includes(id));
    if (allSelected) {
      setSelectedRequests((prev) =>
        prev.filter((id) => !currentPageRequests.includes(id))
      );
    } else {
      setSelectedRequests((prev) => [
        ...prev,
        ...currentPageRequests.filter((id) => !prev.includes(id)),
      ]);
    }
  };

  // Handle approving selected requests
  const handleApproveSelected = () => {
    setRequests((prev) =>
      prev.map((req) =>
        selectedRequests.includes(req.id) ? { ...req, status: 'Approved' } : req
      )
    );
    setSelectedRequests([]); // Clear selection after action
  };

  // Handle denying selected requests
  const handleDenySelected = () => {
    setRequests((prev) =>
      prev.map((req) =>
        selectedRequests.includes(req.id) ? { ...req, status: 'Denied' } : req
      )
    );
    setSelectedRequests([]); // Clear selection after action
  };

  // Pagination logic for hospital reports
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const paginatedReports = reports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Pagination logic for hospital requests
  const [requestsPage, setRequestsPage] = useState(1);
  const requestsPerPage = 5;
  const totalRequestsPages = Math.ceil(requests.length / requestsPerPage);
  const paginatedRequests = requests.slice(
    (requestsPage - 1) * requestsPerPage,
    requestsPage * requestsPerPage
  );

  return (
    <div className="p-6">
      {/* Hospital Reports Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Hospital Reports</h2>
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Last Updated: {lastUpdated.toLocaleTimeString()}
              </p>
              <button
                onClick={fetchData}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                <RefreshCw size={18} className="mr-2" />
                Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Patient Inflow
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Resource Usage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Staff Allocation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Metrics Distribution
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      <Link
                        to={`/hospital-details/${report.id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {report.hospital}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {report.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {report.patientInflow}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {report.resourceUsage}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {report.staffAllocation}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          report.status === 'Critical'
                            ? 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
                            : report.status === 'Stable'
                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                            : 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                        }`}
                      >
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-32 h-32">
                        <Pie
                          data={getPieChartData(report)}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                                labels: {
                                  color: document.documentElement.classList.contains('dark')
                                    ? '#e5e7eb'
                                    : '#374151',
                                },
                              },
                              tooltip: {
                                callbacks: {
                                  label: (context) => {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return `${label}: ${value.toFixed(1)}`;
                                  },
                                },
                              },
                            },
                            onClick: (event, elements) => {
                              if (elements.length > 0) {
                                navigate(`/hospital-details/${report.id}`);
                              }
                            },
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Reports */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Hospital Requests Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Hospital Requests</h2>
          <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
            <button
              onClick={handleApproveSelected}
              disabled={selectedRequests.length === 0}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-300 mb-2 sm:mb-0"
            >
              Approve Selected
            </button>
            <button
              onClick={handleDenySelected}
              disabled={selectedRequests.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 disabled:bg-gray-300"
            >
              Deny Selected
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    <input
                      type="checkbox"
                      checked={paginatedRequests.every((req) =>
                        selectedRequests.includes(req.id)
                      )}
                      onChange={handleSelectAll}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Hospital
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Request Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRequests.includes(request.id)}
                        onChange={() => handleSelectRequest(request.id)}
                        className="rounded"
                        disabled={request.status !== 'Pending'}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                      {request.hospital}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {request.requestType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {request.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          request.status === 'Pending'
                            ? 'bg-yellow-200 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-200'
                            : request.status === 'Approved'
                            ? 'bg-green-200 text-green-800 dark:bg-green-700 dark:text-green-200'
                            : 'bg-red-200 text-red-800 dark:bg-red-700 dark:text-red-200'
                        }`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                      {request.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls for Requests */}
          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => setRequestsPage((prev) => Math.max(prev - 1, 1))}
              disabled={requestsPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600 dark:text-gray-300">
              Page {requestsPage} of {totalRequestsPages}
            </span>
            <button
              onClick={() => setRequestsPage((prev) => Math.min(prev + 1, totalRequestsPages))}
              disabled={requestsPage === totalRequestsPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalReports;