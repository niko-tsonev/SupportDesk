import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-primary text-white">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold tracking-wide">
          SupportDesk
        </h1>

        <nav className="space-x-6 text-sm">
          <Link className="hover:text-accent" to="/">Catalog</Link>
          <Link className="hover:text-accent" to="/dashboard">Dashboard</Link>
          <Link className="hover:text-accent" to="/history">History</Link>
          <Link className="hover:text-accent" to="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}
