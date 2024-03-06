import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; //npm install react-router-domの実施が必要
//import Header from './Header';
import Home from './home';
import Login from './Login';
import SignUp  from './SignUp';
import ReviewIndex  from './ReviewIndex';
import Profile from './Profile';
import New from './New';
import Detail from './Detail';
import Edit from './Edit';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/index" element={<ReviewIndex />} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/new" element={<New/>} />
          <Route path="/detail/:id" element={<Detail />} />
          <Route path="/edit/:id" element={<Edit />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
