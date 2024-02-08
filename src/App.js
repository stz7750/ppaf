import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Join from './pages/Join';
import Toast from  './pages/Toast';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />}/>
        <Route path="/Toast" element={<Toast></Toast>} />
      </Routes>
    </Router>
  );
}

export default App;
