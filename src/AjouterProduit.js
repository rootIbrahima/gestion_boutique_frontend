import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterProduit = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [categories, setCategories] = useState([]);  // État pour stocker les catégories
  const [image, setImage] = useState(null);  // État pour stocker l'image téléchargée
  const navigate = useNavigate();

  // Charger les catégories depuis l'API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories')  // Assurez-vous que cette route renvoie les catégories
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Préparer les données du produit à envoyer
    const formData = new FormData();
    formData.append('nom', nom);
    formData.append('description', description);
    formData.append('prix_achat', prixAchat);
    formData.append('prix_vente', prixVente);
    formData.append('categorie_id', categorieId);
    if (image) {
      formData.append('image', image);  // Ajouter l'image au formData
    }

    // Envoyer les données avec l'image
    axios.post('http://127.0.0.1:8000/api/produits', formData)
      .then(response => {
        // Lorsque le produit est ajouté avec succès, on sauvegarde un message de succès dans le localStorage
        localStorage.setItem('successMessage', 'Produit ajouté avec succès!');

        // Rediriger vers la page de la liste des produits
        navigate('/');  // Remplace '/' par la route de ta page de liste des produits
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du produit:', error);
        alert('Une erreur est survenue');
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Ajouter un produit</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">

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
          <label>Prix d'achat (en CFA) :</label>
          <input
            type="number"
            className="form-control"
            value={prixAchat}
            onChange={(e) => setPrixAchat(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Prix de vente (en CFA) :</label>
          <input
            type="number"
            className="form-control"
            value={prixVente}
            onChange={(e) => setPrixVente(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie :</label>
          <select
            className="form-select"
            value={categorieId}
            onChange={(e) => setCategorieId(e.target.value)}
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map(categorie => (
              <option key={categorie.id} value={categorie.id}>
                {categorie.nom}  {/* Affiche le nom de la catégorie */}
              </option>
            ))}
          </select>
        </div>

        {/* Champ pour télécharger l'image */}
        <div className="form-group">
          <label>Image :</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}  // Gérer l'image téléchargée
            accept="image/*"
          />
        </div>

        <button type="submit" className="btn btn-primary mt-3">Ajouter le produit</button>
      </form>
    </div>
  );
};

export default AjouterProduit;
