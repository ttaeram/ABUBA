import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layouts/Layout'
import Main from './pages/Main'

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App;
