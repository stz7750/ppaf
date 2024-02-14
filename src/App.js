import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Join from './pages/Join';
import Toast from  './pages/Toast';
import Calendar from './pages/Calendar';
import BigCalendar from './pages/BigCalendar';
import Main from './pages/Main';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />}/>
        <Route path="/Toast" element={<Toast></Toast>} />
        <Route path="/Calendar" element={<Calendar></Calendar>} />
        <Route path="/BigCalendar" element={<BigCalendar />} />
        <Route path="/main" element={<Main/>}/>
      </Routes>
    </Router>
  );
}

export default App;
