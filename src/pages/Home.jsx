import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Routes, Route, Link, Outlet, useLocation } from 'react-router-dom';

const Section = ({ id, title, text }) => (
  <section id={id}>
    <h2>{title}</h2>
    <p>{text}</p>
  </section>
);

function Home() {
  const { t } = useTranslation();
  return (
    <>
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
        id="about-show" 
        title={t('aboutShow.title')} 
        text={t('aboutShow.text')} 
      />
    </>
  );
}

export default Home;