import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Eye, TrendingUp, Users, Calendar, CreditCard, DollarSign } from 'lucide-react';

const ListeVentes = () => {
  const [ventes, setVentes] = useState([]);
  const navigate = useNavigate();

  // Récupération des ventes depuis l'API
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/ventes')
      .then(response => {
        setVentes(response.data);
      })
      .catch(error => {
        console.error("Erreur lors de la récupération des ventes:", error);
      });
  }, []);

  // Fonction pour rediriger vers les détails de la vente
  const voirDetails = (venteId) => {
    // Redirige vers /ventes/:id (par exemple, /ventes/1)
    navigate(`/ventes/${venteId}`);
  };

  // Calcul des statistiques
  const totalVentes = ventes.length;
  const montantTotal = ventes.reduce((sum, vente) => sum + parseFloat(vente.montant_total), 0);
  const montantMoyen = totalVentes > 0 ? montantTotal / totalVentes : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête avec titre et statistiques */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Historique des Ventes</h1>
          </div>

          {/* Cartes de statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total des ventes</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVentes}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Chiffre d'affaires</p>
                  <p className="text-2xl font-bold text-gray-900">{montantTotal.toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Montant moyen</p>
                  <p className="text-2xl font-bold text-gray-900">{montantMoyen.toLocaleString()} FCFA</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {ventes.length === 0 ? (
            <div className="text-center py-16">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune vente enregistrée</h3>
              <p className="text-gray-600">Les ventes apparaîtront ici une fois qu'elles seront enregistrées.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-4 font-semibold text-gray-700">ID Vente</th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Client
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Montant Total
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Mode de Paiement
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Date
                      </div>
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ventes.map((vente) => (
                    <tr key={vente.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                            {vente.id}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-gray-900">
                          {vente.client ? vente.client.nom : "Client anonyme"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-green-600">
                          {parseFloat(vente.montant_total).toLocaleString()} FCFA
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                          vente.mode_paiement === 'Espèces' ? 'bg-green-100 text-green-800' :
                          vente.mode_paiement === 'Carte' ? 'bg-blue-100 text-blue-800' :
                          vente.mode_paiement === 'Mobile Money' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {vente.mode_paiement}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-600">
                          {new Date(vente.created_at).toLocaleDateString('fr-FR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => voirDetails(vente.id)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                          <Eye className="w-4 h-4" />
                          Voir détails
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListeVentes;