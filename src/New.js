import './App.css';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { url } from "./const";
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Compressor from 'compressorjs';
import Header from './Header';


function New() {
  const navigate = useNavigate(); // リダイレクト用のフック
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { login, token } = useAuth();
  const [iconUrl, setIconUrl] = useState('');

  //react-hook-formを使って、バリデーションを実現する。
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  //画像保存用
  const [image, setImage] = useState();

  //Compressor.jsを使って画像圧縮
  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      new Compressor(event.target.files[0], {
        quality: 0.6, // 60%の品質に圧縮
        success: (compressedImage) => {
          setImage(compressedImage);
        },
      });
    }
  };

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
      const response = await axios.post(`${url}/books`, bookData, {
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
    // トークンが存在しない場合、/indexにリダイレクト
    if (!token) {
      navigate('/index');
    }
  }, [token, navigate]);

  return (
    <>
      <Header />
      <div>
        
        <h2>レビュー新規作成</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
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
          
          <button type="submit">新規作成</button>
        </form>
        <a href="/index">一覧画面に戻る</a>
      </div>
    </>
  );
}

export default New;
