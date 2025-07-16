import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Hook pour la redirection après la connexion

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Envoie une requête POST à l'API de login
      const response = await axios.post('http://127.0.0.1:8000/api/login', { email, password });

      // Sauvegarde le token JWT dans localStorage
      localStorage.setItem('token', response.data.token);

      // Redirige l'admin vers la page principale (dashboard)
      navigate('/'); // Assurez-vous que la route '/dashboard' est définie dans ton React Router

    } catch (error) {
      console.error('Erreur de connexion', error);
      alert('Erreur de connexion, veuillez vérifier vos informations.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password :</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
