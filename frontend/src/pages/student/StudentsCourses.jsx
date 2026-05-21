

import { useEffect, useState } from 'react'
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"


const StudentsCourses = () => {
     const [enrollments, setEnrollments] = useState([])
     const [loading, setLoading] = useState(true)
     const navigate = useNavigate()

     useEffect(() => {
          const fetchData = async () => {
               try {
                    const res = await api.get(`courses/enrollments/`)
                    setEnrollments(res.data.filter(e => e.status === 'approved'))
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

     if (loading) {
          return (
               <div>
                    LOADING....
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
                         <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                    </div>

                    {enrollments.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                              You are not enrolled in any courses yet
                         </div>
                    ) : (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {enrollments.map(enrollment => (
                                   <div key={enrollment.id} className="bg-white rounded-lg shadow p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">{enrollment.course_name}</h3>
                                        <div className="space-y-2">
                                             <button
                                                  onClick={() => navigate(`/student/courses/${enrollment.course}/assignments`)}
                                                  className="w-full bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition text-sm"
                                             >
                                                  Assignments
                                             </button>
                                             <button
                                                  onClick={() => navigate(`/student/courses/${enrollment.course}/materials`)}
                                                  className="w-full bg-green-100 text-green-600 py-2 rounded-lg hover:bg-green-200 transition text-sm"
                                             >
                                                  Study Materials
                                             </button>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}

export default StudentsCourses