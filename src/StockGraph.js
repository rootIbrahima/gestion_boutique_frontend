import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Enregistrement des composants de Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const StockGraph = () => {
  const [stocks, setStocks] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produits')
      .then(response => setStocks(response.data))
      .catch(error => console.error('Erreur de récupération des stocks', error));
  }, []);

  const stockChartData = {
    labels: stocks.map(stock => stock.nom),
    datasets: [
      {
        label: 'Stock disponible',
        data: stocks.map(stock => stock.stock),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Graphique des Stocks</h1>
      <Bar data={stockChartData} />
    </div>
  );
};

export default StockGraph;
