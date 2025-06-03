import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userId, setUserId] = useState(null);
  const [hunt, setHunt] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    api.get('/auth/me')
      .then(res => {
        setUserId(res.data.userId);
        fetchHuntStatus();
        fetchHistory();
      })
      .catch(() => navigate('/'));
  }, [navigate]);

  const fetchHuntStatus = async () => {
    try {
      const res = await api.get('/hunt/status');
      setHunt(res.data.hunt);
    } catch {
      setHunt(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get('/hunt/history');
      setHistory(res.data.history);
    } catch {
      console.error('Failed to fetch history');
    }
  };

  const startHunt = async () => {
    try {
      const res = await api.post('/hunt/start');
      setHunt(res.data.hunt);
      setMessage(res.data.message);
    } catch {
      setMessage('Failed to start hunt');
    }
  };

  const completeLocation = async () => {
    if (!hunt) return;
    try {
      const res = await api.post('/hunt/complete-location', {
        stepCompleted: hunt.current_step,
      });
      setMessage(res.data.message);
      fetchHuntStatus();
    } catch {
      setMessage('Failed to update step');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Dashboard</h2>
      {userId && <p>Welcome, user #{userId}!</p>}
      {message && <p><strong>{message}</strong></p>}

      {loading ? (
        <p>Loading hunt status...</p>
      ) : hunt ? (
        <div>
          <p><strong>Current Step:</strong> {hunt.current_step}</p>
          <button onClick={completeLocation}>Complete Step {hunt.current_step}</button>
        </div>
      ) : (
        <button onClick={startHunt}>Start New Hunt</button>
      )}

      <hr />
      <h3>Completed Hunts</h3>
      <ul>
        {history.map(h => (
          <li key={h.id}>Hunt #{h.id} - {new Date(h.created_at).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
