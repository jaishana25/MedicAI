
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // hard-coded users
  const users = [
    { username: 'admin', password: 'abcd@1234' },
    { username: 'user', password: '123456' }
  ];

  const handleLogin = () => {

    const validUser = users.find(user => user.username === username && user.password === password);

    if (validUser) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', username);
      setSuccessMessage('Logged in successfully!');
      setTimeout(() => {
        navigate('/report');
      }, 1000);
    } else {
      alert('Invalid username or password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-green-200 p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>


        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />


        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />


        <button onClick={handleLogin} className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
          Login
        </button>

        {successMessage && (
          <div className="mt-4 p-2 text-center text-green-700 bg-green-100 rounded">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
