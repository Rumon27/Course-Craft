import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import api from "../../api/axios";

function TeacherDashboard() {
     const [courses, setCourses] = useState([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();
     const { user } = useAuth();

     useEffect(() => {
          const fetchCourses = async () => {
               try {
                    const res = await api.get("/courses/");
                    setCourses(res.data);
               } catch (err) {
                    console.error(err);
               } finally {
                    setLoading(false);
               }
          };
          fetchCourses();
     }, []);

     const myCourses = courses.filter(c => c.teacher === user?.id)
     const activeCourses = myCourses.filter((c) => !c.is_completed);
     const completedCourses = myCourses.filter((c) => c.is_completed);

     if (loading) return <div className="text-center mt-10">Loading...</div>;

     return (
          <div className="min-h-screen bg-gray-100">

               <div className="max-w-6xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                         Teacher Dashboard
                    </h2>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-blue-600">
                                   {myCourses.length}
                              </p>
                              <p className="text-gray-500 mt-1">My Courses</p>
                         </div>
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-green-600">
                                   {activeCourses.length}
                              </p>
                              <p className="text-gray-500 mt-1">Active Courses</p>
                         </div>
                         <div className="bg-white rounded-lg shadow p-6 text-center">
                              <p className="text-4xl font-bold text-gray-400">
                                   {completedCourses.length}
                              </p>
                              <p className="text-gray-500 mt-1">Completed Courses</p>
                         </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                   Quick Actions
                              </h3>
                              <div className="space-y-3">
                                   <button
                                        onClick={() => navigate("/teacher/courses/")}
                                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                                   >
                                        My Courses
                                   </button>
                                   <button
                                        onClick={() => navigate("/teacher/notifications/")}
                                        className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                                   >
                                        Notifications
                                   </button>
                              </div>
                         </div>

                         {/* My Courses List */}
                         <div className="bg-white rounded-lg shadow p-6">
                              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                   My Courses
                              </h3>
                              {myCourses.length === 0 ? (
                                   <p className="text-gray-400 text-sm">No courses assigned yet</p>
                              ) : (
                                   <div className="space-y-2">
                                        {myCourses.map((course) => (
                                             <div
                                                  key={course.id}
                                                  onClick={() => navigate(`/teacher/courses/${course.id}/assignments/`)}
                                                  className="flex justify-between items-center border-b pb-2 cursor-pointer hover:bg-gray-50 px-2 rounded"
                                             >
                                                  <p className="text-sm font-medium">{course.name}</p>
                                                  <span
                                                       className={`text-xs px-2 py-1 rounded-full ${course.is_completed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"}`}
                                                  >
                                                       {course.is_completed ? "Completed" : "Active"}
                                                  </span>
                                             </div>
                                        ))}
                                   </div>
                              )}
                         </div>
                    </div>
               </div>
          </div>
     );
}

export default TeacherDashboard;
