/**
 * Created by Thomas on 12/4/17.
 */
(function() {

  looker.plugins.visualizations.add({
    id: "eta",
    label: "ETA",
    options: {
      loc1: {
        type: "string",
        label: "Start Address",
        display: "text",
        default: "Santa Cruz, CA"
      },
      loc2: {
        type: "string",
        label: "Destination Address",
        display: "text",
        default: "San Jose, CA"
      },
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

      // function isLoaded() {
      //   return Microsoft && Microsoft.Maps && Microsoft.Maps.Location;
      // }

      let test = element.appendChild(document.createElement("script"));
      test.type = "javascript";
      test.src = "config.js";

      let bing = document.createElement('script');
      bing.src = 'https://www.bing.com/api/maps/mapcontrol?s=1&callback=getMap';
      bing.setAttribute('defer', '');
      bing.setAttribute('async', '');

      element.appendChild(bing);

      this._myMap = element.appendChild(document.createElement("div"));
      this._myMap.id = createUniqueId("myMap", 0);
      this._myMap.style.opacity = "0";

      this._container = element.appendChild(document.createElement("div"));
      this._container.id = createUniqueId("container", 0);

      this._eta = this._container.appendChild(document.createElement("div"));
      this._eta.id = createUniqueId("eta", 0);

      function createUniqueId(id, i) {
        if (document.getElementById(id)) {
          return createUniqueId(id + i, i + 1);
        } else {
          return id;
        }
      }

    },

    // Render in response to the data or settings changing
    update: _.debounce(function (data, element, config, queryResponse) {
      this.clearErrors();

      let myThis = this;
      let map;
      let key = keys.MICROSOFT_KEY;
      window.getMap = function() {
        map = new Microsoft.Maps.Map("#"+myThis._myMap.id, {
          credentials: key,
          center: new Microsoft.Maps.Location(37.156332700, -121.982457400),
          zoom: 10
        });

        Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function () {
          myThis.directionsManager = new Microsoft.Maps.Directions.DirectionsManager(map);

          myThis._myMap.style.display = "none";

          addWaypoints();
        });
      };

      function addWaypoints() {
        myThis._container.innerHTML = "";
        var title = document.createElement("h3");
        title.innerHTML = config.loc1 + " --> " + config.loc2;
        myThis._container.appendChild(title);

        var santaCruz = new Microsoft.Maps.Directions.Waypoint({ address: config.loc1 });
        myThis.directionsManager.addWaypoint(santaCruz);


        var sanJose = new Microsoft.Maps.Directions.Waypoint({ address: config.loc2 });
        myThis.directionsManager.addWaypoint(sanJose);


        Microsoft.Maps.Events.addHandler(myThis.directionsManager, 'directionsError', directionsError);
        Microsoft.Maps.Events.addHandler(myThis.directionsManager, 'directionsUpdated', directionsUpdated);

        myThis.directionsManager.calculateDirections();
      }

      if (myThis.directionsManager) {
        myThis.directionsManager.clearAll();
        addWaypoints();
      }

      function directionsUpdated(e) {
        var routeIdx = myThis.directionsManager.getRequestOptions().routeIndex;

        var distance = Math.round(e.routeSummary[routeIdx].distance * 100)/100;

        var units = myThis.directionsManager.getRequestOptions().distanceUnit;


        myThis._eta.innerHTML = "";
        //Time is in seconds, convert to minutes and round off.
        var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);

        var timeEta = myThis._eta.appendChild(document.createElement("div"));
        timeEta.id = "time";
        if (time >= 60) {
          var hours = Math.floor(time / 60);
          var mins = time - (hours * 60);
          timeEta.innerHTML = hours + " hours and " + mins + " minutes with traffic";
        } else {
          timeEta.innerHTML = time + " minutes with current traffic";
        }
        var dist = myThis._eta.appendChild(document.createElement("div"));
        dist.id = "distance";
        dist.innerHTML = distance + " miles";

        myThis._container.appendChild(myThis._eta);
      }

      function directionsError(e) {
        console.log(e);
      }

    }, 250)
  });
}());
