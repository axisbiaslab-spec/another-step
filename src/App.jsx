import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import StepsList from './pages/StepsList';
import StepDetail from './pages/StepDetail';
import CardDetail from './pages/CardDetail';

function App() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    document.documentElement.lang = i18n.language;
    document.documentElement.setAttribute('data-scroll', window.scrollY > 0 ? '1' : '0');
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [i18n.language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-scroll', scrolled ? '1' : '0');
  }, [scrolled]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const isCardPage = location.pathname.startsWith('/card');

  return (
    <>
      {!isCardPage && (
        <nav className="top-nav" aria-label="Main Navigation">
          <div className="nav-links">
            <Link to="/" className={location.pathname === '/' ? 'active' : ''}>{t('navHome')}</Link>
            <Link to="/steps" className={location.pathname.startsWith('/steps') ? 'active' : ''}>{t('navSteps')}</Link>
          </div>
          <div className="lang-switcher" aria-label="Language selection">
            <button
              onClick={() => changeLanguage('en')}
              className={i18n.resolvedLanguage === 'en' ? 'active' : ''}
            >
              EN
            </button>
            <button
              onClick={() => changeLanguage('ru')}
              className={i18n.resolvedLanguage === 'ru' ? 'active' : ''}
            >
              RU
            </button>
            <button
              onClick={() => changeLanguage('sr')}
              className={i18n.resolvedLanguage === 'sr' ? 'active' : ''}
            >
              SR
            </button>
          </div>
        </nav>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/steps" element={<StepsList />} />
          <Route path="/steps/:stepName" element={<StepDetail />} />
          <Route path="/card/:slug" element={<CardDetail />} />
        </Routes>
      </main>

      <footer>
        <p>{t('footer.socials')}</p>
        <div className="social-links">
          <a href="https://www.instagram.com/axisbias/" target="_blank" rel="noopener noreferrer">Instagram</a>
          <a href="mailto:another-step@axisbias.com" target="_blank" rel="noopener noreferrer">Email</a>
        </div>
      </footer>
    </>
  );
}

export default App;
