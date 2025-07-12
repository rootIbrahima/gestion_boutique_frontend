import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const HistoriqueVentes = () => {
  const { id } = useParams(); // Récupérer l'ID de la vente via l'URL
  const [vente, setVente] = useState(null);

  // Récupérer les détails de la vente
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/ventes/${id}`)
      .then((response) => {
        setVente(response.data);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de la vente:', error);
      });
  }, [id]);

  // Affichage des détails de la vente
  if (!vente) return <p>Chargement...</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Détails de la Vente #{vente.id}</h1>
      
      {/* Affichage du nom du client */}
      <h3>Client : {vente.client ? vente.client.nom : 'Anonyme'}</h3>  {/* Affichage du nom du client */}
      <h4>Mode de paiement : {vente.mode_paiement}</h4>
      <h4>Date : {new Date(vente.created_at).toLocaleDateString()}</h4>
      
      <h3>Produits de la Vente :</h3>
      <ul>
        {vente.produits.map((produit) => (
          <li key={produit.id}>
            {produit.produit.nom} - {produit.quantite} x {produit.prix_vente} FCFA
          </li>
        ))}
      </ul>
      
      <h3>Montant Total : {vente.montant_total} FCFA</h3>
    </div>
  );
};

export default HistoriqueVentes;
