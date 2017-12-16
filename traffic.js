(function() {

  looker.plugins.visualizations.add({
    id: "traffic",
    label: "Traffic",
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
      this._myMap.id = "myMap";

      let map, trafficManager;

      function getMap() {
        map = new Microsoft.Maps.Map('#myMap', {
          credentials: key,
          center: new Microsoft.Maps.Location(37.156332700, -121.982457400),
          zoom: 10
        });

        Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
          trafficManager = new Microsoft.Maps.Traffic.TrafficManager(map);

          trafficManager.show();
        });

      }

    },
    // Render in response to the data or settings changing
    update: function (data, element, config, queryResponse) {
      this.clearErrors();
    }
  });
}());
