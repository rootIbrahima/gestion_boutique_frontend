import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ModifierClient = () => {
  const { id } = useParams(); // Récupère l'ID du client depuis l'URL
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
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
        setAdresse(client.adresse || '');
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
      adresse,
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
    return <div className="text-center">Chargement...</div>; // Afficher un message de chargement tant que les données ne sont pas récupérées
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Modifier le client</h1>
      
      {/* Affichage des erreurs */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Affichage du message de succès */}
      {successMessage && <div className="alert alert-success">{successMessage}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Nom :</label>
          <input
            type="text"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Email :</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Téléphone :</label>
          <input
            type="text"
            className="form-control"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
          />
        </div>

        <div className="form-group mb-3">
          <label>Adresse :</label>
          <input
            type="text"
            className="form-control"
            value={adresse}
            onChange={(e) => setAdresse(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-block">Mettre à jour le client</button>
      </form>
    </div>
  );
};

export default ModifierClient;
