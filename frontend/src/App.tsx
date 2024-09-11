import React from 'react';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layouts/Layout'
import Main from './pages/Main'
import DiaryList from './pages/diary/DiaryList'
import Diary from './pages/diary/Diary'

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/diaryList" element={<DiaryList />} />
        <Route path="/diary" element={<Diary />} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App;
