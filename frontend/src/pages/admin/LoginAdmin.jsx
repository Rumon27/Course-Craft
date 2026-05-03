import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { Link, useNavigate } from "react-router-dom";

const LoginAdmin = () => {
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
      const res = await api.post("/users/login", { userName, password });
      
      // Security check: Ensure only admins can use this door
      if (res.data.user.role !== "admin") {
        setError("Access Denied: This portal is for Administrators only.");
        return;
      }

      login(res.data, res.data.access, res.data.refresh);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-indigo-950 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 transform transition-all">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-slate-300 font-medium">Secure access for CourseCraft</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border-l-4 border-red-500 text-red-100 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Admin Username</label>
            <input
              type="text"
              value={userName}
              placeholder="Admin ID"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-200 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/20 outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl active:scale-95 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            Student or Teacher?{" "}
            <Link to="/login" className="text-indigo-400 font-bold hover:text-indigo-300">
              Go to Main Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
