import { useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

function AdminNotifications() {
     const [formData, setFormData] = useState({ title: "", message: "" });
     const [loading, setLoading] = useState(false);
     const [success, setSuccess] = useState("");
     const [error, setError] = useState("");

     const handleSubmit = async (e) => {
          e.preventDefault();
          setError("");
          setSuccess("");
          setLoading(true);
          try {
               const res = await api.post("/notifications/global/", formData);
               setSuccess(res.data.message);
               setFormData({ title: "", message: "" });
          } catch (err) {
               setError("Something went wrong. Please try again.");
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-gray-100">
               <div className="max-w-2xl mx-auto p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                         Send Global Notification
                    </h2>

                    <div className="bg-white rounded-lg shadow p-6">
                         <p className="text-sm text-gray-500 mb-6">
                              This will send a notification to all teachers and students on the
                              platform.
                         </p>

                         {success && (
                              <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">
                                   {success}
                              </div>
                         )}
                         {error && (
                              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">
                                   {error}
                              </div>
                         )}

                         <form onSubmit={handleSubmit} className="space-y-4">
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                   </label>
                                   <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) =>
                                             setFormData({ ...formData, title: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Notification title"
                                        required
                                   />
                              </div>
                              <div>
                                   <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Message
                                   </label>
                                   <textarea
                                        value={formData.message}
                                        onChange={(e) =>
                                             setFormData({ ...formData, message: e.target.value })
                                        }
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Write your message here..."
                                        rows={5}
                                        required
                                   />
                              </div>
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
                              >
                                   {loading ? "Sending..." : "Send Notification"}
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
}

export default AdminNotifications;
