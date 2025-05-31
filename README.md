# My Weather App

This is a simple web application that shows you the current weather for any city you search for. Just type in a city name, and it will display the temperature, humidity, and a general description of the weather conditions, along with a fun emoji!

## How to Use

1.  **Open the App:** When you first open the application (`app.html` in a web browser), you'll see a title "My weather App" and an input field.
2.  **Enter a City Name:** Type the name of the city you want to check the weather for in the input box that says "地名入力" (which means "Enter city name").
3.  **Click Search:** Press the "検索" button (which means "Search").
4.  **View Weather Information:** The application will then display a card with:
    *   The city name.
    *   The current temperature in Celsius (℃).
    *   The current humidity percentage (%).
    *   A short description of the weather (e.g., "clear sky", "light rain").
    *   An emoji representing the weather (e.g., ☀️ for sunny, 🌧️ for rain).

**Example:**

If you type "Tokyo" into the input field and click "検索", the app will fetch and display the current weather conditions for Tokyo. You might see something like:

    Tokyo
    15℃
    湿度: 60%
    晴れ (Clear sky)
    ☀️

## Technologies Used

This application is built using a few core web technologies:

*   **HTML (`app.html`):** Provides the basic structure and content of the web page.
*   **CSS (`style.css`):** Styles the application to make it look good, controlling things like colors, fonts, and layout.
*   **JavaScript (`script.js`):** Makes the application interactive. It handles your input, fetches the weather data, and updates the page to show you the results.
*   **OpenWeatherMap API:** This is an external service that provides the actual weather data. Our JavaScript code sends a request to this service for the city you entered, and OpenWeatherMap sends back the weather information.

## Project Structure

The project consists of three main files:

*   `app.html`: This is the main file you open in your web browser. It defines the layout of the page, including the input field for the city name, the search button, and the area where the weather information is displayed.
*   `style.css`: This file contains all the styling rules. It dictates how the `app.html` elements look, including their colors, sizes, fonts, and positioning on the page.
*   `script.js`: This file contains the logic of the application. It waits for you to submit a city name, then communicates with the OpenWeatherMap API to get the weather data, and finally updates the `app.html` page to display that data. It also handles showing error messages if something goes wrong.

## Future Ideas

This app is a great starting point! Here are a few ideas for how it could be expanded in the future:

*   **More Detailed Forecast:** Show a 5-day forecast instead of just the current weather.
*   **Unit Conversion:** Allow users to switch between Celsius and Fahrenheit.
*   **Geolocation:** Automatically detect the user's location and show their local weather.
*   **Save Favorite Cities:** Let users save a list of cities they frequently check.
*   **Improved Error Handling:** Provide more specific error messages (e.g., "City not found" vs. "API key issue").
*   **Better Visuals:** Add more graphics, like animated weather icons or background images that change with the weather.
