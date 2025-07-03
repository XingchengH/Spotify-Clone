
Spotify API: http://localhost:3000/spotify/callback


### Features
- **Songs** / **Artists**
    - Search songs by artist name or song title
    - Filter songs by language and genre
    - Like a song (Add to User's liked songs)
    - Follow an artist (add to User's followed artists)


****
### Routes
**Backend Routes**
- GET
    - /user/songs - All songs liked by a specific user
    - /songs?search=...&language=...&genre=... ; Search for songs
- PUT
    - /songs - User likes a song
    - /artists - User follows an artist
    - /user/info - User updates profile info