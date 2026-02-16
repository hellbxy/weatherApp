# Weather Wardrobe

Weather Wardrobe is a small browser app that shows today’s weather and a 5‑day forecast, then suggests what to wear and whether it’s a good day to do laundry.

The UI is in Japanese:

- Search input: `地名入力`
- Buttons: `検索` (Search), `現在地` (Current location)

## Features

- Current weather (city name, temperature, humidity, description + emoji)
- 5‑day forecast (date, emoji, min/max temperature, short label)
- Clothing recommendation (simple, rule-based tips)
- Laundry “drying” check based on temperature/humidity/weather
- Current-location mode using browser geolocation

## Getting Started

### 1) Set your OpenWeatherMap API key

This app uses OpenWeatherMap for **current** weather.

1. Create an API key at OpenWeatherMap.
2. Open `script.js` and replace the `apiKey` value near the top:

```js
const apiKey = "YOUR_OPENWEATHERMAP_API_KEY";
```

Security note: don’t commit real API keys to a public repo.

### 2) Run it locally

You can open `app.html` directly, but some browsers restrict geolocation and/or network requests on `file://` pages.

Recommended: run a local server and open the app via `http://localhost`.

From this folder:

```bash
python3 -m http.server 5500
```

Then open:

`http://localhost:5500/app.html`

## How to Use

1. Enter a city name and click `検索`, or click `現在地` to use your location.
2. The app displays:
   - Weather card: current weather + 5‑day forecast
   - Clothing card: outfit suggestions
   - Laundry card: quick “drying” tip

## Data Sources

- OpenWeatherMap (Current Weather API)
  - Used for current conditions by city name and by coordinates
  - Note: OpenWeatherMap returns temperature in Kelvin; the app converts to Celsius

- Open‑Meteo (Forecast API)
  - Used for the 5‑day daily forecast (min/max temps + weather codes)

## Project Files

- `app.html` — page structure (form + cards)
- `style.css` — styling
- `script.js` — fetching weather/forecast data + rendering + clothing/laundry logic

## Optional: AI clothing text (disabled by default)

There is an `AI_CLOTHING_ENDPOINT` constant in `script.js`. It is currently `null`, so the app uses the built-in fallback sentence generator.
