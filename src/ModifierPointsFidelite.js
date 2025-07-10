import React, { useState } from 'react';
import axios from 'axios';

const ModifierPointsFidelite = ({ match }) => {
  const [points, setPoints] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientData = {
      points_fidelite: points,
    };

    axios.put(`http://127.0.0.1:8000/api/clients/${match.params.id}/fidelite`, clientData)
      .then(response => {
        alert('Points fidélité mis à jour');
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour des points fidélité:', error);
      });
  };

  return (
    <div>
      <h1>Modifier les points fidélité</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Points fidélité :</label>
          <input type="number" value={points} onChange={(e) => setPoints(e.target.value)} required />
        </div>
        <button type="submit">Mettre à jour</button>
      </form>
    </div>
  );
};

export default ModifierPointsFidelite;
