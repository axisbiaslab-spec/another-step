import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, Link, Navigate } from 'react-router-dom';

function parseContent(rawContent) {
  if (!rawContent) return [];
  const regex = /```(\w+)[\r\n]+([\s\S]*?)```/g;
  const versions = [];
  let match;
  while ((match = regex.exec(rawContent)) !== null) {
    versions.push({ lang: match[1], text: match[2].trim() });
  }
  
  if (versions.length === 0) {
    return [{ lang: 'default', text: rawContent.trim() }];
  }
  return versions;
}

function StepDetail() {
  const { t, i18n } = useTranslation();
  const { stepName } = useParams();

  const title = t(`steps.${stepName}.title`);
  const rawLyrics = t(`steps.${stepName}.lyrics`);
  const rawPhilosophy = t(`steps.${stepName}.philosophy`);

  if (title === `steps.${stepName}.title`) {
    return <Navigate to="/steps" replace />;
  }

  const lyricVersions = parseContent(rawLyrics);
  const philosophyVersions = parseContent(rawPhilosophy);

  const activeLang = i18n.resolvedLanguage;

  const [activeTab, setActiveTab] = useState(() => {
    if (lyricVersions.length === 1 && lyricVersions[0].lang === 'default') return 'default';
    if (lyricVersions.some(v => v.lang === activeLang)) return activeLang;
    if (lyricVersions.some(v => v.lang === 'en')) return 'en';
    return lyricVersions[0]?.lang || 'default';
  });

  useEffect(() => {
    if (lyricVersions.some(v => v.lang === activeLang)) {
      setActiveTab(activeLang);
    } else if (lyricVersions.some(v => v.lang === 'en')) {
      setActiveTab('en');
    } else {
      setActiveTab(lyricVersions[0]?.lang || 'default');
    }
  }, [activeLang, rawLyrics]);

  if (title === `steps.${stepName}.title`) {
    return <Navigate to="/steps" replace />;
  }

  let activePhilosophy = philosophyVersions.find(v => v.lang === activeLang)?.text 
    || philosophyVersions.find(v => v.lang === 'en')?.text 
    || philosophyVersions[0]?.text;

  const currentLyricText = lyricVersions.find(v => v.lang === activeTab)?.text || '';

  return (
    <div className="step-detail">
      <div className="back-link-container">
        <Link to="/steps" className="back-link">← {t('navSteps')}</Link>
      </div>
      
      <header className="step-header">
        <h1>{title}</h1>
      </header>

      <section className="step-content">

        <div className="step-philosophy">
          <h2>Philosophy</h2>
          <p style={{ whiteSpace: 'pre-wrap' }}>{activePhilosophy}</p>
        </div>
        <div className="step-lyrics">
          <h2>Lyrics</h2>
          {lyricVersions.length > 0 && lyricVersions[0].lang !== 'default' && (
            <div className="tabs-container">
              {lyricVersions.map((v) => (
                <button 
                  key={v.lang} 
                  className={`tab-btn ${activeTab === v.lang ? 'active' : ''}`}
                  onClick={() => setActiveTab(v.lang)}
                >
                  {v.lang.toUpperCase()}
                </button>
              ))}
            </div>
          )}
          <div className="lyrics-content">
            <p key={activeTab} style={{ whiteSpace: 'pre-wrap' }}>{currentLyricText}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StepDetail;