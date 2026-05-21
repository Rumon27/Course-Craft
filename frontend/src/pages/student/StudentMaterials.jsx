
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/axios"
import React, { useEffect, useState } from 'react'

const StudentMaterials = () => {
     const { courseID } = useParams()
     const [materials, setMaterials] = useState([])
     const [loading, setLoading] = useState(true)
     const navigate = useNavigate()

     useEffect(() => {
          const fetchMaterials = async () => {
               try {
                    const res = await api.get(`/courses/${courseID}/materials/`)
                    setMaterials(res.data)
               }
               catch (err) {
                    console.error(err)
               }
               finally {
                    setLoading(false)
               }
          }

          fetchMaterials()
     }, [courseID])

     if (loading) {
          return (
               <div className="text-center">
                    Loading....
               </div>
          )
     }

     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-6xl mx-auto p-6">
                    <div className="mb-6">
                         <button onClick={() => navigate('/student/mycourses')} className="text-blue-600 text-sm hover:underline mb-1 block">
                              ← Back to My Courses
                         </button>
                         <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>
                    </div>

                    {materials.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                              No materials yet
                         </div>
                    ) : (
                         <div className="space-y-4">
                              {materials.map(material => (
                                   <div key={material.id} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex items-center gap-2 mb-2">
                                             <h3 className="font-semibold text-gray-800">{material.title}</h3>
                                             <span className={`text-xs px-2 py-1 rounded-full ${material.material_type === 'link' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                                                  }`}>
                                                  {material.material_type}
                                             </span>
                                        </div>
                                        {material.description && (
                                             <p className="text-sm text-gray-500 mb-3">{material.description}</p>
                                        )}
                                        {material.material_type === 'link' && (
                                             <a
                                                  href={material.link}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                                             >
                                                  Open Link
                                             </a>
                                        )}
                                        {material.material_type === 'file' && (
                                             <a
                                                  href={material.file}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                                             >
                                                  Download File
                                             </a>
                                        )}
                                        <p className="text-xs text-gray-400 mt-3">
                                             Added by {material.uploaded_by_name} · {new Date(material.uploaded_at).toLocaleDateString()}
                                        </p>
                                   </div>
                              ))}
                         </div>
                    )}
               </div>
          </div>
     )
}

export default StudentMaterials
