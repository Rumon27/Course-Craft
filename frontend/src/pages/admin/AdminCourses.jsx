import { useEffect, useState } from "react";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacher: "",
    prerequisites: [],
  });

  const fetchData = async () => {
    try {
      const [registeredCourse, RegisteredTeachers] = await Promise.all([
        api.get("/courses/"),
        api.get("/users/teachers/"),
      ]);
      setCourses(registeredCourse.data);
      setTeachers(RegisteredTeachers.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editCourse) {
        await api.put(`/courses/${editCourse.id}/`, formData);
      } else {
        await api.post("/courses/", formData);
      }

      setShowForm(false);
      setEditCourse(null);
      setFormData({
        name: "",
        description: "",
        teacher: "",
        prerequisites: [],
      });
      fetchData();
    } catch (err) {
      setError(
        "Something went wrong, Check the Source Code[pages/admin/AdminCourses]",
      );
    }
  };

  const handleEdit = (course) => {
    setEditCourse(course);

    setFormData({
      name: course.name,
      description: course.description,
      teacher: course.teacher || "",
      prerequisites: course.prerequisites || [],
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are u Sure?")) {
      return;
    }
    try {
      await api.delete(`/courses/${id}/`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Manage Courses</h2>
          <button
            onClick={() => {
              setShowForm(true);
              setEditCourse(null);
              setFormData({
                name: "",
                description: "",
                teacher: "",
                prerequisites: [],
              });
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + New Course
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">
              {editCourse ? "Edit Course" : "Create New Course"}
            </h3>
            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Course Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign Teacher
                </label>
                <select
                  value={formData.teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, teacher: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.username}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {editCourse ? "Update Course" : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditCourse(null);
                  }}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-white rounded-lg shadow p-6">
          {courses.length === 0 ? (
            <p className="text-gray-400 text-sm">No courses yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b">
                    <th className="pb-2 text-gray-500">Course</th>
                    <th className="pb-2 text-gray-500">Teacher</th>
                    <th className="pb-2 text-gray-500">Status</th>
                    <th className="pb-2 text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id} className="border-b last:border-0">
                      <td className="py-3 font-medium">{course.name}</td>
                      <td className="py-3 text-gray-500">
                        {course.teacher_name || "Unassigned"}
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${course.is_completed ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"}`}
                        >
                          {course.is_completed ? "Completed" : "Active"}
                        </span>
                      </td>
                      <td className="py-3 flex gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg text-xs hover:bg-yellow-200 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(course.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs hover:bg-red-200 transition"
                        >
                          Deactivate
                        </button>
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

export default AdminCourses;
