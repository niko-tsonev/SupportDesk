import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets";
import { Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";

export default function Catalog() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">
        Ticket Catalog
      </h2>

      <div className="grid gap-5">
        {tickets.map((t) => (
          <Link
            key={t.id}
            to={`/tickets/${t.id}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-secondary overflow-hidden group"
          >
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="text-lg font-semibold text-secondary group-hover:text-accent transition-colors flex-1">
                  {t.subject}
                </h3>
                <StatusBadge status={t.status} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-700">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-sm font-medium">{t.customerEmail}</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm text-gray-500">Assigned to:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    t.assignedToUserEmail 
                      ? "bg-blue-100 text-blue-800" 
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {t.assignedToUserEmail || "Unassigned"}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-500 text-xs pt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
