import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Produits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produits')
      .then(response => {
        setProduits(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des produits:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Chargement des produits...</div>;
  }

  return (
    <div>
      <h1>Liste des produits</h1>
      <ul>
        {produits.length > 0 ? (
          produits.map((produit) => (
            <li key={produit.id}>
              {produit.nom} - {produit.prix_vente.toLocaleString()} CFA
            </li>
          ))
        ) : (
          <li>Aucun produit trouvé.</li>
        )}
      </ul>
    </div>
  );
}

export default Produits;
