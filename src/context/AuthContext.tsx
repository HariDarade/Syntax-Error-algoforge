import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface User {
  username: string;
  role: 'patient' | 'hospital' | 'admin';
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
  login: (username: string, password: string, role: 'patient' | 'hospital' | 'admin') => Promise<boolean>;
  signup: (
    username: string,
    password: string,
    email: string,
    role: 'patient' | 'hospital' | 'admin',
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
    { username: 'admin', role: 'hospital', email: 'admin@example.com' },
    { username: 'staff', role: 'admin', email: 'staff@example.com' },
  ];

  const demoPasswords: { [key: string]: string } = {
    patient: 'patient123',
    admin: 'admin123',
    staff: 'staff123',
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      if (parsedUser.role === 'patient' && location.pathname === '/login') {
        navigate('/patient-dashboard');
      } else if (parsedUser.role === 'hospital' && location.pathname === '/login') {
        navigate('/hospital-dashboard');
      } else if (parsedUser.role === 'admin' && location.pathname === '/login') {
        navigate('/admin');
      }
    } else {
      const publicRoutes = ['/', '/get-started', '/login', '/about'];
      if (!publicRoutes.includes(location.pathname)) {
        navigate('/login', { replace: true });
      }
    }
  }, [navigate, location.pathname]);

  const login = async (username: string, password: string, role: 'patient' | 'hospital' | 'admin') => {
    setLoading(true);
    setError(null);

    try {
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

      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));

      if (foundUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (foundUser.role === 'hospital') {
        navigate('/hospital-dashboard');
      } else if (foundUser.role === 'admin') {
        navigate('/admin');
      }

      return true;
    } catch (err: any) {
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
    role: 'patient' | 'hospital' | 'admin',
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
      };

      demoUsers.push(newUser);
      demoPasswords[username] = password;

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      if (newUser.role === 'patient') {
        navigate('/patient-dashboard');
      } else if (newUser.role === 'hospital') {
        navigate('/hospital-dashboard');
      } else if (newUser.role === 'admin') {
        navigate('/admin');
      }

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

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        isHospital,
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