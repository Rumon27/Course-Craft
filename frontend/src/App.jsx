import { useAuth } from "./context/AuthContext";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import RegisterAdmin from "./pages/admin/RegisterAdmin";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/admin/Dashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import AdminCourses from "./pages/admin/AdminCourses";
import ManageTeachers from "./pages/admin/ManageTeachers";
import ManageEnrollments from "./pages/admin/ManageEnrollments";
import AdminNotifications from "./pages/admin/AdminNotifications";
import TeacherCourses from "./pages/teacher/TeacherCourses";
import TeacherAssignments from "./pages/teacher/TeacherAssignments";
import TeacherMaterials from "./pages/teacher/TeacherMaterials";
import TeacherSubmissions from "./pages/teacher/TeacherSubmissions";
import TSNotifications from "./pages/TSNotifications";
import StudentDashboard from "./pages/student/StudentDashboard";
import BrowseCourses from "./pages/student/BrowseCourses";

// Dashboard components


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (user) {
    return children;
  } else {
    return <Navigate to="/login" replace />;
  }
};

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login/" element={<Login />} />
        <Route path="/register/" element={<Register />} />
        <Route path="/admin/register/" element={<RegisterAdmin />} />

        {/* Protected Routes */}

        {/* Admin Stuffs */}
        <Route
          path="/admin/dashboard/"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/courses/"
          element={
            <PrivateRoute>
              <AdminCourses />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/enrollments/"
          element={
            <PrivateRoute>
              <ManageEnrollments />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/manageteachers/"
          element={
            <PrivateRoute>
              <ManageTeachers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/notifications/"
          element={
            <PrivateRoute>
              <AdminNotifications />
            </PrivateRoute>
          }
        />

        {/*Teacher Stuffs*/}

        <Route
          path="/teacher/dashboard/"
          element={
            <PrivateRoute>
              <TeacherDashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses/"
          element={
            <PrivateRoute>
              <TeacherCourses />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses/:courseID/assignments/"
          element={
            <PrivateRoute>
              <TeacherAssignments />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses/:courseID/materials/"
          element={
            <PrivateRoute>
              <TeacherMaterials />
            </PrivateRoute>
          }
        />

        <Route
          path="/teacher/courses/:courseID/submissions/"
          element={
            <PrivateRoute>
              <TeacherSubmissions />
            </PrivateRoute>
          }
        />

        <Route path="/teacher/notifications" element={
          <PrivateRoute>
            <TSNotifications />
          </PrivateRoute>
        } />



        {/*STUDNET SERIES */}

        <Route
          path="/student/dashboard/"
          element={
            <PrivateRoute>
              <StudentDashboard />
            </PrivateRoute>
          }
        />

        <Route path="/student/notifications" element={
          <PrivateRoute>
            <TSNotifications />
          </PrivateRoute>
        } />

        <Route
          path="/student/courses/"
          element={
            <PrivateRoute>
              <BrowseCourses />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login/" replace />} />
        <Route path="*" element={<Navigate to="/login/" replace />} />
      </Routes>
    </>
  );
}

export default App;
