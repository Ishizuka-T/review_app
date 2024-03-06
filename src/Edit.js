import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { url } from "./const";
import Header from './Header';
import './Detail.css';
import { useForm } from 'react-hook-form';

function Edit() {
  const { id } = useParams();
  const [bookDetails, setBookDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { username, token } = useAuth();

  //react-hook-formを使って、バリデーションを実現する。
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    try {
      //画像以外のデータをJSON形式で送信
      const bookData = {
        title: data.title,
        url: data.url,
        detail: data.detail,
        review: data.review,
      };
    
      // axios.putをawaitで待機させる
      const response = await axios.put(`${url}/books/${id}`, bookData, {
        headers: {
          'Authorization': "Bearer " + token,
        }
      });
      console.log(response.data);
      console.log("登録が成功しました");
      navigate('/index');
    } catch (error) {
      console.error("エラー発生", error);
    }
  };

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
        reset({
          title: response.data.title,
          url: response.data.url,
          detail: response.data.detail,
          review: response.data.review,
        });
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <h1>書籍更新</h1>
      <p><strong>タイトル</strong></p>
      <input
        type="text"
        placeholder="タイトル"
        {...register('title', { required: true })}
      />
      {errors.title && <p>タイトルは必須です</p>}

      <p><strong>URL</strong></p>
      <input
        type="text"
        placeholder="URL"
        {...register('url', { required: true })}
      />
      {errors.url && <p>URLは必須です</p>}

      <p><strong>詳細</strong></p>
      <input
        type="text"
        placeholder="詳細"
        {...register('detail', { required: true })}
      />
      {errors.detail && <p>詳細は必須です</p>}

      <p><strong>レビュー</strong></p>
      <input
        type="text"
        placeholder="レビュー"
        {...register('review', { required: true })}
      />
      {errors.review && <p>レビューは必須です</p>}

      <button type="submit">書籍レビュー更新</button>
    </form>

    <a href="/index">一覧画面に戻る</a>
    </div>
  );
}

export default Edit;