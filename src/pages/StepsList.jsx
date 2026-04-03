import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function StepsList() {
  const { t } = useTranslation();
  
  // To dynamically get the steps, we can iterate over the keys in the translations.
  // Using a static array of keys based on the dummy data provided.
  const stepKeys = ['intro', 'song1', 'outro'];

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