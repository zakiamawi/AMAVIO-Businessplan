async function request(path) {
  const response = await fetch(path, { headers: { Accept: "application/json" } });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "Importierte CRM-Daten konnten nicht geladen werden.");
  return payload;
}

function queryString(parameters) {
  const query = new URLSearchParams();
  Object.entries(parameters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") query.set(key, String(value));
  });
  return query.toString();
}

export const importedCrmRecordsApi = Object.freeze({
  organizations: (parameters) => request(`/api/crm/imported/organizations?${queryString(parameters)}`),
  contacts: (parameters) => request(`/api/crm/imported/contacts?${queryString(parameters)}`),
  detail: (type, id) => request(`/api/crm/imported/detail/${encodeURIComponent(type)}/${encodeURIComponent(id)}`),
  search: async (search, pageSize = 6) => {
    const [organizations, contacts] = await Promise.all([
      request(`/api/crm/imported/organizations?${queryString({ search, page: 1, pageSize })}`),
      request(`/api/crm/imported/contacts?${queryString({ search, page: 1, pageSize })}`),
    ]);
    return { organizations, contacts };
  },
});
