import React from 'react'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Layout from './components/layouts/Layout'
import Main from './pages/Main'
import DiaryList from './pages/diary/DiaryList'
import DiaryDetail from './pages/diary/DiaryDetail'
import DiaryCreate from './pages/diary/DiaryCreate'
import DiaryUpdate from './pages/diary/DiaryUpdate'

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/diaryList" element={<DiaryList />} />
        <Route path="/diary/:id" element={<DiaryDetail />} />
        <Route path="/diary/create" element={<DiaryCreate />} />
        <Route path="/diary/:id/update" element={<DiaryUpdate />} />
      </Routes>
    </Layout>
  </Router>
  );
}

export default App
