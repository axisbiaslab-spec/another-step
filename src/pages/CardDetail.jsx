import React, { useState } from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import registry from '../content/tarot/registry.json';
import arcana from '../content/tarot/arcana.json';

const LANGS = ['en', 'ru', 'sr'];

const cardsBySlug = Object.fromEntries(registry.map((card) => [card.slug, card]));

function CardDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get('id');
  const { i18n } = useTranslation();

  const meta = cardsBySlug[slug];
  const text = arcana[slug];

  const initialLang = LANGS.includes(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en';
  const [activeLang, setActiveLang] = useState(initialLang);

  if (!meta || !text) {
    return <Navigate to="/" replace />;
  }

  const name = meta.name[activeLang] || meta.name.en;
  const description = text[activeLang] || text.en;

  return (
    <div className="step-detail card-detail">
      <div className="back-link-container">
        <Link to="/" className="back-link">← Another Step</Link>
      </div>

      <header className="step-header">
        <h1>{name}</h1>
        {cardId && <p className="card-instance">№ {cardId}</p>}
      </header>

      <section className="step-content">
        <div className="step-philosophy">
          <div className="tabs-container">
            {LANGS.map((lang) => (
              <button
                key={lang}
                className={`tab-btn ${activeLang === lang ? 'active' : ''}`}
                onClick={() => setActiveLang(lang)}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="philosophy-content">
            <p>{description}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CardDetail;
