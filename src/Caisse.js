import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Caisse = () => {
  const [produits, setProduits] = useState([]);
  const [clients, setClients] = useState([]);
  const [panier, setPanier] = useState([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [modePaiement, setModePaiement] = useState('Espèces');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/produits')
      .then(response => setProduits(response.data))
      .catch(error => console.error('Erreur produits:', error));

    axios.get('http://127.0.0.1:8000/api/clients')
      .then(response => setClients(response.data))
      .catch(error => console.error('Erreur clients:', error));
  }, []);

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

  const retirerDuPanier = (id) => {
    setPanier(panier.filter(p => p.id !== id));
  };

  const handleQuantiteChange = (id, newQuantite) => {
    setPanier(panier.map(p =>
      p.id === id ? { ...p, quantite: Number(newQuantite) } : p
    ));
  };

  const calculerTotal = () => {
    return panier.reduce((total, item) => total + item.prix_vente * item.quantite, 0);
  };

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
        setPanier([]);
        navigate('/'); // ou navigate('/ventes') si tu fais une liste des ventes
      })
      .catch(error => {
        console.error('Erreur lors de l\'enregistrement de la vente :', error);
        alert('Erreur lors de l\'enregistrement de la vente');
      });
  };

  return (
    <div>
      <h1>🛍️ Caisse</h1>

      <div>
        <label>Client : </label>
        <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
          <option value="">Client anonyme</option>
          {clients.map(client => (
            <option key={client.id} value={client.id}>
              {client.nom}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label>Mode de paiement : </label>
        <select value={modePaiement} onChange={e => setModePaiement(e.target.value)}>
          <option value="Espèces">Espèces</option>
          <option value="Carte bancaire">Carte bancaire</option>
          <option value="Mobile Money">Mobile Money</option>
        </select>
      </div>

      <h3>📦 Produits</h3>
      <ul>
        {produits.map(p => (
          <li key={p.id}>
            {p.nom} - {p.prix_vente.toLocaleString()} FCFA &nbsp;
            <button onClick={() => ajouterAuPanier(p)}>➕ Ajouter</button>
          </li>
        ))}
      </ul>

      <h3>🛒 Panier</h3>
      {panier.length === 0 ? (
        <p>Aucun produit dans le panier</p>
      ) : (
        <table>
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
                    value={item.quantite}
                    onChange={e => handleQuantiteChange(item.id, e.target.value)}
                  />
                </td>
                <td>{item.prix_vente.toLocaleString()} FCFA</td>
                <td>{(item.prix_vente * item.quantite).toLocaleString()} FCFA</td>
                <td>
                  <button onClick={() => retirerDuPanier(item.id)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Total : {calculerTotal().toLocaleString()} FCFA</h3>

      <button onClick={handleSubmit} disabled={panier.length === 0}>
        ✅ Valider la vente
      </button>
    </div>
  );
};

export default Caisse;
