let accessToken = null;

const ADD_LIMIT = 3;
const TIME_LIMIT_MINUTES = 10;

const API_BASE = 'https://api.spotify.com/v1';

const headersAuth = () => ({
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

function canAddTrack() {
  const now = Date.now();
  const hist = JSON.parse(localStorage.getItem('addHistory')) || [];
  const recent = hist.filter(ts => now - ts < TIME_LIMIT_MINUTES * 60 * 1000);
  if (recent.length >= ADD_LIMIT) {
    const minutesLeft = Math.ceil((TIME_LIMIT_MINUTES * 60 * 1000 - (now - recent[0])) / (60 * 1000));
    const message = `Limite raggiunto! Potrai aggiungere un'altra canzone tra ${minutesLeft} minuti.`;
    window.UIBridge?.showToast?.(message);
    return false;
  }
  return true;
}

function saveTrackAddition() {
  const now = Date.now();
  const hist = JSON.parse(localStorage.getItem('addHistory')) || [];
  hist.push(now);
  localStorage.setItem('addHistory', JSON.stringify(hist));
}

window.canAddTrack = canAddTrack;
window.saveTrackAddition = saveTrackAddition;

async function addToQueue(trackUri) {
  if (!accessToken) { window.UIBridge?.showToast?.('Errore: Token non disponibile.'); return false; }
  if (!trackUri)    { window.UIBridge?.showToast?.('Errore: Traccia non valida.'); return false; }

  try {
    const res = await fetch(`${API_BASE}/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
      method: 'POST',
      headers: headersAuth()
    });

    if (res.ok) {
      window.UIBridge?.showToast?.('Aggiunto! Il tuo brano verrà suonato a breve!');
      return true;
    }

    if (res.status === 404) { window.UIBridge?.showToast?.('Nessun dispositivo attivo. Assicurati che Spotify stia suonando.'); return false; }
    if (res.status === 401) { window.UIBridge?.showToast?.('Token scaduto o non valido.'); return false; }
    if (res.status === 429) { window.UIBridge?.showToast?.('Limite richieste Spotify raggiunto. Riprova tra poco.'); return false; }
    if (res.status === 403) { window.UIBridge?.showToast?.('Permesso negato.'); return false; }

    console.error('Errore Coda:', res.status, await res.text().catch(()=>''));
    window.UIBridge?.showToast?.('Impossibile aggiungere alla coda. Riprova.');
    return false;

  } catch (err) {
    console.error('Errore di rete nell\'aggiunta:', err);
    window.UIBridge?.showToast?.('Errore di rete. Riprova.');
    return false;
  }
}

window.addToQueue = addToQueue;

let searchAbort;

async function doSearch(query, limit = 10) {
  if (!accessToken) { window.UIBridge?.showToast?.('Problema di configurazione. Token non trovato.'); return; }
  const q = (query || '').trim();
  if (!q) { window.UIBridge?.showToast?.('Inserisci un termine di ricerca valido.'); return; }

  try {
    if (searchAbort) searchAbort.abort();
    searchAbort = new AbortController();
    const { signal } = searchAbort;

    window.UIBridge?.showLoading?.();

    const tries = [
      `${API_BASE}/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}&market=from_token`,
      `${API_BASE}/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}`,
      `${API_BASE}/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}&market=IT`
    ];

    let data = null;
    let lastErr = null;

    for (const url of tries) {
      try {
        const res = await fetch(url, { headers: headersAuth(), signal });
        if (res.ok) {
          data = await res.json();
          break;
        } else {
          lastErr = { status: res.status, body: await res.text().catch(()=>'') };
          if (res.status === 401) break;
        }
      } catch (loopErr) {
        lastErr = { status: 'NETWORK_ERROR', body: loopErr.message };
      }
    }
    
    if (!data) {
        console.error('Errore Ricerca Finale:', lastErr);
        window.UIBridge?.showError?.('Errore nella ricerca. Assicurati che il token sia valido.');
        return;
    }

    const items = (data?.tracks?.items || []).map(t => ({
      image:   t?.album?.images?.[0]?.url || '',
      title:   t?.name || 'Titolo Sconosciuto',
      subtitle:(t?.artists || []).map(a => a?.name).filter(Boolean).join(', ') || 'Artista Sconosciuto',
      uri:     t?.uri || '',
      preview: t?.preview_url || null,
    }));

    window.UIBridge?.renderItems?.(items, q);

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Errore Ricerca:', err);
      window.UIBridge?.showError?.('Ricerca fallita. Riprova.');
    }
  }
}

document.addEventListener('ui:search', e => {
  const q = e?.detail?.query || '';
  const limit = e?.detail?.limit || 10;
  doSearch(q, limit);
});

async function fetchAccessToken() {
  try {
    const response = await fetch('/api/token');
    if (!response.ok) throw new Error('Impossibile recuperare il token dal server.');
    
    const data = await response.json();
    if (data.accessToken) {
      accessToken = data.accessToken;
      console.log('Token caricato.');
      document.getElementById('song-query').disabled = false;
      document.getElementById('search-btn').disabled = false;
    } else {
      throw new Error('Token ricevuto non valido.');
    }
  } catch (err) {
    console.error(err);
    window.UIBridge?.showError?.('ERRORE CRITICO: Impossibile caricare la configurazione. L\'app non funzionerà.');
    document.getElementById('song-query').placeholder = 'Errore di configurazione';
  }
}

window.addEventListener('load', () => {
  fetchAccessToken();
});
