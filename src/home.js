import './App.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 

function Home() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (e) => {
    e.preventDefault(); // フォームの送信を防ぎます

    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setErrorMessage('無効なメールアドレスです');
    } else {
      setErrorMessage('');
      // ここで有効なメールアドレスでの処理を行います（例: APIへの送信）
      console.log('Email is valid:', email);
    }
  };

  return (
    <div>
      <h2>Email Form</h2>
      <form onSubmit={validateEmail}>
        <label htmlFor="email">Email:</label><br/>
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br/>
        {errorMessage && <span style={{ color: 'red' }}>{errorMessage}</span>}<br/>
        <input type="submit" value="Submit" />
      </form>

      <div className="signup-link">
        <Link to="/login">station2以降はこちら</Link>
      </div>
    </div>
  );
}

export default Home;
