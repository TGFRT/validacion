// pages/index.js
import { useState } from 'react';
import UserPhotos from '../components/UserPhotos';

export default function Home() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (data.message === 'Login successful') {
      setUser(data.user);
    } else {
      alert(data.error);
    }
  };

  return (
    <div>
      {!user ? (
        <div>
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div>
          <h2>Welcome, {user.phone}</h2>
          <UserPhotos phone={user.phone} />
        </div>
      )}
    </div>
  );
}
