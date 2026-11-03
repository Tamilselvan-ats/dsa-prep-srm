const API_BASE = '/api';

export async function askAITutor(query) {
  const res = await fetch(`${API_BASE}/tutor/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function fetchSyllabus() {
  const res = await fetch(`${API_BASE}/syllabus`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function fetchLabs() {
  const res = await fetch(`${API_BASE}/labs`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function evaluateLabCode(payload) {
  const res = await fetch(`${API_BASE}/lab-simulator/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function sendVivaAnswer(payload) {
  const res = await fetch(`${API_BASE}/viva/turn`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function analyzeCodeSnippet(payload) {
  const res = await fetch(`${API_BASE}/code/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function fetchRevisionNotes(mode, unit) {
  const params = new URLSearchParams({ mode, unit: unit || 'all' });
  const res = await fetch(`${API_BASE}/revision?${params.toString()}`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function fetchQuestions(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_BASE}/questions?${params.toString()}`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}

export async function fetchPlacementModules() {
  const res = await fetch(`${API_BASE}/placement`);
  if (!res.ok) throw new Error(`Server responded with ${res.status}`);
  return res.json();
}
