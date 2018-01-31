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
        display: "radio",
        default: "0"
      }
    },
    // Set up the initial state of the visualization
    create: function (element, config) {

      this._clock = element.appendChild(document.createElement("div"));

      let myThis = this;
      this._interval = setInterval(function() {
        calculateTime(myThis);
      }, 1000);
    },
    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
      this.clearErrors();
      let myThis = this;
      clearInterval(this._interval);

      calculateTime(myThis);
      this._interval = setInterval(function() {
        calculateTime(myThis);
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

        switch (Number(config.city)) {
          case 0:
          case 1:
            let caliTime = new Date(utc + (mult * caliOffset));
            if (!isDST(caliTime, 2, 2, 10, 1)) {
              caliOffset--;
              caliTime = new Date(utc + (mult * caliOffset));
            }
            time = caliTime;
            break;
          case 2:
            let nycTime = new Date(utc + (mult * nycOffset));
            if (!isDST(nycTime, 2, 2, 10, 1)) {
              nycOffset--;
              nycTime = new Date(utc + (mult * nycOffset));
            }
            time = nycTime;
            break;
          case 3:
            let chiTime = new Date(utc + (mult * chiOffset));
            if (!isDST(chiTime, 2, 2, 10, 1)) {
              chiOffset--;
              chiTime = new Date(utc + (mult * chiOffset));
            }
            time = chiTime;
            break;
          case 4:
          case 5:
            let ukTime = new Date(utc + (mult * ukOffset));
            if (!isDST(ukTime, 2, 2, 10, 1)) {
              ukOffset--;
              ukTime = new Date(utc + (mult * ukOffset));
            }
            time = ukTime;
        }

        myThis._clock.innerHTML = "";

        let display = myThis._clock.appendChild(document.createElement("h1"));

        display.innerHTML = time.toLocaleTimeString();
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
