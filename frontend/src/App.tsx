import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layouts/Layout'
import Main from './pages/Main'
import LoginPage from './pages/LoginPage'
import OnBoardingInfoPage from './pages/OnBoardingInfoPage'
import SignupPage from './pages/SignupPage';

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Main/>} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/onboard" element={<OnBoardingInfoPage/>} />
        <Route path="/signup" element={<SignupPage/>} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App;
