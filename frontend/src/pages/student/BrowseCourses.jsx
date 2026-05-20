
import { useEffect, useState } from 'react'
import api from "../../api/axios"
import { useNavigate } from "react-router-dom"

const BrowseCourses = () => {
     const [courses, setCourses] = useState([])
     const [error, setError] = useState('')
     const [enrollments, setEnrollments] = useState([])
     const [loading, setLoading] = useState(true)
     const [message, setMessage] = useState('')
     const navigate = useNavigate()

     useEffect(() => {
          fetchData()
     })

     const fetchData = async () => {
          try{
               const courseRes = await api.get('/courses')
               const enrollmentsRes = await api.get('/courses/enrollments/')

               setCourses(courseRes.data)
               setEnrollments(enrollmentsRes.data)
          }
          catch(err)
          {
               console.error(err)
          }
          finally
          {
               setLoading(false)
          }
     }

     const getEnrollmentStatus = (courseID) => {
          const enrollment = enrollments.find(e => e.course === courseID)
          if(enrollment)
          {
               return enrollment.status 
          }
          else
          {
               return null
          }
     } 

     const handleEnroll = async(courseID) => {
          setMessage('')
          setError('')

          try{
               await api.post(`/courses/enroll/`, {course:courseID})
               setMessage('Enrollment request sent. LOGIN TO ADMIN TO VERIFY')
               fetchData()
          }
          catch(err)
          {
               setError('something is wrong. CHECK BROWSE COURSES')
          }


     }

     if(loading)
     {
          return(
               <div className="text-center">
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
          <h2 className="text-2xl font-bold text-gray-800">Browse Courses</h2>
        </div>

        {message && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{message}</div>}
        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
            No courses available
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map(course => {
              const enrollmentStatus = getEnrollmentStatus(course.id)
              return (
                <div key={course.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{course.name}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${course.is_completed ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-600'}`}>
                      {course.is_completed ? 'Completed' : 'Active'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-3">{course.description}</p>
                  <p className="text-xs text-gray-400 mb-4">
                    Teacher: {course.teacher_name || 'Unassigned'}
                  </p>

                  {enrollmentStatus === 'approved' && (
                    <button
                      onClick={() => navigate(`/student/courses/${course.id}`)}
                      className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition text-sm"
                    >
                      Go to Course
                    </button>
                  )}
                  {enrollmentStatus === 'pending' && (
                    <button disabled className="w-full bg-yellow-100 text-yellow-600 py-2 rounded-lg text-sm cursor-not-allowed">
                      Pending Approval
                    </button>
                  )}
                  {enrollmentStatus === 'rejected' && (
                    <button disabled className="w-full bg-red-100 text-red-500 py-2 rounded-lg text-sm cursor-not-allowed">
                      Enrollment Rejected
                    </button>
                  )}
                  {!enrollmentStatus && (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Apply for Enrollment
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default BrowseCourses