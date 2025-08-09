let accessToken = 'spotify_token-here';

const ADD_LIMIT = 3;
const TIME_LIMIT_MINUTES = 10;

const searchInput = document.getElementById('song-query');
const searchBtn = document.getElementById('search-btn');
const resultsList = document.getElementById('results');

function canAddTrack() {
    const currentTime = Date.now();
    const addHistory = JSON.parse(localStorage.getItem('addHistory')) || [];

    const recentAdds = addHistory.filter(timestamp => currentTime - timestamp < TIME_LIMIT_MINUTES * 60 * 1000);

    if (recentAdds.length >= ADD_LIMIT) {
        const minutesLeft = Math.ceil((TIME_LIMIT_MINUTES * 60 * 1000 - (currentTime - recentAdds[0])) / (60 * 1000));
        alert(`Hey, slow down! You can add another song in ${minutesLeft} minutes.`);
        return false;
    }

    return true;
}

function saveTrackAddition() {
    const currentTime = Date.now();
    const addHistory = JSON.parse(localStorage.getItem('addHistory')) || [];

    addHistory.push(currentTime);

    localStorage.setItem('addHistory', JSON.stringify(addHistory));
}

window.onload = () => {
    if (accessToken) {
        console.log('Ready! Token:', accessToken);
    } else {
        alert('Error: No token entered in code. Manually enter token in accessToken variable.');
    }
};

async function searchTrack(query) {
    if (!accessToken) {
        alert("There was a problem. Please make sure you entered the token correctly.");
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Search results:', data.tracks.items);
            displaySearchResults(data.tracks.items);
        } else {
            alert('Song search error. Make sure the token is valid.');
            console.error('Search response error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Song search error:', error);
    }
}

function displaySearchResults(tracks) {
    resultsList.innerHTML = ''; 
    tracks.forEach(track => {
        const li = document.createElement('li');
        li.className = 'result-item';

        const img = document.createElement('img');
        img.src = track.album.images[0].url;

        const title = document.createElement('h2');
        title.textContent = track.name;

        const artist = document.createElement('p');
        artist.textContent = track.artists[0].name;

        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(artist);

        li.onclick = () => addToQueue(track.uri);

        resultsList.appendChild(li);
    });
}

async function addToQueue(trackUri) {
    if (!accessToken) {
        alert("Error: No token available to add the song.");
        return;
    }

    if (!canAddTrack()) return;

    try {
        const response = await fetch(`https://api.spotify.com/v1/me/player/queue?uri=${trackUri}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (response.ok) {
            alert('Hands up! Your song will be played soon!');
            searchInput.value = '';
            resultsList.innerHTML = '';
            saveTrackAddition();
        } else {
            alert('No active devices, please make sure at least one device is playing content.');
            console.error('Error in add to queue response:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error adding the track to the queue:', error);
    }
}

if (searchBtn) {
    searchBtn.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) {
            searchTrack(query);
        } else {
            alert('Please enter a valid search term.');
        }
    });
}

if (searchInput) {
    searchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') { 
            const query = searchInput.value.trim();
            if (query) {
                searchTrack(query);
            } else {
                alert('Please enter a valid search term.');
            }
        }
    });
}
