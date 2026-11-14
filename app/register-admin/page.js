'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { registerAdmin } from '../../services/api';

export default function RegisterAdminPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/login');
  }

  async function handleRegister(e) {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await registerAdmin({ email, password });
      setMessage(`Successfully registered new admin: ${email}`);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      {/* Admin Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', background: '#f8f9fa', padding: '10px 15px', borderRadius: '6px', border: '1px solid #ddd' }}>
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

      <div style={{ background: '#fff', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto' }}>
        <h2>Register New Administrator</h2>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>Authorized admins can create credentials for other team members.</p>

        {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '14px' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginBottom: '15px', fontSize: '14px' }}>{message}</p>}

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>New Admin Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>Temporary Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <button type="submit" style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            Create Admin Account
          </button>
        </form>
      </div>
    </main>
  );
}