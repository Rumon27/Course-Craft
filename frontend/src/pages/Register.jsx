import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";

const Register = () => {
     const [formData, setFormData] = useState({
          username: "",
          email: "",
          password: "",
          role: "student", 
     });

     const [error, setError] = useState("");
     const [loading, setLoading] = useState(false);
     const navigate = useNavigate();


     const handleChange = (e) => {
          const { name, value } = e.target;
          setFormData((prev) => ({
               ...prev,
               [name]: value,
          }));
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
          setLoading(true);

          try {
               await api.post("users/register/", formData);
               navigate("/login");
          } catch (err) {
               setError(err.response?.data?.message || "Registration failed. Try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-50 via-white to-purple-50 px-4 py-12">
               <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 transform transition-all hover:scale-[1.01]">
                    <div className="text-center mb-8">
                         <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-purple-600 mb-2">
                              Join CourseCraft
                         </h1>
                         <p className="text-gray-500 font-medium">Create your account to get started</p>
                    </div>

                    {error && (
                         <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm animate-pulse">
                              {error}
                         </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
                              <input
                                   type="text"
                                   name="username"
                                   value={formData.username}
                                   onChange={handleChange}
                                   placeholder="Pick a unique username"
                                   required
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                              <input
                                   type="email"
                                   name="email"
                                   value={formData.email}
                                   onChange={handleChange}
                                   placeholder="name@example.com"
                                   required
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
                              <input
                                   type="password"
                                   name="password"
                                   value={formData.password}
                                   onChange={handleChange}
                                   placeholder="Create a strong password"
                                   required
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                              />
                         </div>

                         <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Register as</label>
                              <select
                                   name="role"
                                   value={formData.role}
                                   onChange={handleChange}
                                   className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white cursor-pointer"
                              >
                                   <option value="student">Student</option>
                              </select>
                         </div>

                         <button
                              type="submit"
                              disabled={loading}
                              className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-lg shadow-indigo-100 mt-4"
                         >
                              {loading ? "Creating Account..." : "Create Account"}
                         </button>
                    </form>

                    <div className="mt-8 text-center">
                         <p className="text-gray-600 text-sm">
                              Already have an account?{" "}
                              <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700">
                                   Sign In
                              </Link>
                         </p>
                    </div>
               </div>
          </div>
     );
};

export default Register;
