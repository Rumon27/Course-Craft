import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const TeacherDashboard = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const res = await api.get("courses/teacher-courses/");
        setCourses(res.data);
      } catch (err) {
        console.error("Failed to fetch teacher courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-emerald-50">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-emerald-50/30 pb-12">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <header className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Teacher Console</h2>
            <p className="text-emerald-600 font-medium mt-1">Manage your courses and interact with students.</p>
          </div>
          <button 
            onClick={() => navigate("/teacher/create-course")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center"
          >
            <span className="mr-2 text-xl">+</span> Create New Course
          </button>
        </header>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Active Courses</p>
            <p className="text-3xl font-black text-slate-900">{courses.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Total Students</p>
            <p className="text-3xl font-black text-slate-900">
              {courses.reduce((acc, c) => acc + (c.student_count || 0), 0)}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Avg. Rating</p>
            <p className="text-3xl font-black text-slate-900">4.8</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-6">
            <p className="text-xs font-bold text-emerald-600 uppercase mb-1">Course Progress</p>
            <p className="text-3xl font-black text-slate-900">72%</p>
          </div>
        </div>

        {/* Courses List */}
        <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 overflow-hidden">
          <div className="p-8 border-b border-emerald-50">
            <h3 className="text-xl font-bold text-slate-900">Your Curriculum</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6 gap-6">
            {courses.length === 0 ? (
              <div className="col-span-full py-12 text-center">
                <div className="text-emerald-200 text-6xl mb-4 text-center">📚</div>
                <p className="text-slate-400 italic">You haven't created any courses yet.</p>
              </div>
            ) : (
              courses.map(course => (
                <div key={course.id} className="group bg-emerald-50/50 rounded-2xl p-6 border border-transparent hover:border-emerald-200 hover:bg-white transition-all cursor-pointer">
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                      {course.category || 'General'}
                    </span>
                    <button className="text-slate-300 hover:text-emerald-600 transition-colors">•••</button>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">{course.name}</h4>
                  <div className="flex items-center text-sm text-slate-500 mb-6">
                    <span className="mr-3">👥 {course.student_count || 0} Students</span>
                    <span>⭐ 4.9</span>
                  </div>
                  <button 
                    onClick={() => navigate(`/teacher/course/${course.id}`)}
                    className="w-full bg-white text-emerald-700 border border-emerald-200 font-bold py-2.5 rounded-xl hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
