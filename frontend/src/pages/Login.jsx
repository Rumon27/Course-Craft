import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
     const [userName, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [error, setError] = useState("");
     const [loading, setLoading] = useState(false);
     const { login } = useAuth();
     const navigate = useNavigate();

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);

          try {
               const res = await api.post("users/login/", { username: userName, password });

               const role = res.data.user.role;
               login(res.data, res.data.access, res.data.refresh);

               if (role === "admin") {
                    navigate("/admin/dashboard");
               } else if (role === "teacher") {
                    navigate("/teacher/dashboard");
               } else {
                    navigate("/student/dashboard");
               }
          } catch (err) {
               setError("Invalid Username or Password");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4">
               <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-10">
                         <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 mb-2">
                              CourseCraft
                         </h1>
                         <p className="text-gray-500 font-medium">Sign in to your account</p>
                    </div>

                    {error && (
                         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
                              {error}
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                   Username
                              </label>
                              <input
                                   type="text"
                                   value={userName}
                                   placeholder="Enter your username"
                                   required
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-gray-400"
                                   onChange={(e) => setUsername(e.target.value)}
                              />
                         </div>
                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                   Password
                              </label>
                              <input
                                   type="password"
                                   value={password}
                                   onChange={(e) => setPassword(e.target.value)}
                                   placeholder="Enter your password"
                                   required
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all placeholder:text-gray-400"
                              />
                         </div>

                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200 mt-2"
                         >
                              {loading ? (
                                   <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Processing...
                                   </span>
                              ) : (
                                   "Sign In"
                              )}
                         </button>
                    </form>

                    <div className="mt-8 text-center">
                         <p className="text-gray-600 text-sm">
                              Don't have an account?{" "}
                              <Link
                                   to="/register"
                                   className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
                              >
                                   Register
                              </Link>
                         </p>
                    </div>
               </div>
          </div>
     );
};

export default Login;

