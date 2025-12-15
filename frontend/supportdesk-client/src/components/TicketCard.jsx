import { Link } from "react-router-dom";
import StatusBadge from "./StatusBadge";

export default function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-l-4 border-secondary overflow-hidden group"
    >
      <div className="p-6 relative">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h3 className="text-lg font-semibold text-secondary group-hover:text-accent transition-colors flex-1">
            {ticket.subject}
          </h3>
          <div className="flex gap-2 flex-shrink-0">
            <StatusBadge status={ticket.status} />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-sm font-medium">{ticket.customerEmail}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm text-gray-500">Assigned to:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
              ticket.assignedToUserName 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {ticket.assignedToUserName || "Unassigned"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 text-gray-500 text-xs pt-1">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{new Date(ticket.createdAt).toLocaleDateString()} {new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {ticket.isPriority && (
              <span className="px-4 py-1 rounded-full text-sm font-semibold bg-purple-100/50 text-purple-700 border border-purple-300">
                Priority
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
