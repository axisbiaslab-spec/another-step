import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const Section = ({ id, title, text }) => (
  <section id={id}>
    <h2>{title}</h2>
    <p>{text}</p>
  </section>
);

function App() {
  const { t, i18n } = useTranslation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Set language attribute for accessibility
    document.documentElement.lang = i18n.language;
    document.documentElement.setAttribute('data-scroll', window.scrollY > 0 ? '1' : '0');
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [i18n.language]);

  useEffect(() => {
    document.documentElement.setAttribute('data-scroll', scrolled ? '1' : '0');
  }, [scrolled]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <>
      <nav className="top-nav" aria-label="Main Navigation">
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

      <main>
        <header className="hero">
          <h1>{t('hero.title')}</h1>
          <p className="subtitle">{t('hero.subtitle')}</p>
        </header>

        <Section 
          id="intro" 
          title={t('introHeader')} 
          text={t('introText')} 
        />
        <Section 
          id="circle" 
          title={t('circleHeader')} 
          text={t('circleText')} 
        />
        <Section 
          id="choice" 
          title={t('choiceHeader')} 
          text={t('choiceText')} 
        />
        <Section 
          id="about-me" 
          title={t('aboutMe.title')} 
          text={t('aboutMe.text')} 
        />
        <Section 
          id="about-show" 
          title={t('aboutShow.title')} 
          text={t('aboutShow.text')} 
        />
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