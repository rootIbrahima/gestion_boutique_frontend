import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';  // Utilisation de HashRouter
import './index.css';
import { ShoppingBag, Users, Plus, CreditCard, Menu, X, Home, Package, UserPlus, FileText } from 'lucide-react';  // Icônes de navigation

// Importation des composants
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

// Composant de navigation avec icônes
const NavItem = ({ to, icon: Icon, children, isActive }) => (
  <Link to={to} className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}>
    <Icon size={20} />
    <span className="font-medium">{children}</span>
  </Link>
);

// Composant de navigation mobile
const MobileNav = ({ isOpen, toggleNav, currentPath }) => (
  <div className={`fixed inset-0 z-50 lg:hidden ${isOpen ? 'block' : 'hidden'}`}>
    <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleNav}></div>
    <div className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-xl">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Menu</h2>
        <button onClick={toggleNav} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>
      <nav className="p-4 space-y-2">
        <NavItem to="/" icon={Home} isActive={currentPath === '/'}>Accueil</NavItem>
        <NavItem to="/clients" icon={Users} isActive={currentPath === '/clients'}>Clients</NavItem>
        <NavItem to="/ajouter-client" icon={UserPlus} isActive={currentPath === '/ajouter-client'}>Ajouter Client</NavItem>
        <NavItem to="/ajouter-produit" icon={Package} isActive={currentPath === '/ajouter-produit'}>Ajouter Produit</NavItem>
        <NavItem to="/caisse" icon={CreditCard} isActive={currentPath === '/caisse'}>Caisse</NavItem>
        <NavItem to="/ventes" icon={FileText} isActive={currentPath === '/ventes'}>Historique des Ventes</NavItem>
        <NavItem to="/statistiques" icon={Home} isActive={currentPath === '/statistiques'}>Statistiques</NavItem>
        <NavItem to="/stocks" icon={Package} isActive={currentPath === '/stocks'}>Stocks</NavItem>
      </nav>
    </div>
  </div>
);

// Composant principal avec layout moderne
const AppLayout = ({ children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const location = useLocation();

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button onClick={toggleMobileNav} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
                <Menu size={24} />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Gestion de Boutique</h1>
              </div>
            </div>
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <span className="text-sm font-medium text-gray-700">Admin</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          <nav className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="space-y-2">
                <NavItem to="/" icon={Home} isActive={location.pathname === '/'}>Accueil</NavItem>
                <NavItem to="/clients" icon={Users} isActive={location.pathname === '/clients'}>Clients</NavItem>
                <NavItem to="/ajouter-client" icon={UserPlus} isActive={location.pathname === '/ajouter-client'}>Ajouter Client</NavItem>
                <NavItem to="/ajouter-produit" icon={Package} isActive={location.pathname === '/ajouter-produit'}>Ajouter Produit</NavItem>
                <NavItem to="/caisse" icon={CreditCard} isActive={location.pathname === '/caisse'}>Caisse</NavItem>
                <NavItem to="/ventes" icon={FileText} isActive={location.pathname === '/ventes'}>Historique des Ventes</NavItem>
                <NavItem to="/statistiques" icon={Home} isActive={location.pathname === '/statistiques'}>Statistiques</NavItem>
                <NavItem to="/stocks" icon={Package} isActive={location.pathname === '/stocks'}>Stocks</NavItem>
              </div>
            </div>
          </nav>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-xl shadow-sm min-h-[600px]">
              {children}
            </div>
          </main>
        </div>
      </div>

      <MobileNav isOpen={isMobileNavOpen} toggleNav={toggleMobileNav} currentPath={location.pathname} />
    </div>
  );
};

// Composant principal de l'application
function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<ListeProduits />} />
          <Route path="/ajouter-produit" element={<AjouterProduit />} />
          <Route path="/modifier-produit/:id" element={<ModifierProduit />} />
          <Route path="/clients" element={<ListeClients />} />
          <Route path="/ajouter-client" element={<AjouterClient />} />
          <Route path="/modifier-client/:id" element={<ModifierClient />} />
          <Route path="/caisse" element={<Caisse />} />
          <Route path="/ventes" element={<ListeVentes />} />
          <Route path="/ventes/:id" element={<HistoriqueVentes />} />
          <Route path="/statistiques" element={<Statistiques />} />
          <Route path="/stocks" element={<StockGraph />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
