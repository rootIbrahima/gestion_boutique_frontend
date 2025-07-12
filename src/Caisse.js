import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Caisse = () => {
  const [produits, setProduits] = useState([]);
  const [clients, setClients] = useState([]);
  const [panier, setPanier] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [modePaiement, setModePaiement] = useState('Espèces');
  const navigate = useNavigate();  // Redirection vers une autre page

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
        setPanier([]); // Réinitialiser le panier
        navigate('/ventes'); // Rediriger vers l'historique des ventes
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la vente :', error);
        alert('Erreur lors de l\'enregistrement de la vente');
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">🛍️ Caisse</h1>

      {/* Sélection du client */}
      <div className="mb-3">
        <label htmlFor="clientSelect" className="form-label">Client : </label>
        <select
          id="clientSelect"
          className="form-select"
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

      {/* Sélection du mode de paiement */}
      <div className="mb-3">
        <label htmlFor="modePaiement" className="form-label">Mode de paiement : </label>
        <select
          id="modePaiement"
          className="form-select"
          value={modePaiement}
          onChange={e => setModePaiement(e.target.value)}
        >
          <option value="Espèces">Espèces</option>
          <option value="Carte bancaire">Carte bancaire</option>
          <option value="Mobile Money">Mobile Money</option>
        </select>
      </div>

      {/* Liste des produits */}
      <h3 className="mt-4">📦 Produits</h3>
      <div className="list-group">
        {produits.map(p => (
          <button
            key={p.id}
            className="list-group-item list-group-item-action"
            onClick={() => ajouterAuPanier(p)}
          >
            {p.nom} - {p.prix_vente.toLocaleString()} FCFA ➕ Ajouter
          </button>
        ))}
      </div>

      {/* Panier */}
      <h3 className="mt-4">🛒 Panier</h3>
      {panier.length === 0 ? (
        <p>Aucun produit dans le panier</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Qté</th>
              <th>Prix</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {panier.map(item => (
              <tr key={item.id}>
                <td>{item.nom}</td>
                <td>
                  <input
                    type="number"
                    min="1"
                    className="form-control"
                    value={item.quantite}
                    onChange={e => handleQuantiteChange(item.id, e.target.value)}
                  />
                </td>
                <td>{item.prix_vente.toLocaleString()} FCFA</td>
                <td>{(item.prix_vente * item.quantite).toLocaleString()} FCFA</td>
                <td>
                  <button className="btn btn-danger" onClick={() => retirerDuPanier(item.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Affichage du total */}
      <h3 className="mt-4">Total : {calculerTotal().toLocaleString()} FCFA</h3>

      {/* Bouton pour valider la vente */}
      <button className="btn btn-success" onClick={handleSubmit} disabled={panier.length === 0}>
        ✅ Valider la vente
      </button>
    </div>
  );
};

export default Caisse;
