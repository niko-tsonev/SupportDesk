import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { assignTicket, unassignTicket, closeTicket, getTicketById, deleteTicket } from "../api/tickets";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../auth/AuthContext";

import { getReplies, addReply } from "../api/replies";
import ReplyList from "../components/ReplyList";
import ReplyForm from "../components/ReplyForm";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [replies, setReplies] = useState([]);

  const load = async () => {
    const data = await getTicketById(id);
    setTicket(data);
  };

  const loadReplies = async () => {
    const data = await getReplies(id);
    setReplies(data);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (isMounted) {
        await load();
        await loadReplies();
      }
    };

    fetchData();

    // Cleanup function - runs on component unmount or when id changes
    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleReplySubmit = async (payload) => {
    await addReply(id, payload);
    await loadReplies();
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) {
      return;
    }

    try {
      await deleteTicket(id);
      navigate("/");
    } catch (error) {
      alert("Failed to delete ticket. You may not have permission.");
    }
  };

  const isAdmin = user?.role === "Admin";

  // Check if any actions are available for the current user
  const hasActions = () => {
    if (isAdmin) return true; // Admins always have delete button
    if (!user || ticket.status === 2) return false; // No actions if not logged in or ticket closed
    
    // Check if any of the action buttons would be shown
    const canAssign = !ticket.assignedToUserId;
    const canUnassign = ticket.assignedToUserId === user?.userId;
    const canClose = ticket.assignedToUserId === user?.userId;
    
    return canAssign || canUnassign || canClose;
  };


  if (!ticket) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4 gap-3">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-bold text-primary mb-2 break-words">
              {ticket.subject}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1 break-all">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="truncate">{ticket.customerEmail}</span>
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {ticket.isPriority && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Priority
              </span>
            )}
            <StatusBadge status={ticket.status} />
          </div>
        </div>

        <div className="border-t pt-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Description</h2>
          <div className="p-3 sm:p-4 rounded border bg-gray-50 border-gray-200">
            <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
              {ticket.description}
            </p>
          </div>
        </div>

        <div className="pt-4 mt-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <span className="font-semibold text-gray-700">Assigned to:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              ticket.assignedToUserName 
                ? "bg-blue-100 text-blue-800" 
                : "bg-gray-100 text-gray-600"
            }`}>
              {ticket.assignedToUserName || "Unassigned"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {hasActions() && (
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Actions</h3>
          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3">
            {user && ticket.status !== 2 && (
              <>
                {!ticket.assignedToUserId && (
                  <button
                    onClick={async () => {
                      await assignTicket(id);
                      load();
                    }}
                    className="w-full sm:w-auto bg-blue-500 text-white px-5 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Assign to me
                  </button>
                )}

                {ticket.assignedToUserId && ticket.assignedToUserId === user?.userId && (
                  <button
                    onClick={async () => {
                      await unassignTicket(id);
                      load();
                    }}
                    className="w-full sm:w-auto bg-gray-600 text-white px-5 py-2.5 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7a4 4 0 11-8 0 4 4 0 018 0zM9 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Unassign from me
                  </button>
                )}

                {(isAdmin || ticket.assignedToUserId === user?.userId) && (
                  <button
                    onClick={async () => {
                      await closeTicket(id);
                      load();
                    }}
                    className="w-full sm:w-auto bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Close ticket
                  </button>
                )}
              </>
            )}

            {isAdmin && (
              <button
                onClick={handleDelete}
                className="w-full sm:w-auto bg-red-600 text-white px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 sm:ml-auto"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Ticket
              </button>
            )}
          </div>
        </div>
      )}

      {/* Back Link */}
      <div className="mb-4 sm:mb-6">
        <Link className="text-secondary hover:text-accent transition-colors flex items-center gap-1 text-sm font-medium" to="/">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to catalog
        </Link>
      </div>

      {/* Replies Section */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-bold text-primary mb-4 sm:mb-6 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Replies
        </h3>

        <ReplyList replies={replies} />

        {user && ticket.status !== 2 && (
          <ReplyForm onSubmit={handleReplySubmit} />
        )}
      </div>
    </div>
  );
}
