## Introduction

This guide will walk you through the steps to use the Spotify Queue Manager. This web application allows users to search for songs and add them to a predefined Spotify account's queue, making it easy to manage the music at events or gatherings.

## Prerequisites

Before you start, ensure you have the following:
- A web browser (Chrome, Firefox, Safari, or Edge).
- An active internet connection.
- A **Spotify Premium** account (required for adding tracks to the queue).

## Getting Started

1. **Download the Project Files**
   - Download the files from the repository (e.g., from GitHub).

2. **Get a Spotify Access Token**

   To use this project, you need a Spotify access token. Follow these steps to create a Spotify app and obtain the token:

   - Go to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard/applications) and log in with your Spotify account.
   - Click on **Create an App** and fill in the required details (App Name, Description, etc.).
   - Once the app is created, you will see the **Client ID** and **Client Secret** for your app.
   - Navigate to the [Spotify Web API Authorization Guide](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#request-an-access-token) and follow the instructions to request an access token using the **Client ID** and **Client Secret**.
   - Make sure to use the **Authorization Code Flow** to get an access token that allows adding tracks to a Spotify Premium account's queue.

3. **Configure the Spotify Token**
   - Open the `script.js` file in a text editor.
   - Paste your Spotify access token in the first line, where indicated.
   - Save the changes.

4. **Upload the Project to Your Web Server**
   - Upload the modified files to your web server.
   - Alternatively, you can host the project using **GitHub Pages** by pushing the changes to a GitHub repository and enabling GitHub Pages in the repository settings.

5. **Open the Web Application**
   - Once the files are hosted, visit the URL where the project is accessible.

6. **Search for Songs**
   - Use the search bar on the main page to find the songs you want to add to the queue.
   - Click on a song to add it to the queue.

## Troubleshooting

- **Issue: Error adding the track to the queue**
  - Verify that the Spotify token is correctly set in `script.js`.
  - Ensure that the track is available on Spotify and the account is Premium.
  
- **Issue: The token seems to be expired**
  - Obtain a new Spotify token by following the steps above and update the first line of `script.js` with the new value.

## Frequently Asked Questions (FAQ)

1. **Can users add songs without logging in?**
   - Yes, users do not need to log in to add songs. They only need access to the web application.

2. **Can the project be hosted on GitHub Pages?**
   - Yes, the project can be hosted on **GitHub Pages**. Simply push the modified files to a GitHub repository and enable GitHub Pages.

3. **How do I reset the add limit?**
   - The reset functionality is available through a separate page that can be accessed as needed.

4. **How can I contact support?**
   - For technical issues, please reach out via [opensource-help@senioxtreme.it](mailto:opensource-help@senioxtreme.it). Please note that response times may not be immediate.

## License

The project is licensed under the **GNU General Public License (GPL)**. See the LICENSE file for more details.
