import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  username: string;
  role: 'patient' | 'hospital' | 'admin' | 'staff'; // Added 'staff' role
  email?: string;
  phoneNumber?: string;
  gender?: 'male' | 'female' | 'other';
  age?: number;
  diseases?: string[];
  employeeId?: string;
  staffDepartment?: string;
  hospitalId?: string;
  hospitalName?: string;
  hospitalPhone?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isHospital: boolean;
  isStaff: boolean; // Added for staff role checks
  login: (username: string, password: string, role: 'patient' | 'hospital' | 'admin' | 'staff') => Promise<boolean>;
  signup: (
    username: string,
    password: string,
    email: string,
    role: 'patient' | 'hospital' | 'admin' | 'staff',
    phoneNumber?: string,
    gender?: 'male' | 'female' | 'other',
    age?: number,
    diseases?: string[],
    employeeId?: string,
    staffDepartment?: string,
    hospitalId?: string,
    hospitalName?: string,
    hospitalPhone?: string
  ) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const demoUsers: User[] = [
    { username: 'patient', role: 'patient', email: 'patient@example.com' },
    { username: 'hospital', role: 'hospital', email: 'hospital@example.com' }, // Renamed 'admin' to 'hospital' for clarity
    { username: 'admin', role: 'admin', email: 'admin@example.com' }, // Added true admin user
    { username: 'staff', role: 'staff', email: 'staff@example.com' }, // Fixed role to 'staff'
  ];

  const demoPasswords: { [key: string]: string } = {
    patient: 'patient123',
    hospital: 'hospital123', // Updated to match new username
    admin: 'admin123',
    staff: 'staff123',
  };

  // Handle redirection when user state changes
  useEffect(() => {
    console.log('User state changed:', user);
    if (user) {
      console.log('Redirecting based on role:', user.role);
      switch (user.role) {
        case 'patient':
          navigate('/patient-dashboard', { replace: true });
          break;
        case 'hospital':
          navigate('/hospital-dashboard', { replace: true });
          break;
        case 'admin':
          navigate('/admin', { replace: true });
          break;
        case 'staff':
          navigate('/staff-dashboard', { replace: true }); // Added staff redirection
          break;
        default:
          navigate('/', { replace: true });
      }
    } else {
      const publicRoutes = ['/', '/get-started', '/login', '/about'];
      if (!publicRoutes.includes(location.pathname)) {
        console.log('User not authenticated, redirecting to /login');
        navigate('/login', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);

  const login = async (username: string, password: string, role: 'patient' | 'hospital' | 'admin' | 'staff') => {
    setLoading(true);
    setError(null);

    try {
      console.log('Attempting login for:', username, role); // Debug log
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const foundUser = demoUsers.find(
        (u) => u.username === username && u.role === role
      );

      if (!foundUser) {
        throw new Error('User not found');
      }

      if (demoPasswords[username] !== password) {
        throw new Error('Invalid password');
      }

      console.log('User found:', foundUser); // Debug log
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));

      return true;
    } catch (err: any) {
      console.error('Login error:', err.message); // Debug log
      setError(err.message || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    username: string,
    password: string,
    email: string,
    role: 'patient' | 'hospital' | 'admin' | 'staff',
    phoneNumber?: string,
    gender?: 'male' | 'female' | 'other',
    age?: number,
    diseases?: string[],
    employeeId?: string,
    staffDepartment?: string,
    hospitalId?: string,
    hospitalName?: string,
    hospitalPhone?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (demoUsers.some((u) => u.username === username)) {
        throw new Error('Username already exists');
      }

      const newUser: User = {
        username,
        role,
        email,
        ...(role === 'patient' && {
          phoneNumber,
          gender,
          age,
          diseases,
        }),
        ...(role === 'hospital' && {
          employeeId,
          staffDepartment,
        }),
        ...(role === 'admin' && {
          hospitalId,
          hospitalName,
          hospitalPhone,
        }),
        ...(role === 'staff' && { // Added staff-specific fields
          employeeId,
          staffDepartment,
        }),
      };

      demoUsers.push(newUser);
      demoPasswords[username] = password;

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      return true;
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isHospital = user?.role === 'hospital';
  const isStaff = user?.role === 'staff'; // Added for staff role checks

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isHospital,
        isStaff, // Added to context
        login,
        signup,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};