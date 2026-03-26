const API_KEY = "d6a5fb17dacb08a1a9dc88d9e8b69837";
const LAT = 50.1447;
const LON = 11.0608;

function getWeatherIcon(iconCode) {
    const icons = {
        "01d": "wi-day-sunny",
        "01n": "wi-night-clear",
        "02d": "wi-day-cloudy",
        "02n": "wi-night-cloudy",
        "03d": "wi-cloud",
        "03n": "wi-cloud",
        "04d": "wi-cloudy",
        "04n": "wi-cloudy",
        "09d": "wi-showers",
        "09n": "wi-showers",
        "10d": "wi-day-rain",
        "10n": "wi-night-rain",
        "11d": "wi-thunderstorm",
        "11n": "wi-thunderstorm",
        "13d": "wi-snow",
        "13n": "wi-snow",
        "50d": "wi-fog",
        "50n": "wi-fog"
    };
    return icons[iconCode] || "wi-day-sunny";
}

fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&appid=${API_KEY}&units=metric&lang=de`)
    .then(res => res.json())
    .then(data => {

       function getTagesWerte(offsetTage) {
    const heute = new Date();
    heute.setHours(0, 0, 0, 0);
    
    const zielTag = new Date(heute);
    zielTag.setDate(zielTag.getDate() + offsetTage);
    
    const eintraege = data.list.filter(e => {
        const eintragDatum = new Date(e.dt * 1000);
        // Nur Jahr, Monat, Tag vergleichen
        return eintragDatum.getDate() === zielTag.getDate() &&
               eintragDatum.getMonth() === zielTag.getMonth() &&
               eintragDatum.getFullYear() === zielTag.getFullYear();
    });

    console.log(`Tag +${offsetTage} (${zielTag.toDateString()}): ${eintraege.length} Einträge`);
    if (eintraege.length === 0) return null;

    const alleTemps = eintraege.map(e => e.main.temp);
    const min = Math.round(Math.min(...alleTemps));
    const max = Math.round(Math.max(...alleTemps));

    const mittagEintrag = eintraege.reduce((prev, curr) => {
        const prevStunde = new Date(prev.dt * 1000).getHours();
        const currStunde = new Date(curr.dt * 1000).getHours();
        return Math.abs(currStunde - 12) < Math.abs(prevStunde - 12) ? curr : prev;
    });

    return { min, max, icon: mittagEintrag.weather[0].icon };
}
        const ids = ["heute", "morgen", "uebermorgen"];
        [0, 1, 2].forEach((offset, i) => {
            const tag = getTagesWerte(offset);
            if (!tag) return;
            document.getElementById(`icon-${ids[i]}`).innerHTML =
                `<i class="wi ${getWeatherIcon(tag.icon)}"></i>`;
            document.getElementById(`temp-${ids[i]}`).textContent =
                `${tag.min} - ${tag.max}°C`;
        });
    });