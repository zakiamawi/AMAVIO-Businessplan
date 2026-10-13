async function request(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Lokales Echtdaten-Staging konnte nicht geladen werden.");
  return payload;
}

function queryString(parameters) {
  const query = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") query.set(key, String(value));
  });
  return query.toString();
}

export const realDataStagingApi = Object.freeze({
  summary: () => request("/api/staging/summary"),
  organizations: (parameters) => request(`/api/staging/organizations?${queryString(parameters)}`),
  contacts: (parameters) => request(`/api/staging/contacts?${queryString(parameters)}`),
  reviewQueue: (parameters) => request(`/api/staging/review-queue?${queryString(parameters)}`),
  quarantine: (parameters) => request(`/api/staging/quarantine?${queryString(parameters)}`),
  sources: () => request("/api/staging/sources"),
  detail: (type, id) => request(`/api/staging/detail/${encodeURIComponent(type)}/${encodeURIComponent(id)}`),
});
