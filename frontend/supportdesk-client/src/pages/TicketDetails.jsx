import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { assignTicket, closeTicket, getTicketById } from "../api/tickets";
import StatusBadge from "../components/StatusBadge";
import { useAuth } from "../auth/AuthContext";

import { getReplies, addReply } from "../api/replies";
import ReplyList from "../components/ReplyList";
import ReplyForm from "../components/ReplyForm";

export default function TicketDetails() {
  const { id } = useParams();
  const { user } = useAuth();
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
    load();
    loadReplies();
  }, [id]);

  const handleReplySubmit = async (payload) => {
    await addReply(id, payload);
    await loadReplies();
  };


  if (!ticket) return null;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-xl font-semibold text-primary">
          {ticket.subject}
        </h2>
        <StatusBadge status={ticket.status} />
      </div>

      <p className="text-gray-700 mb-2">
        <strong>Customer:</strong> {ticket.customerEmail}
      </p>

      <p className="text-gray-700 mb-6">
        {ticket.description}
      </p>

      <p className="text-gray-700 mb-2">
        <strong>Assigned to:</strong>{" "}
        {ticket.assignedToUserEmail || "Unassigned"}
      </p>

      {user && ticket.status !== 2 && (
        <div className="space-x-3">
          <button
            onClick={async () => {
              await assignTicket(id);
              load();
            }}
            className="bg-secondary text-white px-4 py-2 rounded hover:bg-accent"
          >
            Assign to me
          </button>

          <button
            onClick={async () => {
              await closeTicket(id);
              load();
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Close ticket
          </button>
        </div>
      )}

      <div className="mt-6">
        <Link className="text-secondary hover:underline" to="/">
          ← Back to catalog
        </Link>
      </div>

      <div className="mt-8 border-t pt-6">
        <h3 className="text-lg font-semibold text-primary mb-4">
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
