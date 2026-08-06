'use client';

import { useEffect, useState } from 'react';

// Voile flouté + confirmation "professionnel de santé".
// Le choix est mémorisé localement pour ne pas le redemander à chaque visite.
export default function ProGate() {
  const [state, setState] = useState('gate'); // gate | refused | ok

  useEffect(() => {
    try {
      if (localStorage.getItem('sm_pro_confirmed') === 'yes') setState('ok');
    } catch (_) {}
  }, []);

  function accept() {
    try { localStorage.setItem('sm_pro_confirmed', 'yes'); } catch (_) {}
    setState('ok');
  }

  if (state === 'ok') return null;

  return (
    <div className="progate" role="dialog" aria-modal="true">
      <div className="progate-card">
        {state === 'gate' ? (
          <>
            <div className="progate-badge">
              <svg viewBox="21 20 58 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M60 23 L38 23 A13 13 0 0 0 25 36 L25 52 A15 15 0 0 0 50.6 62.6 L63 50" stroke="currentColor" strokeWidth="5" strokeLinecap="round" transform="rotate(180 50 50)" />
                <path d="M46 54 L54 46" stroke="#2F8F7D" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </div>
            <h2>Êtes-vous professionnel de santé ?</h2>
            <p>
              {"ScrubMarket est une place de marché réservée aux professionnels de santé et aux établissements de soins. En continuant, vous confirmez en être un."}
            </p>
            <div className="progate-actions">
              <button className="btn btn-primary" onClick={accept}>Oui, je le suis</button>
              <button className="btn btn-ghost" onClick={() => setState('refused')}>Non</button>
            </div>
          </>
        ) : (
          <>
            <h2>Accès réservé</h2>
            <p>
              {"ScrubMarket est réservé aux professionnels de santé et n'est pas ouvert au grand public."}
            </p>
            <div className="progate-actions">
              <button className="btn btn-ghost" onClick={() => setState('gate')}>Revenir</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
