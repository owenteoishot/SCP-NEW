import React from 'react';

function Dashboard() {
  const token = localStorage.getItem('token');

  if (!token) return <p>You must be logged in to see this page.</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome! This is a protected route.</p>
    </div>
  );
}

export default Dashboard;
