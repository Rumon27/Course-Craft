import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../../api/axios'

function StudentAssignments() {
  const { courseId } = useParams()
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submittingId, setSubmittingId] = useState(null)
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await api.get(`/courses/${courseId}/assignments/`)
      setAssignments(res.data)
      const submissionPromises = res.data.map(a =>
        api.get(`/courses/${courseId}/assignments/${a.id}/submissions/`).catch(() => ({ data: [] }))
      )
      const submissionResults = await Promise.all(submissionPromises)
      const allSubmissions = submissionResults.flatMap(r => r.data)
      setSubmissions(allSubmissions)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const getSubmission = (assignmentId) => {
    return submissions.find(s => s.assignment === assignmentId)
  }

  const handleSubmit = async (assignmentId) => {
    setError('')
    setSuccess('')
    try {
      const formData = new FormData()
      if (text) formData.append('text', text)
      if (file) formData.append('file', file)

      await api.post(`/courses/${courseId}/assignments/${assignmentId}/submissions/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      setSuccess('Assignment submitted successfully!')
      setSubmittingId(null)
      setText('')
      setFile(null)
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
          <button onClick={() => navigate('/student/mycourses')} className="text-blue-600 text-sm hover:underline mb-1 block">
            ← Back to My Courses
          </button>
          <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
        </div>

        {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>}

        {assignments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
            No assignments yet
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map(assignment => {
              const submission = getSubmission(assignment.id)
              return (
                <div key={assignment.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      submission?.status === 'graded' ? 'bg-green-100 text-green-600' :
                      submission?.status === 'submitted' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {submission?.status || 'Not submitted'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{assignment.description}</p>
                  <div className="flex gap-4 text-xs text-gray-400 mb-4">
                    <span>Due: {new Date(assignment.due_date).toLocaleString()}</span>
                    <span>Total Marks: {assignment.total_marks}</span>
                  </div>

                  {submission?.status === 'graded' && (
                    <div className="bg-green-50 p-3 rounded mb-3">
                      <p className="text-sm font-medium text-green-700">
                        Grade: {submission.mark_obtained} / {assignment.total_marks}
                      </p>
                      {submission.text && <p className="text-xs text-gray-500 mt-1">{submission.text}</p>}
                      {submission.file && (
                        <a href={submission.file} target="_blank" rel="noopener noreferrer"
                           className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                          View submitted file ↗
                        </a>
                      )}
                    </div>
                  )}

                  {submission?.status === 'submitted' && (
                    <div className="bg-yellow-50 p-3 rounded mb-3">
                      <p className="text-sm text-yellow-700">Submitted — waiting for grade</p>
                      {submission.text && <p className="text-xs text-gray-400 mt-1">{submission.text}</p>}
                      {submission.file && (
                        <a href={submission.file} target="_blank" rel="noopener noreferrer"
                           className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                          View submitted file ↗
                        </a>
                      )}
                    </div>
                  )}

                  {!submission && (
                    <>
                      {submittingId === assignment.id ? (
                        <div className="space-y-3">
                          <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Write your answer here..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                          />
                          <input
                            type="file"
                            onChange={(e) => setFile(e.target.files[0] || null)}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleSubmit(assignment.id)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                            >
                              Submit
                            </button>
                            <button
                              onClick={() => { setSubmittingId(null); setText(''); setFile(null) }}
                              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSubmittingId(assignment.id)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                        >
                          Submit Assignment
                        </button>
                      )}
                    </>
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

export default StudentAssignments

