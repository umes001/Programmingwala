import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore session on page load
  useEffect(() => {
    const fetchMe = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setProfile(data.profile);
        } else {
          // Token expired or invalid
          logout();
        }
      } catch (err) {
        console.error('Session restore failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchMe();
  }, [token]);

  // Login handler
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Fetch detailed profile
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const meData = await meRes.json();
        if (meData.success) {
          setProfile(meData.profile);
        }
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setError(data.message || 'Invalid credentials');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Server connection failed. Try again.');
      setLoading(false);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Register handler
  const register = async (name, email, password, role, extra = {}) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, ...extra })
      });
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        
        // Fetch detailed profile
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const meData = await meRes.json();
        if (meData.success) {
          setProfile(meData.profile);
        }
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setError(data.message || 'Registration failed');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Server connection failed. Try again.');
      setLoading(false);
      return { success: false, message: 'Server connection failed.' };
    }
  };

  // Google Login handler
  const loginWithGoogle = async (googleUser = {}) => {
    setLoading(true);
    setError(null);
    try {
      const email = googleUser.email || `google_student_${Date.now().toString().slice(-4)}@pranidha.edu`;
      const name = googleUser.name || 'Google Student';
      const avatar = googleUser.avatar || '/clay_mascot.png';
      const role = googleUser.role || 'user';

      const res = await fetch('/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, avatar, role, googleId: googleUser.googleId })
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);

        // Fetch profile
        const meRes = await fetch('/api/auth/me', {
          headers: { Authorization: `Bearer ${data.token}` }
        });
        const meData = await meRes.json();
        if (meData.success) {
          setProfile(meData.profile);
        }
        setLoading(false);
        return { success: true, user: data.user };
      } else {
        setError(data.message || 'Google login failed');
        setLoading(false);
        return { success: false, message: data.message };
      }
    } catch (err) {
      setError('Google login connection failed. Try again.');
      setLoading(false);
      return { success: false, message: 'Google login connection failed.' };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setProfile(null);
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        error,
        login,
        register,
        loginWithGoogle,
        logout,
        setProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
