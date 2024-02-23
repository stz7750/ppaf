import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import Join from './pages/Join';
import Toast from  './pages/Toast';
import Calendar from './pages/Calendar';
import BigCalendar from './pages/BigCalendar';
import Main from './pages/Main';
import Admin from './adminpages/Admin';
import Admins from './adminpages/Admins';
import RegEvent from './adminpages/RegEvent';
import Footer from './layout/Footer';



function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/join" element={<Join />}/>
          <Route path="/Toast" element={<Toast></Toast>} />
          <Route path="/Calendar" element={<Calendar></Calendar>} />
          <Route path="/BigCalendar" element={<BigCalendar />} />
          <Route path="/main" element={<Main/>}/>
          <Route path="/admin/main" element={<Admin/>}/>
          <Route path="/admin/main2" element={<Admins />}/>
          <Route path='/admin/Event' element={<RegEvent />}/>
        </Routes>
      </Router>
    </>
  );
}

export default App;
