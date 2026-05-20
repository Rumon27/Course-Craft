

import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"


const StudentDashboard = () => {
     const [enrollments, setEnrollments] = useState([])
     const [loading, setLoading] = useState(true)
     const navigate = useNavigate()

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const res = await api.get(`/courses/enrollments/`)
                    setEnrollments(res.data)
               }
               catch (err) {
                    console.error(err)
               }
               finally {
                    setLoading(false)
               }
          }

          fetchData()
     }, [])

     const approved = enrollments.filter(e => e.status === 'approved')
     const pending = enrollments.filter(e => e.status === 'pending')

     if(loading)
     {
          return(
               <div className="text-center">
                    LOADING.,..
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Student Dashboard</h2>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-blue-600">{approved.length}</p>
                              <p className="text-gray-500 mt-1">Enrolled Courses</p>
                         </div>
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-yellow-500">{pending.length}</p>
                              <p className="text-gray-500 mt-1">Pending Enrollments</p>
                         </div>
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-green-600">{enrollments.length}</p>
                              <p className="text-gray-500 mt-1">Total Applications</p>
                         </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Actions</h3>
                              <div className="space-y-3">
                                   <button
                                        onClick={() => navigate('/student/courses')}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                   >
                                        Browse Courses
                                   </button>
                                   <button
                                        onClick={() => navigate('/student/my-courses')}
                                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                   >
                                        My Courses
                                   </button>
                                   <button
                                        onClick={() => navigate('/student/performance')}
                                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                                   >
                                        My Performance
                                   </button>
                                   <button
                                        onClick={() => navigate('/student/notifications')}
                                        className="w-full bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600 transition"
                                   >
                                        Notifications
                                   </button>
                              </div>
                         </div>

                         {/* My Enrolled Courses */}
                         <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">My Enrolled Courses</h3>
                              {approved.length === 0 ? (
                                   <p className="text-gray-400 text-sm">No approved enrollments yet</p>
                              ) : (
                                   <div className="space-y-2">
                                        {approved.map(enrollment => (
                                             <div
                                                  key={enrollment.id}
                                                  onClick={() => navigate(`/student/courses/${enrollment.course}`)}
                                                  className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                             >
                                                  <p className="text-sm font-medium">{enrollment.course_name}</p>
                                                  <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                                                       Enrolled
                                                  </span>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     )

}




export default StudentDashboard