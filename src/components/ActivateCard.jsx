import React, { useEffect, useState } from 'react';

const COPY = {
  en: {
    activate: 'Activate this card',
    pending: 'Activating…',
    done: 'Card activated',
    error: "Couldn't activate — try again",
  },
  ru: {
    activate: 'Активировать карту',
    pending: 'Активация…',
    done: 'Карта активирована',
    error: 'Не получилось активировать — попробуйте ещё раз',
  },
  sr: {
    activate: 'Aktiviraj karticu',
    pending: 'Aktiviranje…',
    done: 'Kartica je aktivirana',
    error: 'Nije uspelo — pokušajte ponovo',
  },
};

// TODO: replace with the real activation endpoint once the backend exists.
// Expected contract: POST { id, code } -> 200 { activated: true } on success,
// 409/403 if the code is invalid or already claimed by someone else.
async function activateCardStub({ id, code }) {
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log('[stub] would POST /api/cards/activate with', { id, code });
  return { activated: true };
}

function ActivateCard({ id, code, lang }) {
  const [status, setStatus] = useState('idle'); // idle | pending | done | error
  const t = COPY[lang] || COPY.en;
  const storageKey = code ? `card-activated:${code}` : null;

  useEffect(() => {
    if (storageKey && localStorage.getItem(storageKey) === '1') {
      setStatus('done');
    }
  }, [storageKey]);

  if (!code) return null;

  const handleActivate = async () => {
    setStatus('pending');
    try {
      const result = await activateCardStub({ id, code });
      if (result.activated) {
        localStorage.setItem(storageKey, '1');
        setStatus('done');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="activate-card">
      {status === 'done' ? (
        <p className="activate-card-done">✓ {t.done}</p>
      ) : (
        <button
          className="activate-card-btn"
          onClick={handleActivate}
          disabled={status === 'pending'}
        >
          {status === 'pending' ? t.pending : t.activate}
        </button>
      )}
      {status === 'error' && <p className="activate-card-error">{t.error}</p>}
    </div>
  );
}

export default ActivateCard;
