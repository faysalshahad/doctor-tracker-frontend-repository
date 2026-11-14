// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { getPatients, deletePatient, updatePatient, getDoctors } from '../../services/api';

// export default function PatientsPage() {
//   const router = useRouter();
//   const [patients, setPatients] = useState([]);
//   const [doctors, setDoctors] = useState([]);
//   const [search, setSearch] = useState('');
//   const [conditionFilter, setConditionFilter] = useState('');
//   const [editingPatient, setEditingPatient] = useState(null);

//   useEffect(() => {
//     const token = localStorage.getItem('adminToken');
//     if (!token) {
//       router.push('/login');
//       return;
//     }
//     loadPatients();
//     loadDoctorsList();
//   }, [search, conditionFilter, router]);

//   async function loadPatients() {
//     try {
//       const data = await getPatients(search, conditionFilter);
//       const sortedPatients = (data.patients || []).sort((a, b) => a.name.localeCompare(b.name));
//       setPatients(sortedPatients);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   async function loadDoctorsList() {
//     try {
//       const data = await getDoctors();
//       const sortedDocs = (data.doctors || []).sort((a, b) => a.name.localeCompare(b.name));
//       setDoctors(sortedDocs);
//     } catch (err) {
//       console.error(err);
//     }
//   }

//   function handleLogout() {
//     localStorage.removeItem('adminToken');
//     router.push('/login');
//   }

//   async function handleDelete(id) {
//     if (confirm('Are you sure you want to delete this patient?')) {
//       try {
//         await deletePatient(id);
//         loadPatients();
//       } catch (err) {
//         alert('Failed to delete patient');
//       }
//     }
//   }

//   async function handleUpdate(e) {
//     e.preventDefault();
//     try {
//       await updatePatient(editingPatient._id, {
//         name: editingPatient.name,
//         age: editingPatient.age,
//         condition: editingPatient.condition,
//         phone: editingPatient.phone,
//         doctor: editingPatient.doctor?._id || editingPatient.doctor
//       });
//       setEditingPatient(null);
//       loadPatients();
//     } catch (err) {
//       alert('Failed to update patient');
//     }
//   }

//   return (
//     <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
//       {/* Admin Navigation & Logout Header */}
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ddd' }}>
//         <div style={{ display: 'flex', gap: '15px' }}>
//           <a href="/dashboard" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Dashboard</a>
//           <a href="/doctors" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Manage Doctors</a>
//           <a href="/patients" style={{ textDecoration: 'none', color: '#0070f3', fontWeight: 'bold' }}>Manage Patients</a>
//         </div>
//         <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
//           Logout
//         </button>
//       </div>

//       <h1>Patient Directory (Alphabetical)</h1>

//       <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
//         <input
//           type="text"
//           placeholder="Search patients by name..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
//         />
//         <input
//           type="text"
//           placeholder="Filter by condition..."
//           value={conditionFilter}
//           onChange={(e) => setConditionFilter(e.target.value)}
//           style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
//         />
//       </div>

//       {editingPatient && (
//         <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
//           <h3>Edit Patient & Reassign Doctor</h3>
//           <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
//             <input type="text" placeholder="Name" value={editingPatient.name} onChange={e => setEditingPatient({...editingPatient, name: e.target.value})} required style={{padding: '8px'}} />
//             <input type="number" placeholder="Age" value={editingPatient.age} onChange={e => setEditingPatient({...editingPatient, age: e.target.value})} required style={{padding: '8px'}} />
//             <input type="text" placeholder="Condition" value={editingPatient.condition} onChange={e => setEditingPatient({...editingPatient, condition: e.target.value})} required style={{padding: '8px'}} />
//             <input type="text" placeholder="Phone" value={editingPatient.phone} onChange={e => setEditingPatient({...editingPatient, phone: e.target.value})} required style={{padding: '8px'}} />
            
//             <select
//               value={editingPatient.doctor?._id || editingPatient.doctor || ''}
//               onChange={e => setEditingPatient({...editingPatient, doctor: e.target.value})}
//               required
//               style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', background: '#fff' }}
//             >
//               <option value="" disabled>Select Doctor</option>
//               {doctors.map(doc => (
//                 <option key={doc._id} value={doc._id}>
//                   Dr. {doc.name} ({doc.specialization})
//                 </option>
//               ))}
//             </select>

//             <button type="submit" style={{ padding: '8px 15px', background: '#ffc107', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Update</button>
//             <button type="button" onClick={() => setEditingPatient(null)} style={{ padding: '8px 15px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Cancel</button>
//           </form>
//         </div>
//       )}

