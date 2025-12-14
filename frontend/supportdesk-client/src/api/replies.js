import api from "./axios";

export async function getReplies(ticketId) {
  const res = await api.get(`/api/tickets/${ticketId}/replies`);
  return res.data;
}

export async function addReply(ticketId, payload) {
  await api.post(`/api/tickets/${ticketId}/replies`, payload);
}
