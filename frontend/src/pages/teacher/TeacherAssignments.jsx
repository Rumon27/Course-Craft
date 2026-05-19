import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useEffect, useState } from "react";

const TeacherAssignments = () => {
     const { courseID } = useParams();

     const [assignments, setAssignments] = useState([]);
     const [loading, setLoading] = useState(true);
     const [showForm, setShowForm] = useState(false);
     const [editAssignment, setEditAssignment] = useState(null);

     const navigate = useNavigate();

     const [formData, setFormData] = useState({
          title: "",
          description: "",
          due_date: "",
          total_marks: 100,
     });

     useEffect(() => {
          fetchAssignments();
     }, []);

     const fetchAssignments = async () => {
          try {
               const res = await api.get(`/courses/${courseID}/assignments/`);
               setAssignments(res.data);
          } catch (err) {
               console.error(err);
          } finally {
               setLoading(false);
          }
     };

     const [error, setError] = useState("");

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");

          try {
               if (editAssignment) {
                    await api.put(
                         `/courses/${courseID}/assignments/${editAssignment.id}/`,
                         formData,
                    );
               } else {
                    await api.post(`/courses/${courseID}/assignments/`, formData);
               }

               setShowForm(false);
               setEditAssignment(null);
               setFormData({
                    title: "",
                    description: "",
                    due_date: "",
                    total_marks: 100,
               });
               fetchAssignments();
          } catch (err) {
               setError("something went wrong, Check TeacherAssignments");
               console.error(err);
          }
     };

     const handleEdit = (assignment) => {
          setEditAssignment(assignment);

          setFormData({
               title: assignment.title,
               description: assignment.description,
               due_date: assignment.due_date ? assignment.due_date.slice(0, 16) : "",
               total_marks: assignment.total_marks,
          });
          setShowForm(true);
     };

     const handleDelete = async (id) => {
          if (!window.confirm("Delete thIs assingment???")) {
               return;
          }

          try {
               await api.delete(`/courses/${courseID}/assignments/${id}/`);
               fetchAssignments();
          } catch (err) {
               console.error(err);
          }
     };

     if (loading) {
          return <div className="text-center mt-10">Loading assignments...</div>;
     }

     return (
          <div className="min-h-screen bg-gray-100">
               <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                         <div>
                              <button
                                   onClick={() => navigate("/teacher/courses")}
                                   className="text-blue-600 text-sm hover:underline mb-1 block"
                              >
                                   ← Back to Courses
                              </button>
                              <h2 className="text-2xl font-bold text-gray-800">Assignments</h2>
                         </div>
                         <button
                              onClick={() => {
                                   setShowForm(true);
                                   setEditAssignment(null);
                                   setFormData({
                                        title: "",
                                        description: "",
                                        due_date: "",
                                        total_marks: 100,
                                   });
                              }}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                         >
                              + New Assignment
                         </button>
                    </div>

                    {/* Form */}
                    {showForm && (
                         <div className="bg-white rounded-lg shadow p-6 mb-6">
                              <h3 className="text-lg font-semibold mb-4">
                                   {editAssignment ? "Edit Assignment" : "Create Assignment"}
                              </h3>
                              {error && (
                                   <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                                        {error}
                                   </div>
                              )}
                              <form onSubmit={handleSubmit} className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Title
                                        </label>
                                        <input
                                             type="text"
                                             value={formData.title}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, title: e.target.value })
                                             }
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Description
                                        </label>
                                        <textarea
                                             value={formData.description}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, description: e.target.value })
                                             }
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             rows={3}
                                             required
                                        />
                                   </div>
                                   <div className="grid grid-cols-2 gap-4">
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                                  Due Date
                                             </label>
                                             <input
                                                  type="datetime-local"
                                                  value={formData.due_date}
                                                  onChange={(e) =>
                                                       setFormData({ ...formData, due_date: e.target.value })
                                                  }
                                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  required
                                             />
                                        </div>
                                        <div>
                                             <label className="block text-sm font-medium text-gray-700 mb-1">
                                                  Total Marks
                                             </label>
                                             <input
                                                  type="number"
                                                  value={formData.total_marks}
                                                  onChange={(e) =>
                                                       setFormData({ ...formData, total_marks: e.target.value })
                                                  }
                                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                  required
                                             />
                                        </div>
                                   </div>
                                   <div className="flex gap-3">
                                        <button
                                             type="submit"
                                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                             {editAssignment ? "Update" : "Create"}
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => {
                                                  setShowForm(false);
                                                  setEditAssignment(null);
                                             }}
                                             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                        >
                                             Cancel
                                        </button>
                                   </div>
                              </form>
                         </div>
                    )}

                    {/* Assignments List */}
                    <div className="space-y-4">
                         {assignments.length === 0 ? (
                              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
                                   No assignments yet
                              </div>
                         ) : (
                              assignments.map((assignment) => (
                                   <div
                                        key={assignment.id}
                                        className="bg-white rounded-lg shadow p-6"
                                   >
                                        <div className="flex justify-between items-start">
                                             <div>
                                                  <h3 className="font-semibold text-gray-800">
                                                       {assignment.title}
                                                  </h3>
                                                  <p className="text-sm text-gray-500 mt-1">
                                                       {assignment.description}
                                                  </p>
                                                  <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                                       <span>
                                                            Due: {new Date(assignment.due_date).toLocaleString()}
                                                       </span>
                                                       <span>Total Marks: {assignment.total_marks}</span>
                                                  </div>
                                             </div>
                                             <div className="flex gap-2">
                                                  <button
                                                       onClick={() => handleEdit(assignment)}
                                                       className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition"
                                                  >
                                                       Edit
                                                  </button>
                                                  <button
                                                       onClick={() => handleDelete(assignment.id)}
                                                       className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                                                  >
                                                       Delete
                                                  </button>
                                                  <button
                                                       onClick={() =>
                                                            navigate(
                                                                 `/teacher/courses/${courseID}/assignments/${assignment.id}/submissions`,
                                                            )
                                                       }
                                                       className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-xs hover:bg-blue-200 transition"
                                                  >
                                                       Submissions
                                                  </button>
                                             </div>
                                        </div>
                                   </div>
                              ))
                         )}
                    </div>
               </div>
          </div>
     );
};

export default TeacherAssignments;
