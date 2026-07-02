import React, { useState, useEffect, useRef } from 'react';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_URL; 

  // Ref pour le champ username
  const usernameRef = useRef(null);

  // Focus automatique sur le champ username au chargement du composant
  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/login.php`, {
      method: 'POST',
      credentials: 'include',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({username, password})
    });
    const data = await res.json();
    if(data.success){
      onLogin(data.user);
    } else {
      setError('Nom d’utilisateur ou mot de passe incorrect');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Connexion Admin</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom d’utilisateur"
            value={username}
            onChange={e => setUsername(e.target.value)}
            ref={usernameRef}  // <-- focus ici
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && <div className="error">{error}</div>}
          <button type="submit">Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
