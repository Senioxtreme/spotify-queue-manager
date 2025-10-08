# 🎵 Spotify Event Queue Manager

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)]()
[![Spotify API](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)]()

The ultimate self-hosted solution for creating a collaborative Spotify jukebox for your events, parties, or get-togethers. Allow anyone to search and queue songs easily and safely, right from their phone.

---

## 🚀 Key Features

-   **Instant Track Search**: Find any song, artist, or album available on Spotify.
-   **Audio Previews**: Listen to a 30-second preview before adding a track.
-   **Shared Playback Queue**: Add tracks directly to an active Spotify Premium account's queue.
-   **Automatic Token Management**: Powered by a **Refresh Token**, the system generates new access tokens autonomously. **No expiration, no maintenance required!**
-   **Real-time 'Now Playing' Tab**: Shows everyone the currently playing song, complete with album art and details.
-   **Addition History**: Keep track of the last few tracks added through the app.
-   **Event Customization**: Set a custom event name that appears in the welcome message.
-   **Anti-Spam Protection**: Limits the number of additions per user to ensure a balanced playlist.
-   **Modern & Responsive UI**: A sleek, dark interface optimized for a flawless mobile experience.
-   **Serverless Deployment**: Designed to be hosted for free and securely on **Cloudflare Pages**.

## 🛠️ Setup and Deployment

Setup is straightforward and takes about 10 minutes. The system is designed to be "set it and forget it."

### Prerequisites

-   A **Spotify Premium** account (required to use the queue feature).
-   A **Cloudflare** account.
-   **Python 3.x** installed on your computer (only needed for the initial setup).

### Step 1: Configure the Spotify Developer App

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in.
2.  Click on **"Create app"**.
3.  Give it a name (e.g., "My Event Jukebox") and a description.
4.  Once created, copy your **Client ID** and **Client Secret**. Keep them handy.
5.  Click on **"Edit settings"**.
6.  In the **"Redirect URIs"** field, add **exactly** this line: `http://localhost:8888/callback`
7.  Save the changes.

### Step 2: Get the Refresh Token

We'll use the provided Python script to authenticate once and get a long-lasting `refresh_token`.

1.  Open the `get_token.py` file.
2.  Paste your **Client ID** and **Client Secret** into the `CLIENT_ID` and `CLIENT_SECRET` variables.
3.  Install the required dependency by opening a terminal and running: `pip install spotipy`
4.  Run the script: `python get_token.py`
5.  Your browser will open. Log in to Spotify and authorize the application.
6.  ✅ When done, a `spotify_refresh_token.txt` file will be created. Copy the long string inside it.

### Step 3: Deploy on Cloudflare Pages

1.  Fork this repository or clone it to your own GitHub account.
2.  Log in to your Cloudflare dashboard and go to **Workers & Pages**.
3.  Create a new **Pages** application and connect it to the GitHub repository you just created.
4.  Cloudflare will automatically detect the correct build settings. Proceed with the setup.
5.  Before the final deploy, go to **Settings -> Environment variables** and add the following variables (for both "Production" and "Preview"):
    -   `SPOTIFY_CLIENT_ID`: Your Client ID from Spotify.
    -   `SPOTIFY_CLIENT_SECRET`: Your Client Secret from Spotify.
    -   `SPOTIFY_REFRESH_TOKEN`: The refresh token you copied from the `.txt` file in Step 2.
    -   `EVENT_NAME`: The name of your event (e.g., `End of Year Party`).
6.  Save the variables and click **"Save and Deploy"**.

### Step 4: Done!

Your application is now live at the URL provided by Cloudflare, fully functional and autonomous!

## 🖥️ Usage

1.  Share the Cloudflare URL with your guests.
2.  Make sure your Spotify account is active and playing music on a device (e.g., a smart speaker).
3.  Guests can search for tracks, listen to previews, and add them to the queue.
4.  Everyone can see what's currently playing in the "Now Playing" tab.

## 🧩 Troubleshooting

-   **"No active devices"**: Ensure Spotify is open and playing music on at least one device linked to the Premium account.
-   **"500 Errors or App Fails to Load"**: Double-check that the environment variable names and values were entered correctly in the Cloudflare dashboard, with no extra spaces.

## 📜 License

Released under the **GNU GPL v3** license — feel free to use, modify, and distribute it.
