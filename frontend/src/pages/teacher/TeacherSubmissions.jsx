import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

function TeacherSubmissions() {
     const { courseId, assignmentId } = useParams()
     const [submissions, setSubmissions] = useState([])
     const [assignment, setAssignment] = useState(null)
     const [loading, setLoading] = useState(true)
     const [gradingId, setGradingId] = useState(null)
     const [mark, setMark] = useState('')
     const [error, setError] = useState('')
     const navigate = useNavigate()

     useEffect(() => {
          fetchData()
     }, [])

     const fetchData = async () => {
          try {
               const [assignmentRes, submissionsRes] = await Promise.all([
                    api.get(`/courses/${courseId}/assignments/${assignmentId}/`),
                    api.get(`/courses/${courseId}/assignments/${assignmentId}/submissions/`)
               ])
               setAssignment(assignmentRes.data)
               setSubmissions(submissionsRes.data)
          } catch (err) {
               console.error(err)
          } finally {
               setLoading(false)
          }
     }

     const handleGrade = async (submissionId) => {
          setError('')
          try {
               await api.put(`/courses/${courseId}/assignments/${assignmentId}/submissions/${submissionId}/grade/`, {
                    mark_obtained: mark
               })
               setGradingId(null)
               setMark('')
               fetchData()
          } catch (err) {
               setError(err.response?.data?.error || 'Something went wrong.')
          }
     }

     if (loading) return <div className="text-center mt-10">Loading...</div>

     return (
          <div className="min-h-screen bg-gray-100">
               
               <div className="max-w-6xl mx-auto p-6">
                    <div className="mb-6">
                         <button
                              onClick={() => navigate(`/teacher/courses/${courseId}/assignments`)}
                              className="text-blue-600 text-sm hover:underline mb-1 block"
                         >
                              ← Back to Assignments
                         </button>
                         <h2 className="text-2xl font-bold text-gray-800">
                              Submissions — {assignment?.title}
                         </h2>
                         <p className="text-sm text-gray-500 mt-1">Total Marks: {assignment?.total_marks}</p>
                    </div>

                    {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}

                    {submissions.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                              No submissions yet
                         </div>
                    ) : (
                         <div className="space-y-4">
                              {submissions.map(submission => (
                                   <div key={submission.id} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex justify-between items-start">
                                             <div className="flex-1">
                                                  <div className="flex items-center gap-2 mb-2">
                                                       <h3 className="font-semibold text-gray-800">{submission.student_name}</h3>
                                                       <span className={`text-xs px-2 py-1 rounded-full ${submission.status === 'graded' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                                            }`}>
                                                            {submission.status}
                                                       </span>
                                                  </div>
                                                  {submission.text && (
                                                       <p className="text-sm text-gray-600 mb-2 bg-gray-50 p-3 rounded">{submission.text}</p>
                                                  )}
                                                  {submission.file && (
                                                       <a href={submission.file} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">
                                                            View File
                                                       </a>
                                                  )}
                                                  <p className="text-xs text-gray-400 mt-2">
                                                       Submitted: {new Date(submission.submitted_at).toLocaleString()}
                                                  </p>
                                                  {submission.status === 'graded' && (
                                                       <p className="text-sm font-medium text-green-600 mt-1">
                                                            Mark: {submission.mark_obtained} / {assignment?.total_marks}
                                                       </p>
                                                  )}
                                             </div>

                                             <div className="ml-4">
                                                  {gradingId === submission.id ? (
                                                       <div className="flex flex-col gap-2">
                                                            <input
                                                                 type="number"
                                                                 value={mark}
                                                                 onChange={(e) => setMark(e.target.value)}
                                                                 placeholder={`Max: ${assignment?.total_marks}`}
                                                                 className="border border-gray-300 rounded-lg px-3 py-1 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                 onClick={() => handleGrade(submission.id)}
                                                                 className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition"
                                                            >
                                                                 Submit Grade
                                                            </button>
                                                            <button
                                                                 onClick={() => { setGradingId(null); setMark('') }}
                                                                 className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs hover:bg-gray-300 transition"
                                                            >
                                                                 Cancel
                                                            </button>
                                                       </div>
                                                  ) : (
                                                       <button
                                                            onClick={() => { setGradingId(submission.id); setMark('') }}
                                                            className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition"
                                                       >
                                                            {submission.status === 'graded' ? 'Regrade' : 'Grade'}
                                                       </button>
                                                  )}
                                             </div>
                                        </div>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}

export default TeacherSubmissions