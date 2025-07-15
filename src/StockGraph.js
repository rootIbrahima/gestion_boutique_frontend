import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Package, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';

// Enregistrement des composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockGraph = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://127.0.0.1:8000/api/produits');
      if (!response.ok) {
        throw new Error('Erreur de réseau');
      }
      const data = await response.json();
      setStocks(data);
    } catch (error) {
      console.error('Erreur de récupération des stocks', error);
      setError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const totalStock = stocks.reduce((sum, stock) => sum + stock.stock, 0);
  const lowStockItems = stocks.filter(stock => stock.stock < 10).length;

  const stockChartData = {
    labels: stocks.map(stock => stock.nom),
    datasets: [
      {
        label: 'Stock disponible',
        data: stocks.map(stock => stock.stock),
        backgroundColor: stocks.map(stock => {
          if (stock.stock < 10) return 'rgba(239, 68, 68, 0.8)'; // Rouge pour stock faible
          if (stock.stock < 50) return 'rgba(245, 158, 11, 0.8)'; // Orange pour stock moyen
          return 'rgba(34, 197, 94, 0.8)'; // Vert pour stock élevé
        }),
        borderColor: stocks.map(stock => {
          if (stock.stock < 10) return 'rgba(239, 68, 68, 1)';
          if (stock.stock < 50) return 'rgba(245, 158, 11, 1)';
          return 'rgba(34, 197, 94, 1)';
        }),
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            size: 14,
            family: 'Inter, sans-serif',
          },
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            const value = context.parsed.y;
            let status = '';
            if (value < 10) status = ' (Stock faible)';
            else if (value < 50) status = ' (Stock moyen)';
            else status = ' (Stock élevé)';
            return `${context.dataset.label}: ${value}${status}`;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12,
            family: 'Inter, sans-serif',
          },
          maxRotation: 45,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-lg text-gray-600">Chargement des données...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="text-red-500 mb-4">
              <Package className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchStocks}
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-indigo-600 p-3 rounded-full">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Tableau de Bord des Stocks
          </h1>
          <p className="text-gray-600 text-lg">
            Visualisation en temps réel de vos niveaux de stock
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
            <div className="flex items-center">
              <div className="bg-indigo-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Produits</h3>
                <p className="text-2xl font-bold text-gray-900">{stocks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Stock Total</h3>
                <p className="text-2xl font-bold text-gray-900">{totalStock}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center">
              <div className="bg-red-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Stock Faible</h3>
                <p className="text-2xl font-bold text-gray-900">{lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Niveaux de Stock par Produit
            </h2>
            <button
              onClick={fetchStocks}
              className="inline-flex items-center px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </button>
          </div>

          {stocks.length > 0 ? (
            <div className="h-96">
              <Bar data={stockChartData} options={chartOptions} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun produit trouvé
              </h3>
              <p className="text-gray-600">
                Commencez par ajouter des produits à votre inventaire
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Légende des Couleurs</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded mr-3"></div>
              <span className="text-sm text-gray-600">Stock faible (&lt; 10)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-yellow-500 rounded mr-3"></div>
              <span className="text-sm text-gray-600">Stock moyen (10-49)</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded mr-3"></div>
              <span className="text-sm text-gray-600">Stock élevé (≥ 50)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockGraph;