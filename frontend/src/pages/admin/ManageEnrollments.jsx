import { useState, useEffect } from "react";
import api from "../../api/axios";

const ManageEnrollments = () => {
     const [enrollments, setEnrollments] = useState([])
     const [loading, setLoading] = useState(true)
     const [filter, setFilter] = useState("all")


     const fetchEnrollments = async () => {
          try {
               const res = await api.get("/courses/enrollments/")
               setEnrollments(res.data)
          } catch (err) {
               console.error(err)
          } finally {
               setLoading(false)
          }
     };

     useEffect(() => {
          fetchEnrollments()
     }, []);


     const handleStatus = async (id, newStatus) => {
          try {
               await api.put(`/courses/enrollments/${id}/`, { status: newStatus });
               fetchEnrollments()
          } catch (err) {
               console.error(err)
          }
     };

     const filtered =
          filter === "all"
               ? enrollments
               : enrollments.filter((e) => e.status === filter)

     if (loading) return <div className="text-center mt-10">Loading...</div>

     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                         Manage Enrollments
                    </h2>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mb-6">
                         {["all", "pending", "approved", "rejected"].map((f) => (
                              <button
                                   key={f}
                                   onClick={() => setFilter(f)}
                                   className={`px-4 py-2 rounded-lg text-sm capitalize transition ${filter === f
                                             ? "bg-blue-600 text-white"
                                             : "bg-white text-gray-600 hover:bg-gray-100"
                                        }`}
                              >
                                   {f}
                              </button>
                         ))}
                    </div>

                    {/* Enrollments Table */}
                    <div className="bg-white rounded-lg shadow p-6">
                         {filtered.length === 0 ? (
                              <p className="text-gray-400 text-sm">No enrollments found</p>
                         ) : (
                              <div className="overflow-x-auto">
                                   <table className="w-full text-sm">
                                        <thead>
                                             <tr className="text-left border-b">
                                                  <th className="pb-2 text-gray-500">Student</th>
                                                  <th className="pb-2 text-gray-500">Course</th>
                                                  <th className="pb-2 text-gray-500">Applied At</th>
                                                  <th className="pb-2 text-gray-500">Status</th>
                                                  <th className="pb-2 text-gray-500">Actions</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {filtered.map((enrollment) => (
                                                  <tr key={enrollment.id} className="border-b last:border-0">
                                                       <td className="py-3 font-medium">
                                                            {enrollment.student_name}
                                                       </td>
                                                       <td className="py-3 text-gray-500">
                                                            {enrollment.course_name}
                                                       </td>
                                                       <td className="py-3 text-gray-400">
                                                            {new Date(enrollment.applied_at).toLocaleDateString()}
                                                       </td>
                                                       <td className="py-3">
                                                            <span
                                                                 className={`px-2 py-1 rounded-full text-xs capitalize ${enrollment.status === "approved"
                                                                           ? "bg-green-100 text-green-600"
                                                                           : enrollment.status === "rejected"
                                                                                ? "bg-red-100 text-red-600"
                                                                                : "bg-yellow-100 text-yellow-600"
                                                                      }`}
                                                            >
                                                                 {enrollment.status}
                                                            </span>
                                                       </td>
                                                       <td className="py-3">
                                                            {enrollment.status === "pending" && (
                                                                 <div className="flex gap-2">
                                                                      <button
                                                                           onClick={() =>
                                                                                handleStatus(enrollment.id, "approved")
                                                                           }
                                                                           className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-xs hover:bg-green-200 transition"
                                                                      >
                                                                           Approve
                                                                      </button>
                                                                      <button
                                                                           onClick={() =>
                                                                                handleStatus(enrollment.id, "rejected")
                                                                           }
                                                                           className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                                                                      >
                                                                           Reject
                                                                      </button>
                                                                 </div>
                                                            )}
                                                            {enrollment.status !== "pending" && (
                                                                 <span className="text-gray-300 text-xs">
                                                                      No actions
                                                                 </span>
                                                            )}
                                                       </td>
                                                  </tr>
                                             ))}
                                        </tbody>
                                   </table>
                              </div>
                         )}
                    </div>
               </div>
          </div>
     );
}

export default ManageEnrollments;
