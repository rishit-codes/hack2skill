'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import api from '@/services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for existing token in localStorage on mount
        const storedToken = localStorage.getItem('auth_token')
        const storedUser = localStorage.getItem('user_data')

        if (storedToken && storedUser) {
            try {
                const userData = JSON.parse(storedUser)
                setToken(storedToken)
                setUser(userData)
                setIsAuthenticated(true)
            } catch (error) {
                // Clear invalid data
                localStorage.removeItem('auth_token')
                localStorage.removeItem('user_data')
            }
        }

        setIsLoading(false)
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.login(email, password)

            // Store token and user data
            localStorage.setItem('auth_token', response.access_token)
            localStorage.setItem('user_data', JSON.stringify(response.user))

            setToken(response.access_token)
            setUser(response.user)
            setIsAuthenticated(true)

            return { success: true, user: response.user }
        } catch (error) {
            console.error('Login failed:', error)
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed. Please check your credentials.'
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.register(userData)

            // Auto-login after registration
            localStorage.setItem('auth_token', response.access_token)
            localStorage.setItem('user_data', JSON.stringify(response.user))

            setToken(response.access_token)
            setUser(response.user)
            setIsAuthenticated(true)

            return { success: true, user: response.user }
        } catch (error) {
            console.error('Registration failed:', error)
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed. Please try again.'
            }
        }
    }

    const logout = () => {
        // Clear all auth data
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')

        setToken(null)
        setUser(null)
        setIsAuthenticated(false)
    }

    const updateUser = (updatedUserData) => {
        setUser(updatedUserData)
        localStorage.setItem('user_data', JSON.stringify(updatedUserData))
    }

    const value = {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
