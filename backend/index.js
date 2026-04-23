const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3000;
const API_KEY = process.env.OPENWEATHER_API_KEY;
const CACHE_TTL_SECONDS = 3600; // 1 hour

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = path.resolve(__dirname, 'weather.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    db.run(`CREATE TABLE IF NOT EXISTS weather (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      city TEXT UNIQUE,
      data TEXT,
      fetched_at INTEGER
    )`);
  }
});

// Helper functions
function getWeatherFromCache(city) {
  return new Promise((resolve, reject) => {
    db.get('SELECT * FROM weather WHERE city =?', [city], (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function saveWeatherToCache(city, data) {
  const fetchedAt = Math.floor(Date.now() / 1000);
  const dataStr = JSON.stringify(data);
  db.run(
    'INSERT OR REPLACE INTO weather (city, data, fetched_at) VALUES (?,?,?)',
    [city, dataStr, fetchedAt],
    (err) => {
      if (err) console.error('Cache save error:', err.message);
    }
  );
}

function isCacheFresh(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  return (now - timestamp) < CACHE_TTL_SECONDS;
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Weather cache server running' });
});

// Main weather endpoint - now uses city name directly
app.get('/api/weather/:city', async (req, res) => {
  const { city } = req.params;
  const cityQuery = `${city},NG`; // Add Nigeria country code for accuracy

  try {
    // 1. Check cache first
    const cached = await getWeatherFromCache(cityQuery);
    if (cached && isCacheFresh(cached.fetched_at)) {
      console.log(`Serving ${city} from cache`);
      return res.json({
        source: 'cache',
        data: JSON.parse(cached.data)
      });
    }

    // 2. Fetch from OpenWeather API
    console.log(`Fetching ${cityQuery} from external API`);
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityQuery)}&units=metric&appid=${API_KEY}`;

    const apiResponse = await fetch(apiUrl);
    if (!apiResponse.ok) {
      throw new Error(`OpenWeather API error: ${apiResponse.status}`);
    }

    const data = await apiResponse.json();

    // 3. Save to cache
    saveWeatherToCache(cityQuery, data);

    // 4. Return fresh data
    res.json({ source: 'api', data });

  } catch (err) {
    console.log(`API Error for ${city}:`, err.message);

    // Fallback: serve stale cache if available
    const cached = await getWeatherFromCache(cityQuery);
    if (cached) {
      console.log(`Serving stale cache for ${city}`);
      return res.json({
        source: 'stale_cache',
        data: JSON.parse(cached.data)
      });
    }

    // No cache, no API - return error
    res.status(500).json({
      error: 'Weather data unavailable',
      city: city
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Weather cache server running on http://localhost:${PORT}`);
});