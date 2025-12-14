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
      <h2 className="text-2xl font-semibold text-primary mb-6">
        My Assigned Tickets
      </h2>

      {tickets.length === 0 && (
        <p className="text-gray-600">No assigned tickets.</p>
      )}

      <div className="grid gap-4">
        {tickets.map((t) => (
          <Link
            key={t.id}
            to={`/tickets/${t.id}`}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition border-l-4 border-secondary"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-secondary">{t.subject}</h3>
              <StatusBadge status={t.status} />
            </div>

            <p className="text-sm text-gray-600 mt-1">
              {t.customerEmail}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
