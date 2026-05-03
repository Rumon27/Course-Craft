import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
     // Initialize state directly from localStorage (Lazy Initialization)
     const [user, setUser] = useState(() => {
          const storedUser = localStorage.getItem('user')
          return storedUser ? JSON.parse(storedUser) : null
     })

     const [loading, setLoading] = useState(false)

     const login = (userData, accessToken, refreshToken) => {
          localStorage.setItem('user', JSON.stringify(userData))
          localStorage.setItem('access_token', accessToken)
          localStorage.setItem('refresh_token', refreshToken)
          setUser(userData)
     }

     const logout = () => {
          localStorage.clear()
          setUser(null)
     }

     return (
          <AuthContext.Provider value={{ user, login, logout, loading }}>
               {children}
          </AuthContext.Provider>
     )
}

export const useAuth = () => useContext(AuthContext)
