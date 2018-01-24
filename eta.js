/**
 * Created by Thomas on 12/4/17.
 */
(function() {

  looker.plugins.visualizations.add({
    id: "eta",
    label: "ETA",
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

      function isLoaded() {
        return Microsoft && Microsoft.Maps && Microsoft.Maps.Location;
      }

      let test = element.appendChild(document.createElement("script"));
      test.type = "javascript";
      test.src = "config.js";
      let key = keys.MICROSOFT_KEY;

      let bing = document.createElement('script');
      bing.src = 'https://www.bing.com/api/maps/mapcontrol?s=1';
      bing.setAttribute('defer', '');
      bing.setAttribute('async', '');
      bing.onload = function() {
        load(0);
      };
      element.appendChild(bing);

      function load(counter) {
        if (counter >= 50) {
          console.log("Bing timed out.");
          return;
        }
        var status = isLoaded();

        if (!status) {
          setTimeout(function() {load(counter+1)}, 100);
        } else {
          getMap();
        }
      }

      this._myMap = element.appendChild(document.createElement("div"));
      this._myMap.id = createUniqueId("myMap", 0);
      this._myMap.style.opacity = "0";

      this._eta = element.appendChild(document.createElement("div"));
      this._eta.id = createUniqueId("eta", 0);

      var title = document.createElement("h3");
      title.innerHTML = "Santa Cruz --> San Jose ETA";
      this._eta.appendChild(title);

      let map, directionsManager;
      let myThis = this;

      function getMap() {
        map = new Microsoft.Maps.Map("#"+myThis._myMap.id, {
          credentials: key,
          center: new Microsoft.Maps.Location(37.156332700, -121.982457400),
          zoom: 10
        });

        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
          directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

          myThis._myMap.style.display = "none";

          var santaCruz = new Microsoft.Maps.Directions.Waypoint({ address: 'Santa Cruz, CA' });
          directionsManager.addWaypoint(santaCruz);

          var sanJose = new Microsoft.Maps.Directions.Waypoint({ address: 'San Jose, CA' });
          directionsManager.addWaypoint(sanJose);

          Microsoft.Maps.Events.addHandler(directionsManager, 'directionsError', directionsError);
          Microsoft.Maps.Events.addHandler(directionsManager, 'directionsUpdated', directionsUpdated);

          directionsManager.calculateDirections();
        });

      }

      function directionsUpdated(e) {
        var routeIdx = directionsManager.getRequestOptions().routeIndex;

        var distance = Math.round(e.routeSummary[routeIdx].distance * 100)/100;

        var units = directionsManager.getRequestOptions().distanceUnit;


        //Time is in seconds, convert to minutes and round off.
        var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);

        var timeEta = myThis._eta.appendChild(document.createElement("div"));
        timeEta.id = "time";
        if (time >= 60) {
          var hours = Math.floor(time / 60);
          var mins = time - (hours * 60);
          timeEta.innerHTML = hours + " hours and " + mins + " minutes with traffic";
        } else {
          timeEta.innerHTML = time + " minutes with traffic";
        }
        var dist = myThis._eta.appendChild(document.createElement("div"));
        dist.id = "distance";
        dist.innerHTML = distance + " miles";
      }

      function directionsError(e) {
        alert('Error: ' + e.message + '\r\nResponse Code: ' + e.responseCode)
      }

      function createUniqueId(id, i) {
        if (document.getElementById(id)) {
          return createUniqueId(id+i, i+1);
        } else {
          return id;
        }
      }
    },

    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
      this.clearErrors();
    }
  });
}());
