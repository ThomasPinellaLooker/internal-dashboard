(function() {

  looker.plugins.visualizations.add({
    id: "weather",
    label: "Weather",
    options: {
      font_size: {
        type: "string",
        label: "Font Size",
        values: [
          {"Large": "large"},
          {"Small": "small"}
        ],
        display: "radio",
        default: "large"
      }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {
      //   let head = element.appendChild(document.createElement("head"));
      //   head.innerHTML = `
      //   <meta charset="utf-8" />
      //   <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      //   <script type='text/javascript' src='http://www.bing.com/api/maps/mapcontrol?callback=GetMap' async defer></script>
      //   <style>
      //     .traffic-vis {
      //       /* Vertical centering */
      //       height: 100%;
      //       display: flex;
      //       flex-direction: column;
      //       justify-content: center;
      //       text-align: center;
      //     }
      //   </style>
      // `;

      let test = element.appendChild(document.createElement("script"));
      test.type = "javascript";
      test.src = "config.js";
      let key = keys.WEATHER_KEY;

      this._weather = element.appendChild(document.createElement("div"));
      this._weather.id = "weather";


      $.ajax({
        url: "https://api.wunderground.com/api/"+key+"/conditions/q/CA/Santa_Cruz.json",
        dataType: "jsonp",
        success: function(data) {
          var temp = data['current_observation']['temp_f'];
          var windSpeed = data['current_observation']['wind_mph'];
          var iconURL = data['current_observation']['icon_url'];
          var precipHr = data['current_observation']['precip_1hr_in'];

          var iconURLImg = document.getElementById('weather').appendChild(document.createElement("img"));
          iconURLImg.src = iconURL;
          iconURLImg.width = "100";
          iconURLImg.style.float = "left";

          // var descDiv = document.getElementById('weather').appendChild(document.createElement("div"));
          // descDiv.innerHTML = desc;

          var tempDiv = document.getElementById('weather').appendChild(document.createElement("h1"));
          tempDiv.innerHTML = temp + "°F";
          tempDiv.style.paddingTop = "15px";
          tempDiv.style.paddingLeft = "10px";

          // var feelsLikeDiv = document.getElementById('weather').appendChild(document.createElement("div"));
          // feelsLikeDiv.innerHTML = "Feels like " + feelsLike + " F";

          var precipHrDiv = document.getElementById('weather').appendChild(document.createElement("h4"));
          precipHrDiv.innerHTML = "Precipitation: " + precipHr + " inches";

          var windSpeedDiv = document.getElementById('weather').appendChild(document.createElement("h4"));
          windSpeedDiv.innerHTML = "Wind Speed: " + windSpeed + " mph";

          getForecast();
        }
      });

      function getForecast() {
        $.ajax({
          url: "https://api.wunderground.com/api/"+key+"/forecast/q/CA/Santa_Cruz.json",
          dataType: "jsonp",
          success: function (data) {
            var forecast = data['forecast']['simpleforecast']['forecastday'];

            var today = forecast[0]['date']['weekday'];
            var today_iconURL = forecast[0]['icon_url'];
            var today_lowTemp = forecast[0]['low']['fahrenheit'];
            var today_highTemp = forecast[0]['high']['fahrenheit'];
            var today_precip = forecast[0]['qpf_allday']['in'];

            var tomorrow = forecast[1]['date']['weekday'];
            var tomorrow_iconURL = forecast[0]['icon_url'];
            var tomorrow_lowTemp = forecast[0]['low']['fahrenheit'];
            var tomorrow_highTemp = forecast[0]['high']['fahrenheit'];
            var tomorrow_precip = forecast[0]['qpf_allday']['in'];

            var twoDays = forecast[2]['date']['weekday'];
            var twoDays_iconURL = forecast[0]['icon_url'];
            var twoDays_lowTemp = forecast[0]['low']['fahrenheit'];
            var twoDays_highTemp = forecast[0]['high']['fahrenheit'];
            var twoDays_precip = forecast[0]['qpf_allday']['in'];

            var threeDays = forecast[3]['date']['weekday'];
            var threeDays_iconURL = forecast[0]['icon_url'];
            var threeDays_lowTemp = forecast[0]['low']['fahrenheit'];
            var threeDays_highTemp = forecast[0]['high']['fahrenheit'];
            var threeDays_precip = forecast[0]['qpf_allday']['in'];

            document.getElementById('weather').appendChild(document.createElement("br"));
            var forecastSpan = document.getElementById('weather').appendChild(document.createElement("div"));

            buildDayForecast(
              forecastSpan,
              "Today",
              today_iconURL,
              today_lowTemp,
              today_highTemp,
              today_precip
            );
            buildDayForecast(
              forecastSpan,
              "Tomorrow",
              tomorrow_iconURL,
              tomorrow_lowTemp,
              tomorrow_highTemp,
              tomorrow_precip
            );
            buildDayForecast(
              forecastSpan,
              twoDays,
              twoDays_iconURL,
              twoDays_lowTemp,
              twoDays_highTemp,
              twoDays_precip
            );
            buildDayForecast(
              forecastSpan,
              threeDays,
              threeDays_iconURL,
              threeDays_lowTemp,
              threeDays_highTemp,
              threeDays_precip
            );

            console.log(forecast);
          }
        });
      }

      function buildDayForecast(forecastSpan, day, iconURL, highTemp, lowTemp, precip) {
        var dayDiv = forecastSpan.appendChild(document.createElement("div"));
        dayDiv.style.float = "left";
        dayDiv.style.width = "20%";

        var iconURLImg = dayDiv.appendChild(document.createElement("img"));
        iconURLImg.src = iconURL;
        iconURLImg.width = "20";
        iconURLImg.style.float = "left";


        var dayH = dayDiv.appendChild(document.createElement("h4"));
        dayH.innerHTML = day;

        var highTempH = dayDiv.appendChild(document.createElement("h6"));
        highTempH.innerHTML = "High: " + highTemp + "°F";

        var lowTempH = dayDiv.appendChild(document.createElement("h6"));
        lowTempH.innerHTML = "Low: " + lowTemp + "°F";

        var precipH = dayDiv.appendChild(document.createElement("h6"));
        precipH.innerHTML = "Precip: " + precip + " inches";
      }

    },
    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
      this.clearErrors();
    }
  });
}());