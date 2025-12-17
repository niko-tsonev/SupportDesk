import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        <Routes>
          {/* Public routes - only accessible when NOT logged in */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Private routes - only accessible when logged in */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Catalog />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/tickets/:id"
            element={
              <PrivateRoute>
                <TicketDetails />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/tickets/:id/reply"
            element={
              <PrivateRoute>
                <TicketReply />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/history"
            element={
              <PrivateRoute>
                <History />
              </PrivateRoute>
            }
          />

          <Route
            path="/create-ticket"
            element={
              <PrivateRoute>
                <CreateTicket />
              </PrivateRoute>
            }
          />

          {/* Catch all - redirect to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
    </div>
  );
}
