const API_BASE = 'http://localhost:3000/api';

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ username, email, password }),
  });
  return res.json();
};
export const fetchProfile = async () => {
  const res = await fetch(`${API_BASE}/profile`, {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  return res.json();
};
export const updateProfile = async (profile) => {
  const res = await fetch(`${API_BASE}/profile/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(profile),
  });
  return res.json();
};