import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getClosedTickets } from "../api/tickets";
import StatusBadge from "../components/StatusBadge";

export default function History() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getClosedTickets().then((data) => {
      if (isMounted) {
        setTickets(data);
      }
    });

    // Cleanup function - runs on component unmount
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Closed Tickets
      </h2>

      {tickets.length === 0 && (
        <p className="text-gray-600">No closed tickets.</p>
      )}

      <div className="grid gap-4">
        {tickets.map((t) => (
          <Link
            key={t.id}
            to={`/tickets/${t.id}`}
            className="bg-white rounded-lg shadow p-5 hover:shadow-md transition border-l-4 border-green-600"
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
