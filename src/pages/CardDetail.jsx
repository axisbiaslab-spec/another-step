import React from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import registry from '../content/tarot/registry.json';
import arcana from '../content/tarot/arcana.json';
import placeholders from '../content/tarot/placeholders.json';
import rwsPlaceholders from '../content/tarot/rws-placeholders.json';
import testCards from '../content/tarot/test-cards.json';
import TiltCard from '../components/TiltCard';

const LANGS = ['en', 'ru', 'sr'];

const FLIP_HINT = {
  en: 'Tap the card to read its meaning',
  ru: 'Коснитесь карты, чтобы увидеть трактовку',
  sr: 'Dodirnite kartu da vidite značenje',
};

const cardsBySlug = Object.fromEntries(registry.map((card) => [card.slug, card]));

function CardDetail() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const cardId = searchParams.get('id');
  const cardCode = searchParams.get('code');
  const { i18n } = useTranslation();

  // test-sun is a standalone NFC hardware-testing card — not part of the
  // real registry/arcana content pipeline, so it never touches deck codes.
  const meta = cardsBySlug[slug] || testCards.meta[slug];
  const text = arcana[slug] || testCards.arcana[slug];

  if (!meta || !text) {
    return <Navigate to="/" replace />;
  }

  const lang = LANGS.includes(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en';
  const name = meta.name[lang] || meta.name.en;
  const description = text[lang] || text.en;
  const attribution = [text.author, text.source].filter(Boolean).join(' — ');

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
        <div className="card-image-container">
          <TiltCard
            src={`/tarot/${slug}.jpg`}
            placeholderSrc={placeholders[slug]}
            rwsSrc={`/rws/${slug}.jpg`}
            rwsPlaceholderSrc={rwsPlaceholders[slug]}
            alt={name}
            backText={description}
            attribution={attribution}
            glowKey={meta.suit || meta.arcana}
            cardId={cardId}
            cardCode={cardCode}
            lang={lang}
          />
        </div>
        <div className="card-flip-chevrons" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 15l6 -6l6 6" />
            <path d="M6 9l6 -6l6 6" />
          </svg>
        </div>
        <p className="card-flip-hint">{FLIP_HINT[lang]}</p>
      </section>
    </div>
  );
}

export default CardDetail;
