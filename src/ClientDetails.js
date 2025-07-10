// ClientDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ClientDetails = () => {
  const [client, setClient] = useState(null);
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/clients/${id}`)
      .then(response => {
        const clientData = response.data;
        setClient(clientData);
        setNom(clientData.nom);
        setEmail(clientData.email);
        setTelephone(clientData.telephone);
        setAdresse(clientData.adresse);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du client:', error);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedClient = { nom, email, telephone, adresse };

    axios.put(`http://127.0.0.1:8000/api/clients/${id}`, updatedClient)
      .then(response => {
        alert('Client modifié avec succès');
        navigate('/clients');
      })
      .catch(error => {
        console.error('Erreur lors de la modification du client:', error);
        alert('Une erreur est survenue');
      });
  };

  if (!client) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <h2>Modifier le client</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom :</label>
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} required />
        </div>
        <div>
          <label>Email :</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label>Téléphone :</label>
          <input type="text" value={telephone} onChange={(e) => setTelephone(e.target.value)} />
        </div>
        <div>
          <label>Adresse :</label>
          <input type="text" value={adresse} onChange={(e) => setAdresse(e.target.value)} />
        </div>
        <button type="submit">Mettre à jour le client</button>
      </form>
    </div>
  );
};

export default ClientDetails;
