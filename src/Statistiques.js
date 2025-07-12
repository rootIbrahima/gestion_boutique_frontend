import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2'; // Import du graphique linéaire de Chart.js
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

// Enregistrement des composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Statistiques = () => {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les ventes depuis l'API
    fetch('http://127.0.0.1:8000/api/ventes')
      .then(res => res.json())
      .then(data => {
        setVentes(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des ventes:', error);
        setLoading(false);
      });
  }, []);

  // Si les données sont encore en train d'être récupérées
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-xl text-gray-700 font-medium">Chargement des ventes...</p>
        </div>
      </div>
    );
  }

  // Traitement des données pour le graphique
  const dates = ventes.map(vente => new Date(vente.created_at).toLocaleDateString());
  const montants = ventes.map(vente => vente.montant_total);

  // Calcul des métriques
  const maxVente = montants.length > 0 ? Math.max(...montants) : 0;

  const data = {
    labels: dates,
    datasets: [
      {
        label: 'Ventes Totales',
        data: montants,
        borderColor: 'rgba(99, 102, 241, 1)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: 'rgba(99, 102, 241, 1)',
        pointBorderColor: 'rgba(255, 255, 255, 1)',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  // Options de personnalisation du graphique
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1,
      },
      legend: {
        display: true,
        labels: {
          color: '#374151',
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          color: 'rgba(156, 163, 175, 0.2)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-3 rounded-lg">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Tableau de Bord des Ventes
              </h1>
              <p className="text-gray-600 mt-1">
                Analyse et suivi de vos performances commerciales
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vente Maximale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maxVente.toLocaleString('fr-FR')} FCFA
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              Évolution des Ventes
            </h2>
          </div>

          <div className="h-96">
            <Line data={data} options={options} />
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center space-x-2 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <BarChart3 className="h-5 w-5 text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Informations Complémentaires
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <strong>Nombre de ventes :</strong> {ventes.length}
            </div>
            <div>
              <strong>Dernière mise à jour :</strong> {new Date().toLocaleDateString('fr-FR')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistiques;
