const express = require("express");
const https = require("https");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

var weather = {city:null, temperature: null, description:null, imgurl:null};


app.get("/", function (req, res) {
  let day = date.getDate();
  res.render("home",{date: day});
});

app.post("/", function (req, res) {
  const query = String(req.body.cityName);
  const apiKey = "91cf67ced9b79e737a993d8782ff4016";
  const unit = "metric";

  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const icon = weatherData.weather[0].icon;
      const iconUrl = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
      weather={city: weatherData.name, temperature: temp, description: weatherDescription, imgurl: iconUrl};
      res.redirect("/weather-data");
    });
  });
});

app.get("/weather-data", function(req, res){
  res.render("weather-data",{imgurl:weather.imgurl, city: weather.city, temperature: weather.temperature, description: weather.description});
})

app.listen(3000, function () {
  console.log("Server is running on port 3000");
});
