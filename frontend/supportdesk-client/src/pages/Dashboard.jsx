import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignedTickets } from "../api/tickets";
import StatusBadge from "../components/StatusBadge";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getAssignedTickets().then(setTickets);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-bold text-primary mb-8">
        My Assigned Tickets
      </h2>

      {tickets.length === 0 && (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-lg">No assigned tickets yet.</p>
          <p className="text-gray-400 text-sm mt-2">Tickets assigned to you will appear here.</p>
        </div>
      )}

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
