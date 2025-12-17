import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="text-base sm:text-lg font-semibold hover:text-accent flex items-center h-9"
            onClick={closeMenu}
          >
            SupportDesk
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            {(user?.role === "Admin" || user?.role === "Agent") && (
              <Link 
                className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium whitespace-nowrap flex items-center justify-center" 
                to="/create-ticket"
              >
                Create
              </Link>
            )}
            
            <Link className="hover:text-accent flex items-center h-9" to="/">Catalog</Link>

            {user && (
              <>
                <Link className="hover:text-accent flex items-center h-9" to="/dashboard">Dashboard</Link>
                <Link className="hover:text-accent flex items-center h-9" to="/history">History</Link>
                <span className="text-sm text-gray-200 flex items-center h-9">
                  {user.userName}
                </span>
                <button
                  onClick={logout}
                  className="bg-secondary px-4 py-2 rounded-lg hover:bg-accent whitespace-nowrap"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <Link className="hover:text-accent flex items-center h-9" to="/login">Login</Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t border-secondary pt-4">
            <Link 
              className="block hover:text-accent transition-colors" 
              to="/"
              onClick={closeMenu}
            >
              Catalog
            </Link>

            {user && (
              <>
                <Link 
                  className="block hover:text-accent transition-colors" 
                  to="/dashboard"
                  onClick={closeMenu}
                >
                  Dashboard
                </Link>
                <Link 
                  className="block hover:text-accent transition-colors" 
                  to="/history"
                  onClick={closeMenu}
                >
                  History
                </Link>
                {(user.role === "Admin" || user.role === "Agent") && (
                  <Link 
                    className="block bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center font-medium" 
                    to="/create-ticket"
                    onClick={closeMenu}
                  >
                    Create Ticket
                  </Link>
                )}
                <div className="text-sm text-gray-200 pt-2 border-t border-secondary">
                  Logged in as: {user.userName}
                </div>
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="w-full bg-secondary px-4 py-2 rounded-lg hover:bg-accent transition-colors text-center"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <Link 
                className="block hover:text-accent transition-colors" 
                to="/login"
                onClick={closeMenu}
              >
                Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
