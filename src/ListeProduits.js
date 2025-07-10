import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListeProduits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");  // État pour la recherche

  useEffect(() => {
    const token = localStorage.getItem('token'); // Récupérer le token d'authentification si nécessaire

    axios.get('http://127.0.0.1:8000/api/produits', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setProduits(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Erreur lors de la récupération des produits:', error);
      setLoading(false);
    });
  }, []);

  // Gérer la suppression d'un produit
  const handleDelete = (id) => {
    const token = localStorage.getItem('token'); // Token d'authentification

    axios.delete(`http://127.0.0.1:8000/api/produits/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setProduits(produits.filter(produit => produit.id !== id));
      alert('Produit supprimé');
    })
    .catch(error => {
      console.error('Erreur lors de la suppression du produit:', error);
    });
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtrer les produits selon le texte de recherche
  const filteredProducts = produits.filter(produit =>
    produit.nom.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Liste des produits</h1>

      {/* Champ de recherche */}
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Rechercher un produit..."
        value={search}
        onChange={handleSearch}
      />

      {/* Lien pour ajouter un produit */}
      <Link to="/ajouter-produit">
        <button className="btn btn-primary mb-4">Ajouter un produit</button>
      </Link>

      {/* Liste des produits */}
      <div className="row">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((produit) => (
            <div key={produit.id} className="col-md-4 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">{produit.nom}</h5>
                  <p className="card-text">{produit.description}</p>
                  <p className="card-text">Prix : {produit.prix_vente} CFA</p>
                  <Link to={`/modifier-produit/${produit.id}`}>
                    <button className="btn btn-warning mr-2">Modifier</button>
                  </Link>
                  <button className="btn btn-danger" onClick={() => handleDelete(produit.id)}>Supprimer</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>Aucun produit trouvé.</div>
        )}
      </div>
    </div>
  );
};

export default ListeProduits;
