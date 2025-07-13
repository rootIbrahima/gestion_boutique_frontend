import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Mail, Phone, Save, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const ModifierClient = () => {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(true); // État pour savoir si le client est chargé
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [successMessage, setSuccessMessage] = useState(''); // Pour afficher le message de succès
  const navigate = useNavigate();

  useEffect(() => {
    // Récupérer les détails du client à modifier en utilisant l'ID
    axios.get(`http://127.0.0.1:8000/api/clients/${id}`)
      .then(response => {
        const client = response.data;
        setNom(client.nom);
        setEmail(client.email);
        setTelephone(client.telephone || '');
        setIsLoading(false); // Le client est chargé
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du client à modifier:', error);
        setIsLoading(false); // Dans tous les cas, on arrête le chargement
        setError('Impossible de récupérer les données du client.');
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const clientData = {
      nom,
      email,
      telephone,
    };

    // Réinitialiser les messages de succès/erreur avant de soumettre
    setError('');
    setSuccessMessage('');

    // Envoyer une requête PUT pour modifier le client
    axios.put(`http://127.0.0.1:8000/api/clients/${id}`, clientData)
      .then(response => {
        setSuccessMessage('Client mis à jour avec succès !');
        setTimeout(() => {
          navigate('/clients'); // Rediriger vers la liste des clients après la modification
        }, 2000);
      })
      .catch(error => {
        console.error('Erreur lors de la mise à jour du client:', error);
        setError('Erreur lors de la mise à jour du client');
      });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
          <span className="text-gray-600 font-medium">Chargement...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Modifier le client</h1>
          <p className="text-gray-600">Mettez à jour les informations du client</p>
        </div>

        {/* Messages d'erreur et de succès */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
            <span className="text-green-700">{successMessage}</span>
          </div>
        )}

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Nom complet
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="Entrez le nom complet"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                  placeholder="+33 1 23 45 67 89"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                />
              </div>
            </div>

            {/* Boutons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="flex-1 flex items-center justify-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour
              </button>
              <button
                type="submit"
                className="flex-1 flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Save className="w-5 h-5 mr-2" />
                Mettre à jour
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModifierClient;