import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Importation de useNavigate

const ListeVentes = () => {
  const [ventes, setVentes] = useState([]);
  const navigate = useNavigate();  // Déclaration de la fonction navigate

  // Récupération des ventes depuis l'API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/ventes')
      .then(response => {
        setVentes(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des ventes:", error);
      });
  }, []);

  // Fonction pour rediriger vers les détails de la vente
  const voirDetails = (venteId) => {
    // Redirige vers /ventes/:id (par exemple, /ventes/1)
    navigate(`/ventes/${venteId}`);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Historique des Ventes</h1>

      {ventes.length === 0 ? (
        <p>Aucune vente enregistrée.</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID Vente</th>
              <th>Client</th>
              <th>Montant Total</th>
              <th>Mode de Paiement</th>
              <th>Date</th>
              <th>Détails</th>
            </tr>
          </thead>
          <tbody>
            {ventes.map((vente) => (
              <tr key={vente.id}>
                <td>{vente.id}</td>
                <td>{vente.client ? vente.client.nom : "Client anonyme"}</td>
                <td>{vente.montant_total} FCFA</td>
                <td>{vente.mode_paiement}</td>
                <td>{new Date(vente.created_at).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => voirDetails(vente.id)}  // Utilisation de la fonction de redirection
                    className="btn btn-info"
                  >
                    Voir détails
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ListeVentes;