//       <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
//         <thead>
//           <tr style={{ background: '#f0f4f8', textAlign: 'left' }}>
//             <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Age</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Condition</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Assigned Doctor</th>
//             <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {patients.length === 0 ? (
//             <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No patients found.</td></tr>
//           ) : (
//             patients.map(p => (
//               <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
//                 <td style={{ padding: '10px' }}>{p.name}</td>
//                 <td style={{ padding: '10px' }}>{p.age}</td>
//                 <td style={{ padding: '10px' }}>{p.condition}</td>
//                 <td style={{ padding: '10px' }}>{p.doctor?.name ? `Dr. ${p.doctor.name}` : 'Unassigned'}</td>
//                 <td style={{ padding: '10px' }}>
//                   <button onClick={() => setEditingPatient(p)} style={{ marginRight: '10px', padding: '5px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
//                   <button onClick={() => handleDelete(p._id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
//                 </td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </main>
//   );
// }



'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getPatients, deletePatient, updatePatient } from '../../services/api';

export default function PatientsPage() {
  const router = useRouter();
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [editingPatient, setEditingPatient] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }
    loadPatients();
  }, [search, conditionFilter, currentPage, router]);

  async function loadPatients() {
    try {
      const data = await getPatients(search, conditionFilter, currentPage, limit);
      const sortedPatients = (data.patients || []).sort((a, b) => a.name.localeCompare(b.name));
      setPatients(sortedPatients);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error(err);
    }
  }

  function handleSearchChange(e) {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to page 1 on search
  }

  function handleConditionChange(e) {
    setConditionFilter(e.target.value);
    setCurrentPage(1); // Reset to page 1 on filter
  }

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/login');
  }

  async function handleDelete(id) {
    if (confirm('Are you sure you want to delete this patient?')) {
      try {
        await deletePatient(id);
        loadPatients();
      } catch (err) {
        alert('Failed to delete patient');
      }
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      // Send updated info without doctor reassignment field
      await updatePatient(editingPatient._id, {
        name: editingPatient.name,
        age: editingPatient.age,
        condition: editingPatient.condition,
        phone: editingPatient.phone
      });
      setEditingPatient(null);
      loadPatients();
      alert('Patient updated successfully!');
    } catch (err) {
      alert('Failed to update patient');
    }
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
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

      <h1>Patient Directory (Alphabetical)</h1>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search patients by name..."
          value={search}
          onChange={handleSearchChange}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
        <input
          type="text"
          placeholder="Filter by condition..."
          value={conditionFilter}
          onChange={handleConditionChange}
          style={{ padding: '10px', flex: 1, borderRadius: '4px', border: '1px solid #ccc' }}
        />
      </div>

      {/* Edit Form (Doctor Dropdown Removed) */}
      {editingPatient && (
        <div style={{ background: '#fff3cd', padding: '20px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #ffeeba' }}>
          <h3>Edit Patient Information</h3>
          <form onSubmit={handleUpdate} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
            <input type="text" placeholder="Name" value={editingPatient.name} onChange={e => setEditingPatient({...editingPatient, name: e.target.value})} required style={{padding: '8px'}} />
            <input type="number" placeholder="Age" value={editingPatient.age} onChange={e => setEditingPatient({...editingPatient, age: e.target.value})} required style={{padding: '8px'}} />
            <input type="text" placeholder="Condition" value={editingPatient.condition} onChange={e => setEditingPatient({...editingPatient, condition: e.target.value})} required style={{padding: '8px'}} />
            <input type="text" placeholder="Phone" value={editingPatient.phone} onChange={e => setEditingPatient({...editingPatient, phone: e.target.value})} required style={{padding: '8px'}} />
            
            <button type="submit" style={{ padding: '8px 15px', background: '#ffc107', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>Update</button>
            <button type="button" onClick={() => setEditingPatient(null)} style={{ padding: '8px 15px', background: '#ccc', border: 'none', cursor: 'pointer', borderRadius: '4px' }}>Cancel</button>
          </form>
        </div>
      )}

      {/* Patients Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ background: '#f0f4f8', textAlign: 'left' }}>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Name</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Age</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Condition</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Assigned Doctor</th>
            <th style={{ padding: '10px', borderBottom: '1px solid #ddd' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {patients.length === 0 ? (
            <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center' }}>No patients found.</td></tr>
          ) : (
            patients.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>{p.name}</td>
                <td style={{ padding: '10px' }}>{p.age}</td>
                <td style={{ padding: '10px' }}>{p.condition}</td>
                <td style={{ padding: '10px' }}>{p.doctor?.name ? `Dr. ${p.doctor.name}` : 'Unassigned'}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => setEditingPatient(p)} style={{ marginRight: '10px', padding: '5px 10px', background: '#17a2b8', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(p._id)} style={{ padding: '5px 10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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
    </main>
  );
}