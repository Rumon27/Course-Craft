import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logOut();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="shrink-0 flex items-center">
            <Link 
              to={!user ? "/" : (
                user.role === "admin" ? "/admin/dashboard/" : 
                user.role === "teacher" ? "/teacher/dashboard/" : 
                "/student/dashboard/"
              )} 
              className="flex items-center space-x-2"
            >
              <span className="text-2xl font-black bg-clip-text text-transparent bg-linear-to-r from-indigo-400 to-purple-400 tracking-tighter">
                CourseCraft
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-indigo-500 shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
                >
                  Join Now
                </Link>
              </>
            ) : (
              <>
                {/* Common Links */}
                <Link
                  to="/notifications"
                  className="text-slate-300 hover:text-white px-3 py-2 text-sm font-semibold transition-colors flex items-center"
                >
                  Notifications
                  <span className="ml-2 h-2 w-2 rounded-full bg-indigo-400"></span>
                </Link>

                {/* Role-Specific Label (No Dashboard Link as requested) */}
                <div className="flex items-center">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] uppercase font-black border tracking-wider ${
                    user.role === 'admin' 
                    ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' 
                    : user.role === 'teacher'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}>
                    {user.role} Portal
                  </span>
                </div>

                <button
                  onClick={handleLogout}
                  className="text-slate-400 hover:text-red-400 px-3 py-2 text-sm font-semibold transition-colors"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
