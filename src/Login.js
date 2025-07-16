import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, LogIn, Store, ShoppingBag, BarChart3, Package } from 'lucide-react';

// Section de bienvenue
const WelcomeSection = () => (
  <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex flex-col justify-center items-center p-8 relative overflow-hidden">
    {/* Éléments décoratifs d'arrière-plan */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    {/* Logo en haut */}
    <div className="absolute top-8 left-8 z-10">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
          <Store className="w-6 h-6 text-white" />
        </div>
        <span className="text-2xl font-bold text-gray-800">Ma Boutique</span>
      </div>
    </div>

    {/* Contenu principal */}
    <div className="relative z-10 text-center max-w-2xl mx-auto">
      {/* Image de bienvenue */}
      <div className="mb-8">
        <div className="w-64 h-64 mx-auto bg-gradient-to-r from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <Store className="w-32 h-32 text-white" />
        </div>
      </div>

      {/* Titre animé */}
      <div className="mb-6">
        <h1 className="text-5xl font-bold text-gray-800 mb-4 animate-pulse">Système de Gestion de Boutique</h1>
        <p className="text-xl text-gray-600 font-medium">Gérez votre commerce en toute simplicité</p>
      </div>

      {/* Fonctionnalités */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <Package className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Inventaire</h3>
          <p className="text-gray-600 text-sm">Gérez vos stocks facilement</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <ShoppingBag className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Ventes</h3>
          <p className="text-gray-600 text-sm">Suivez vos transactions</p>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Rapports</h3>
          <p className="text-gray-600 text-sm">Analysez vos performances</p>
        </div>
      </div>
    </div>
  </div>
);

const App = () => {
  // État des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();
      
      // Simulation de localStorage pour la démo
      localStorage.setItem('token', data.token);
      window.location.href = '/';
    } catch (error) {
      setError('Erreur de connexion, veuillez vérifier vos informations.');
      console.error('Erreur de connexion', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2">
        <WelcomeSection />
      </div>
      <div className="w-1/2">
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 relative">
          {/* Particules d'arrière-plan */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500 rounded-full opacity-10 animate-pulse"></div>
            <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full opacity-10 animate-pulse delay-1000"></div>
            <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500 rounded-full opacity-10 animate-pulse delay-2000"></div>
          </div>

          <div className="relative w-full max-w-md">
            {/* Effet de glassmorphisme */}
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8 transform hover:scale-105 transition-all duration-300">
              {/* Header */}
              <div className="text-center mb-8 space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg transform hover:rotate-6 transition-transform duration-300">
                  <User className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">Bienvenue</h1>
                <p className="text-gray-300">Connectez-vous à votre compte</p>
              </div>

              {/* Formulaire */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-300 text-sm animate-shake">
                    {error}
                  </div>
                )}

                {/* Champ Email */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/90 border border-white/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:bg-white"
                      placeholder="votre@email.com"
                      required
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="relative group">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-12 py-4 bg-white/90 border border-white/30 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-300 hover:bg-white"
                      placeholder="••••••••"
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Connexion...</span>
                    </>
                  ) : (
                    <>
                      <LogIn className="w-5 h-5" />
                      <span>Se connecter</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
