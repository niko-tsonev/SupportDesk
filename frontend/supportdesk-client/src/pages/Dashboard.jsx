import { useEffect, useState } from "react";
import { getAssignedTickets } from "../api/tickets";
import TicketCard from "../components/TicketCard";

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    let isMounted = true;

    getAssignedTickets().then((data) => {
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
          <TicketCard key={t.id} ticket={t} />
        ))}
      </div>
    </div>
  );
}
