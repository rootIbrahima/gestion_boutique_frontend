import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ListeClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");  // État pour la recherche

  useEffect(() => {
    // Récupérer les clients depuis l'API
    axios.get('http://127.0.0.1:8000/api/clients')
      .then(response => {
        setClients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des clients:', error);
        setLoading(false);
      });
  }, []);

  // Gérer la suppression d'un client
  const handleDelete = (id) => {
    const token = localStorage.getItem('token'); // Token d'authentification

    axios.delete(`http://127.0.0.1:8000/api/clients/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => {
      setClients(clients.filter(client => client.id !== id));
      alert('Client supprimé');
    })
    .catch(error => {
      console.error('Erreur lors de la suppression du client:', error);
    });
  };

  // Gérer la recherche
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // Filtrer les clients selon le texte de recherche
  const filteredClients = clients.filter(client =>
    client.nom.toLowerCase().includes(search.toLowerCase()) ||
    client.email.toLowerCase().includes(search.toLowerCase())
  );

  // Afficher un message de chargement si les clients sont en train de se charger
  if (loading) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Liste des Clients</h1>

      {/* Champ de recherche */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Rechercher un client par nom ou email"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Lien pour ajouter un client */}
      <Link to="/ajouter-client">
        <button className="btn btn-success mb-3">Ajouter un client</button>
      </Link>

      {/* Tableau des clients */}
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredClients.length > 0 ? (
            filteredClients.map((client) => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.nom}</td>
                <td>{client.email}</td>
                <td>{client.telephone}</td>
                <td>{client.adresse || 'Non précisé'}</td>
                <td>
                  <Link to={`/modifier-client/${client.id}`}>
                    <button className="btn btn-primary btn-sm mr-2">Modifier</button>
                  </Link>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(client.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">Aucun client trouvé</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListeClients;
