import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState, useEffect } from 'react'
import api from '../api/axios'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications/')
        setUnreadCount(res.data.filter(n => !n.is_read).length)
      } catch (err) {
        console.error(err)
      }
    }
    if (user) fetchUnread()
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (user?.role === 'admin') return '/admin/dashboard'
    if (user?.role === 'teacher') return '/teacher/dashboard'
    return '/student/dashboard'
  }

  const getNotificationLink = () => {
    if (user?.role === 'teacher') return '/teacher/notifications'
    if (user?.role === 'student') return '/student/notifications'
    return '/admin/notifications'
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate(getDashboardLink())}
      >
        CourseCraft
      </h1>
      <div className="flex items-center gap-4">
        <span className="text-sm capitalize bg-blue-700 px-3 py-1 rounded-full">
          {user?.role}
        </span>
        <span className="text-sm">{user?.username}</span>
        <button
          onClick={() => navigate(getNotificationLink())}
          className="relative bg-blue-700 px-3 py-1 rounded-lg text-sm hover:bg-blue-800 transition"
        >
          🔔
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={handleLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar