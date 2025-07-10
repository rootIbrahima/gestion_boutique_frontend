import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AjouterClient = () => {
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [adresse, setAdresse] = useState('');
  const [isLoading, setIsLoading] = useState(false); // État pour savoir si le client est en train d'être ajouté
  const [error, setError] = useState(''); // Pour afficher les erreurs
  const [successMessage, setSuccessMessage] = useState(''); // Pour afficher le message de succès
  const navigate = useNavigate();

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
    setIsLoading(true); // Démarrer le chargement

    // Envoyer une requête POST pour ajouter un client
    axios.post('http://127.0.0.1:8000/api/clients', clientData)
      .then(response => {
        setSuccessMessage('Client ajouté avec succès!');
        setTimeout(() => {
          navigate('/clients'); // Rediriger vers la liste des clients après l'ajout
        }, 2000);
      })
      .catch(error => {
        console.error('Erreur lors de l\'ajout du client:', error);
        setError('Erreur lors de l\'ajout du client');
      })
      .finally(() => {
        setIsLoading(false); // Arrêter le chargement une fois la requête terminée
      });
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Ajouter un client</h1>
      
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

        <button type="submit" className="btn btn-primary btn-block" disabled={isLoading}>
          {isLoading ? 'Ajout en cours...' : 'Ajouter le client'}
        </button>
      </form>
    </div>
  );
};

export default AjouterClient;
