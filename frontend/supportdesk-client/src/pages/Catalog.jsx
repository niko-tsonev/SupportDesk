import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets";
import { Link } from "react-router-dom";

export default function Catalog() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-semibold text-primary mb-6">
        Ticket Catalog
      </h2>

      <div className="grid gap-4">
        {tickets.map((t) => (
          <Link
            key={t.id}
            to={`/tickets/${t.id}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition p-5 border-l-4 border-secondary"
          >
            <h3 className="font-medium text-secondary">{t.subject}</h3>
            <p className="text-sm text-gray-600 mt-1">{t.customerEmail}</p>
            <p className="text-sm mt-2 text-accent">
              Status: {t.status}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
