import api from "./axios";

export async function getTickets() {
  const res = await api.get("/api/tickets");
  return res.data;
}

export async function getTicketById(id) {
  const res = await api.get(`/api/tickets/${id}`);
  return res.data;
}

export async function createTicket(payload) {
  const res = await api.post("/api/tickets", payload);
  return res.data;
}

export async function updateTicket(id, payload) {
  await api.put(`/api/tickets/${id}`, payload);
}

export async function assignTicket(id) {
  await api.post(`/api/tickets/${id}/assign`);
}

export async function closeTicket(id) {
  await api.post(`/api/tickets/${id}/close`);
}

export async function deleteTicket(id) {
  await api.delete(`/api/tickets/${id}`);
}
