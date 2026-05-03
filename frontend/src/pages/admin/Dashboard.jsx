import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function AdminDashboard() {
  const [courses, setCourses] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, enrollmentsRes] = await Promise.all([
          api.get('courses/'),
          api.get('courses/enrollments/')
        ])
        setCourses(coursesRes.data)
        setEnrollments(enrollmentsRes.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const pendingEnrollments = enrollments.filter(e => e.status === 'pending')

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
    </div>
  )

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <header className="mb-10">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admin Overview</h2>
          <p className="text-slate-500 mt-1">Manage your platform's courses and enrollments.</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transform transition-hover hover:shadow-md">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-2">Total Courses</p>
            <p className="text-5xl font-black text-slate-900">{courses.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transform transition-hover hover:shadow-md">
            <p className="text-sm font-bold text-emerald-600 uppercase tracking-wider mb-2">Total Enrollments</p>
            <p className="text-5xl font-black text-slate-900">{enrollments.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 transform transition-hover hover:shadow-md">
            <p className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Pending Requests</p>
            <p className="text-5xl font-black text-slate-900">{pendingEnrollments.length}</p>
          </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions & Recent */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-slate-900 rounded-2xl shadow-xl p-8 text-white">
              <h3 className="text-xl font-bold mb-6">Quick Management</h3>
              <div className="space-y-4">
                <button onClick={() => navigate('/admin/courses')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-white/10 flex justify-between items-center group">
                  <span>Courses</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button onClick={() => navigate('/admin/teachers')} className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-4 rounded-xl transition-all border border-white/10 flex justify-between items-center group">
                  <span>Teachers</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </button>
                <button onClick={() => navigate('/admin/enrollments')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-indigo-900/40">
                  Manage Enrollments
                </button>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Pending</h3>
              {pendingEnrollments.length === 0 ? (
                <p className="text-slate-400 italic">No pending requests</p>
              ) : (
                <div className="space-y-4">
                  {pendingEnrollments.slice(0, 4).map(enrollment => (
                    <div key={enrollment.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{enrollment.student_name}</p>
                        <p className="text-xs text-slate-500">{enrollment.course_name}</p>
                      </div>
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Courses Table */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900">Platform Courses</h3>
                <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">LIVE</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Course Name</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courses.map(course => (
                      <tr key={course.id} className="hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5 text-sm font-semibold text-slate-800">{course.name}</td>
                        <td className="px-8 py-5 text-sm text-slate-500">{course.teacher_name || 'Not Assigned'}</td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${course.is_completed ? 'bg-slate-100 text-slate-500' : 'bg-emerald-100 text-emerald-700'}`}>
                            {course.is_completed ? 'Archive' : 'Active'}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {courses.length === 0 && (
                      <tr>
                        <td colSpan="3" className="px-8 py-10 text-center text-slate-400 italic">No courses found on the platform.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default AdminDashboard