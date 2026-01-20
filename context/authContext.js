import { createContext, useContext, useState, useEffect } from 'react';
import axios from '../utils/axios';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Check if user is logged in on mount
    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const response = await axios.get('/api/auth/me');
            if (response.data.success) {
                setUser(response.data.user);
            }
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password,
            });

            if (response.data.success) {
                setUser(response.data.user);
                toast.success('Registration successful!');
                router.push('/');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Registration failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const login = async (email, password) => {
        try {
            const response = await axios.post('/api/auth/login', {
                email,
                password,
            });

            if (response.data.success) {
                setUser(response.data.user);
                toast.success('Login successful!');
                router.push('/');
                return { success: true };
            }
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed';
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await axios.post('/api/auth/logout');
            setUser(null);
            toast.success('Logged out successfully');
            router.push('/login');
        } catch (error) {
            toast.error('Logout failed');
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
