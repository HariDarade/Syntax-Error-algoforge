import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  username: string;
  role: 'patient' | 'admin' | 'hospital';
  email?: string;
  hospitalId?: string;
  hospitalName?: string;
  hospitalPhone?: string;
  employeeId?: string;
  staffDepartment?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string, loginType: 'patient' | 'hospital' | 'admin') => Promise<boolean>;
  signup: (
    username: string,
    password: string,
    email: string,
    type: 'patient' | 'hospital' | 'admin',
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
  isAuthenticated: boolean;
  isAdmin: boolean;
  isPatient: boolean;
  isHospital: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Error parsing stored user:', err);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (username: string, password: string, loginType: 'patient' | 'hospital' | 'admin'): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      if (
        (loginType === 'patient' && username === 'patient' && password === 'patient123') ||
        (loginType === 'hospital' && username === 'hospital' && password === 'hospital123') ||
        (loginType === 'admin' && username === 'admin' && password === 'admin123')
      ) {
        const authenticatedUser: User = { username, role: loginType };
        setUser(authenticatedUser);
        localStorage.setItem('user', JSON.stringify(authenticatedUser));
        return true;
      } else {
        setError('Invalid username or password');
        return false;
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    username: string,
    password: string,
    email: string,
    type: 'patient' | 'hospital' | 'admin',
    phoneNumber?: string,
    gender?: 'male' | 'female' | 'other',
    age?: number,
    diseases?: string[],
    employeeId?: string,
    staffDepartment?: string,
    hospitalId?: string,
    hospitalName?: string,
    hospitalPhone?: string
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '{}');
      if (existingUsers[username]) {
        setError('Username already exists');
        return false;
      }

      const newUser: User = { username, role: type, email };
      if (type === 'hospital') {
        newUser.employeeId = employeeId;
        newUser.staffDepartment = staffDepartment;
      } else if (type === 'admin') {
        newUser.hospitalId = hospitalId;
        newUser.hospitalName = hospitalName;
        newUser.hospitalPhone = hospitalPhone;
      }

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      existingUsers[username] = {
        username,
        password,
        email,
        role: type,
        ...(type === 'hospital' ? { employeeId, staffDepartment } : {}),
        ...(type === 'admin' ? { hospitalId, hospitalName, hospitalPhone } : {}),
      };
      localStorage.setItem('users', JSON.stringify(existingUsers));

      return true;
    } catch (err) {
      if (err instanceof Error && err.message.includes('exists')) {
        setError('Username or email already exists');
      } else {
        setError('Signup failed. Please try again.');
      }
      console.error('Signup error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isPatient: user?.role === 'patient',
    isHospital: user?.role === 'hospital',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};