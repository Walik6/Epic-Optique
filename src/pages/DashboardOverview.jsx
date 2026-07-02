import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { FaHourglassHalf, FaUndo, FaCheckCircle, FaTruck } from 'react-icons/fa';
import './DashboardOverview.css';
import useAdminAuth from '../hooks/useAdminAuth';

const DashboardOverview = () => {
  useAdminAuth(); // protège la page

  const [stats, setStats] = useState({});
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/getStats.php`, { credentials: 'include' })
      .then(res => res.json())
      .then(setStats);
  }, []);

  const chartData = [
    { statut: 'En attente', value: stats.en_attente || 0, color: '#b45309' },
    { statut: 'Retour', value: stats.retour || 0, color: '#dc2626' },
    { statut: 'Confirmée', value: stats.confirmée || 0, color: '#16a34a' },
    { statut: 'Livrée', value: stats.livrée || 0, color: '#2563eb' },
  ];

  return (
    <div className="overview-dashboard">
      <h1>Résumé général</h1>

      <div className="cards">
        <div className="card en_attente">
          <div className="card-icon"><FaHourglassHalf size={20} /></div>
          <div>
            <h2>{stats.en_attente || 0}</h2>
            <p>En attente</p>
          </div>
        </div>

        <div className="card retour">
          <div className="card-icon"><FaUndo size={20} /></div>
          <div>
            <h2>{stats.retour || 0}</h2>
            <p>Retour</p>
          </div>
        </div>

        <div className="card confirmée">
          <div className="card-icon"><FaCheckCircle size={20} /></div>
          <div>
            <h2>{stats.confirmée || 0}</h2>
            <p>Confirmées</p>
          </div>
        </div>

        <div className="card livrée">
          <div className="card-icon"><FaTruck size={20} /></div>
          <div>
            <h2>{stats.livrée || 0}</h2>
            <p>Livrées</p>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2>Commandes par statut</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="statut" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardOverview;
