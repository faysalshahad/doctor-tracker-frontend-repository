
'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getDashboardAnalytics, getDoctors } from '../../services/api';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const router = useRouter();
  const [analytics, setAnalytics] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination for Doctor List Preview
  const [doctorPage, setDoctorPage] = useState(1);
  const [doctorTotalPages, setDoctorTotalPages] = useState(1);
  const limit = 10;

  // Pagination for the Analytics Chart (10 doctors per page on chart)
  const [chartPage, setChartPage] = useState(1);
  const chartLimit = 10;

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/login');
      return;
    }

    async function fetchData() {
      try {
        const analyticsData = await getDashboardAnalytics();
        const doctorsData = await getDoctors('', '', doctorPage, limit);
        setAnalytics(analyticsData);
        setDoctors(doctorsData.doctors || []);
        setDoctorTotalPages(doctorsData.totalPages || 1);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router, doctorPage]);

  function handleLogout() {
    localStorage.removeItem('adminToken');
    router.push('/login');
  }

  if (loading) return <div style={{ padding: '40px' }}>Loading Doctor Tracker...</div>;

  // Slice analytics data for chart pagination (10 doctors per page)
  const allChartData = analytics?.patientsPerDoctor || [];
  const chartTotalPages = Math.ceil(allChartData.length / chartLimit) || 1;
  const startIndex = (chartPage - 1) * chartLimit;
  const paginatedChartData = allChartData.slice(startIndex, startIndex + chartLimit);

  const chartData = {
    labels: paginatedChartData.map(item => `Dr. ${item.doctorName}`) || [],
    datasets: [
      {
        label: 'Patients Assigned',
        data: paginatedChartData.map(item => item.patientCount) || [],
        backgroundColor: 'rgba(0, 112, 243, 0.6)',
        borderColor: 'rgba(0, 112, 243, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Distribution of Patients per Doctor (Page ${chartPage} of ${chartTotalPages})` },
    },
  };

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Admin Header with Navigation & Logout */}
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

      <h1>Doctor Tracker Admin Dashboard</h1>
      <p>Welcome! Here is the live overview and visual data insights of your healthcare portal.</p>

      {/* Analytics Cards */}
      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>Total Doctors</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#0070f3' }}>{analytics?.totalDoctors || 0}</p>
        </div>
        <div style={{ background: '#f0f4f8', padding: '20px', borderRadius: '8px', flex: 1, textAlign: 'center' }}>
          <h3>Total Patients</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#28a745' }}>{analytics?.totalPatients || 0}</p>
        </div>
      </div>

      {/* Chart Section with Pagination */}
      <div style={{ background: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginTop: '40px' }}>
        {allChartData.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '20px' }}>No doctor data available to display in charts yet.</p>
        ) : (
          <>
            <Bar data={chartData} options={chartOptions} />

            {/* Chart Pagination Controls */}
            {chartTotalPages > 1 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '15px', padding: '8px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
                <button
                  onClick={() => setChartPage(prev => Math.max(prev - 1, 1))}
                  disabled={chartPage === 1}
                  style={{
                    padding: '6px 12px',
                    background: chartPage === 1 ? '#e0e0e0' : '#0070f3',
                    color: chartPage === 1 ? '#888' : '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: chartPage === 1 ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  ← Previous Chart Page
                </button>

                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#333' }}>
                  Chart Page {chartPage} of {chartTotalPages}
                </span>

                <button
                  onClick={() => setChartPage(prev => Math.min(prev + 1, chartTotalPages))}
                  disabled={chartPage === chartTotalPages}
                  style={{
                    padding: '6px 12px',
                    background: chartPage === chartTotalPages ? '#e0e0e0' : '#0070f3',
                    color: chartPage === chartTotalPages ? '#888' : '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: chartPage === chartTotalPages ? 'not-allowed' : 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px'
                  }}
                >
                  Next Chart Page →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Doctor List Preview with Pagination */}
      <h2 style={{ marginTop: '40px' }}>Registered Doctors</h2>
      {doctors.length === 0 ? (
        <p>No doctors found. You can add them through the management page.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {doctors.map((doc) => (
              <li key={doc._id} style={{ background: '#f9f9f9', padding: '12px', margin: '10px 0', borderRadius: '4px', border: '1px solid #eee' }}>
                <strong>Dr. {doc.name}</strong> - {doc.specialization} ({doc.hospital})
              </li>
            ))}
          </ul>

          {/* Doctor List Pagination Controls */}
          {doctorTotalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px', padding: '10px', background: '#f8f9fa', borderRadius: '6px', border: '1px solid #ddd' }}>
              <button
                onClick={() => setDoctorPage(prev => Math.max(prev - 1, 1))}
                disabled={doctorPage === 1}
                style={{
                  padding: '8px 14px',
                  background: doctorPage === 1 ? '#e0e0e0' : '#0070f3',
                  color: doctorPage === 1 ? '#888' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: doctorPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ← Previous
              </button>

              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>
                Page {doctorPage} of {doctorTotalPages}
              </span>

              <button
                onClick={() => setDoctorPage(prev => Math.min(prev + 1, doctorTotalPages))}
                disabled={doctorPage === doctorTotalPages}
                style={{
                  padding: '8px 14px',
                  background: doctorPage === doctorTotalPages ? '#e0e0e0' : '#0070f3',
                  color: doctorPage === doctorTotalPages ? '#888' : '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: doctorPage === doctorTotalPages ? 'not-allowed' : 'pointer',
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