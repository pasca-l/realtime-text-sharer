# Realtime Text Sharer
Shares content of textarea in realtime within virtual rooms.

## Website URL
https://realtime-text-sharer.vercel.app/

## Screenshots
![](https://github.com/user-attachments/assets/368eb122-d12e-4e58-b3e8-e642a4a71657)

## Requirements
- Docker 25.0.3
- Docker Compose v2.24.6

## Dependencies
- Next.js
- Firebase

## Run on development mode
### Using local WebSocket server
1. Set environmental variable as below in `.env`, below is the default value.
```
NEXT_PUBLIC_USE_WEBSOCKET="true"
```

2. Set up docker containers.
```bash
$ docker compose up
```

3. Open website on [`http://localhost:3000`](http://localhost:3000).

### Using Firebase Realtime Database
1. Configure Firebase settings.

- [`firebaseConfig.ts`](https://github.com/pasca-l/realtime-text-sharer/blob/main/app/src/config/firebaseConfig.ts) should have configurations to accessible Firebase project.
- Security rules of the Firebase Realtime Database should enable both read and write permissions.
  ```json
  {
    "rules": {
      ".read": true,
      ".write": true
    }
  }
  ```

2. Set environmental variable as below in `.env`.
```
NEXT_PUBLIC_USE_WEBSOCKET="false"
```

3. Set up docker containers.
```bash
$ docker compose up
```

4. Open website on [`http://localhost:3000`](http://localhost:3000).
