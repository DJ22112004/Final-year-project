import React, { useState, Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import axios from 'axios';
import { io } from "socket.io-client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

const DispenserModel = (props) => {
  const { scene } = useGLTF('/dispenser.glb');
  return <primitive object={scene} scale={2.5} position={[0, -1.5, 0]} {...props} />;
};
const SplashScreen = ({ onEnter }) => {
  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', backgroundColor: '#111827', color: 'white', overflow: 'hidden' }}>
      <Canvas camera={{ position: [0, 1, 10], fov: 50 }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 5]} intensity={2} />
        <Suspense fallback={null}>
          <DispenserModel />
          <OrbitControls enableZoom={true} autoRotate={true} autoRotateSpeed={1.0} />
        </Suspense>
      </Canvas>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', pointerEvents: 'none', textAlign: 'center', padding: '1rem' }}>
        <h1 style={{ fontSize: 'clamp(2rem, 8vw, 4rem)', fontWeight: 'bold', marginBottom: '1rem' }}>Smart Medicine Dispenser</h1>
        <p style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)', marginBottom: '2rem', color: '#d1d5db' }}>Your Health, Automated and Assured.</p>
        <button onClick={onEnter} style={{ pointerEvents: 'auto', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', padding: '0.75rem 2rem', borderRadius: '0.5rem', fontSize: '1.125rem', border: 'none', cursor: 'pointer', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>Open Dispenser</button>
      </div>
    </div>
  );
};

const AdherenceChart = ({ logs }) => {
    const takenCount = logs.filter(l => l.status === 'TAKEN').length;
    const missedCount = logs.filter(l => l.status === 'MISSED').length;
    const totalDoses = takenCount + missedCount;
    const adherenceRate = totalDoses > 0 ? Math.round((takenCount / totalDoses) * 100) : 100;

    const data = {
        labels: ['Taken', 'Missed'],
        datasets: [{
            data: [takenCount, missedCount],
            backgroundColor: ['#34D399', '#F87171'],
            borderColor: ['#ffffff'],
            borderWidth: 4,
            hoverOffset: 4
        }]
    };
    const options = { responsive: true, maintainAspectRatio: false, cutout: '80%', plugins: { legend: { display: false } } };

    return (
        <div style={{ position: 'relative', width: '180px', height: '180px', margin: '0 auto' }}>
            <Doughnut data={data} options={options} />
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#1f2937' }}>{adherenceRate}%</span>
            </div>
        </div>
    );
};

const WeeklyActivityChart = ({ logs }) => {
    const weeklyData = { Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0 };
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    logs.forEach(log => {
        const dayIndex = new Date(log.dispenseTime).getDay();
        if (log.status === 'TAKEN') weeklyData[days[dayIndex]]++;
    });

    const data = {
        labels: Object.keys(weeklyData),
        datasets: [{
            label: 'Doses Taken',
            data: Object.values(weeklyData),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 1,
            borderRadius: 4
        }]
    };
    const options = {
        responsive: true, maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } },
        plugins: { legend: { display: false } }
    };
    return <Bar data={data} options={options} />;
};


// DASHBOARD SUB-COMPONENTS (UPDATED)                             //
//================================================================//

