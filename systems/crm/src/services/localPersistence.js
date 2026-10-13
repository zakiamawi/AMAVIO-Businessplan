const jsonHeaders = { "Content-Type": "application/json" };

async function apiRequest(path, options = {}) {
  const response = await fetch(path, { ...options, headers: { ...jsonHeaders, ...(options.headers || {}) } });
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) throw new Error("Lokale SQLite-API ist nicht aktiv.");
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.error || `Lokale API antwortet mit ${response.status}.`);
  return payload;
}

export async function loadServerState() {
  return apiRequest("/api/state");
}

export async function saveServerState(state) {
  return apiRequest("/api/state", { method: "PUT", body: JSON.stringify({ state }) });
}

export async function createServerBackup(label = "Manuelle lokale Sicherung") {
  return apiRequest("/api/backups", { method: "POST", body: JSON.stringify({ label }) });
}

export async function listServerBackups() {
  return apiRequest("/api/backups");
}

export async function runServerRestoreDrill() {
  return apiRequest("/api/assurance/restore-drill", { method: "POST" });
}

export async function restoreServerBackup(id) {
  return apiRequest(`/api/backups/${encodeURIComponent(id)}/restore`, { method: "POST" });
}

export async function previewServerImport(state) {
  return apiRequest("/api/import/preview", { method: "POST", body: JSON.stringify({ state }) });
}

export async function applyServerImport(state) {
  return apiRequest("/api/import/apply", { method: "POST", body: JSON.stringify({ state }) });
}

export async function resetServerState() {
  return apiRequest("/api/reset", { method: "POST" });
}

export function downloadJson(filename, payload) {
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
