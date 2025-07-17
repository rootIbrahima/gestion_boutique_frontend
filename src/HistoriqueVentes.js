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

  // Fonction pour exporter en PDF avec design moderne et professionnel
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Configuration des couleurs
    const primaryColor = [59, 130, 246]; // Bleu
    const secondaryColor = [147, 51, 234]; // Violet
    const textColor = [31, 41, 55]; // Gris foncé
    const lightGray = [156, 163, 175]; // Gris clair
    const successColor = [34, 197, 94]; // Vert
    const backgroundColor = [248, 250, 252]; // Gris très clair
    
    // === HEADER AVEC DESIGN MODERNE ===
    // Fond principal du header
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Accent violet sur le côté
    doc.setFillColor(...secondaryColor);
    doc.rect(0, 0, 8, 40, 'F');
    
    // Logo/Icône moderne
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(20, 10, 20, 20, 3, 3, 'F');
    doc.setFillColor(...primaryColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('₣', 28, 24);
    
    // Titre principal
    doc.setFontSize(26);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('FACTURE', 50, 22);
    
    // Numéro de facture avec style
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`N° ${vente.id.toString().padStart(6, '0')}`, 50, 30);
    
    // Date et statut dans le header
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    const currentDate = new Date(vente.created_at).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    doc.text(`Date: ${currentDate}`, 145, 18);
    
    // Statut payé
    doc.setFillColor(...successColor);
    doc.roundedRect(145, 22, 25, 8, 2, 2, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PAYÉ', 155, 27);
    
    // === INFORMATIONS ENTREPRISE ===
    let yPos = 50;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('Boutique EC2LT', 145, yPos);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...lightGray);
    doc.text(' Liberté 2 près du Rond Point Jet d’eau derrière l’immeuble de la banque CBAO', 145, yPos + 6);
    doc.text('Dakar, Sénégal', 145, yPos + 12);
    doc.text('Tél: +221 33 868 18 85', 145, yPos + 18);
    doc.text(' ecole@ec2lt.sn', 145, yPos + 24);
    
    // === SECTION CLIENT ===
    yPos = 80;
    
    // Titre section client avec design moderne
    doc.setFillColor(...backgroundColor);
    doc.roundedRect(15, yPos - 5, 180, 30, 3, 3, 'F');
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, yPos - 5, 4, 30, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textColor);
    doc.text('INFORMATIONS CLIENT', 25, yPos + 2);
    
    // Détails client
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text(`Client: ${vente.client ? vente.client.nom : 'Client anonyme'}`, 25, yPos + 10);
    doc.text(`Mode de paiement: ${vente.mode_paiement}`, 25, yPos + 16);
    
    // === TABLEAU DES PRODUITS ===
    yPos = 120;
    
    // En-tête du tableau avec design moderne
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, yPos, 180, 12, 2, 2, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('PRODUIT', 20, yPos + 8);
    doc.text('QTÉ', 120, yPos + 8);
    doc.text('PRIX UNIT.', 140, yPos + 8);
    doc.text('TOTAL', 170, yPos + 8);
    
    // Lignes des produits
    yPos += 15;
    let totalGeneral = 0;
    
    vente.produits.forEach((produit, index) => {
      const totalProduit = produit.quantite * produit.prix_vente;
      totalGeneral += totalProduit;
      
      // Alternance de couleurs pour les lignes
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, yPos - 3, 180, 12, 'F');
      }
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...textColor);
      
      // Nom du produit (avec troncature si trop long)
      const nomProduit = produit.produit.nom.length > 25 
        ? produit.produit.nom.substring(0, 25) + '...' 
        : produit.produit.nom;
      doc.text(nomProduit, 20, yPos + 5);
      
      // Quantité
      doc.text(produit.quantite.toString(), 125, yPos + 5);
      
      // Prix unitaire
      doc.text(`${produit.prix_vente.toLocaleString()} F`, 142, yPos + 5);
      
      // Total
      doc.setFont('helvetica', 'bold');
      doc.text(`${totalProduit.toLocaleString()} F`, 172, yPos + 5);
      
      yPos += 12;
    });
    
    // === SECTION TOTAUX ===
    yPos += 10;
    
    // Fond pour la section totaux
    doc.setFillColor(...backgroundColor);
    doc.roundedRect(120, yPos - 5, 75, 40, 3, 3, 'F');
    
    // Sous-total
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textColor);
    doc.text('Sous-total:', 125, yPos + 5);
    doc.text(`${totalGeneral.toLocaleString()} FCFA`, 165, yPos + 5);
    
    // TVA
    doc.text('TVA (0%):', 125, yPos + 13);
    doc.text('0 FCFA', 165, yPos + 13);
    
    // Ligne de séparation
    doc.setDrawColor(...lightGray);
    doc.line(125, yPos + 17, 190, yPos + 17);
    
    // Total final
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...successColor);
    doc.text('TOTAL:', 125, yPos + 25);
    doc.text(`${totalGeneral.toLocaleString()} FCFA`, 165, yPos + 25);
    
    // === PIED DE PAGE ===
    yPos = 260;
    
    // Message de remerciement
    doc.setFillColor(...primaryColor);
    doc.roundedRect(15, yPos, 180, 20, 3, 3, 'F');
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('Merci pour votre confiance !', 105, yPos + 8, { align: 'center' });
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Cette facture est générée automatiquement', 105, yPos + 15, { align: 'center' });
    
    // Informations légales en bas
    doc.setFontSize(8);
    doc.setTextColor(...lightGray);
    doc.text('Facture générée le ' + new Date().toLocaleDateString('fr-FR'), 105, 285, { align: 'center' });
    
    // Sauvegarder le fichier PDF
    doc.save(`facture_moderne_${vente.id}.pdf`);
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