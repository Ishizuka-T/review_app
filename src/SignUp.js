import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';　//npm install react-hook-formの実施が必要
import axios from 'axios';　//npm install axiosの実施が必要
import Compressor from 'compressorjs'; //npm install compressorjsの実施が必要
import { url } from "./const";
import './SignUp.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


function SignUp() {
  const navigate = useNavigate(); // リダイレクト用のフック
  const { login, logout, token } = useAuth();

  useEffect(() => {
    // トークンが存在する場合、/indexにリダイレクト
    if (token) {
      navigate('/index');
    }
  }, [token, navigate]); // 依存配列にtokenとnavigateを追加

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
    //仮のキー
    let token = ""
    try {
      //画像以外のデータをJSON形式で送信
      const userData = {
        name: data.name,
        email: data.email,
        password: data.password,
      };
    
      // axios.postをawaitで待機させる
      const response = await axios.post(`${url}/users`, userData);
      console.log(response.data);
      console.log("登録が成功しました");
      token = response.data.token; // トークンをセット

      // トークンがある場合、画像アップロードの処理を実行
      if (token && image) {
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
      navigate('/login');
    } catch (error) {
      console.error("エラー発生", error);
    }
  };

  return (
    <div>
      <h2>アカウント作成</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <p><strong>名前</strong></p>
        <input
          type="text"
          placeholder="名前"
          {...register('name', { required: true })}
        />
        {errors.name && <p>名前は必須です</p>}
        <p><strong>メールアドレス</strong></p>
        <input
          type="email"
          placeholder="メールアドレス"
          {...register('email', { required: true })}
        />
        {errors.email && <p>Eメールは必須です</p>}
        <p><strong>パスワード</strong></p>
        <input
          type="password"
          placeholder="パスワード"
          {...register('password', { required: true })}
        />
        {errors.password && <p>パスワードは必須です</p>}
        <p><strong>アイコン</strong></p>
        <input
          type="file"
          accept="image/*"
          onChange={onImageChange}
        />
        
        <button type="submit">アカウント作成</button>
      </form>
      <a href="/login">ログイン画面に戻る</a>
    </div>
  );
}

export default SignUp;