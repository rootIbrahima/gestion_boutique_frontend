import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Search, Plus, Edit, Trash2, ShoppingBag, Filter, Grid, List } from 'lucide-react';

const ListeProduits = () => {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    const token = localStorage.getItem('token');

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

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      const token = localStorage.getItem('token');

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
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredProducts = produits.filter(produit =>
    produit.nom.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Chargement des produits...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Liste des produits</h1>
                <p className="text-gray-600">{produits.length} produits disponibles</p>
              </div>
            </div>
            <Link to="/ajouter-produit">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors duration-200 shadow-lg hover:shadow-xl">
                <Plus className="h-5 w-5" />
                <span>Ajouter un produit</span>
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et options d'affichage */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Rechercher un produit..."
                  value={search}
                  onChange={handleSearch}
                />
              </div>
            </div>
            
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map((produit) => (
              <div
                key={produit.id}
                className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  viewMode === 'list' ? 'flex items-center' : 'flex flex-col h-full'
                }`}
              >
                <div className={viewMode === 'list' ? 'w-48 h-32 flex-shrink-0' : 'w-full h-48 flex-shrink-0'}>
                  <img
                    src={`http://127.0.0.1:8000/${produit.image_url}`}
                    alt={produit.nom}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{produit.nom}</h3>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 flex-1">{produit.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-blue-600">{formatPrice(produit.prix_vente)} CFA</span>
                  </div>
                  
                  <div className="flex space-x-2 mt-auto">
                    <Link to={`/modifier-produit/${produit.id}`} className="flex-1">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                        <span>Modifier</span>
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(produit.id)}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-6">Essayez de modifier votre recherche ou ajoutez de nouveaux produits.</p>
            <Link to="/ajouter-produit">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 mx-auto transition-colors duration-200">
                <Plus className="h-5 w-5" />
                <span>Ajouter un produit</span>
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListeProduits;