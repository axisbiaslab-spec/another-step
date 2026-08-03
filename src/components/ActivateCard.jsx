import React, { useEffect, useRef, useState } from 'react';

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

function ActivateCard({ id, code, lang, onActivated }) {
  const [status, setStatus] = useState('idle'); // idle | pending | done | error
  const t = COPY[lang] || COPY.en;
  const storageKey = code ? `card-activated:${code}` : null;
  // Some mobile browsers don't reliably synthesize `click` after a touch on
  // a touch-action:none ancestor (the card wrapper) — fire on pointerup
  // directly instead, matching the card's own tap-to-flip handling. A ref
  // (not state) guards against also double-firing if click *does* land too,
  // since state updates aren't visible synchronously to a same-tick handler.
  const firingRef = useRef(false);

  useEffect(() => {
    if (storageKey && localStorage.getItem(storageKey) === '1') {
      setStatus('done');
      onActivated?.({ replay: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  if (!code) return null;

  const handleActivate = async () => {
    if (firingRef.current || status !== 'idle') return;
    firingRef.current = true;
    setStatus('pending');
    try {
      const result = await activateCardStub({ id, code });
      if (result.activated) {
        localStorage.setItem(storageKey, '1');
        setStatus('done');
        onActivated?.({ replay: false });
      } else {
        setStatus('error');
        firingRef.current = false;
      }
    } catch {
      setStatus('error');
      firingRef.current = false;
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
          onPointerUp={handleActivate}
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
