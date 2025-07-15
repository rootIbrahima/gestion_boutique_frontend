import React, { useState } from 'react';

const AjouterClient = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulation de votre logique backend
    const clientData = { nom, email, telephone };
    
    setError('');
    setSuccessMessage('');
    setIsLoading(true);
    
    // Simulation d'un appel API
    setTimeout(() => {
      if (nom && email) {
        setSuccessMessage('Client ajouté avec succès!');
        setTimeout(() => {
          // navigate('/clients'); // Votre navigation
        }, 2000);
      } else {
        setError('Veuillez remplir tous les champs requis');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-12 px-4 relative overflow-hidden">
      {/* Éléments décoratifs animés */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-lg mx-auto relative">
        {/* Carte principale avec effet glassmorphism */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative overflow-hidden">
          {/* Effet de brillance */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-pulse opacity-30"></div>
          
          {/* Header avec animation */}
          <div className="text-center mb-8 relative">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl transform hover:scale-105 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent mb-3">
              Nouveau Client
            </h1>
            <p className="text-gray-600 text-lg">Créez un profil client en quelques clics</p>
          </div>

          {/* Messages d'erreur et de succès avec animations */}
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border-l-4 border-red-400 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border-l-4 border-green-400 rounded-r-xl">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-3 text-green-700 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Formulaire avec design moderne */}
          <div className="space-y-6">
            {/* Nom */}
            <div className="group">
              <label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Nom complet *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="nom"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  placeholder="Entrez le nom complet"
                />
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Adresse email *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  placeholder="exemple@email.com"
                />
              </div>
            </div>

            {/* Téléphone */}
            <div className="group">
              <label htmlFor="telephone" className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                Numéro de téléphone
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="telephone"
                  value={telephone}
                  onChange={(e) => setTelephone(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300 text-gray-900 placeholder-gray-400 bg-white/60 backdrop-blur-sm hover:bg-white/80"
                  placeholder="+33 1 23 45 67 89"
                />
              </div>
            </div>

            {/* Bouton de soumission avec animation */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-300 transform relative overflow-hidden ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl'
              }`}
            >
              {/* Effet de brillance sur le bouton */}
              {!isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full hover:translate-x-full transition-transform duration-700"></div>
              )}
              
              {isLoading ? (
                <div className="flex items-center justify-center relative">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Ajout en cours...
                </div>
              ) : (
                <div className="flex items-center justify-center relative">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  Ajouter le client
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AjouterClient;