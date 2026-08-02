import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import authService from "../services/authService";
import STORAGE_KEYS from "../constants/storageKeys";
const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadUser() {

            try {

                const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);

                if (!token) {
                    return;
                }

                const response = await authService.getCurrentUser();

                setUser(response.data);

            } catch (error) {

                localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

                setUser(null);

            } finally {

                setLoading(false);

            }

        }

        loadUser();

    }, []);

    async function login(credentials) {

        const response = await authService.login(credentials);

        localStorage.setItem(
            STORAGE_KEYS.AUTH_TOKEN,
            response.data.token
        );

        setUser(response.data.user);

        return response;

    }

    async function register(userData) {

        return await authService.register(userData);

    }

    function logout() {

        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

        setUser(null);

    }

    return (

        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}