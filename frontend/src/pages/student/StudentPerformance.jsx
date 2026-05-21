

import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

const StudentPerformance = () => {
     const [performance, setPerfomance] = useState([])
     const [student, setStudent] = useState('')
     const [loading, setLoading] = useState(true)
     const navigate = useNavigate()

     useEffect(() => {
          const fetchPerformance = async () => {
               try {
                    const res = await api.get('/performance/')
                    setPerfomance(res.data.performance)
                    setStudent(res.data.student)
               }
               catch (err) {
                    console.error(err)
               }
               finally {
                    setLoading(false)
               }
          }
          fetchPerformance()
     }, [])

     if (loading) {
          return (
               <div>
                    LOAADING.....
               </div>
          )
     }


     return (
          <div className="min-h-screen bg-gray-100">
               <div className="max-w-6xl mx-auto p-6">
                    <div className="mb-6">
                         <button onClick={() => navigate('/student/dashboard')} className="text-blue-600 text-sm hover:underline mb-1 block">
                              ← Back to Dashboard
                         </button>
                         <h2 className="text-2xl font-bold text-gray-800">My Performance — {student}</h2>
                    </div>

                    {performance.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                              No performance data yet
                         </div>
                    ) : (
                         <div className="space-y-6">
                              {performance.map(course => (
                                   <div key={course.course_id} className="bg-white rounded-lg shadow p-6">
                                        {/* Course Header */}
                                        <div className="flex justify-between items-start mb-4">
                                             <div>
                                                  <h3 className="text-lg font-semibold text-gray-800">{course.course_name}</h3>
                                                  <span className={`text-xs px-2 py-1 rounded-full ${course.is_completed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                                                       {course.is_completed ? 'Completed' : 'Active'}
                                                  </span>
                                             </div>
                                             <div className="text-right">
                                                  <p className="text-2xl font-bold text-blue-600">{course.percentage}%</p>
                                                  <p className="text-xs text-gray-400">{course.obtained_marks} / {course.total_marks} marks</p>
                                             </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                                             <div
                                                  className={`h-2 rounded-full ${course.percentage >= 80 ? 'bg-green-500' :
                                                            course.percentage >= 50 ? 'bg-yellow-500' :
                                                                 'bg-red-500'
                                                       }`}
                                                  style={{ width: `${course.percentage}%` }}
                                             />
                                        </div>

                                        {/* Assignments Table */}
                                        <table className="w-full text-sm">
                                             <thead>
                                                  <tr className="text-left border-b">
                                                       <th className="pb-2 text-gray-500">Assignment</th>
                                                       <th className="pb-2 text-gray-500">Total</th>
                                                       <th className="pb-2 text-gray-500">Obtained</th>
                                                       <th className="pb-2 text-gray-500">Status</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  {course.assignments.map(assignment => (
                                                       <tr key={assignment.assignment_id} className="border-b last:border-0">
                                                            <td className="py-2 font-medium">{assignment.assignment_title}</td>
                                                            <td className="py-2 text-gray-500">{assignment.total_marks}</td>
                                                            <td className="py-2 text-gray-500">{assignment.mark_obtained ?? '—'}</td>
                                                            <td className="py-2">
                                                                 <span className={`text-xs px-2 py-1 rounded-full capitalize ${assignment.status === 'graded' ? 'bg-green-100 text-green-600' :
                                                                           assignment.status === 'submitted' ? 'bg-yellow-100 text-yellow-600' :
                                                                                'bg-gray-100 text-gray-500'
                                                                      }`}>
                                                                      {assignment.status}
                                                                 </span>
                                                            </td>
                                                       </tr>
                                                  ))}
                                             </tbody>
                                        </table>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}

export default StudentPerformance