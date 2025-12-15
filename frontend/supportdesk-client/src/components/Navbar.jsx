import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link
          to="/"
          className="text-lg font-semibold hover:text-accent"
        >
          SupportDesk
        </Link>


        <nav className="space-x-6 text-sm flex items-center">
          {(user?.role === "Admin" || user?.role === "Agent") && (
            <Link 
              className="bg-green-600 px-4 py-1.5 rounded-lg hover:bg-green-700 transition-colors font-medium" 
              to="/create-ticket"
            >
              Create
            </Link>
          )}
          
          <Link className="hover:text-accent" to="/">Catalog</Link>

          {user && (
            <>
              <Link className="hover:text-accent" to="/dashboard">Dashboard</Link>
              <Link className="hover:text-accent" to="/history">History</Link>
              <button
                onClick={logout}
                className="ml-4 bg-secondary px-3 py-1 rounded hover:bg-accent"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link className="hover:text-accent" to="/login">Login</Link>
          )}
          
          {user && (
            <span className="ml-4 text-sm text-gray-200">
              {user.userName}
            </span>
          )}
        </nav>
      </div>
    </header>
  );
}
