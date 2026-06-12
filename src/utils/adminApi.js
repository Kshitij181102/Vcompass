import apis from './apis';

const req = async (url, options = {}) => {
  const res = await fetch(url, { credentials: 'include', headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
};

export const adminApi = {
  // Stats
  getStats: () => req(apis().adminStats),

  // Users
  getUsers:      (params = '') => req(`${apis().adminUsers}?${params}`),
  getUser:       (id)          => req(`${apis().adminUsers}/${id}`),
  updateUser:    (id, body)    => req(`${apis().adminUsers}/${id}`,      { method: 'PUT',   body: JSON.stringify(body) }),
  deleteUser:    (id)          => req(`${apis().adminUsers}/${id}`,      { method: 'DELETE' }),
  updateRole:    (id, role)    => req(`${apis().adminUsers}/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role }) }),

  // Mentors
  getMentors:    (params = '') => req(`${apis().adminMentors}?${params}`),
  createMentor:  (body)        => req(apis().adminMentors,               { method: 'POST',  body: JSON.stringify(body) }),
  updateMentor:  (id, body)    => req(`${apis().adminMentors}/${id}`,    { method: 'PUT',   body: JSON.stringify(body) }),
  deleteMentor:  (id)          => req(`${apis().adminMentors}/${id}`,    { method: 'DELETE' }),

  // News
  getNews:       (params = '') => req(`${apis().adminNews}?${params}`),
  createNews:    (body)        => req(apis().adminNews,                  { method: 'POST',  body: JSON.stringify(body) }),
  updateNews:    (id, body)    => req(`${apis().adminNews}/${id}`,       { method: 'PUT',   body: JSON.stringify(body) }),
  deleteNews:    (id)          => req(`${apis().adminNews}/${id}`,       { method: 'DELETE' }),

  // Posters
  getPosters:    (params = '') => req(`${apis().adminPosters}?${params}`),
  createPoster:  (body)        => req(apis().adminPosters,               { method: 'POST',  body: JSON.stringify(body) }),
  updatePoster:  (id, body)    => req(`${apis().adminPosters}/${id}`,    { method: 'PUT',   body: JSON.stringify(body) }),
  deletePoster:  (id)          => req(`${apis().adminPosters}/${id}`,    { method: 'DELETE' }),

  // Bookings
  getBookings:   (params = '') => req(`${apis().adminBookings}?${params}`),
  deleteBooking: (id)          => req(`${apis().adminBookings}/${id}`,   { method: 'DELETE' }),
  updateBooking: (id, body)    => req(`${apis().adminBookings}/${id}/status`, { method: 'PATCH', body: JSON.stringify(body) }),
};
