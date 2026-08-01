import React from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import registry from '../content/tarot/registry.json';
import arcana from '../content/tarot/arcana.json';
import TiltCard from '../components/TiltCard';
import ActivateCard from '../components/ActivateCard';

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

  const meta = cardsBySlug[slug];
  const text = arcana[slug];

  if (!meta || !text) {
    return <Navigate to="/" replace />;
  }

  const lang = LANGS.includes(i18n.resolvedLanguage) ? i18n.resolvedLanguage : 'en';
  const name = meta.name[lang] || meta.name.en;
  const description = text[lang] || text.en;

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
            alt={name}
            backText={description}
            glowKey={meta.suit || meta.arcana}
          />
        </div>
        <p className="card-flip-hint">{FLIP_HINT[lang]}</p>

        <ActivateCard id={cardId} code={cardCode} lang={lang} />
      </section>
    </div>
  );
}

export default CardDetail;
