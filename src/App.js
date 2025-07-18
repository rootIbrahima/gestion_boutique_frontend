import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, Navigate, Outlet } from 'react-router-dom';
import { ShoppingBag, Users, Plus, CreditCard, Menu, X, Home, Package, FileText, Settings, Bell, Search, ChevronRight, LogOut } from 'lucide-react';

// Importation des composants
import Login from './Login';
import ListeProduits from './ListeProduits';
import AjouterProduit from './AjouterProduit';
import ModifierProduit from './ModifierProduit';
import ListeClients from './ListeClients';
import AjouterClient from './AjouterClient';
import ModifierClient from './ModifierClient';
import Caisse from './Caisse';
import HistoriqueVentes from './HistoriqueVentes';
import ListeVentes from './ListeVentes';
import Statistiques from './Statistiques';
import StockGraph from './StockGraph';
import GestionEmployes from './GestionEmployes';

// Fonction de protection des routes
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Composant de navigation avec design moderne
const NavItem = ({ to, icon: Icon, children, isActive, badge }) => (
  <Link 
    to={to} 
    className={`group relative flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-300 ${
      isActive 
        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-105' 
        : 'text-gray-600 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:text-gray-900 hover:shadow-md'
    }`}
  >
    <div className={`relative ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'} transition-colors duration-300`}>
      <Icon size={20} />
      {badge && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">{badge}</span>
        </div>
      )}
    </div>
    <span className="font-medium">{children}</span>
    {isActive && (
      <div className="absolute right-3">
        <ChevronRight size={16} className="text-white/80" />
      </div>
    )}
  </Link>
);

// Composant de navigation mobile
const MobileNav = ({ isOpen, toggleNav, currentPath, onLogout }) => (
  <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${isOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm"
      onClick={toggleNav}
    />
    <div className={`fixed left-0 top-0 bottom-0 w-80 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-transform duration-300 ${
      isOpen ? 'translate-x-0' : '-translate-x-full'
    }`}>
      {/* Header mobile */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ShoppingBag size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Menu
            </h2>
            <p className="text-sm text-gray-500">Navigation</p>
          </div>
        </div>
        <button 
          onClick={toggleNav} 
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Navigation mobile */}
      <nav className="p-6 space-y-2">
        <NavItem to="/" icon={Home} isActive={currentPath === '/'}>Accueil</NavItem>
        <NavItem to="/clients" icon={Users} isActive={currentPath === '/clients'}>Clients</NavItem>
        <NavItem to="/caisse" icon={CreditCard} isActive={currentPath === '/caisse'} badge="3">Caisse</NavItem>
        <NavItem to="/ventes" icon={FileText} isActive={currentPath === '/ventes'}>Historique des Ventes</NavItem>
        <NavItem to="/statistiques" icon={Settings} isActive={currentPath === '/statistiques'}>Statistiques</NavItem>
        <NavItem to="/stocks" icon={Package} isActive={currentPath === '/stocks'}>Stocks</NavItem>
        <NavItem to="/gestion-employes" icon={Users} isActive={currentPath === '/gestion-employes'}>Gestion des Employés</NavItem>
        
        {/* Bouton de déconnexion mobile */}
        <button 
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-red-600 hover:bg-red-50 transition-all duration-300 mt-6"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </nav>
    </div>
  </div>
);

// Composant principal avec layout pleine page - MODIFIÉ pour utiliser Outlet
const AppLayout = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Récupérer les informations utilisateur depuis le localStorage ou une API
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header fixe */}
      <header className="flex-shrink-0 backdrop-blur-xl bg-white/80 border-b border-gray-200/50 shadow-lg">
        <div className="h-16 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleMobileNav} 
                className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ShoppingBag size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Gestion de Boutique
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">Tableau de bord</p>
                </div>
              </div>
            </div>
            
            {/* Actions header */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-3">
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
                  <Search size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 relative">
                  <Bell size={20} className="text-gray-600" />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </button>
              </div>
              
              {/* Avatar et profil */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.nom ? user.nom.charAt(0).toUpperCase() : 'A'}
                  </span>
                </div>
                <div className="hidden lg:block">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.nom || 'Admin'}
                  </span>
                  <p className="text-xs text-gray-500">
                    {user?.role || 'Administrateur'}
                  </p>
                </div>
              </div>

              {/* Bouton de déconnexion desktop */}
              <button 
                onClick={handleLogout}
                className="hidden lg:flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                title="Déconnexion"
              >
                <LogOut size={18} />
                <span className="text-sm font-medium">Déconnexion</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal avec sidebar */}
      <div className="flex-1 flex min-h-0">
        {/* Navigation sidebar fixe */}
        <nav className="hidden lg:block w-72 flex-shrink-0 bg-white/80 backdrop-blur-xl border-r border-gray-200/50">
          <div className="h-full p-6 overflow-y-auto">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Navigation</h3>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <NavItem to="/" icon={Home} isActive={location.pathname === '/'}>Accueil</NavItem>
              <NavItem to="/clients" icon={Users} isActive={location.pathname === '/clients'}>Clients</NavItem>
              <NavItem to="/caisse" icon={CreditCard} isActive={location.pathname === '/caisse'} badge="3">Caisse</NavItem>
              <NavItem to="/ventes" icon={FileText} isActive={location.pathname === '/ventes'}>Historique des Ventes</NavItem>
              <NavItem to="/statistiques" icon={Settings} isActive={location.pathname === '/statistiques'}>Statistiques</NavItem>
              <NavItem to="/stocks" icon={Package} isActive={location.pathname === '/stocks'}>Stocks</NavItem>
              <NavItem to="/gestion-employes" icon={Users} isActive={location.pathname === '/gestion-employes'}>Gestion des Employés</NavItem>
            </div>
          </div>
        </nav>

        {/* Zone de contenu principal - MODIFIÉ pour utiliser Outlet */}
        <main className="flex-1 min-w-0 bg-white/80 backdrop-blur-xl overflow-hidden">
          <div className="h-full p-6">
            <div className="h-full overflow-y-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <MobileNav 
        isOpen={isMobileNavOpen} 
        toggleNav={toggleMobileNav} 
        currentPath={location.pathname} 
        onLogout={handleLogout}
      />
    </div>
  );
};

// Composant App refactorisé avec Layout Routes
function App() {
  return (
    <Router>
      <Routes>
        {/* Route publique */}
        <Route path="/login" element={<Login />} />
        
        {/* Groupe des routes protégées avec layout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<ListeProduits />} />
          <Route path="ajouter-produit" element={<AjouterProduit />} />
          <Route path="modifier-produit/:id" element={<ModifierProduit />} />
          <Route path="clients" element={<ListeClients />} />
          <Route path="ajouter-client" element={<AjouterClient />} />
          <Route path="modifier-client/:id" element={<ModifierClient />} />
          <Route path="caisse" element={<Caisse />} />
          <Route path="ventes" element={<ListeVentes />} />
          <Route path="ventes/:id" element={<HistoriqueVentes />} />
          <Route path="statistiques" element={<Statistiques />} />
          <Route path="stocks" element={<StockGraph />} />
          <Route path="gestion-employes" element={<GestionEmployes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;