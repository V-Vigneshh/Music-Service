const lastFmApiKey = "3451a4bdde2c02b1f223d084b31f69ba";
const lyricsApiUrl = "https://api.lyrics.ovh/v1"; // Base URL for Lyrics.ovh API

async function searchSong() {
  const songInput = document.getElementById('song-input').value;
  if (!songInput) {
    alert('Please enter a song name.');
    return;
  }

  const searchUrl = `https://ws.audioscrobbler.com/2.0/?method=track.search&track=${encodeURIComponent(songInput)}&api_key=${lastFmApiKey}&format=json`;

  try {
    const response = await fetch(searchUrl);
    const data = await response.json();

    if (data.results.trackmatches.track.length === 0) {
      document.getElementById('lyrics').innerHTML = `<p>No song found.</p>`;
      return;
    }

    const song = data.results.trackmatches.track[0];
    const songName = song.name;
    const artistName = song.artist;

    displaySongDetails(songName, artistName);
    fetchLyrics(songName, artistName);
  } catch (error) {
    console.error('Error fetching song details:', error);
    alert('Error fetching song details. Check the console for details.');
  }
}

async function fetchLyrics(songName, artistName) {
  const lyricsUrl = `${lyricsApiUrl}/${encodeURIComponent(artistName)}/${encodeURIComponent(songName)}`;

  try {
    const response = await fetch(lyricsUrl);
    const data = await response.json();

    if (data.lyrics) {
      document.getElementById('lyrics').innerHTML = `<h2>Lyrics for "${songName}"</h2><pre>${data.lyrics}</pre>`;
    } else {
      document.getElementById('lyrics').innerHTML = `<p>Lyrics not found.</p>`;
    }
  } catch (error) {
    console.error('Error fetching lyrics:', error);
    document.getElementById('lyrics').innerHTML = `<p>Error fetching lyrics. Try another song.</p>`;
  }
}

async function displaySongDetails(songName, artistName) {
  const infoUrl = `https://ws.audioscrobbler.com/2.0/?method=track.getInfo&track=${encodeURIComponent(songName)}&artist=${encodeURIComponent(artistName)}&api_key=${lastFmApiKey}&format=json`;

  try {
    const response = await fetch(infoUrl);
    const data = await response.json();

    if (data.track) {
      document.getElementById('trivia').innerHTML = `<h2>${songName} by ${artistName}</h2>
        <p>${data.track.wiki ? data.track.wiki.summary : 'No trivia available.'}</p>`;
      displayRecommendations(artistName);
    } else {
      document.getElementById('trivia').innerHTML = `<p>No details found for the song.</p>`;
    }
  } catch (error) {
    console.error('Error fetching song details:', error);
  }
}

async function displayRecommendations(artistName) {
  const recommendationsUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getTopTracks&artist=${encodeURIComponent(artistName)}&api_key=${lastFmApiKey}&format=json`;

  try {
    const response = await fetch(recommendationsUrl);
    const data = await response.json();

    if (data.toptracks) {
      const recommendations = data.toptracks.track.slice(0, 5).map(track => `<li>${track.name}</li>`).join('');
      document.getElementById('recommendations').innerHTML = `<h3>Top Songs by ${artistName}</h3><ul>${recommendations}</ul>`;
    } else {
      document.getElementById('recommendations').innerHTML = `<p>No recommendations found.</p>`;
    }
  } catch (error) {
    console.error('Error fetching recommendations:', error);
  }
}
