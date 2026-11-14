// const API_URL = 'http://localhost:5000/api';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://doctor-tracker-backend-render-faysal.onrender.com';

// Admin Login API
export async function adminLogin(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// Helper to get auth headers
function getAuthHeaders() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
}

// Public: Get Alphabetical Doctors for Guests & Admin
export async function getDoctors(search = '', specialization = '', page = 1, limit = 10) {
  const params = new URLSearchParams({
    search: search || '',
    specialization: specialization || '',
    page: page.toString(),
    limit: limit.toString()
  });
    const res = await fetch(`${API_URL}/doctors?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch doctors');
  return res.json();
}

// Protected: Create Doctor
export async function createDoctor(doctorData) {
  const res = await fetch(`${API_URL}/doctors`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) throw new Error('Failed to create doctor');
  return res.json();
}

// Protected: Update Doctor
export async function updateDoctor(doctorId, doctorData) {
  const res = await fetch(`${API_URL}/doctors/${doctorId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(doctorData),
  });
  if (!res.ok) throw new Error('Failed to update doctor');
  return res.json();
}

// Fetch Dashboard Analytics
export async function getDashboardAnalytics() {
  const res = await fetch(`${API_URL}/patients/analytics/dashboard`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

// Fetch Patients for a Specific Doctor
export async function getDoctorPatients(doctorId) {
  const res = await fetch(`${API_URL}/doctors/${doctorId}/patients`);
  if (!res.ok) throw new Error('Failed to fetch doctor patients');
  return res.json();
}

// Add a Patient under a specific Doctor
export async function addPatientToDoctor(doctorId, patientData) {
  const res = await fetch(`${API_URL}/doctors/${doctorId}/patients`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });
  if (!res.ok) throw new Error('Failed to add patient');
  return res.json();
}

// Fetch All Patients (with condition filter & search)
export async function getPatients(search = '', condition = '', page = 1, limit = 10) {
  const params = new URLSearchParams({
    search: search || '',
    condition: condition || '',
    page: page.toString(),
    limit: limit.toString()
  });
  const res = await fetch(`${API_URL}/patients?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch patients');
  return res.json();
}

// Update Patient Info
export async function updatePatient(patientId, patientData) {
  const res = await fetch(`${API_URL}/patients/${patientId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(patientData),
  });
  if (!res.ok) throw new Error('Failed to update patient');
  return res.json();
}

// Delete Patient (Protected with Auth Headers)
export async function deletePatient(patientId) {
  const res = await fetch(`${API_URL}/patients/${patientId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to delete patient');
  return res.json();
}

// Register a New Admin (Protected)
export async function registerAdmin(adminData) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(adminData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to register new admin');
  return data;
}