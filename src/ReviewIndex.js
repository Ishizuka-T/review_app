import './ReviewIndex.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { url } from "./const";
// import Pagination from './Pagination'; Pagination コンポーネント　今回Reduxを使うのはやめた。
import { useAuth } from './AuthContext';
import Header from './Header';
import { usePagination } from './PaginationContext'; //今はこっちにした！
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

function ReviewIndex() {
  const [data, setData] = useState([]);
  const { username, token } = useAuth();
  const { currentPage, setCurrentPage } = usePagination();
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      navigate('/login');
    }else{
      fetchData();
    }
  }, [currentPage, token, navigate]);

  const fetchData = async () => {
    const offset = (currentPage - 1) * 10; // 1ページ10個なので、次の値の計算をする。
    try {
      let response;
      if (token) {
        response = await axios.get(`${url}/books`, {
          headers: {
            'Authorization': "Bearer " + token,
          },
          params: {
            offset, // クエリパラメータとしてoffsetを設定
          },
        });
      } else {
        // トークンがない場合のリクエスト（別のエンドポイントやパラメータを使用）
        response = await axios.get(`${url}/public/books`, {
          params: {
            offset, // トークンがない場合もクエリパラメータとしてoffsetを設定
          },
        });
        console.log("トークンなし");
      }
      setData(response.data); // 取得したデータで状態を更新
    } catch (error) {
      console.error("データの取得に失敗しました", error);
    }
  };

  const handleDelete = async (bookId) => {
    if (window.confirm('本当に削除しますか？')) {
      try {
        const response = await fetch(`${url}/books/${bookId}`, {
          method: 'DELETE', // HTTPメソッド
          headers: {
            'Authorization': "Bearer " + token,
          }
          // 認証トークンが必要なAPIの場合はここに追加
        });
  
        if (response.ok) {
          // 削除が成功した場合の処理 (例: ページをリフレッシュ、または状態を更新してリストから削除)
          console.log('削除成功');
          // ページのリフレッシュや、状態の更新などの処理をここに追加
          fetchData();
        } else {
          // サーバーからのエラーレスポンス処理
          console.error('削除に失敗しました。');
        }
      } catch (error) {
        // ネットワークエラーなどの処理
        console.error('削除中にエラーが発生しました。', error);
      }
    }
  };

  return (
    <div>
      <Header userName={username} />
      <div className="review-index">
        <h1 className="review-index__title">データ一覧</h1>
        <div><button onClick={() => navigate('/new')}>新規作成</button></div>
        <ul className="review-index__list">
        {data.map(book => (
        <li key={book.id} className="review-index__item">
          <div className="review-index__item-title"><strong>タイトル：</strong>{book.title}</div>
          <div className="review-index__item-url"><strong>URL：</strong><a href={book.url} target="_blank" rel="noopener noreferrer">{book.url}</a></div>
          <div className="review-index__item-detail"><strong>詳細：</strong>{book.detail}</div>
          <div className="review-index__item-review"><strong>レビュー：</strong>{book.review}</div>
          <div className="review-index__item-reviewer"><strong>レビュワー：</strong>{book.reviewer}</div>
          {/* 詳細ボタンの追加 */}
          <div style={{ marginTop: '10px' }}>
            <button onClick={() => navigate(`/detail/${book.id}`)}>詳細</button>
            {/* 条件に基づくボタンの追加 */}
            {book.isMine && (
              <>
                <button onClick={() => navigate(`/edit/${book.id}`)}>更新</button>
                <button onClick={() => handleDelete(book.id)}>削除</button>
              </>
            )}
          </div>
        </li>
      ))}
        </ul>
        <div>
          {currentPage > 1 && (<button onClick={() => setCurrentPage(currentPage - 1)}>前へ</button>)}
          <button onClick={() => setCurrentPage(currentPage + 1)}>次へ</button>
        </div>
      </div>
    </div>
  );
}

export default ReviewIndex;