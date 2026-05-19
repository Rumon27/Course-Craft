import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TeacherCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get("/courses/");
        setCourses(res.data.filter((c) => c.teacher === user?.id));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleComplete = async (id) => {
    if (!window.confirm("Course Marked As Completed")) {
      return;
    }
    try {
      await api.post(`/courses/${id}/complete/`);
      setCourses(
        courses.map((c) => (c.id === id ? { ...c, is_completed: true } : c)),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div>loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">My Courses</h2>

        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center text-gray-400">
            No courses assigned to you yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {course.name}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${course.is_completed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"}`}
                  >
                    {course.is_completed ? "Completed" : "Active"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  {course.description}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() =>
                      navigate(`/teacher/courses/${course.id}/assignments/`)
                    }
                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-blue-200 transition"
                  >
                    Assignments
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/teacher/courses/${course.id}/materials/`)
                    }
                    className="bg-green-100 text-green-600 px-3 py-1 rounded-lg text-sm hover:bg-green-200 transition"
                  >
                    Materials
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/teacher/courses/${course.id}/submissions/`)
                    }
                    className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-lg text-sm hover:bg-yellow-200 transition"
                  >
                    Submissions
                  </button>
                  {!course.is_completed && (
                    <button
                      onClick={() => handleComplete(course.id)}
                      className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-200 transition"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherCourses;
