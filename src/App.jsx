import React, { useState, useEffect } from 'react';
import MyPage from './MyPage.jsx';
import CheckDriverPage from './CheckDriverPage.jsx';
import BalancePage from './BalancePage.jsx';
import ProfilePage from './ProfilePage.jsx';
import MyChecksPage from './MyChecksPage.jsx';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Simple routing based on hash
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#check' || hash === '#search') {
        setCurrentPage('check');
      } else if (hash === '#balance') {
        setCurrentPage('balance');
      } else if (hash === '#profile') {
        setCurrentPage('profile');
      } else if (hash === '#checks') {
        setCurrentPage('checks');
      } else {
        setCurrentPage('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (currentPage === 'check') {
    return <CheckDriverPage />;
  }

  if (currentPage === 'balance') {
    return <BalancePage />;
  }

  if (currentPage === 'profile') {
    return <ProfilePage />;
  }

  if (currentPage === 'checks') {
    return <MyChecksPage />;
  }

  return <MyPage />;
}

