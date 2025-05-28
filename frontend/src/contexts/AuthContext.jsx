import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken')); // Load token from LS

    useEffect(() => {
        // Attempt to load user from localStorage if token exists
        const storedUser = localStorage.getItem('userData');
        if (token && storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse stored user data:", error);
                localStorage.removeItem('userData'); // Clear corrupted data
            }
        } else if (!token && storedUser) {
            // If no token but user data exists, it's an inconsistent state, clear user data
            localStorage.removeItem('userData');
        }
    }, [token]); // Re-run if token changes (e.g., on login/logout)

    const loginContext = (userData, authToken) => {
        localStorage.setItem('authToken', authToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
    };

    const logoutContext = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        setToken(null);
        setUser(null);
    };

    const isAuthenticated = !!token && !!user; // Or more robust check based on token validity

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, loginContext, logoutContext }}>
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
