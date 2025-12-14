import { useParams, Link } from "react-router-dom";

export default function TicketReply() {
  const { id } = useParams();

  return (
    <div style={{ padding: 16 }}>
      <h1>Reply to Ticket</h1>
      <p>Ticket ID: {id}</p>

      <p>This page will contain a reply form in Day 2 Step 2/3.</p>

      <Link to={`/tickets/${id}`}>Back to Ticket</Link>
    </div>
  );
}
