import { useEffect, useState } from "react";
import { getTickets } from "../api/tickets";
import TicketCard from "../components/TicketCard";

export default function Catalog() {
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  const sortTickets = (ticketList) => {
    const sorted = [...ticketList];

    switch (sortBy) {
      case "priority":
        return sorted.sort((a, b) => {
          if (a.isPriority === b.isPriority) return 0;
          return a.isPriority ? -1 : 1;
        });
      
      case "status":
        return sorted.sort((a, b) => a.status - b.status);
      
      case "name":
        return sorted.sort((a, b) => a.subject.localeCompare(b.subject));
      
      case "date":
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      case "assigned":
        return sorted.sort((a, b) => {
          const nameA = a.assignedToUserName || "zzz"; // Put unassigned at the end
          const nameB = b.assignedToUserName || "zzz";
          return nameA.localeCompare(nameB);
        });
      
      default:
        return sorted;
    }
  };

  const sortedTickets = sortTickets(tickets);
  const totalPages = Math.ceil(sortedTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTickets = sortedTickets.slice(startIndex, endIndex);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-primary">
          Ticket Catalog
        </h2>
        
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className="bg-white rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary shadow-sm"
          >
            <option value="date">Date (Newest)</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
            <option value="name">Name</option>
            <option value="assigned">Assigned To</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5">
        {currentTickets.map((t) => (
          <TicketCard key={t.id} ticket={t} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentPage === page
                    ? "bg-secondary text-white"
                    : "bg-white shadow-sm hover:bg-gray-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-white shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
