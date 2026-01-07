import { createContext, useState, useEffect, useContext, type ReactNode } from 'react';
import axios from 'axios';
import { API_URL } from '../config';

interface User {
    id: number;
    name: string;
    email?: string;
    profile_picture?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string) => void;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [loading, setLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        if (token) {
            axios.defaults.headers.common['x-auth-token'] = token;
            localStorage.setItem('token', token);
            try {
                const res = await axios.get(`${API_URL}/auth/me`);
                setUser(res.data);
            } catch (err) {
                console.error('Error loading user:', err);
                delete axios.defaults.headers.common['x-auth-token'];
                localStorage.removeItem('token');
                setToken(null);
                setUser(null);
            }
        } else {
            delete axios.defaults.headers.common['x-auth-token'];
            localStorage.removeItem('token');
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, [token]);

    const login = (newToken: string) => {
        setToken(newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated: !!token,
            loading,
            login,
            logout,
            checkAuth
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
