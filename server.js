const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const apiKey = "your-apiKey";

app.get("/", (req, res) => {
    res.send(`
        <form action="/" method="post">
            <input type="text" name="city" placeholder="Enter city name" required>
            <button type="submit">Get Weather</button>
        </form>
    `);
});

app.post("/", (req, res) => {
    const city = req.body.city;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    https.get(url, (response) => {
        let data = "";
        response.on("data", (chunk) => data += chunk);
        response.on("end", () => {
            if (response.statusCode === 200) {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const weatherDescription = weatherData.weather[0].description;
                res.send(`<p>The weather in ${city} is currently ${weatherDescription}</p><h1>The temperature is ${temp} degrees Celsius</h1>`);
            } else {
                res.status(response.statusCode).send(`Error: ${response.statusCode}`);
            }
        });
    }).on("error", (error) => res.status(500).send("Error fetching weather data"));
});

app.listen(3000, () => console.log("Server is running on port 3000"));
