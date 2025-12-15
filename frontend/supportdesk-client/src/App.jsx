import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./auth/ProtectedRoute";

import Catalog from "./pages/Catalog";
import TicketDetails from "./pages/TicketDetails";
import TicketReply from "./pages/TicketReply";
import Dashboard from "./pages/Dashboard";
import History from "./pages/History";
import CreateTicket from "./pages/CreateTicket";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/tickets/:id" element={<TicketDetails />} />
          <Route path="/tickets/:id/reply" element={<TicketReply />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />

          <Route
            path="/create-ticket"
            element={
              <ProtectedRoute>
                <CreateTicket />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}
