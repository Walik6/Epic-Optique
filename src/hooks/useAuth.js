import { useState, useEffect } from 'react';

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('adminUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  return { user, isAdmin: user?.role === 'admin' };
}
