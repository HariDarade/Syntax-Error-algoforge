import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface VirtualRoom {
  id: string;
  name: string;
  status: 'Available' | 'Occupied';
  department: string;
}

const VirtualRooms: React.FC = () => {
  const [rooms, setRooms] = useState<VirtualRoom[]>([
    { id: '1', name: 'Virtual Room 101', status: 'Available', department: 'General' },
    { id: '2', name: 'Virtual Room 102', status: 'Occupied', department: 'General' },
    { id: '3', name: 'Virtual Room 201', status: 'Available', department: 'Cardiology' },
  ]);

  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDepartment, setNewRoomDepartment] = useState('');

  const navigate = useNavigate();

  const joinRoom = (room: VirtualRoom) => {
    navigate(`/video-chat/${room.id}`);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoomName || !newRoomDepartment) {
      alert('Please fill in all fields.');
      return;
    }

    const newRoom: VirtualRoom = {
      id: (rooms.length + 1).toString(), // Simple ID generation (replace with UUID in production)
      name: newRoomName,
      status: 'Available',
      department: newRoomDepartment,
    };

    setRooms([...rooms, newRoom]);
    setNewRoomName('');
    setNewRoomDepartment('');
    setIsCreatingRoom(false);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Virtual Rooms</h1>
        <button
          onClick={() => setIsCreatingRoom(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          Create New Room
        </button>
      </div>

      {/* Create Room Form */}
      {isCreatingRoom && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Create New Virtual Room
          </h2>
          <form onSubmit={handleCreateRoom}>
            <div className="mb-4">
              <label
                htmlFor="roomName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Room Name
              </label>
              <input
                type="text"
                id="roomName"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="e.g., Virtual Room 301"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Department
              </label>
              <input
                type="text"
                id="department"
                value={newRoomDepartment}
                onChange={(e) => setNewRoomDepartment(e.target.value)}
                className="mt-1 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                placeholder="e.g., Neurology"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300"
              >
                Create Room
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingRoom(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rooms Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Room
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                  {room.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      room.status === 'Available'
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                    }`}
                  >
                    {room.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  {room.department}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <button
                    onClick={() => joinRoom(room)}
                    disabled={room.status !== 'Available'}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 ${
                      room.status === 'Available'
                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Join Room
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VirtualRooms;