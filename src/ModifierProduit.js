import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifierProduit = () => {
  const { id } = useParams(); // Récupère l'ID du produit depuis l'URL
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [isLoading, setIsLoading] = useState(true); // État pour savoir si le produit est chargé
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les détails du produit à modifier en utilisant l'ID
    axios.get(`http://127.0.0.1:8000/api/produits/${id}`)
      .then(response => {
        const produit = response.data;
        setNom(produit.nom);
        setDescription(produit.description);
        setPrixAchat(produit.prix_achat);
        setPrixVente(produit.prix_vente);
        setCategorieId(produit.categorie_id);
        setIsLoading(false); // Le produit est chargé
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du produit à modifier:', error);
        setIsLoading(false); // Dans tous les cas, on arrête le chargement
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const produitData = {
      nom,
      description,
      prix_achat: prixAchat,
      prix_vente: prixVente,
      categorie_id: categorieId,
    };

    // Envoyer une requête PUT pour modifier le produit
    axios.put(`http://127.0.0.1:8000/api/produits/${id}`, produitData)
      .then(response => {
        alert('Produit mis à jour avec succès');
        navigate('/'); // Rediriger vers la liste des produits après la modification
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du produit:', error);
        alert('Erreur lors de la mise à jour du produit');
      });
  };

  if (isLoading) {
    return <div>Chargement...</div>; // Afficher un message de chargement tant que les données ne sont pas récupérées
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Modifier le produit</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nom :</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description :</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix d'achat :</label>
          <input
            type="number"
            className="form-control"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix de vente :</label>
          <input
            type="number"
            className="form-control"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>ID de catégorie :</label>
          <input
            type="number"
            className="form-control"
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-success mt-3">Mettre à jour le produit</button>
      </form>
    </div>
  );
};

export default ModifierProduit;
