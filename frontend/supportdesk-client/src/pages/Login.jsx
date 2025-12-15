import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../api/auth";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await loginApi(email, password);
      login(result.token, result.role, result.userName, result.userId, result.expiresAt);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow p-8">
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Login
      </h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-2 rounded hover:bg-secondary transition disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
