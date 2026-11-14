'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getDoctors, createDoctor, updateDoctor, getDoctorPatients, addPatientToDoctor, deletePatient, updatePatient } from '../../services/api';

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patients, setPatients] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [docForm, setDocForm] = useState({ name: '', specialization: '', hospital: '', phone: '', email: '' });
  const [editingDocId, setEditingDocId] = useState(null);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', condition: '', phone: '' });

  // Inline Patient Edit State
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [patientEditForm, setPatientEditForm] = useState({ name: '', age: '', condition: '', phone: '' });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    loadDoctors();
  }, [search, currentPage, router]);

  async function loadDoctors() {
    try {
      const data = await getDoctors(search, '', currentPage, limit);
      setDoctors(data.doctors || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 when search query changes
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/login');
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      if (editingDocId) {
        await updateDoctor(editingDocId, docForm);
        alert('Doctor updated successfully!');
      } else {
        await createDoctor(docForm);
        alert('Doctor created successfully!');
      }
      resetDocForm();
      loadDoctors();
    } catch (err) {
      alert('Error saving doctor');
    }
  }

  function handleEditClick(doc, e) {
    e.stopPropagation();
    setEditingDocId(doc._id);
    setDocForm({
      name: doc.name,
      specialization: doc.specialization,
      hospital: doc.hospital,
      phone: doc.phone,
      email: doc.email
    });
  }

  function resetDocForm() {
    setEditingDocId(null);
    setDocForm({ name: '', specialization: '', hospital: '', phone: '', email: '' });
  }

  async function handleSelectDoctor(doc) {
    setSelectedDoctor(doc);
    setEditingPatientId(null); // Reset any active patient edit form
    try {
      const pats = await getDoctorPatients(doc._id);
      const sortedPats = pats.sort((a, b) => a.name.localeCompare(b.name));
      setPatients(sortedPats);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddPatient(e) {
    e.preventDefault();
    if (!selectedDoctor) return;
    try {
      await addPatientToDoctor(selectedDoctor._id, newPatient);
      setNewPatient({ name: '', age: '', condition: '', phone: '' });
      const pats = await getDoctorPatients(selectedDoctor._id);
      setPatients(pats.sort((a, b) => a.name.localeCompare(b.name)));
    } catch (err) {
      alert('Error adding patient');
    }
  }

  async function handleDeletePatient(patientId) {
    if (!selectedDoctor) return;
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(patientId);
        const pats = await getDoctorPatients(selectedDoctor._id);
        setPatients(pats.sort((a, b) => a.name.localeCompare(b.name)));
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  }

  function handleStartEditPatient(p) {
    setEditingPatientId(p._id);
    setPatientEditForm({
      name: p.name,
      age: p.age,
      condition: p.condition,
      phone: p.phone
    });
  }

  async function handleUpdatePatient(patientId, e) {
    e.preventDefault();
    if (!selectedDoctor) return;
    try {
      await updatePatient(patientId, patientEditForm);
      setEditingPatientId(null);
      const pats = await getDoctorPatients(selectedDoctor._id);
      setPatients(pats.sort((a, b) => a.name.localeCompare(b.name)));
      alert('Patient updated successfully!');
    } catch (err) {
      alert('Failed to update patient');
    }
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Admin Navigation & Logout Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ddd' }}>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="/dashboard" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Dashboard</a>
          <a href="/doctors" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Manage Doctors</a>
          <a href="/patients" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Manage Patients</a>
          <a href="/register-admin" style={{ textDecoration: 'none', color: '#28a745', fontWeight: 'bold' }}>Register Admin</a>
        </div>
        <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Logout
        </button>
      </div>

      <h1>Doctor Management</h1>

      <div style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search doctors by name, specialization, hospital..."
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '10px', width: '100%', maxWidth: '400px', borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '30px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ background: editingDocId ? '#fff3cd' : '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px', border: editingDocId ? '1px solid #ffeeba' : '1px solid #ddd' }}>
            <h2>{editingDocId ? 'Edit Doctor Details' : 'Add New Doctor'}</h2>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
              <input type="text" placeholder="Name" value={docForm.name} onChange={e => setDocForm({...docForm, name: e.target.value})} required style={{padding: '8px'}} />
              <input type="text" placeholder="Specialization" value={docForm.specialization} onChange={e => setDocForm({...docForm, specialization: e.target.value})} required style={{padding: '8px'}} />
              <input type="text" placeholder="Hospital" value={docForm.hospital} onChange={e => setDocForm({...docForm, hospital: e.target.value})} required style={{padding: '8px'}} />
              <input type="text" placeholder="Phone" value={docForm.phone} onChange={e => setDocForm({...docForm, phone: e.target.value})} required style={{padding: '8px'}} />
              <input type="email" placeholder="Email" value={docForm.email} onChange={e => setDocForm({...docForm, email: e.target.value})} required style={{padding: '8px'}} />
              
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: editingDocId ? '#ffc107' : '#0070f3', color: editingDocId ? '#000' : '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>
                  {editingDocId ? 'Update Doctor' : 'Save Doctor'}
                </button>
                {editingDocId && (
                  <button type="button" onClick={resetDocForm} style={{ padding: '10px 15px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <h2>All Doctors (Alphabetical)</h2>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {doctors.map(doc => (
              <li key={doc._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '10px 0', background: selectedDoctor?._id === doc._id ? '#e6f0ff' : '#f9f9f9', padding: '12px', borderRadius: '4px', border: '1px solid #eee' }}>
                <div onClick={() => handleSelectDoctor(doc)} style={{ cursor: 'pointer', flex: 1 }}>
                  <strong>Dr. {doc.name}</strong> ({doc.specialization}) <br />
                  <small>{doc.hospital} | {doc.phone}</small>
                </div>
                <button onClick={(e) => handleEditClick(doc, e)} style={{ padding: '5px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}>
                  Edit
                </button>
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '8px 14px',
                  background: currentPage === 1 ? '#e0e0e0' : '#0070f3',
                  color: currentPage === 1 ? '#888' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Previous
              </button>

              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '8px 14px',
                  background: currentPage === totalPages ? '#e0e0e0' : '#0070f3',
                  color: currentPage === totalPages ? '#888' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                Next →
              </button>
            </div>
          )}
        </div>

        <div style={{ flex: 1, background: '#f4f6f9', padding: '20px', borderRadius: '8px' }}>
          {selectedDoctor ? (
            <div>
              <h3>Patients under Dr. {selectedDoctor.name}</h3>
              
              <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: '8px', margin: '15px 0' }}>
                <h4>Add Patient</h4>
                <input type="text" placeholder="Patient Name" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} required style={{padding: '6px'}} />
                <input type="number" placeholder="Age" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} required style={{padding: '6px'}} />
                <input type="text" placeholder="Condition/Diagnosis" value={newPatient.condition} onChange={e => setNewPatient({...newPatient, condition: e.target.value})} required style={{padding: '6px'}} />
                <input type="text" placeholder="Phone" value={newPatient.phone} onChange={e => setNewPatient({...newPatient, phone: e.target.value})} required style={{padding: '6px'}} />
                <button type="submit" style={{ padding: '8px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Add Patient to Doctor</button>
              </form>

              <ul style={{ listStyle: 'none', padding: 0 }}>
                {patients.length === 0 ? <p>No patients assigned to this doctor yet.</p> : patients.map(p => (
                  <li key={p._id} style={{ background: '#fff', padding: '10px', margin: '6px 0', borderRadius: '4px', border: '1px solid #e0e0e0' }}>
                    {editingPatientId === p._id ? (
                      /* Inline Patient Edit Form */
                      <form onSubmit={(e) => handleUpdatePatient(p._id, e)} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <input type="text" value={patientEditForm.name} onChange={e => setPatientEditForm({...patientEditForm, name: e.target.value})} required style={{padding: '5px'}} />
                        <input type="number" value={patientEditForm.age} onChange={e => setPatientEditForm({...patientEditForm, age: e.target.value})} required style={{padding: '5px'}} />
                        <input type="text" value={patientEditForm.condition} onChange={e => setPatientEditForm({...patientEditForm, condition: e.target.value})} required style={{padding: '5px'}} />
                        <input type="text" value={patientEditForm.phone} onChange={e => setPatientEditForm({...patientEditForm, phone: e.target.value})} required style={{padding: '5px'}} />
                        <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
                          <button type="submit" style={{ padding: '4px 10px', background: '#ffc107', color: '#000', border: 'none', borderRadius: '3px', cursor: 'pointer', fontWeight: 'bold' }}>Save</button>
                          <button type="button" onClick={() => setEditingPatientId(null)} style={{ padding: '4px 10px', background: '#ccc', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </form>
                    ) : (
                      /* Normal View Mode */
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong>{p.name}</strong> (Age: {p.age}) - {p.condition} <br />
                          <small style={{ color: '#666' }}>Phone: {p.phone}</small>
                        </div>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button
                            onClick={() => handleStartEditPatient(p)}
                            style={{ padding: '4px 8px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeletePatient(p._id)}
                            style={{ padding: '4px 8px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer', fontSize: '12px' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ color: '#666', textAlign: 'center', marginTop: '50px' }}>Select a doctor from the list to view and manage their patients.</p>
          )}
        </div>
      </div>
    </main>
  );
}