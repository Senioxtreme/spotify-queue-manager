# 🎵 Spotify Queue Manager
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)  ![JavaScript](https://img.shields.io/badge/JavaScript-323330?logo=javascript&logoColor=F7DF1E)  ![Spotify Web API](https://img.shields.io/badge/Spotify%20API-1DB954?logo=spotify&logoColor=white)  
> A modern web app to search, preview, and queue Spotify tracks seamlessly.  
> Designed for events, parties, and collaborative playlists.
---

## 🚀 Features

- **Track Search** — Search any song, artist, or album via Spotify API.  
- **Audio Preview** — Listen before adding.  
- **Instant Queueing** — Add tracks to a Spotify Premium account’s queue.  
- **Animated Feedback** — Smooth UI/UX with visual confirmations.  
- **History Panel** — See the last 5 tracks added.  
- **Limit Protection** — Max 3 additions every 10 minutes per device.  
- **One-click Reset** — Dedicated reset page.  
- **Dark UI** — Responsive and optimized for mobile.  

---

## 📦 Requirements

- Spotify Premium account *(needed for queueing)*.  
- Modern browser: Chrome, Firefox, Edge, Safari.  
- Internet connection.  
- Spotify **Access Token** with:
  - `user-modify-playback-state`
  - `user-read-playback-state`

---

## 🛠 Setup

### 1️⃣ Download Project
```bash
git clone https://github.com/yourusername/spotify-queue-manager.git
```
Or download the ZIP and extract it.

---

### 2️⃣ Get Your Spotify Access Token
1. Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in.  
2. Click on **Create an App** and fill the details.  
3. Once created, note down the **Client ID** and **Client Secret**.  
4. Follow the [Authorization Code Flow Guide](https://developer.spotify.com/documentation/web-api/tutorials/code-flow) to generate an access token.  
5. Ensure it has the scopes:
   ```
   user-modify-playback-state
   user-read-playback-state
   ```

---

### 3️⃣ Configure the Spotify Token
- Open `script.js`  
- Paste your token into the `accessToken` variable.  
- Save the file.

---

### 4️⃣ Launch the App
- Open `index.html` in your browser *(local)*.  
- Or upload to a web server/GitHub Pages for public use.  

---

## 🖥 Usage
1. Search for your track.  
2. Preview it with the play button.  
3. Add to queue instantly.  
4. Track your additions in the **History** panel.  

---

## 🧩 Troubleshooting

- **Token expired** → Get a new one and replace in `script.js`.  
- **No active devices** → Ensure Spotify is open and playing on at least one device.  

---

## 📜 License
Released under **GNU GPL v3** — Free to use and modify.
