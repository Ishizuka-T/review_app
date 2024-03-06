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


function Profile() {
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
      const userData = {
        name: data.name,
      };
    
      // axios.putをawaitで待機させる
      const response = await axios.put(`${url}/users`, userData, {
        headers: {
          'Authorization': "Bearer " + token,
        }
      });
      console.log(response.data);
      console.log("登録が成功しました");

      if (image) {
        const imageFormData = new FormData();
        imageFormData.append('icon', image);
        console.log("OK");
        axios.post(`${url}/uploads`, imageFormData, {
          headers: {
            'Authorization': "Bearer " + token,
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(response => {
          console.log("画像もアップロードできました");
          console.log(response.data);
          //reset();
        })
      }
      login( data.name , token);
      navigate('/index');
    } catch (error) {
      console.error("エラー発生", error);
    }
  };

  useEffect(() => {
    // トークンが存在しない場合、/indexにリダイレクト
    if (!token) {
      navigate('/index');
    }else{
      fetchData();
    }
  }, [token, navigate]);

  const fetchData = async () => {
    const response = await axios.get(`${url}/users`, {
      headers: {
        'Authorization': "Bearer " + token,
      }
    });
      /*帰ってくるのはこれ
      {
        "name": "string",
        "iconUrl": "string"
      }*/
    reset({
      name: response.data.name, // フォームに初めからセット
    });
    setIconUrl(response.data.iconUrl); 
  };

  return (
    <>
      <Header />
      <div>
        
        <h2>アカウント更新</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <p><strong>名前</strong></p>
          <input
            type="text"
            placeholder="名前"
            {...register('name', { required: true })}
          />
          {errors.name && <p>名前は必須です</p>}
  
          <p><strong>プロフィールアイコン</strong></p>
          {iconUrl && <img src={iconUrl} alt="プロフィールアイコン" />}
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
          />
          
          <button type="submit">アカウント更新</button>
        </form>
        <a href="/index">一覧画面に戻る</a>
      </div>
    </>
  );
}

export default Profile;
