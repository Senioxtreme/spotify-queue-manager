# 🎵 Spotify Event Queue Manager

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)]()
[![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=Cloudflare&logoColor=white)]()
[![Spotify API](https://img.shields.io/badge/Spotify-1ED760?style=for-the-badge&logo=spotify&logoColor=white)]()

The ultimate self-hosted solution for creating a collaborative Spotify jukebox for your events. This app allows guests to search for songs, preview them, and add them to a live Spotify queue, all from a sleek, mobile-friendly web interface.

Built with a serverless architecture on Cloudflare Pages, it's secure, infinitely scalable, and completely free to host.

---

## ✨ Key Features

-   **Automatic Token Management**: "Set it and forget it." Uses a **Refresh Token** to autonomously generate new access tokens, eliminating the need for any maintenance during an event.
-   **Live Queue & Now Playing**: Features a real-time sidebar with tabs showing the **currently playing song** and the **actual upcoming track queue** from Spotify, keeping everyone engaged.
-   **Duplicate Prevention**: Intelligently prevents users from adding a song that is already in the queue or currently playing.
-   **Consent-Driven Analytics**: Integrates with **Google Analytics** and asks for user consent via a two-step welcome modal, ensuring privacy compliance.
-   **Robust Search & Previews**: Instantly search Spotify's entire library and listen to 30-second audio previews before queueing.
-   **Full Admin Control**:
    -   **Maintenance Mode**: Easily take the site offline with a single environment variable, redirecting all traffic to a maintenance page.
    -   **Protected Rate-Limit Reset**: A dedicated `/reset.html` page, secured by **hCaptcha**, allows users to reset their local anti-spam limits.
-   **Event Customization**: Centrally manage your event's name and branding through environment variables.
-   **Modern UI/UX**: A polished dark-mode interface with smooth animations, toast notifications, and confetti effects for a premium user experience.

## 🛠️ Setup and Deployment

Setup is straightforward and takes about 15 minutes. Once deployed, the application is fully autonomous.

### Prerequisites

-   A **Spotify Premium** account (required for queueing).
-   A **Cloudflare** account.
-   A **GitHub** account.
-   An **hCaptcha** account (free, for the reset page).
-   **Python 3.x** installed locally (for initial setup only).

### Step 1: Configure the Spotify Developer App

1.  Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/) and log in.
2.  Click **"Create app"** and give it a name and description.
3.  Copy your **Client ID** and **Client Secret**.
4.  Click **"Edit settings"** and add the following **Redirect URI**: `http://localhost:8888/callback`
5.  Save the changes.

### Step 2: Get the Refresh Token

This one-time script uses Python to get a long-lived `refresh_token`.

1.  Open `get_token.py` and paste in your **Client ID** and **Client Secret**.
2.  In your terminal, install the required library: `pip install spotipy`
3.  Run the script: `python get_token.py`
4.  Your browser will open. Log in and authorize the app.
5.  ✅ A `spotify_refresh_token.txt` file will be created. Copy the long string inside it.

### Step 3: Deploy on Cloudflare Pages

1.  Fork this repository to your own GitHub account.
2.  On the Cloudflare dashboard, go to **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3.  Select your forked repository. Cloudflare will auto-detect the correct build settings.
4.  Go to **Settings -> Environment variables** and add the following variables for both **Production** and **Preview**:

    | Variable Name            | Value                                                              | Required |
    | ------------------------ | ------------------------------------------------------------------ | -------- |
    | `SPOTIFY_CLIENT_ID`      | Your Client ID from Spotify.                                       | ✅ Yes     |
    | `SPOTIFY_CLIENT_SECRET`  | Your Client Secret from Spotify.                                   | ✅ Yes     |
    | `SPOTIFY_REFRESH_TOKEN`  | The refresh token you generated in Step 2.                         | ✅ Yes     |
    | `EVENT_NAME`             | The name of your event (e.g., `Oktoberfuego`).                     | optional |
    | `GOOGLE_ANALYTICS_ID`    | Your Google Analytics Measurement ID (e.g., `G-XXXXXXXXXX`).       | optional |
    | `MAINTENANCE`            | Set to `TRUE` to enable maintenance mode.                          | optional |

5.  **Save** the variables and click **"Save and Deploy"**.

### Step 4: Final Configuration

1.  **hCaptcha**: Open `reset.html`, find the `h-captcha` div, and replace `"YOUR_HCAPTCHA_SITE_KEY_HERE"` with your actual hCaptcha Sitekey. Commit and push this change to your repository.
2.  **Done!** Your application is live at the URL provided by Cloudflare.

## 🖥️ Usage

-   **Share the Link**: Give the Cloudflare URL to your guests.
-   **Start the Music**: Make sure your Spotify account is active and playing music on a device.
-   **Maintenance**: To take the site offline, set the `MAINTENANCE` variable to `TRUE` in Cloudflare and redeploy.

## 🧩 Troubleshooting

-   **"No active devices"**: Ensure Spotify is open and playing music on at least one device linked to the Premium account.
-   **"500 Errors or App Fails to Load"**: Double-check that all **Required** environment variables are set correctly in the Cloudflare dashboard, with no extra spaces.
-   **"Error 1019" or "TOO_MANY_REDIRECTS"**: Ensure your `functions/_middleware.js` file is up-to-date with the latest version from this repository.

## 📜 License

Released under the **GNU GPL v3** license — feel free to use, modify, and distribute it.
