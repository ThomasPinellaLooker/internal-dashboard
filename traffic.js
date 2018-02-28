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

      let test = element.appendChild(document.createElement("script"));
      test.type = "javascript";
      test.src = "config.js";

      this._myMap = element.appendChild(document.createElement("div"));
      this._myMap.id = createUniqueId("myMap", 0);

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

      // function isLoaded() {
      //   return Microsoft && Microsoft.Maps && Microsoft.Maps.Location;
      // }

      let bing = document.createElement('script');
      bing.src = 'https://www.bing.com/api/maps/mapcontrol?s=1&callback=getMap';
      bing.setAttribute('defer', '');
      bing.setAttribute('async', '');

      // bing.onload = function() {
      //   load(0);
      // };
      element.appendChild(bing);

      // function load(counter) {
      //   if (counter >= 50) {
      //     console.log("Bing timed out.");
      //     return;
      //   }
      //   var status = isLoaded();
      //
      //   if (!status) {
      //     setTimeout(function() {load(counter+1)}, 100);
      //   } else {
      //     getMap();
      //   }
      // }

      let map, trafficManager;
      let key = keys.MICROSOFT_KEY;
      let myThis = this;

      window.getMap = function() {
        map = new Microsoft.Maps.Map("#"+myThis._myMap.id, {
          credentials: key,
          center: new Microsoft.Maps.Location(37.156332700, -121.982457400),
          zoom: 10
        });

        Microsoft.Maps.loadModule('Microsoft.Maps.Traffic', function () {
          trafficManager = new Microsoft.Maps.Traffic.TrafficManager(map);

          trafficManager.show();
        });

      }
    }
  });
}());
