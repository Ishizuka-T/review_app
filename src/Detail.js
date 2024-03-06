import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { url } from "./const";
import Header from './Header';
import './Detail.css';

function Detail() {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username, token } = useAuth();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/books/${id}`, {
          headers: {
            'Authorization': "Bearer " + token,
          }
        });
        setBookDetails(response.data);
        setLoading(false); // データの取得後、ローディング状態を解除
      } catch (error) {
        console.error('Error fetching book details:', error);
        setError(error); // エラーをステートにセット
        setLoading(false); // エラーが発生した場合もローディング状態を解除
      }
    };

    fetchData();
  }, [id, token, navigate]);

  if (loading) {
    return <div>ローディング</div>; // ローディング中の表示
  }

  if (error) {
    return <div>エラー！</div>; // エラーが発生した場合の表示
  }

  return (
    <div>
    <Header userName={username} />
    <div id ="window">
      <h1>書籍詳細</h1>
      <p><strong>タイトル:</strong>{bookDetails.title}</p>
      <p><strong>URL:</strong> <a href={bookDetails.url} target="_blank" rel="noopener noreferrer">{bookDetails.url}</a></p>
      <p><strong>詳細:</strong> {bookDetails.detail}</p>
      <p><strong>レビュー:</strong> {bookDetails.review}</p>
      <p><strong>レビュワー:</strong> {bookDetails.reviewer}</p>
    </div>
    <a href="/index">一覧画面に戻る</a>
    </div>
  );
}

export default Detail;