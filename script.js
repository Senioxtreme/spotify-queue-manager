let accessToken = 'spotify_token-here';

const ADD_LIMIT = 3;
const TIME_LIMIT_MINUTES = 10;

const API_BASE = 'https://api.spotify.com/v1';

const headersAuth = () => ({
  'Authorization': `Bearer ${accessToken}`,
  'Content-Type': 'application/json'
});

const toast = (msg) => alert(msg);

function canAddTrack() {
  const now = Date.now();
  const hist = JSON.parse(localStorage.getItem('addHistory')) || [];
  const recent = hist.filter(ts => now - ts < TIME_LIMIT_MINUTES * 60 * 1000);
  if (recent.length >= ADD_LIMIT) {
    const minutesLeft = Math.ceil((TIME_LIMIT_MINUTES * 60 * 1000 - (now - recent[0])) / (60 * 1000));
    alert(`Hey, slow down! You can add another song in ${minutesLeft} minutes.`);
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
  if (!accessToken) { toast('Error: No token available to add the song.'); return false; }
  if (!trackUri)    { toast('Error: invalid track.'); return false; }

  try {
    const res = await fetch(`${API_BASE}/me/player/queue?uri=${encodeURIComponent(trackUri)}`, {
      method: 'POST',
      headers: headersAuth()
    });

    if (res.ok) {
      toast('Hands up! Your song will be played soon!');
      return true;
    }

    if (res.status === 404) { toast('No active devices, please make sure at least one device is playing content.'); return false; }
    if (res.status === 401) { toast('Token expired or invalid. Please refresh your token.'); return false; }
    if (res.status === 429) { toast('Spotify rate limit hit. Try again in a bit.'); return false; }
    if (res.status === 403) { toast('Permission denied. Check scopes.'); return false; }

    const txt = await res.text().catch(()=> '');
    console.error('Queue error:', res.status, res.statusText, txt);
    toast('Could not add to queue. Try again.');
    return false;

  } catch (err) {
    console.error('Error adding the track to the queue:', err);
    toast('Network error adding the track. Try again.');
    return false;
  }
}

window.addToQueue = addToQueue;

let searchAbort;

async function doSearch(query, limit = 10) {
  if (!accessToken) { toast('There was a problem. Please make sure you entered the token correctly.'); return; }
  const q = (query || '').trim();
  if (!q) { toast('Please enter a valid search term.'); return; }

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
      const res = await fetch(url, { headers: headersAuth(), signal });
      if (res.ok) {
        data = await res.json();
        break;
      } else {
        const bodyText = await res.text().catch(()=> '');
        lastErr = { status: res.status, statusText: res.statusText, bodyText };
        if (res.status === 401) break;
      }
    }

    if (!data) {
      if (lastErr) {
        console.error('Search failed:', lastErr.status, lastErr.statusText, lastErr.bodyText);
      }
      toast('Song search error. Make sure the token is valid.');
      window.UIBridge?.showError?.('Song search error. Try again.');
      return;
    }

    const items = (data?.tracks?.items || []).map(t => ({
      image:   t?.album?.images?.[0]?.url || '',
      title:   t?.name || 'Unknown title',
      subtitle:(t?.artists || []).map(a => a?.name).filter(Boolean).join(', ') || 'Unknown artist',
      uri:     t?.uri || '',
      preview: t?.preview_url || null,
      onclick: () => addToQueue(t?.uri)
    }));

    window.UIBridge?.renderItems?.(items);

  } catch (err) {
    if (err.name !== 'AbortError') {
      console.error('Song search error:', err);
      toast('Search failed. Please try again.');
      window.UIBridge?.showError?.('Search failed. Please try again.');
    }
  } finally {
  }
}

document.addEventListener('ui:search', e => {
  const q = e?.detail?.query || '';
  const limit = e?.detail?.limit || 10;
  doSearch(q, limit);
});

window.addEventListener('load', () => {
  if (!accessToken) {
    alert('Error: No token entered in code. Manually enter token in accessToken variable.');
  } else {
    console.log('Ready. Token present.');
  }
});
