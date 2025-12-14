import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getTicketById, assignTicket, closeTicket } from "../api/tickets";

export default function TicketDetails() {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setError("");
      const data = await getTicketById(id);
      setTicket(data);
    } catch (e) {
      setError(e.message || "Failed to load ticket");
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onAssign = async () => {
    try {
      await assignTicket(id);
      await load();
    } catch (e) {
      setError(e.response?.data || e.message || "Assign failed");
    }
  };

  const onClose = async () => {
    try {
      await closeTicket(id);
      await load();
    } catch (e) {
      setError(e.response?.data || e.message || "Close failed");
    }
  };

  if (!ticket) return <div style={{ padding: 16 }}>Loading...</div>;

  return (
    <div style={{ padding: 16 }}>
      <h1>Ticket Details</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p><b>Subject:</b> {ticket.subject}</p>
      <p><b>Customer:</b> {ticket.customerEmail}</p>
      <p><b>Status:</b> {ticket.status}</p>
      <p><b>Description:</b> {ticket.description}</p>

      <div style={{ marginTop: 12 }}>
        <button onClick={onAssign}>Assign to me</button>{" "}
        <button onClick={onClose}>Close ticket</button>{" "}
        <Link to={`/tickets/${id}/reply`}>Reply</Link>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/">Back to Catalog</Link>
      </div>
    </div>
  );
}
