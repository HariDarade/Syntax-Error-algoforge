import React from 'react';

interface AddPatientModalProps {
  showAddPatient: boolean;
  setShowAddPatient: (show: boolean) => void;
  newPatient: {
    name: string;
    department: string;
    priority: string;
  };
  setNewPatient: (patient: { name: string; department: string; priority: string }) => void;
  departments: any[];
  handleAddPatient: (e: React.FormEvent) => Promise<void>;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({
  showAddPatient,
  setShowAddPatient,
  newPatient,
  setNewPatient,
  departments,
  handleAddPatient,
}) => {
  return (
    <>
      {showAddPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Patient</h2>
            <form onSubmit={handleAddPatient}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                  Patient Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
                  Department
                </label>
                <select
                  id="department"
                  value={newPatient.department}
                  onChange={(e) => setNewPatient({ ...newPatient, department: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="priority">
                  Priority
                </label>
                <select
                  id="priority"
                  value={newPatient.priority}
                  onChange={(e) => setNewPatient({ ...newPatient, priority: e.target.value })}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div className="flex items-center justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddPatient(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPatientModal;