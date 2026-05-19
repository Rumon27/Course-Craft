//////FILE OPTION IS NOT WORKING, FIX IT LATER//////

import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from "react-router-dom"
import api from "../../api/axios"


const TeacherMaterials = () => {

     const { courseID } = useParams()
     const [materials, setMaterials] = useState([])
     const [loading, setLoading] = useState(true)

     const [showForm, setShowForm] = useState(false)
     const [formData, setFormData] = useState({
          title: "",
          description: "",
          material_type: "link",
          link: "",
          file: null
     })

     const [error, setError] = useState("")
     const navigate = useNavigate()

     useEffect(() => {
          fetchMaterials()
     }, [])

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

     const handleSubmit = async (e) => {
          e.preventDefault()

          setError('')

          try {
               if (formData.material_type === 'file') {
                    const data = new FormData()
                    data.append('title', formData.title)
                    data.append('description', formData.description)
                    data.append('material_type', formData.material_type)
                    data.append('file', formData.file)

                    await api.post(`/courses/${courseID}/materials/`, data, {
                         headers: { 'Content-Type': 'multipart/form-data' }
                    })

               }
               else {
                    const data = {
                         title: formData.title,
                         description: formData.description,
                         material_type: formData.material_type,
                         link: formData.link
                    }
                    await api.post(`/courses/${courseID}/materials/`, data)
               }

               setShowForm(false)
               setFormData({
                    title: "",
                    description: "",
                    material_type: "link",
                    link: "",
                    file: null
               })
               fetchMaterials()
          }

          catch (err) {
               setError("Something went wrong while saving the material.")
          }
     }

     const handleDelete = async (id) => {
          if (!window.confirm('delete this material??')) {
               return
          }

          try {
               await api.delete(`/courses/${courseID}/materials/${id}/`)
               fetchMaterials()
          }
          catch (err) {
               console.error(err)
          }
     }

     if (loading) {
          return (
               <div className="text-center">
                    LOADING.....
               </div>
          )
     }


     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                         <div>
                              <button onClick={() => navigate('/teacher/courses')} className="text-blue-600 text-sm hover:underline mb-1 block">
                                   ← Back to Courses
                              </button>
                              <h2 className="text-2xl font-bold text-gray-800">Study Materials</h2>
                         </div>
                         <button
                              onClick={() => setShowForm(true)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                         >
                              + Add Material
                         </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                         <div className="bg-white rounded-lg shadow p-6 mb-6">
                              <h3 className="text-lg font-semibold mb-4">Add New Material</h3>
                              {error && <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
                              <form onSubmit={handleSubmit} className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                        <input
                                             type="text"
                                             value={formData.title}
                                             onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                        <textarea
                                             value={formData.description}
                                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             rows={2}
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                        <select
                                             value={formData.material_type}
                                             onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                             <option value="link">Link</option>
                                             <option value="file">File</option>
                                        </select>
                                   </div>
                                   {formData.material_type === 'link' ? (
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                                             <input
                                                  type="url"
                                                  value={formData.link}
                                                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  placeholder="https://..."
                                                  required
                                             />
                                        </div>
                                   ) : (
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-1">File</label>
                                             <input
                                                  type="file"
                                                  onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                                                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                                                  required
                                             />
                                        </div>
                                   )}
                                   <div className="flex gap-3">
                                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                                             Add Material
                                        </button>
                                        <button type="button" onClick={() => setShowForm(false)} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
                                             Cancel
                                        </button>
                                   </div>
                              </form>
                         </div>
                    )}

                    {/* Materials List */}
                    <div className="space-y-4">
                         {materials.length === 0 ? (
                              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                                   No materials yet
                              </div>
                         ) : (
                              materials.map(material => (
                                   <div key={material.id} className="bg-white rounded-lg shadow p-6">
                                        <div className="flex justify-between items-start">
                                             <div>
                                                  <div className="flex items-center gap-2 mb-1">
                                                       <h3 className="font-semibold text-gray-800">{material.title}</h3>
                                                       <span className={`text-xs px-2 py-1 rounded-full ${material.material_type === 'link' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                                            {material.material_type}
                                                       </span>
                                                  </div>
                                                  {material.description && <p className="text-sm text-gray-500 mb-2">{material.description}</p>}
                                                  {material.material_type === 'link' && (
                                                       <a href={material.link} target="_blank" rel="noreferrer" className="text-blue-500 text-sm hover:underline">
                                                            {material.link}
                                                       </a>
                                                  )}
                                                  {material.material_type === 'file' && (
                                                       <a
                                                            href={material.file}
                                                            download={material.title} // This attribute triggers the download
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="text-green-500 text-sm hover:underline"
                                                       >
                                                            Download File
                                                       </a>
                                                  )}
                                             </div>
                                             <button
                                                  onClick={() => handleDelete(material.id)}
                                                  className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                                             >
                                                  Delete
                                             </button>
                                        </div>
                                   </div>
                              ))
                         )}
                    </div>
               </div>
          </div>
     )

}

export default TeacherMaterials