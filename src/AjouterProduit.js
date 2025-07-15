import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload, Package, Tag, DollarSign, FileText, Camera, Plus, ArrowLeft } from 'lucide-react';

const AjouterProduit = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [categorieId, setCategorieId] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();

  // Charger les catégories depuis l'API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/categories')
      .then(response => {
        setCategories(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des catégories:', error);
      });
  }, []);

  const handleImageChange = (file) => {
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleImageChange(file);
    }
  };

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
      formData.append('image', image);
    }

    // Envoyer les données avec l'image
    axios.post('http://127.0.0.1:8000/api/produits', formData)
      .then(response => {
        // Lorsque le produit est ajouté avec succès, on sauvegarde un message de succès dans le localStorage
        localStorage.setItem('successMessage', 'Produit ajouté avec succès!');

        // Rediriger vers la page de la liste des produits
        navigate('/');
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du produit:', error);
        alert('Une erreur est survenue');
      });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 overflow-hidden">
      <div className="max-w-6xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="mb-4 flex-shrink-0">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors mb-2 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à la liste
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Ajouter un produit
          </h1>
          <p className="text-sm text-gray-600">Créez un nouveau produit pour votre catalogue</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex-1 flex flex-col">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex-shrink-0">
            <div className="flex items-center text-white">
              <Package className="w-6 h-6 mr-2" />
              <h2 className="text-lg font-semibold">Informations du produit</h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} encType="multipart/form-data" className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Colonne gauche */}
              <div className="space-y-4">
                {/* Nom */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                    Nom du produit
                  </label>
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                    placeholder="Nom de votre produit"
                  />
                </div>

                {/* Catégorie */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Tag className="w-4 h-4 mr-2 text-indigo-600" />
                    Catégorie
                  </label>
                  <select
                    value={categorieId}
                    onChange={(e) => setCategorieId(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(categorie => (
                      <option key={categorie.id} value={categorie.id}>
                        {categorie.nom}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-2 flex-1">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FileText className="w-4 h-4 mr-2 text-indigo-600" />
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    rows={6}
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 resize-none"
                    placeholder="Décrivez votre produit..."
                  />
                </div>

                {/* Prix */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                      Prix d'achat (CFA)
                    </label>
                    <input
                      type="number"
                      value={prixAchat}
                      onChange={(e) => setPrixAchat(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <DollarSign className="w-4 h-4 mr-2 text-blue-600" />
                      Prix de vente (CFA)
                    </label>
                    <input
                      type="number"
                      value={prixVente}
                      onChange={(e) => setPrixVente(e.target.value)}
                      required
                      className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Colonne droite - Upload d'image */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <Camera className="w-4 h-4 mr-2 text-purple-600" />
                    Image du produit
                  </label>
                  
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 h-80 flex flex-col justify-center ${
                      isDragOver
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {imagePreview ? (
                      <div className="relative h-full flex items-center justify-center">
                        <img
                          src={imagePreview}
                          alt="Aperçu"
                          className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImage(null);
                            setImagePreview(null);
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <Upload className="w-12 h-12 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-600 mb-2">
                            Glissez votre image ici ou{' '}
                            <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer font-medium">
                              parcourez vos fichiers
                              <input
                                type="file"
                                onChange={(e) => handleImageChange(e.target.files[0])}
                                accept="image/*"
                                className="hidden"
                              />
                            </label>
                          </p>
                          <p className="text-sm text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bouton de soumission */}
                <div className="flex justify-end pt-4">
                  <button
                    type="submit"
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Ajouter le produit
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjouterProduit;