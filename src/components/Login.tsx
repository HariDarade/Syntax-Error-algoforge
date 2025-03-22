import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, User, Lock, LogIn, UserPlus, Phone, Users, Calendar, Briefcase, Building } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | 'other' | ''>('');
  const [age, setAge] = useState<string>('');
  const [diseases, setDiseases] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<string>('');
  const [staffDepartment, setStaffDepartment] = useState<string>('');
  const [hospitalId, setHospitalId] = useState<string>(''); // Added for hospital signup
  const [hospitalName, setHospitalName] = useState<string>(''); // Added for hospital signup
  const [hospitalPhone, setHospitalPhone] = useState<string>(''); // Added for hospital signup
  const [loginType, setLoginType] = useState<'patient' | 'hospital' | 'admin'>('patient'); // Swapped admin and hospital
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const { login, signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || 
    (loginType === 'hospital' ? '/hospital-dashboard' : // Swapped admin to hospital
     loginType === 'admin' ? '/admin' : '/patient-dashboard'); // Swapped hospital to admin

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    const success = await login(username, password, loginType);
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !email || (loginType === 'hospital' && !employeeId)) return; // Swapped admin to hospital

    const diseasesArray = diseases ? diseases.split(',').map(d => d.trim()) : [];
    const ageNumber = age ? parseInt(age) : undefined;

    const success = await signup(
      username,
      password,
      email,
      loginType,
      loginType === 'patient' ? phoneNumber || undefined : undefined,
      loginType === 'patient' ? (gender || undefined) : undefined,
      loginType === 'patient' ? ageNumber : undefined,
      loginType === 'patient' && diseasesArray.length > 0 ? diseasesArray : undefined,
      loginType === 'hospital' ? employeeId : undefined, // Swapped admin to hospital
      loginType === 'hospital' ? staffDepartment || undefined : undefined, // Swapped admin to hospital
      loginType === 'admin' ? hospitalId : undefined, // Swapped hospital to admin
      loginType === 'admin' ? hospitalName || undefined : undefined, // Swapped hospital to admin
      loginType === 'admin' ? hospitalPhone || undefined : undefined // Swapped hospital to admin
    );
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const toggleLoginType = (type: 'patient' | 'hospital' | 'admin') => { // Swapped admin and hospital
    setLoginType(type);
    setUsername('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setGender('');
    setAge('');
    setDiseases('');
    setEmployeeId('');
    setStaffDepartment('');
    setHospitalId(''); // Added
    setHospitalName(''); // Added
    setHospitalPhone(''); // Added
  };

  const toggleAuthMode = () => {
    setIsSignup(!isSignup);
    setUsername('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setGender('');
    setAge('');
    setDiseases('');
    setEmployeeId('');
    setStaffDepartment('');
    setHospitalId(''); // Added
    setHospitalName(''); // Added
    setHospitalPhone(''); // Added
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">MediQueue</h2>
          <p className="mt-2 text-sm text-gray-600">
            {isSignup 
              ? (loginType === 'patient' ? 'Patient Registration' : 
                 loginType === 'hospital' ? 'Hospital Registration' : 'Staff Registration') // Swapped admin to hospital, hospital to admin
              : (loginType === 'patient' ? 'Patient Portal Login' : 
                 loginType === 'hospital' ? 'Hospital Portal Login' : 'Staff Portal Login') // Swapped admin to hospital, hospital to admin
            }
          </p>
        </div>

        <div className="flex justify-center space-x-4 mt-4">
          <button
            type="button"
            onClick={() => toggleLoginType('patient')}
            className={`px-4 py-2 rounded-md ${
              loginType === 'patient'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            onClick={() => toggleLoginType('hospital')} // Swapped admin to hospital
            className={`px-4 py-2 rounded-md ${
              loginType === 'hospital'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Hospital
          </button>
          <button
            type="button"
            onClick={() => toggleLoginType('admin')} // Swapped hospital to admin
            className={`px-4 py-2 rounded-md ${
              loginType === 'admin'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Staff
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>
            {isSignup && (
              <>
                <div>
                  <label htmlFor="email" className="sr-only">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                </div>
                {loginType === 'patient' && (
                  <>
                    <div>
                      <label htmlFor="phoneNumber" className="sr-only">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Phone Number (optional)"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="gender" className="sr-only">Gender</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Users className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                          id="gender"
                          name="gender"
                          value={gender}
                          onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'other' | '')}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        >
                          <option value="">Select Gender (optional)</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="age" className="sr-only">Age</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Calendar className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="age"
                          name="age"
                          type="number"
                          min="1"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Age (optional)"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="diseases" className="sr-only">Diseases</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="diseases"
                          name="diseases"
                          type="text"
                          value={diseases}
                          onChange={(e) => setDiseases(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Diseases (comma-separated, optional)"
                        />
                      </div>
                    </div>
                  </>
                )}
                {loginType === 'hospital' && ( // Swapped admin to hospital
                  <>
                    <div>
                      <label htmlFor="employeeId" className="sr-only">Employee ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Briefcase className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="employeeId"
                          name="employeeId"
                          type="text"
                          required
                          value={employeeId}
                          onChange={(e) => setEmployeeId(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Employee ID"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="staffDepartment" className="sr-only">Department</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Activity className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="staffDepartment"
                          name="staffDepartment"
                          type="text"
                          value={staffDepartment}
                          onChange={(e) => setStaffDepartment(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Department (optional)"
                        />
                      </div>
                    </div>
                  </>
                )}
                {loginType === 'admin' && ( // Swapped hospital to admin
                  <>
                    <div>
                      <label htmlFor="hospitalId" className="sr-only">Admin ID</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="hospitalId"
                          name="hospitalId"
                          type="text"
                          required
                          value={hospitalId}
                          onChange={(e) => setHospitalId(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Admin ID"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hospitalName" className="sr-only">Admin Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Building className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="hospitalName"
                          name="hospitalName"
                          type="text"
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Admin Name (optional)"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hospitalPhone" className="sr-only">Admin Phone</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="hospitalPhone"
                          name="hospitalPhone"
                          type="tel"
                          value={hospitalPhone}
                          onChange={(e) => setHospitalPhone(e.target.value)}
                          className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="Admin Phone (optional)"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pl-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSignup ? (
                  <UserPlus className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                ) : (
                  <LogIn className="h-5 w-5 text-blue-500 group-hover:text-blue-400" />
                )}
              </span>
              {loading ? (isSignup ? 'Registering...' : 'Logging in...') : (isSignup ? 'Sign up' : 'Sign in')}
            </button>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-600 hover:text-blue-800"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>

          {!isSignup && (
            <div className="text-center text-sm">
              <p className="text-gray-600">
                {loginType === 'patient' ? (
                  <>For demo, use: <span className="font-semibold">patient / patient123</span></>
                ) : loginType === 'hospital' ? ( // Swapped admin to hospital
                  <>For demo, use: <span className="font-semibold">hospital / hospital123</span></>
                ) : (
                  <>For demo, use: <span className="font-semibold">admin / admin123</span></> // Swapped hospital to admin
                )}
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;