// --- Dashboard Home Page (with Charts) ---
const DashboardHomePage = ({ data }) => (
    <div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6b7280' }}>Total Medications</h3>
                <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>{data.medications.length}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6b7280' }}>Active Schedules</h3>
                <p style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#111827', marginTop: '0.5rem' }}>{data.schedule.length}</p>
            </div>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: '500', color: '#6b7280', marginBottom: '1rem' }}>Adherence Rate</h3>
                 <AdherenceChart logs={data.logs} />
            </div>
        </div>
        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr', lg: 'grid-template-columns: 2fr 1fr', gap: '1.5rem' }}>
             <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '400px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Weekly Activity</h3>
                <WeeklyActivityChart logs={data.logs} />
             </div>
             <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Recent Dispense Logs</h3>
                <ul style={{ listStyle: 'none', padding: 0, height: '320px', overflowY: 'auto' }}>
                    {data.logs.slice(-10).reverse().map(log => (
                        <li key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0', borderBottom: '1px solid #e5e7eb' }}>
                            <div>
                                <p style={{ fontWeight: '500' }}>{log.medicationName}</p>
                                <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{new Date(log.dispenseTime).toLocaleDateString()}</p>
                            </div>
                            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', color: log.status === 'TAKEN' ? '#059669' : '#dc2626', backgroundColor: log.status === 'TAKEN' ? '#d1fae5' : '#fee2e2' }}>{log.status}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);


const MedicationsPage = ({ medications, addMedication }) => {
    const [name, setName] = useState('');
    const [sifter, setSifter] = useState('');
    const handleSubmit = (e) => { e.preventDefault(); addMedication({ name, sifterDiscType: sifter }); setName(''); setSifter(''); };
    return (<div><div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}><h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Add New Medication</h3><form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}><FormInput label="Medication Name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Paracetamol" /><FormInput label="Sifter Disc Type" type="text" value={sifter} onChange={e => setSifter(e.target.value)} placeholder="e.g., Circular" /><button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', height: '46px' }}>Add</button></form></div><div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Your Medications</h3>{medications.map(med => (<div key={med.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', marginBottom: '1rem' }}><p><strong>Name:</strong> {med.name}</p><p><strong>Required Disc:</strong> {med.sifterDiscType}</p></div>))}</div></div>);
};


const SchedulePage = ({ schedule, medications, addSchedule }) => {
    const [medId, setMedId] = useState('');
    const [time, setTime] = useState('');
    const [dosage, setDosage] = useState(1);
    const handleSubmit = (e) => { e.preventDefault(); addSchedule({ medicationId: medId, time, dosage }); setMedId(''); setTime(''); setDosage(1); };
    return (<div><div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '2rem' }}><h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Add New Schedule</h3><form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}><div><label style={{ display: 'block', marginBottom: '0.5rem' }}>Medication</label><select value={medId} onChange={e => setMedId(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', height: '46px' }} required><option value="" disabled>Select...</option>{medications.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div><FormInput label="Time" type="time" value={time} onChange={e => setTime(e.target.value)} /><FormInput label="Dosage" type="number" value={dosage} onChange={e => setDosage(e.target.value)} /><button type="submit" style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer', height: '46px' }}>Add</button></form></div><div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Your Schedule</h3>{schedule.map(s => { const med = medications.find(m => m.id === s.medicationId); return (<div key={s.id} style={{ border: '1px solid #e5e7eb', padding: '1rem', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}><div><p><strong>Medication:</strong> {med ? med.name : 'N/A'} (Dosage: {s.dosage})</p></div><span style={{ fontFamily: 'monospace', fontSize: '1.25rem', backgroundColor: '#e0e7ff', color: '#4338ca', padding: '0.25rem 0.75rem', borderRadius: '0.5rem' }}>{s.time}</span></div>); })}</div></div>);
};


const LogsPage = ({ logs }) => (<div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.75rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr style={{ borderBottom: '1px solid #d1d5db', textAlign: 'left' }}><th style={{ padding: '0.75rem' }}>Medication</th><th style={{ padding: '0.75rem' }}>Dispense Time</th><th style={{ padding: '0.75rem' }}>Status</th></tr></thead><tbody>{logs.map(log => (<tr key={log.id} style={{ borderBottom: '1px solid #e5e7eb' }}><td style={{ padding: '0.75rem', fontWeight: '500' }}>{log.medicationName}</td><td style={{ padding: '0.75rem' }}>{new Date(log.dispenseTime).toLocaleString()}</td><td style={{ padding: '0.75rem' }}><span style={{ padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: '500', color: log.status === 'TAKEN' ? '#059669' : '#dc2626', backgroundColor: log.status === 'TAKEN' ? '#d1fae5' : '#fee2e2' }}>{log.status}</span></td></tr>))}</tbody></table></div>);


