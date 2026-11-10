import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import StudentApp from './StudentApp.jsx';
import TeacherDashboard from './TeacherDashboard.jsx';
import './research.css';

function ResearchApp() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => { const f = () => setHash(window.location.hash); window.addEventListener('hashchange', f); return () => window.removeEventListener('hashchange', f); }, []);
  return hash === '#teacher' ? <TeacherDashboard /> : <StudentApp />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><ResearchApp /></React.StrictMode>);
