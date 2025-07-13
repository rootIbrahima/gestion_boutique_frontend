import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { Receipt, User, CreditCard, Calendar, Package, DollarSign, ArrowLeft, Loader2, FileText } from 'lucide-react';

const HistoriqueVentes = () => {
  const { id } = useParams();
  const [vente, setVente] = useState(null);
  const [loading, setLoading] = useState(true);

  // Récupérer les détails de la vente
  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/ventes/${id}`)
      .then((response) => {
        setVente(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de la vente:', error);
        setLoading(false);
      });
  }, [id]);

  // Fonction pour exporter en PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Titre de la facture
    doc.setFontSize(16);
    doc.text(`Facture #${vente.id}`, 20, 20);
    
    // Informations générales de la vente
    doc.setFontSize(12);
    doc.text(`Client: ${vente.client ? vente.client.nom : 'Client anonyme'}`, 20, 30);
    doc.text(`Date de vente: ${new Date(vente.created_at).toLocaleDateString('fr-FR')}`, 20, 40);
    doc.text(`Mode de paiement: ${vente.mode_paiement}`, 20, 50);
    
    // Détails des produits
    let yOffset = 60;
    vente.produits.forEach((produit) => {
      doc.text(`${produit.produit.nom} x${produit.quantite} - ${produit.prix_vente.toLocaleString()} FCFA`, 20, yOffset);
      yOffset += 10;
    });

    // Résumé de la vente
    doc.text(`Sous-total: ${vente.montant_total.toLocaleString()} FCFA`, 20, yOffset + 10);
    doc.text(`TVA: 0 FCFA`, 20, yOffset + 20);
    doc.text(`Total: ${vente.montant_total.toLocaleString()} FCFA`, 20, yOffset + 30);

    // Sauvegarder le fichier PDF
    doc.save(`facture_${vente.id}.pdf`);
  };

  // Écran de chargement
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={48} className="text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des détails de la vente...</p>
        </div>
      </div>
    );
  }

  // Affichage des détails de la vente
  if (!vente) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Vente non trouvée</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full p-0 bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 p-6 mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Receipt size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Détails de la Vente #{vente.id}
            </h1>
            <p className="text-gray-600">Informations complètes de la transaction</p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informations de la vente */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte des informations générales */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <FileText size={20} className="text-blue-600" />
                <span>Informations générales</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Client</p>
                      <p className="font-semibold text-gray-900">
                        {vente.client ? vente.client.nom : 'Client anonyme'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <CreditCard size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Mode de paiement</p>
                      <p className="font-semibold text-gray-900">{vente.mode_paiement}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
                    <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                      <Calendar size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date de vente</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(vente.created_at).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl">
                    <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                      <Package size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nombre d'articles</p>
                      <p className="font-semibold text-gray-900">
                        {vente.produits.reduce((total, produit) => total + produit.quantite, 0)} articles
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des produits */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Package size={20} className="text-green-600" />
                <span>Produits vendus</span>
              </h3>
              
              <div className="space-y-4">
                {vente.produits.map((produit) => (
                  <div key={produit.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 hover:shadow-md transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <Package size={20} className="text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{produit.produit.nom}</h4>
                        <p className="text-sm text-gray-600">
                          {produit.quantite} × {produit.prix_vente.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600 text-lg">
                        {(produit.quantite * produit.prix_vente).toLocaleString()} FCFA
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Résumé de la vente */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-lg border border-gray-200/50 p-6 sticky top-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <DollarSign size={20} className="text-green-600" />
                <span>Résumé</span>
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold text-gray-900">
                      {vente.montant_total.toLocaleString()} FCFA
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">TVA</span>
                    <span className="font-semibold text-gray-900">0 FCFA</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-green-600">
                        {vente.montant_total.toLocaleString()} FCFA
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Statut</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Payé
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Facture</span>
                    <span className="text-blue-600 font-medium">#{vente.id.toString().padStart(6, '0')}</span>
                  </div>
                </div>

                <button 
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:scale-105"
                  onClick={handleExportPDF}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Receipt size={18} />
                    <span>Imprimer reçu</span>
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

export default HistoriqueVentes;