const DashboardPage = ({ onLogout }) => {
    const [alert, setAlert] = useState(null);
    const [page, setPage] = useState('dashboard'); // State for navigation

    const [data, setData] = useState({
        dispensers: [{ id: 'D-001', name: 'Main Dispenser', status: 'Online', hopperStatus: 'OK' }],
        medications: [{ id: 'M-01', name: 'Paracetamol', sifterDiscType: 'Circular' }],
        schedule: [{ id: 'S-01', time: '09:00 AM', medicationId: 'M-01', dosage: 1, isActive: true }],
        logs: [
            { id: 'L-01', medicationName: 'Paracetamol', dispenseTime: '2025-09-10T09:00:00Z', status: 'TAKEN' },
            { id: 'L-02', medicationName: 'Paracetamol', dispenseTime: '2025-09-09T09:00:00Z', status: 'TAKEN' },
            { id: 'L-03', medicationName: 'Paracetamol', dispenseTime: '2025-09-08T09:00:00Z', status: 'MISSED' },
        ]
    });

    const addMedication = (newMed) => setData(prev => ({ ...prev, medications: [...prev.medications, { id: `M-${Date.now()}`, ...newMed }] }));
    const addSchedule = (newSchedule) => setData(prev => ({ ...prev, schedule: [...prev.schedule, { id: `S-${Date.now()}`, ...newSchedule, isActive: true }] }));

    useEffect(() => {
        const socket = io("http://localhost:5000");
        socket.on('medication_alert', (data) => {
            setAlert(data.message);
            setData(prev => ({...prev, logs: [...prev.logs, { id: `L-${Date.now()}`, medicationName: data.medication || 'Alerted Med', dispenseTime: new Date().toISOString(), status: 'MISSED'}]}));
            setTimeout(() => setAlert(null), 5000);
        });
        return () => { socket.disconnect(); };
    }, []);

    const renderCurrentPage = () => {
        switch (page) {
            case 'dashboard': return <DashboardHomePage data={data} />;
            case 'medications': return <MedicationsPage medications={data.medications} addMedication={addMedication} />;
            case 'schedule': return <SchedulePage schedule={data.schedule} medications={data.medications} addSchedule={addSchedule} />;
            case 'logs': return <LogsPage logs={data.logs} />;
            default: return <DashboardHomePage data={data} />;
        }
    };
    
    const navLinkStyle = (pageName) => ({ display: 'flex', alignItems: 'center', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', backgroundColor: page === pageName ? '#e0e7ff' : 'transparent', color: page === pageName ? '#4338ca' : '#374151', });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
            {alert && (<div style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', backgroundColor: '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: 100 }}><strong>Alert:</strong> {alert}</div>)}
            <aside style={{ width: '256px', flexShrink: 0, backgroundColor: 'white', borderRight: '1px solid #e5e7eb' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}><h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#4338ca' }}>Dispenser+</h2></div>
                <nav style={{ padding: '1.5rem 1rem' }}>
                    <div onClick={() => setPage('dashboard')} style={navLinkStyle('dashboard')}>Dashboard</div>
                    <div onClick={() => setPage('medications')} style={navLinkStyle('medications')}>Medications</div>
                    <div onClick={() => setPage('schedule')} style={navLinkStyle('schedule')}>Schedule</div>
                    <div onClick={() => setPage('logs')} style={navLinkStyle('logs')}>Dispense Logs</div>
                </nav>
                 <div style={{ padding: '1.5rem 1rem', marginTop: 'auto', borderTop: '1px solid #e5e7eb' }}><button onClick={onLogout} style={{ width: '100%', textAlign: 'left', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', background: 'none', cursor: 'pointer' }}>Log Out</button></div>
            </aside>
            <main style={{ flex: 1, padding: '2rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}><h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#1f2937', textTransform: 'capitalize' }}>{page}</h1><div><p style={{ fontWeight: '500' }}>Dhananjay Gaur</p><p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Patient</p></div></header>
                {renderCurrentPage()}
            </main>
        </div>
    );
};


//================================================================//
// AUTHENTICATION & APP LOGIC (No Changes)                        //
//================================================================//
const FormInput = ({ label, type, value, onChange, placeholder }) => ( <div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>{label}</label><input type={type} value={value} onChange={onChange} placeholder={placeholder} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', boxSizing: 'border-box' }} required /></div>);
const LoginPage = ({ onToggleView, onLoginSuccess }) => { const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); setError(''); try { const response = await axios.post('http://localhost:5000/api/users/login', { email, password }); onLoginSuccess(response.data.token); } catch (err) { setError(err.response?.data?.message || 'Login failed.'); } }; return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '100%', maxWidth: '28rem' }}><h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back</h2>{error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}<form onSubmit={handleSubmit}><FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /><FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /><button type="submit" style={{ width: '100%', backgroundColor: '#3b82f6', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Log In</button></form><p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Don't have an account? <button onClick={onToggleView} style={{ color: '#3b82f6', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>Sign Up</button></p></div></div>); };
const RegisterPage = ({ onToggleView }) => { const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [role, setRole] = useState('patient'); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); setError(''); setSuccess(''); try { await axios.post('http://localhost:5000/api/users/register', { name, email, password, role }); setSuccess('Registration successful! Please login.'); setTimeout(() => onToggleView(), 2000); } catch (err) { setError(err.response?.data?.message || 'Registration failed.'); } }; return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}><div style={{ padding: '2.5rem', backgroundColor: 'white', borderRadius: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '100%', maxWidth: '28rem' }}><h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem', textAlign: 'center' }}>Create Your Account</h2>{error && <p style={{ color: '#ef4444', marginBottom: '1rem', textAlign: 'center' }}>{error}</p>}{success && <p style={{ color: '#10b981', marginBottom: '1rem', textAlign: 'center' }}>{success}</p>}<form onSubmit={handleSubmit}><FormInput label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" /><FormInput label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /><FormInput label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" /><div style={{ marginBottom: '1rem' }}><label style={{ display: 'block', marginBottom: '0.5rem', color: '#374151', fontWeight: '500' }}>I am a:</label><select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}><option value="patient">Patient</option><option value="caregiver">Caregiver</option></select></div><button type="submit" style={{ width: '100%', backgroundColor: '#10b981', color: 'white', padding: '0.75rem', borderRadius: '0.375rem', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '600', marginTop: '1rem' }}>Create Account</button></form><p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4b5563' }}>Already have an account? <button onClick={onToggleView} style={{ color: '#3b82f6', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>Login</button></p></div></div>); };
function App() {
    const [currentView, setCurrentView] = useState('splash');
    const [authView, setAuthView] = useState('login');
    useEffect(() => { const token = localStorage.getItem('authToken'); if (token) { setCurrentView('dashboard'); } }, []);
    const handleEnter = () => setCurrentView('auth');
    const toggleAuthView = () => setAuthView(prev => (prev === 'login' ? 'register' : 'login'));
    const handleLoginSuccess = (token) => { localStorage.setItem('authToken', token); setCurrentView('dashboard'); };
    const handleLogout = () => { localStorage.removeItem('authToken'); setCurrentView('auth'); setAuthView('login'); };
    const renderContent = () => {
        switch (currentView) {
            case 'splash': return <SplashScreen onEnter={handleEnter} />;
            case 'auth': return authView === 'login' ? <LoginPage onToggleView={toggleAuthView} onLoginSuccess={handleLoginSuccess} /> : <RegisterPage onToggleView={toggleAuthView} />;
            case 'dashboard': return <DashboardPage onLogout={handleLogout} />;
            default: return <SplashScreen onEnter={handleEnter} />;
        }
    };
    return (<div className="App">{renderContent()}</div>);
}

export default App;

