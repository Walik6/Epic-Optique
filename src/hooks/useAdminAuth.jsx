import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAdminAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifie si l'utilisateur est connecté et si c'est un admin
    const user = localStorage.getItem('user'); // ou sessionStorage
    if (!user) {
      navigate('/login'); // redirige vers login si pas connecté
      return;
    }

    const userObj = JSON.parse(user);
    if (userObj.role !== 'admin') {
      navigate('/'); // redirige vers la page publique si pas admin
    }
  }, [navigate]);
};

export default useAdminAuth;
