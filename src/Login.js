import React, { useState, useEffect } from 'react';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { url } from "./const";
import { useAuth } from './AuthContext';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [errorMessage, setErrorMessage] = React.useState('');
  const { login, token } = useAuth();
  const navigate = useNavigate(); // リダイレクト用のフック

  useEffect(() => {
    // トークンが存在する場合、/indexにリダイレクト
    if (token) {
      navigate('/index');
    }
  }, [token, navigate]); // 依存配列にtokenとnavigateを追加

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${url}/signin`, data);
      const token = response.data.token; // トークンをセット
      console.log('ログイン成功！', response.data);
      const response2 = await axios.get(`${url}/users`, {
        headers: {
          'Authorization': "Bearer " + token,
        }
      });
      console.log("あ");
      console.log(response2);
      login( response2.data.name , token);
      // ログイン後、/indexにリダイレクト
      navigate('/index');
      setErrorMessage(''); // エラーメッセージをクリア
    } catch (error) {
      console.error('ログインエラー', error.response ? error.response.data : error.message);
      setErrorMessage('ログインに失敗しました。'); // エラーメッセージをセット
    }
  };

  return (
    <div className="login-container">
      <h2>ログイン画面</h2>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            {...register('email', { required: 'メールアドレスは必須です。', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: '無効なメールアドレスです。' } })}
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            {...register('password', { required: 'パスワードは必須です。' })}
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        <button type="submit">ログイン</button>
      </form>
      <div className="signup-link">
        <Link to="/signup">新規作成ボタン</Link>
      </div>
    </div>
  );
}

export default Login;