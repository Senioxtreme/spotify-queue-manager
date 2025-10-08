import spotipy
import webbrowser
import http.server
import socketserver
import threading

CLIENT_ID = ""
CLIENT_SECRET = ""

REDIRECT_URI = "http://localhost:8888/callback"

SCOPE = "user-modify-playback-state"

OUTPUT_FILENAME = "spotify_refresh_token.txt"

refresh_token_obtained = False

class SpotifyAuthHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global refresh_token_obtained
        
        if self.path.startswith("/callback?code="):
            self.send_response(200)
            self.send_header("Content-type", "text/html")
            self.end_headers()
            
            auth_code = self.path.split("=")[1].split("&")[0]
            
            try:
                token_info = sp_oauth.get_access_token(auth_code, check_cache=False)
                
                refresh_token = token_info.get("refresh_token")

                if not refresh_token:
                    print("❌ ERRORE: Spotify non ha restituito un refresh token.")
                    print("Questo può accadere se hai già autorizzato l'app. Prova a revocare l'accesso da https://www.spotify.com/account/apps/ e riprova.")
                    self.wfile.write(b"<h1>Errore: Refresh Token non trovato.</h1>")
                else:
                    with open(OUTPUT_FILENAME, "w") as f:
                        f.write(refresh_token)
                    
                    refresh_token_obtained = True
                    print(f"\n✅ Successo! REFRESH token salvato in '{OUTPUT_FILENAME}'.")
                    print("Questo token è il tuo 'passpartout' a lunga durata. Tienilo al sicuro!")
                    
                    self.wfile.write(b"<h1>Autenticazione completata con successo!</h1>")
                    self.wfile.write(b"<p>Hai ottenuto il Refresh Token. Puoi chiudere questa finestra.</p>")
                
            except Exception as e:
                print(f"❌ Errore durante il recupero del token: {e}")
                self.wfile.write(b"<h1>Errore durante l'autenticazione.</h1>")
            
            threading.Thread(target=self.server.shutdown).start()

if __name__ == "__main__":
    if CLIENT_ID == "IL_TUO_CLIENT_ID" or CLIENT_SECRET == "IL_TUO_CLIENT_SECRET":
        print("🚨 ERRORE: Per favore, inserisci il tuo CLIENT_ID e CLIENT_SECRET nello script.")
    else:
        sp_oauth = spotipy.oauth2.SpotifyOAuth(
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET,
            redirect_uri=REDIRECT_URI,
            scope=SCOPE
        )

        auth_url = sp_oauth.get_authorize_url()

        print("--- Spotify Refresh Token Fetcher ---")
        print("\nSto aprendo il browser per l'autorizzazione...")
        webbrowser.open(auth_url)

        PORT = 8888
        with socketserver.TCPServer(("", PORT), SpotifyAuthHandler) as httpd:
            print(f"In attesa di autorizzazione su http://localhost:{PORT}/callback ...")
            httpd.serve_forever()
        
        if not refresh_token_obtained:
            print("\nOperazione annullata o non riuscita.")
