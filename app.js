const express = require("express");
const exphbs = require("express-handlebars");
const request = require("request");

const app = express();
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

function time(ms) {
  return new Date(ms).toISOString().slice(11, -1);
}

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/", function(req, res) {
  const city = req.body.city;
  const apiKey = "db4c8a7b334fe22c02f9ff8bce0060ed";
  const units = "metric";
  if (city == "") {
    return res.render("index", { message: "Please enter a city name" });
  }
  request(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`,
    function(error, response, body) {
      if (error || response.statusCode == 404) {
        res.render("index", { message: "Please enter valid city name." });
      } else {
        const parsed = JSON.parse(body);
        res.render("index", {
          temp: Math.round(parsed.main.temp),
          data: parsed,
          icon: parsed.weather[0].icon,
          description: parsed.weather[0].description,
          feels: Math.round(parsed.main.feels_like),
          max: Math.round(parsed.main.temp_max),
          min: Math.round(parsed.main.temp_min),
          speed: Math.round(parsed.wind.speed)
        });
      }
    }
  );
});

app.listen(1232, function() {
  console.log("Server running on port 1232");
});
