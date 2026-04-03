import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function StepsList() {
  const { t } = useTranslation();
  
  // To dynamically get the steps, we can iterate over the keys in the translations.
  // Using a static array of keys based on the dummy data provided.
  const stepKeys = [
    'intro',
    '1-traces',
    '2-awaiting',
    '2a-anger',
    '3-rusty-leaves',
    '4a-arevoir',
    '4b-sweet-poison',
    '5-melodies',
    '6a-black-shades',
    '6b-the-light',
    '7-4u',
    '8-kango',
    '9-winds',
    '10-take-me',
    '11-another-breath',
    'outro'
  ];

  return (
    <div className="steps-list-container">
      <header className="hero">
        <h1>{t('stepsTitle')}</h1>
      </header>
      <div className="steps-links">
        {stepKeys.map((key) => (
          <Link key={key} to={`/steps/${key}`} className="step-card">
            <h3>{t(`steps.${key}.title`)}</h3>
            <span className="step-arrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default StepsList;