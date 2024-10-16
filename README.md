# Spotify Queue Manager
A web application that allows users to search for songs and add them to the queue on a predefined Spotify account. Designed for events and parties, it allows guests to participate in the music selection without having to authenticate with their Spotify account.

# User Guide

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

2. **Configure the Spotify Token**
   - Open the `script.js` file in a text editor.
   - Paste your Spotify token in the first line, where indicated.
   - Save the changes.

3. **Upload the Project to Your Web Server**
   - Upload the modified files to your web server.
   - Alternatively, you can host the project using **GitHub Pages** by pushing the changes to a GitHub repository and enabling GitHub Pages in the repository settings.

4. **Open the Web Application**
   - Once the files are hosted, visit the URL where the project is accessible.

5. **Search for Songs**
   - Use the search bar on the main page to find the songs you want to add to the queue.
   - Click on a song to add it to the queue.

6. **Manage the Queue**
   - Songs will be added to the Spotify account's queue.
   - There is active moderation, so inappropriate songs may be filtered.

## Troubleshooting

- **Issue: Error adding the track to the queue**
  - Verify that the Spotify token is correctly set in `script.js`.
  - Ensure that the track is available on Spotify and the account is Premium.
  
- **Issue: The token seems to be expired**
  - Obtain a new Spotify token and update the first line of `script.js` with the new value.

## Frequently Asked Questions (FAQ)

1. **Can users add songs without logging in?**
   - Yes, users do not need to log in to add songs. They only need access to the web application.

2. **Can the project be hosted on GitHub Pages?**
   - Yes, the project can be hosted on **GitHub Pages**. Simply push the modified files to a GitHub repository and enable GitHub Pages.

3. **How do I reset the add limit?**
   - The reset functionality is available through a separate page that can be accessed as needed (/reset.html).

4. **How can I contact support?**
   - For technical issues, please reach out via [opensource-help@senioxtreme.it](mailto:opensource-help@senioxtreme.it).

## License

The project is licensed under the **GNU General Public License (GPL)**. See the LICENSE file for more details.
