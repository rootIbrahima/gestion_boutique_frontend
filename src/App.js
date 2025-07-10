import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ListeProduits from './ListeProduits';
import AjouterProduit from './AjouterProduit';
import ModifierProduit from './ModifierProduit';
import ListeClients from './ListeClients';
import AjouterClient from './AjouterClient';
import ModifierClient from './ModifierClient'; // ➕ Import du composant de modification
import Caisse from './Caisse';

function App() {
  return (
    <Router>
      <div>
        <h1>Gestion de Boutique</h1>

        {/* Navigation propre avec Link */}
        <nav>
          <ul>
            <li><Link to="/clients">Voir les clients</Link></li>
            <li><Link to="/ajouter-client">Ajouter un client</Link></li>
            <li><Link to="/ajouter-produit">Ajouter un produit</Link></li>
            <li><Link to="/caisse">Caisse</Link></li>
          </ul>
        </nav>

        {/* Définition des routes */}
        <Routes>
          <Route path="/" element={<ListeProduits />} />
          <Route path="/ajouter-produit" element={<AjouterProduit />} />
          <Route path="/modifier-produit/:id" element={<ModifierProduit />} />
          
          <Route path="/clients" element={<ListeClients />} />
          <Route path="/ajouter-client" element={<AjouterClient />} />
          <Route path="/modifier-client/:id" element={<ModifierClient />} /> {/* ➕ Route pour modifier un client */}
          <Route path="/caisse" element={<Caisse />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
