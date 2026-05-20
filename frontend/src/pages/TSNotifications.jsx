

import  { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"

const TSNotifications = () => {
     const [notifications, setNotifications] = useState([])
     const [loading, setLoading] = useState(true)
     const { user } = useAuth()
     const navigate = useNavigate()

     useEffect(() => {
          fetchNotifications()

     }, [])

     const fetchNotifications = async () => {
          try {
               const res = await api.get('/notifications/')
               setNotifications(res.data)
          }
          catch (err) {
               console.error(err)

          }
          finally {
               setLoading(false)
          }
     }

     const handleMarkRead = async (id) => {
          try {
               await api.put(`/notifications/${id}/read`)
               setNotifications(notifications.map(n =>
                    n.id === id ? {
                         ...n, is_read: true
                    } : n

               ))
          }
          catch (err) {
               console.error(err)
          }
     }

     const handleBack = () => {
          if (user?.role === 'teacher') {
               navigate(`/teacher/dashboard`)
          }
          else if (user?.role === 'student') {
               navigate(`/student/dashboard`)
          }
          else {
               navigate('/admin/dashboard')
          }
     }

     const unreadCount = notifications.filter(n => !n.is_read).length

     if (loading) {
          return (
               <div className="text-center">
                    LOADING....
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-3xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                         <div>
                              <button onClick={handleBack} className="text-blue-600 text-sm hover:underline mb-1 block">
                                   ← Back to Dashboard
                              </button>
                              <h2 className="text-2xl font-bold text-gray-800">
                                   Notifications
                                   {unreadCount > 0 && (
                                        <span className="ml-2 text-sm bg-red-500 text-white px-2 py-1 rounded-full">
                                             {unreadCount} unread
                                        </span>
                                   )}
                              </h2>
                         </div>
                         {unreadCount > 0 && (
                              <button
                                   onClick={() => notifications.filter(n => !n.is_read).forEach(n => handleMarkRead(n.id))}
                                   className="text-sm text-blue-600 hover:underline"
                              >
                                   Mark all as read
                              </button>
                         )}
                    </div>

                    {notifications.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                              No notifications yet
                         </div>
                    ) : (
                         <div className="space-y-3">
                              {notifications.map(notification => (
                                   <div
                                        key={notification.id}
                                        className={`bg-white rounded-lg shadow p-5 border-l-4 ${notification.is_read ? 'border-gray-200' :
                                                  notification.notification_type === 'assignment' ? 'border-blue-500' :
                                                       notification.notification_type === 'material' ? 'border-green-500' :
                                                            'border-purple-500'
                                             }`}
                                   >
                                        <div className="flex justify-between items-start">
                                             <div className="flex-1">
                                                  <div className="flex items-center gap-2 mb-1">
                                                       <h3 className={`font-semibold ${notification.is_read ? 'text-gray-500' : 'text-gray-800'}`}>
                                                            {notification.title}
                                                       </h3>
                                                       <span className={`text-xs px-2 py-1 rounded-full capitalize ${notification.notification_type === 'assignment' ? 'bg-blue-100 text-blue-600' :
                                                                 notification.notification_type === 'material' ? 'bg-green-100 text-green-600' :
                                                                      'bg-purple-100 text-purple-600'
                                                            }`}>
                                                            {notification.notification_type}
                                                       </span>
                                                       {!notification.is_read && (
                                                            <span className="text-xs bg-red-100 text-red-500 px-2 py-1 rounded-full">New</span>
                                                       )}
                                                  </div>
                                                  <p className="text-sm text-gray-500">{notification.message}</p>
                                                  <p className="text-xs text-gray-400 mt-2">
                                                       {new Date(notification.created_at).toLocaleString()}
                                                  </p>
                                             </div>
                                             {!notification.is_read && (
                                                  <button
                                                       onClick={() => handleMarkRead(notification.id)}
                                                       className="ml-4 text-xs text-blue-600 hover:underline whitespace-nowrap"
                                                  >
                                                       Mark read
                                                  </button>
                                             )}
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}

export default TSNotifications