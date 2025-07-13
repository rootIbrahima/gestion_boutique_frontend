import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, CreditCard, User, Package, CheckCircle, X } from 'lucide-react';

const Caisse = () => {
  const [produits, setProduits] = useState([]);
  const [clients, setClients] = useState([]);
  const [panier, setPanier] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [modePaiement, setModePaiement] = useState('Espèces');
  const navigate = useNavigate();

  // Récupération des produits et clients
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produits')
      .then(response => setProduits(response.data))
      .catch(error => console.error('Erreur produits:', error));

    axios.get('http://127.0.0.1:8000/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Erreur clients:', error));
  }, []);

  // Ajouter un produit au panier
  const ajouterAuPanier = (produit) => {
    const existant = panier.find(p => p.id === produit.id);
    if (existant) {
      setPanier(panier.map(p =>
        p.id === produit.id ? { ...p, quantite: p.quantite + 1 } : p
      ));
    } else {
      setPanier([...panier, { ...produit, quantite: 1 }]);
    }
  };

  // Retirer un produit du panier
  const retirerDuPanier = (id) => {
    setPanier(panier.filter(p => p.id !== id));
  };

  // Mettre à jour la quantité d'un produit dans le panier
  const handleQuantiteChange = (id, newQuantite) => {
    setPanier(panier.map(p =>
      p.id === id ? { ...p, quantite: Math.max(1, Number(newQuantite)) } : p
    ));
  };

  // Calculer le total du panier en temps réel
  const calculerTotal = () => {
    return panier.reduce((total, item) => total + item.prix_vente * item.quantite, 0);
  };

  // Soumettre la vente
  const handleSubmit = (e) => {
    e.preventDefault();

    if (panier.length === 0) {
      alert('Le panier est vide.');
      return;
    }

    const donnees = {
      client_id: selectedClient || null,
      mode_paiement: modePaiement,
      produits: panier.map(item => ({
        produit_id: item.id,
        quantite: item.quantite
      }))
    };

    axios.post('http://127.0.0.1:8000/api/ventes', donnees)
      .then(response => {
        alert('Vente enregistrée avec succès !');
        setPanier([]);
        navigate('/ventes');
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la vente :', error);
        alert('Erreur lors de l\'enregistrement de la vente');
      });
  };

  return (
    <div className="h-full p-0 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingCart size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Caisse
            </h1>
            <p className="text-gray-600">Gestion des ventes et paiements</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Section Configuration */}
          <div className="lg:col-span-2 space-y-6">
            {/* Sélection Client et Mode de paiement */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <User size={16} />
                    <span>Client</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={selectedClient}
                    onChange={e => setSelectedClient(e.target.value)}
                  >
                    <option value="">Client anonyme</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                    <CreditCard size={16} />
                    <span>Mode de paiement</span>
                  </label>
                  <select
                    className="w-full px-4 py-3 bg-white/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    value={modePaiement}
                    onChange={e => setModePaiement(e.target.value)}
                  >
                    <option value="Espèces">💵 Espèces</option>
                    <option value="Carte bancaire">💳 Carte bancaire</option>
                    <option value="Mobile Money">📱 Mobile Money</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6">
              <div className="flex items-center space-x-3 mb-6">
                <Package size={20} className="text-blue-600" />
                <h3 className="text-xl font-semibold text-gray-900">Produits disponibles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                {produits.map(p => (
                  <button
                    key={p.id}
                    className="group p-4 bg-gradient-to-r from-white to-gray-50 hover:from-blue-50 hover:to-purple-50 border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-md hover:scale-105 text-left"
                    onClick={() => ajouterAuPanier(p)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {p.nom}
                        </h4>
                        <p className="text-lg font-bold text-green-600 mt-1">
                          {p.prix_vente.toLocaleString()} FCFA
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500 group-hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200">
                        <Plus size={16} className="text-white" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section Panier */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 sticky top-6">
              <div className="flex items-center space-x-3 mb-6">
                <ShoppingCart size={20} className="text-purple-600" />
                <h3 className="text-xl font-semibold text-gray-900">Panier</h3>
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">{panier.length}</span>
                </div>
              </div>

              {panier.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {panier.map(item => (
                    <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-2xl border border-gray-200">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-900 text-sm">{item.nom}</h4>
                        <button
                          className="p-1 hover:bg-red-100 rounded-lg transition-colors duration-200"
                          onClick={() => retirerDuPanier(item.id)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <button
                            className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center transition-colors duration-200"
                            onClick={() => handleQuantiteChange(item.id, item.quantite - 1)}
                            disabled={item.quantite <= 1}
                          >
                            <Minus size={12} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            className="w-16 px-2 py-1 text-center border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={item.quantite}
                            onChange={e => handleQuantiteChange(item.id, e.target.value)}
                          />
                          <button
                            className="w-8 h-8 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
                            onClick={() => handleQuantiteChange(item.id, item.quantite + 1)}
                          >
                            <Plus size={12} className="text-white" />
                          </button>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">{item.prix_vente.toLocaleString()} FCFA</p>
                          <p className="font-bold text-green-600">{(item.prix_vente * item.quantite).toLocaleString()} FCFA</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total et bouton de validation */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xl font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-green-600">
                    {calculerTotal().toLocaleString()} FCFA
                  </span>
                </div>
                
                <button
                  className={`w-full py-4 px-6 rounded-2xl font-medium text-white transition-all duration-300 ${
                    panier.length === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 hover:shadow-lg hover:scale-105'
                  }`}
                  onClick={handleSubmit}
                  disabled={panier.length === 0}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CheckCircle size={20} />
                    <span>Valider la vente</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Caisse;