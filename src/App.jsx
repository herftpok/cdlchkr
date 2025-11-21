import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MyPage from './MyPage.jsx';
import CheckDriverPage from './CheckDriverPage.jsx';
import BalancePage from './BalancePage.jsx';
import ProfilePage from './ProfilePage.jsx';
import MyChecksPage from './MyChecksPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MyPage />} />
      <Route path="/check" element={<CheckDriverPage />} />
      <Route path="/search" element={<CheckDriverPage />} />
      <Route path="/balance" element={<BalancePage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/checks" element={<MyChecksPage />} />
    </Routes>
  );
}

