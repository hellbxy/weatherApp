const weatherForm = document.querySelector(".weatherForm");
const cityName = document.querySelector(".cityName");
const weatherCard = document.querySelector(".weatherCard");
const clothCard = document.querySelector(".clothCard");
const laundryCard = document.querySelector(".laundryCard");
const apiKey = "1a4fa94c8e83e28d12952c4ca8d5f0b4";
const AI_CLOTHING_ENDPOINT = null;

weatherForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityName.value.trim();
  if (!city) {
    displayError("地名を入力してください。");
    return;
  }

  try {
    const weatherData = await getWeather(city);
    const forecastData = await get5DayForecast(
      weatherData.coord.lat,
      weatherData.coord.lon,
    );
    displayWeatherInfo(weatherData, forecastData);
  } catch (error) {
    console.error(error);
    displayError("エラーが発生しました。");
  }
});

async function getWeather(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&lang=ja`;
  const response = await fetch(apiUrl);
  console.log(response);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("天気情報が取得できませんでした。");
}

async function get5DayForecast(lat, lon) {
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lon)}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;
  const response = await fetch(apiUrl);
  if (response.ok) {
    return await response.json();
  }
  throw new Error("5日天気が取れませんでした。");
}

function displayWeatherInfo(data, forecastData) {
  console.log(data);
  const {
    name: city,
    main: { temp, humidity },
    weather: [{ description, id }],
  } = data;

  const tempC = Math.round(temp - 273.15);

  weatherCard.textContent = " ";
  weatherCard.style.display = "flex";

  const cityDisplay = document.createElement("h1");
  const tempDisplay = document.createElement("p");
  const humidityDisplay = document.createElement("p");
  const weatherDisplay = document.createElement("p");
  const weatherEmoji = document.createElement("p");

  cityDisplay.textContent = city;
  cityDisplay.classList.add("cityDisplay");

  tempDisplay.textContent = `${tempC}℃`;
  tempDisplay.classList.add("tempDisplay");

  humidityDisplay.textContent = `湿度: ${humidity}%`;
  humidityDisplay.classList.add("humidityDisplay");

  weatherDisplay.textContent = description;
  weatherDisplay.classList.add("weatherDisplay");

  weatherEmoji.textContent = displayWeatherEmoji(id);
  weatherEmoji.classList.add("weatherEmoji");

  weatherCard.appendChild(cityDisplay);
  weatherCard.appendChild(tempDisplay);
  weatherCard.appendChild(humidityDisplay);
  weatherCard.appendChild(weatherDisplay);
  weatherCard.appendChild(weatherEmoji);

  if (forecastData?.daily?.time?.length) {
    const forecastContainer = document.createElement("div");
    forecastContainer.classList.add("forecastContainer");

    const forecastTitle = document.createElement("h2");
    forecastTitle.textContent = "5日天気";
    forecastTitle.classList.add("forecastTitle");

    const forecastList = document.createElement("ul");
    forecastList.classList.add("forecastList");

    const dates = forecastData.daily.time;
    const maxTemps = forecastData.daily.temperature_2m_max;
    const minTemps = forecastData.daily.temperature_2m_min;
    const codes = forecastData.daily.weathercode;

    const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });

    for (let i = 0; i < Math.min(5, dates.length); i++) {
      const item = document.createElement("li");
      item.classList.add("forecastItem");

      const dateEl = document.createElement("span");
      dateEl.classList.add("forecastDate");
      dateEl.textContent = dateFormatter.format(new Date(dates[i]));

      const emojiEl = document.createElement("span");
      emojiEl.classList.add("forecastEmoji");
      emojiEl.textContent = getMeteoEmoji(codes[i]);

      const tempsEl = document.createElement("span");
      tempsEl.classList.add("forecastTemps");
      tempsEl.textContent = `${Math.round(minTemps[i])}℃ / ${Math.round(maxTemps[i])}℃`;

      const descEl = document.createElement("span");
      descEl.classList.add("forecastDesc");
      descEl.textContent = getMeteoDescriptionJa(codes[i]);

      item.appendChild(dateEl);
      item.appendChild(emojiEl);
      item.appendChild(tempsEl);
      item.appendChild(descEl);
      forecastList.appendChild(item);
    }

    forecastContainer.appendChild(forecastTitle);
    forecastContainer.appendChild(forecastList);
    weatherCard.appendChild(forecastContainer);
  }

  displayClothingRecommendation({
    city,
    tempC,
    humidity,
    weatherId: id,
    description,
  });

  displayLaundryRecommendation({
    city,
    tempC,
    humidity,
    weatherId: id,
  });
}

function displayWeatherEmoji(weatherID) {
  switch (true) {
    case weatherID >= 200 && weatherID < 300:
      return "⛈️";
    case weatherID >= 300 && weatherID < 500:
      return "🌦️";
    case weatherID >= 500 && weatherID < 600:
      return "☔";
    case weatherID >= 600 && weatherID < 700:
      return "❄️";
    case weatherID >= 700 && weatherID < 800:
      return "🌫️";
    case weatherID == 800:
      return "☀️";
    case weatherID >= 801 && weatherID < 810:
      return "☁️";
    default:
      return "❓";
  }
}

function displayClothingRecommendation({ city, tempC, humidity, weatherId }) {
  clothCard.textContent = "";
  clothCard.style.display = "flex";

  const title = document.createElement("h2");
  title.classList.add("clothTitle");
  title.textContent = "服装おすすめ";

  const sentence = document.createElement("p");
  sentence.classList.add("clothSentence");
  sentence.textContent = generateClothingSentenceFallback({
    city,
    tempC,
    humidity,
    weatherId,
  });

  const list = document.createElement("ul");
  list.classList.add("clothList");

  const tips = getClothingTips(tempC, weatherId);
  for (const tip of tips) {
    const li = document.createElement("li");
    li.classList.add("clothItem");
    li.textContent = tip;
    list.appendChild(li);
  }

  clothCard.appendChild(title);
  clothCard.appendChild(sentence);
  clothCard.appendChild(list);

  maybeEnhanceClothingSentenceWithAI(sentence, {
    city,
    tempC,
    humidity,
    weatherId,
  });
}

function displayLaundryRecommendation({ city, tempC, humidity, weatherId }) {
  laundryCard.textContent = "";
  laundryCard.style.display = "flex";

  const title = document.createElement("h2");
  title.classList.add("laundryTitle");
  title.textContent = "洗濯チェック";

  const summary = document.createElement("p");
  summary.classList.add("laundrySummary");
  summary.textContent = `${city}（${tempC}℃ / 湿度 ${humidity}%）`;

  const sentence = document.createElement("p");
  sentence.classList.add("laundrySentence");
  sentence.textContent = getLaundryDryingTip(tempC, humidity, weatherId);

  laundryCard.appendChild(title);
  laundryCard.appendChild(summary);
  laundryCard.appendChild(sentence);
}

function getLaundryDryingTip(tempC, humidity, weatherId) {
  const isWetWeather =
    (weatherId >= 200 && weatherId < 600) ||
    (weatherId >= 600 && weatherId < 700);

  if (isWetWeather) {
    return "洗濯：外は乾きにくいかも。部屋干しが安心。";
  }

  if (humidity >= 80) {
    return "洗濯：湿っぽいので、乾きにくいかも。";
  }

  if (tempC >= 20 && humidity <= 60) {
    return "洗濯：今日は乾きやすそう。外干しOK。";
  }

  if (tempC <= 10) {
    return "洗濯：気温が低めで、乾くのに時間がかかりそう。";
  }

  return "洗濯：ふつう。風があると乾きやすいよ。";
}

function generateClothingSentenceFallback({ city, tempC, weatherId }) {
  const weatherEmoji = displayWeatherEmoji(weatherId);

  const tempPhrase =
    tempC <= 0
      ? "とても寒い"
      : tempC <= 10
        ? "寒い"
        : tempC <= 18
          ? "少し寒い"
          : tempC <= 25
            ? "ちょうどいい"
            : "暑い";

  const weatherPhrase =
    weatherId >= 200 && weatherId < 300
      ? "雷雨になりそう"
      : weatherId >= 300 && weatherId < 600
        ? "雨になりそう"
        : weatherId >= 600 && weatherId < 700
          ? "雪になりそう"
          : weatherId >= 700 && weatherId < 800
            ? "霧が出そう"
            : weatherId === 800
              ? "晴れ"
              : "曇り";

  const openers = [
    `${city}は${weatherEmoji} ${weatherPhrase}で、${tempPhrase}よ。`,
    `${city}、今日は${weatherEmoji} ${weatherPhrase}。${tempPhrase}感じ。`,
    `${city}は${tempPhrase}し、${weatherPhrase}って感じ。`,
  ];

  const outfit =
    tempC <= 0
      ? ["ダウンか厚手のコートが安心", "首元を暖めよう"]
      : tempC <= 10
        ? ["コートか厚手ジャケットがちょうどいい", "重ね着が安心"]
        : tempC <= 18
          ? ["薄手の羽織りがあると便利", "長袖が安心"]
          : tempC <= 25
            ? ["薄手でOK、朝と夜だけ羽織り", "動きやすい服で"]
            : ["半袖でOK、涼しい服で", "水分補給も忘れずに"];

  const rainAdd =
    weatherId >= 200 && weatherId < 600
      ? ["傘があると安心", "濡れてもいい靴が楽"]
      : [];

  const closers = [
    `${outfit[0]}。${outfit[1]}。`,
    `${outfit[0]}で行こう。${outfit[1]}。`,
    `${outfit[0]}が正解。${outfit[1]}。`,
  ];

  const extra = rainAdd.length
    ? [`あと${rainAdd[0]}。`, `ついでに${rainAdd[1]}。`]
    : ["無理せず、脱ぎ着しやすい服がいいよ。", "体に合わせてね。"];

  return `${pickOne(openers)} ${pickOne(closers)} ${pickOne(extra)}`;
}

async function maybeEnhanceClothingSentenceWithAI(targetEl, payload) {
  if (!AI_CLOTHING_ENDPOINT) return;

  try {
    const aiText = await fetchWithTimeout(
      AI_CLOTHING_ENDPOINT,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "clothing_recommendation",
          lang: "ja",
          tone: "casual",
          ...payload,
        }),
      },
      4000,
    );

    const data = await aiText.json();
    if (data?.text && typeof data.text === "string") {
      targetEl.textContent = data.text;
    }
  } catch (e) {
    console.warn("AI sentence unavailable", e);
  }
}

function pickOne(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  return fetch(url, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
}

function getClothingTips(tempC, weatherId) {
  const tips = [];

  if (tempC <= 0) {
    tips.push("ダウン or 厚手コート + ニット");
    tips.push("マフラー・手袋など");
  } else if (tempC <= 10) {
    tips.push("コート or 厚手ジャケット + 長袖");
  } else if (tempC <= 18) {
    tips.push("薄手ジャケット/カーディガン + 長袖");
  } else if (tempC <= 25) {
    tips.push("長袖シャツ or 薄手の羽織り");
  } else {
    tips.push("半袖 + 薄手の服（涼しく）");
  }

  if (weatherId >= 200 && weatherId < 300) {
    tips.push("雷雨かも：傘 + カッパ");
  } else if (weatherId >= 300 && weatherId < 600) {
    tips.push("雨かも：傘、濡れてもいい靴");
  } else if (weatherId >= 600 && weatherId < 700) {
    tips.push("雪：濡れにくい靴 + 暖かい靴下");
  } else if (weatherId >= 700 && weatherId < 800) {
    tips.push("霧/ほこり：羽織りで調整しやすく");
  } else if (weatherId === 800) {
    tips.push("晴れ：日差しが強いなら、帽子もOK");
  }

  return tips;
}

function getMeteoEmoji(code) {
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code === 45 || code === 48) return "🌫️";
  if (
    (code >= 51 && code <= 57) ||
    (code >= 61 && code <= 67) ||
    (code >= 80 && code <= 82)
  )
    return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "❓";
}

function getMeteoDescriptionJa(code) {
  switch (code) {
    case 0:
      return "快晴";
    case 1:
      return "ほぼ快晴";
    case 2:
      return "晴れ時々くもり";
    case 3:
      return "くもり";
    case 45:
    case 48:
      return "霧";
    case 51:
    case 53:
    case 55:
      return "霧雨";
    case 56:
    case 57:
      return "こおる霧雨";
    case 61:
    case 63:
    case 65:
      return "雨";
    case 66:
    case 67:
      return "こおる雨";
    case 71:
    case 73:
    case 75:
      return "雪";
    case 77:
      return "あられ";
    case 80:
    case 81:
    case 82:
      return "にわか雨";
    case 85:
    case 86:
      return "にわか雪";
    case 95:
      return "かみなり雨";
    case 96:
    case 99:
      return "かみなり雨(ひょう)";
    default:
      return "不明";
  }
}

function displayError(message) {
  const errorDisplay = document.createElement("p");
  errorDisplay.textContent = message;
  errorDisplay.classList.add("errorDisplay");

  weatherCard.textContent = " ";
  weatherCard.style.display = "flex";
  weatherCard.appendChild(errorDisplay);

  clothCard.textContent = "";
  clothCard.style.display = "none";

  laundryCard.textContent = "";
  laundryCard.style.display = "none";
}
