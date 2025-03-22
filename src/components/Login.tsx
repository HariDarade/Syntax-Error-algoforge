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
  const [hospitalId, setHospitalId] = useState<string>('');
  const [hospitalName, setHospitalName] = useState<string>('');
  const [hospitalPhone, setHospitalPhone] = useState<string>('');
  const [loginType, setLoginType] = useState<'patient' | 'hospital' | 'admin'>('patient');
  const [isSignup, setIsSignup] = useState<boolean>(false);

  const { login, signup, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname ||
    (loginType === 'hospital' ? '/hospital-dashboard' :
      loginType === 'admin' ? '/admin' : '/patient-dashboard');

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
    if (!username || !password || !email || (loginType === 'hospital' && !employeeId)) return;

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
      loginType === 'hospital' ? employeeId : undefined,
      loginType === 'hospital' ? staffDepartment || undefined : undefined,
      loginType === 'admin' ? hospitalId : undefined,
      loginType === 'admin' ? hospitalName || undefined : undefined,
      loginType === 'admin' ? hospitalPhone || undefined : undefined
    );
    if (success) {
      navigate(from, { replace: true });
    }
  };

  const toggleLoginType = (type: 'patient' | 'hospital' | 'admin') => {
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
    setHospitalId('');
    setHospitalName('');
    setHospitalPhone('');
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
    setHospitalId('');
    setHospitalName('');
    setHospitalPhone('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-500 hover:shadow-3xl">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-blue-600 animate-pulse" />
          </div>
          <h2 className="mt-6 text-4xl font-extrabold text-gray-900 tracking-tight">
            MediQueue
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            {isSignup
              ? (loginType === 'patient' ? 'Patient Registration' :
                loginType === 'hospital' ? 'Admin Registration' : 'Staff Registration') // Changed "Hospital" to "Admin"
              : (loginType === 'patient' ? 'Patient Portal Login' :
                loginType === 'hospital' ? 'Admin Portal Login' : 'Staff Portal Login') // Changed "Hospital" to "Admin"
            }
          </p>
        </div>

        {/* Role Selection Buttons */}
        <div className="flex justify-center space-x-4 mt-6">
          {['patient', 'hospital', 'admin'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => toggleLoginType(type as 'patient' | 'hospital' | 'admin')}
              className={`px-4 py-2 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${loginType === type
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
              {type === 'patient' ? 'Patient' : type === 'hospital' ? 'Admin' : 'Staff'} {/* Changed "Hospital" to "Admin" */}
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="space-y-4">
            {/* Username Field */}
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
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Email Field (Signup Only) */}
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
                      className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                </div>

                {/* Patient-Specific Fields */}
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Diseases (comma-separated, optional)"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Admin-Specific Fields (Previously Hospital) */}
                {loginType === 'hospital' && (
                  <>
                    <div>
                      <label htmlFor="employeeId" className="sr-only">Admin ID</label> {/* Changed "Employee ID" to "Admin ID" */}
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Admin ID" // Changed "Employee ID" to "Admin ID"
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Department (optional)"
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* Staff-Specific Fields (Previously Admin) */}
                {loginType === 'admin' && (
                  <>
                    <div>
                      <label htmlFor="hospitalId" className="sr-only">Staff ID</label> {/* Changed "Admin ID" to "Staff ID" */}
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Staff ID" // Changed "Admin ID" to "Staff ID"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hospitalName" className="sr-only">Staff Name</label> {/* Changed "Admin Name" to "Staff Name" */}
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Staff Name (optional)" // Changed "Admin Name" to "Staff Name"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="hospitalPhone" className="sr-only">Staff Phone</label> {/* Changed "Admin Phone" to "Staff Phone" */}
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
                          className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                          placeholder="Staff Phone (optional)" // Changed "Admin Phone" to "Staff Phone"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}

            {/* Password Field */}
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
                  className="appearance-none relative block w-full px-3 py-3 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg animate-fade-in" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-all duration-300 transform hover:scale-105 ${loading ? 'animate-pulse' : ''
                }`}
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSignup ? (
                  <UserPlus className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors duration-300" />
                ) : (
                  <LogIn className="h-5 w-5 text-blue-200 group-hover:text-blue-300 transition-colors duration-300" />
                )}
              </span>
              {loading ? (isSignup ? 'Registering...' : 'Logging in...') : (isSignup ? 'Sign Up' : 'Sign In')}
            </button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center text-sm">
            <button
              type="button"
              onClick={toggleAuthMode}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
            >
              {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign up"}
            </button>
          </div>

          {/* Demo Credentials */}
          {!isSignup && (
            <div className="text-center text-sm bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-600 font-medium">
                {loginType === 'patient' ? (
                  <>For demo, use: <span className="font-semibold text-blue-600">patient / patient123</span></>
                ) : loginType === 'hospital' ? (
                  <>For demo, use: <span className="font-semibold text-blue-600">admin / admin123</span></> // Changed "hospital / hospital123" to "admin / admin123"
                ) : (
                  <>For demo, use: <span className="font-semibold text-blue-600">staff / staff123</span></> // Changed "admin / admin123" to "staff / staff123"
                )}
              </p>
            </div>
          )}
        </form>
      </div>

      {/* Custom CSS for Animations and Styling */}
      <style>{`
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

        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 1.5s infinite;
        }

        .shadow-3xl {
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
        }

        input:focus, select:focus {
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        button:disabled {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default Login;