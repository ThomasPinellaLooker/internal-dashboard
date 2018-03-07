(function() {

  looker.plugins.visualizations.add({
    id: "clock",
    label: "Clock",
    options: {
      city: {
        type: "string",
        label: "City",
        values: [
          {"Santa Cruz": "0"},
          {"San Francisco": "1"},
          {"New York City": "2"},
          {"Chicago": "3"},
          {"Dublin": "4"},
          {"London": "5"}
        ],
        display: "select",
        default: "0"
      },
      display: {
        type: "string",
        label: "Display Type",
        values: [
          {"Digital": "digital"},
          {"Analog": "analog"}
        ],
        display: "radio",
        default: "digital"
      }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {

      let head = element.appendChild(document.createElement("head"));
      head.innerHTML = `
      <meta charset="utf-8" />
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <style>
        svg.clock {
            stroke-linecap: round;
            margin-left:auto;
            margin-right:auto;
        }
        
        .face {
            stroke: #aac;
            stroke-width: 3;
        }
        
        .hourtick.face {
        }
        
        .minutetick.face {
            stroke-width: 2;
        }
        
        .hand {
            stroke: #336;
            stroke-width: 4;
        }
        
        .hour.hand {
            stroke-width: 5;
        }
        
        .minute.hand {
        }
        
        .second.hand {
            stroke: red;
            stroke-width: 2;
        }
        
        #city {
          text-align:center;
        }
        
        #digital-display {
          text-align:center;
        }
        
        #clock {
          margin-left:auto;
          margin-right:auto;
          text-align:center;
        }
      </style>
      `;


      this._container = element.appendChild(document.createElement("div"));
      this._city = this._container.appendChild(document.createElement("h4"));
      this._city.id = "city";
      this._clock = this._container.appendChild(document.createElement("div"));
      this._clock.id = "clock";

      let myThis = this;
      // this._interval = setInterval(function() {
      //   calculateTime(myThis);
      // }, 1000);
    },
    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
      this.clearErrors();
      let myThis = this;
      clearInterval(this._interval);
      myThis._clock.innerHTML = "";
      if (element.getElementsByClassName("clock")[0]) {
        element.removeChild(element.lastChild);
      }
      let time = calculateTime(myThis);
      if (config.display === "digital") {
        showDigitalClock(myThis, time);
      } else {
        showD3Clock(myThis._clock, time);
      }
      this._interval = setInterval(function() {
        time = calculateTime(myThis);

        myThis._clock.innerHTML = "";
        if (element.getElementsByClassName("clock")[0]) {
          element.removeChild(element.lastChild);
        }
        if (config.display === "digital") {
          showDigitalClock(myThis, time);
        } else {
          showD3Clock(myThis._clock, time);
        }

      }, 1000);

      function calculateTime(myThis) {
        let localTime = new Date().getTime();
        let localOffset = new Date().getTimezoneOffset() * 60000;
        let utc = localTime + localOffset;
        let mult = 3600000;

        let caliOffset = -7;
        let nycOffset = -4;
        let chiOffset = -5;
        let ukOffset = 1;

        let time = new Date();
        let caliTime, nycTime, chiTime, ukTime;

        switch (Number(config.city)) {
          case 0:
            myThis._city.innerHTML = "Santa Cruz";
            caliTime = new Date(utc + (mult * caliOffset));
            if (!isDST(caliTime, 2, 2, 10, 1)) {
              caliOffset--;
              caliTime = new Date(utc + (mult * caliOffset));
            }
            time = caliTime;
            break;
          case 1:
            myThis._city.innerHTML = "San Francisco";
            caliTime = new Date(utc + (mult * caliOffset));
            if (!isDST(caliTime, 2, 2, 10, 1)) {
              caliOffset--;
              caliTime = new Date(utc + (mult * caliOffset));
            }
            time = caliTime;
            break;
          case 2:
            myThis._city.innerHTML = "New York City";
            nycTime = new Date(utc + (mult * nycOffset));
            if (!isDST(nycTime, 2, 2, 10, 1)) {
              nycOffset--;
              nycTime = new Date(utc + (mult * nycOffset));
            }
            time = nycTime;
            break;
          case 3:
            myThis._city.innerHTML = "Chicago";
            chiTime = new Date(utc + (mult * chiOffset));
            if (!isDST(chiTime, 2, 2, 10, 1)) {
              chiOffset--;
              chiTime = new Date(utc + (mult * chiOffset));
            }
            time = chiTime;
            break;
          case 4:
            myThis._city.innerHTML = "Dublin";
            ukTime = new Date(utc + (mult * ukOffset));
            if (!isDST(ukTime, 2, 2, 10, 1)) {
              ukOffset--;
              ukTime = new Date(utc + (mult * ukOffset));
            }
            time = ukTime;
            break;
          case 5:
            myThis._city.innerHTML = "London";
            ukTime = new Date(utc + (mult * ukOffset));
            if (!isDST(ukTime, 2, 2, 10, 1)) {
              ukOffset--;
              ukTime = new Date(utc + (mult * ukOffset));
            }
            time = ukTime;
        }

        return time;
      }

      function showDigitalClock(myThis, time) {
        // myThis._clock.innerHTML = "";
        let display = myThis._clock.appendChild(document.createElement("h1"));
        display.id = "digital-display";
        display.innerHTML = time.toLocaleTimeString();
      }

      function showD3Clock(element, time) {
        var w = 200;             // Width of SVG element
        var h = 200;             // Height of SVG element

        var cx = w / 2;          // Center x
        var cy = h / 2;          // Center y
        var margin = 4;
        var r = w / 2 - margin;  // Radius of clock face

        //element.removeChild(element.lastChild);

        var svg = d3.select(element).append("svg")
          .attr("class", "clock")
          .attr("width", w)
          .attr("height", h);

        makeClockFace();

        // Create hands from dataset

        svg.selectAll("line.hand")
          .data(getTimeOfDay(time))
          .enter()
          .append("line")
          .attr("class", function (d) { return d[0] + " hand"})
          .attr("x1", cx)
          .attr("y1", function (d) { return cy + handBackLength(d) })
          .attr("x2", cx)
          .attr("y2", function (d) { return r - handLength(d)})
          .attr("transform", rotationTransform)

        // Update hand positions once per second
        //setInterval(updateHands(time), 1000)
        updateHands(time);

        function makeClockFace() {
          var hourTickLength = Math.round(r * 0.2)
          var minuteTickLength = Math.round(r * 0.075)
          for (var i = 0; i < 60; ++i) {
            var tickLength, tickClass
            if ((i % 5) == 0) {
              tickLength = hourTickLength
              tickClass = "hourtick"
            }
            else {
              tickLength = minuteTickLength
              tickClass = "minutetick"
            }
            svg.append("line")
              .attr("class", tickClass + " face")
              .attr("x1", cx)
              .attr("y1", margin)
              .attr("x2", cx)
              .attr("y2", margin + tickLength)
              .attr("transform", "rotate(" + i * 6 + "," + cx + "," + cy + ")")
          }
        }

        function getTimeOfDay(now) {
          var hr = now.getHours();
          var min = now.getMinutes();
          var sec = now.getSeconds();
          return [
            [ "hour",   hr + (min / 60) + (sec / 3600) ],
            [ "minute", min + (sec / 60) ],
            [ "second", sec ]
          ]
        }

        function handLength(d) {
          if (d[0] == "hour")
            return Math.round(0.45 * r)
          else
            return Math.round(0.90 * r)
        }

        function handBackLength(d) {
          if (d[0] == "second")
            return Math.round(0.25 * r)
          else
            return Math.round(0.10 * r)
        }

        function rotationTransform(d) {
          var angle
          if (d[0] == "hour")
            angle = (d[1] % 12) * 30
          else
            angle = d[1] * 6
          return "rotate(" + angle + "," + cx + "," + cy + ")"
        }

        function updateHands(time) {
          svg.selectAll("line.hand")
            .data(getTimeOfDay(time))
            .transition().ease("bounce")
            .attr("transform", rotationTransform)
        }
      }


      function isDST(date, beginsMonth, beginsSunday, endsMonth, endsSunday) {

        let dateDSTBegins = getDSTDate(date, beginsMonth, beginsSunday);
        let dateDSTEnds = getDSTDate(date, endsMonth, endsSunday);

        if (date.getMonth() > beginsMonth &&
            date.getMonth() < endsMonth) {
          return true;
        } else {
          if (date.getMonth() === beginsMonth &&
              date.getDate() > dateDSTBegins) {
            return true;

          } else if (date.getMonth() === beginsMonth &&
                     date.getDate() === dateDSTBegins &&
                     date.getHours() >= 2) {
            return true;
          } else if (date.getMonth() === endsMonth &&
                     date.getDate() < dateDSTEnds) {
            return true;
          } else if (date.getMonth() === endsMonth &&
                     date.getDate() === dateDSTEnds &&
                     date.getHours() < 2) {
            return true;
          } else {
            return false;
          }
        }
      }

      function getDSTDate(date, month, numSundays) {
        let i = 1;
        let d = new Date().setFullYear(date.getFullYear(), month, i);
        let sundayCounter = 0;
        let dstDate = 0;
        while (sundayCounter < numSundays) {
          if (new Date(d).getDay() === 6) {
            sundayCounter++;
          }
          if (sundayCounter === numSundays) {
            dstDate = i;
          }
          d = new Date(d).setFullYear(date.getFullYear(), month, i);
          i++;
        }
        return dstDate;
      }
    }
  });
}());
