import { useEffect, useState } from "react";
import api from "../../api/axios";

const ManageTeachers = () => {
     const [teachers, setTeachers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [showForm, setShowForm] = useState(false);

     const [formData, setFormData] = useState({
          username: "",
          email: "",
          password: "",
     });

     const [error, setError] = useState("");
     const [teacherAssigned, setTeacherAssigned] = useState("");

     const fetchTeachers = async () => {
          try {
               const res = await api.get("/users/teachers/");
               setTeachers(res.data);
          } catch (err) {
               console.error(err);
          } finally {
               setLoading(false);
          }
     };

     useEffect(() => {
          fetchTeachers();
     }, []);

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
          setTeacherAssigned("");

          try {
               await api.post("/users/create-teacher/", formData);
               setTeacherAssigned("Teacher assigned teacherAssignedfully");
               setFormData({
                    username: "",
                    email: "",
                    password: "",
               });
               setShowForm(false);
               fetchTeachers();
          } catch (err) {
               setError("something went wrong");
          }
     };

     if (loading) {
          return <div className="text-center">Loading....</div>;
     }

     return (
          <div className="min-h-screen bg-gray-100">
               <div className="max-w-6xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                         <h2 className="text-2xl font-bold text-gray-800">Manage Teachers</h2>
                         <button
                              onClick={() => setShowForm(!showForm)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                         >
                              + New Teacher
                         </button>
                    </div>

                    {teacherAssigned && (
                         <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                              {teacherAssigned}
                         </div>
                    )}

                    {/* Form */}
                    {showForm && (
                         <div className="bg-white rounded-lg shadow p-6 mb-6">
                              <h3 className="text-lg font-semibold mb-4">Create New Teacher</h3>
                              {error && (
                                   <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                                        {error}
                                   </div>
                              )}
                              <form onSubmit={handleSubmit} className="space-y-4">
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Username
                                        </label>
                                        <input
                                             type="text"
                                             value={formData.username}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, username: e.target.value })
                                             }
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Email
                                        </label>
                                        <input
                                             type="email"
                                             value={formData.email}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, email: e.target.value })
                                             }
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             required
                                        />
                                   </div>
                                   <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                             Password
                                        </label>
                                        <input
                                             type="password"
                                             value={formData.password}
                                             onChange={(e) =>
                                                  setFormData({ ...formData, password: e.target.value })
                                             }
                                             className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                             required
                                        />
                                   </div>
                                   <div className="flex gap-3">
                                        <button
                                             type="submit"
                                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                        >
                                             Create Teacher
                                        </button>
                                        <button
                                             type="button"
                                             onClick={() => setShowForm(false)}
                                             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                                        >
                                             Cancel
                                        </button>
                                   </div>
                              </form>
                         </div>
                    )}

                    {/* Teachers Table */}
                    <div className="bg-white rounded-lg shadow p-6">
                         {teachers.length === 0 ? (
                              <p className="text-gray-400 text-sm">No teachers yet</p>
                         ) : (
                              <div className="overflow-x-auto">
                                   <table className="w-full text-sm">
                                        <thead>
                                             <tr className="text-left border-b">
                                                  <th className="pb-2 text-gray-500">ID</th>
                                                  <th className="pb-2 text-gray-500">Username</th>
                                                  <th className="pb-2 text-gray-500">Email</th>
                                                  <th className="pb-2 text-gray-500">Role</th>
                                             </tr>
                                        </thead>
                                        <tbody>
                                             {teachers.map((teacher) => (
                                                  <tr key={teacher.id} className="border-b last:border-0">
                                                       <td className="py-3 text-gray-400">{teacher.id}</td>
                                                       <td className="py-3 font-medium">{teacher.username}</td>
                                                       <td className="py-3 text-gray-500">{teacher.email}</td>
                                                       <td className="py-3">
                                                            <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs capitalize">
                                                                 {teacher.role}
                                                            </span>
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
};

export default ManageTeachers;
