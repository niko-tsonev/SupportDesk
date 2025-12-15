import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTicket } from "../api/tickets";

export default function CreateTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: "",
    customerEmail: "",
    description: "",
    isPriority: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createTicket(formData);
      navigate("/");
    } catch (err) {
      setError("Failed to create ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-primary mb-6">Create New Ticket</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject *
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              minLength={5}
              maxLength={200}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="Brief description of the issue"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.subject.length}/200 characters (minimum 5)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Customer Email *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
              placeholder="customer@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              placeholder="Detailed description of the issue..."
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/2000 characters (minimum 10)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              name="isPriority"
              id="isPriority"
              checked={formData.isPriority}
              onChange={handleChange}
              className="w-4 h-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isPriority" className="text-sm font-medium text-gray-700">
              Mark as Priority
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-secondary text-white px-6 py-2.5 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Ticket"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
