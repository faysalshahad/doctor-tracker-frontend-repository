
'use client';
import { useState, useEffect } from 'react';
import { getDoctors } from '../services/api';

export default function GuestHome() {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    loadPublicDoctors();
  }, [search, specialization, currentPage]);

  async function loadPublicDoctors() {
    try {
      const data = await getDoctors(search, specialization, currentPage, limit);
      // Ensure alphabetical order A-Z
      const sorted = (data.doctors || []).sort((a, b) => a.name.localeCompare(b.name));
      setDoctors(sorted);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  }

  function handleSpecializationChange(e) {
    setSpecialization(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Doctor Directory</h1>
          <p>Find trusted medical professionals easily.</p>
        </div>
        <a href="/login" style={{ padding: '10px 20px', background: '#0070f3', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
          Admin Login
        </a>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '15px', margin: '30px 0' }}>
        <input
          type="text"
          placeholder="Search by doctor name or hospital..."
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Filter by specialization..."
          value={specialization}
          onChange={handleSpecializationChange}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Doctor Cards / List in Alphabetical Order */}
      {loading ? <p>Loading directory...</p> : (
        <>
          <div style={{ display: 'grid', gap: '15px' }}>
            {doctors.length === 0 ? <p>No doctors found.</p> : doctors.map(doc => (
              <div key={doc._id} style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', border: '1px solid #eee' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>Dr. {doc.name}</h3>
                <p style={{ margin: '3px 0', color: '#555' }}><strong>Specialization:</strong> {doc.specialization}</p>
                <p style={{ margin: '3px 0', color: '#555' }}><strong>Hospital:</strong> {doc.hospital}</p>
                <p style={{ margin: '3px 0', color: '#777' }}><small>Contact: {doc.phone} | {doc.email}</small></p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px', padding: '12px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
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
        </>
      )}
    </main>
  );
}