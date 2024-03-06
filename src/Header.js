import React from 'react';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom'; // useNavigateをインポート

// スタイル定義
const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '10px 20px',
  backgroundColor: '#f5f5f5',
  borderBottom: '1px solid #ddd',
};

const headerNameStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
};

const headerLogoutButtonStyle = {
  padding: '5px 10px',
  fontSize: '16px',
  cursor: 'pointer',
};

// Headerコンポーネント
const Header = () => {
  const { username, token, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={headerStyle}>
      {token ? (
        <><div style={headerNameStyle}>{username}</div><div><button style={headerLogoutButtonStyle} onClick={() => navigate('/profile')}>ユーザー編集</button></div></>
      ):(<div style={headerNameStyle}>ゲスト</div>)}
      {token ? (
        <div><button style={headerLogoutButtonStyle} onClick={logout}>ログアウト</button></div>
      ):(<div><button style={headerLogoutButtonStyle} onClick={() => navigate('/login')}>ログイン</button></div>)}
    </div>
  );
};

export default Header;