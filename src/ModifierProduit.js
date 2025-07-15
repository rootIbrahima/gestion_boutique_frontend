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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800 mb-4 inline-flex items-center"
          >
            ← Retour à la liste
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Modifier le produit</h1>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit
              </label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nom du produit"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Description du produit"
              />
            </div>

            {/* Prix en ligne */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix d'achat (FCFA)
                </label>
                <input
                  type="number"
                  value={prixAchat}
                  onChange={(e) => setPrixAchat(e.target.value)}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prix de vente (FCFA)
                </label>
                <input
                  type="number"
                  value={prixVente}
                  onChange={(e) => setPrixVente(e.target.value)}
                  required
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de catégorie
              </label>
              <input
                type="number"
                value={categorieId}
                onChange={(e) => setCategorieId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Mettre à jour le produit
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex-1 sm:flex-none bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifierProduit;