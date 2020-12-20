console.log(configFile.mapCoords[0]);
  var mapLeft = L.map('map1').setView([configFile.mapCoords[0], configFile.mapCoords[1]], configFile.mapZoom);

    // create an empty layer group to store the results and add it to the map
    var results = L.layerGroup().addTo(mapLeft);

    // Create new crosshair for the Left map
    var crosshairIcon = L.icon({
        iconUrl: 'images/crosshairs.svg',
        iconSize: [200, 200], // size of the icon
        iconAnchor: [100, 100] // point of the icon which will correspond to marker's location
    });

    // Add crosshair to left map
    crosshairL = new L.marker(mapLeft.getCenter(), { icon: crosshairIcon, clickable: false });
    crosshairL.addTo(mapLeft);

// set up global variables and assign settings from config.js to the appropriate variables
  var leftLayer, rightLayer;
  var baseURL = configFile.base_URL;
  var defaultLeftLayer = configFile.defaultLeft;
  var defaultRightLayer = configFile.defaultRight;
  var renameArray = configFile.rename;
  var excludeArray = configFile.exclude;

// Query arcgis rest endpoint and populate the dropdowns with different datasets from the service
  L.esri.get(baseURL, {},
    function (error, response) {
      if (error) {
        console.log(error)
      }
      else {
        var dropdownContent = [];
        var dropdownLeft = document.getElementById("basemapsLeft");
        var dropdownRight = document.getElementById("basemapsRight");
        //for to process all layers on service endpoint and push to dropdown lists
        for (i=0; i<response.services.length;  i++) {
          console.log(response.services[i].name)
          // var thisTileLayer = response.services[i].name.split('/')[1]
          var thisTileLayer = response.services[i].name
          //if this tile layer is not in the excludes list, then process
        // removed due to IE error for line below if (excludeArray.includes(thisTileLayer) == false) {
        if (excludeArray.indexOf(thisTileLayer) == -1) {
            var thisLayerString = renameItem(thisTileLayer);
            dropdownContent.push(thisLayerString);
            var elLeft = document.createElement("option");
            elLeft.textContent = thisLayerString;
            elLeft.value = thisLayerString;
            dropdownLeft.appendChild(elLeft);
            var elRight = document.createElement("option");
            elRight.textContent = thisLayerString;
            elRight.value = thisLayerString;
            dropdownRight.appendChild(elRight);
            //configure the path name to this service, using the base URL, this Map Name, and /MapServer
            thisLayerName = L.esri.imageMapLayer({
              url: baseURL.concat('/', thisTileLayer, '/ImageServer'),
              // maxZoom: 21
              attribution: configFile.attribution
            });
            //set default layer if this service matches the assigned default on left map
            if (renameBackToOfficialServiceName(thisLayerString) == defaultLeftLayer) {
              leftLayer = thisLayerName;
              mapLeft.addLayer(leftLayer);
              elLeft.selected = true;
            }
            //set default layer if this service matches the assigned default on right map
            if (renameBackToOfficialServiceName(thisLayerString) == defaultRightLayer) {
              rightLayer = thisLayerName;
              mapRight.addLayer(rightLayer);
              elRight.selected = true;
            }
          }
      }
    }
  });

    var mapRight = L.map('map2').setView([configFile.mapCoords[0], configFile.mapCoords[1]], configFile.mapZoom);

    // Add in a crosshair for the Right map
    crosshairR = new L.marker(mapRight.getCenter(), { icon: crosshairIcon, clickable: false });
    crosshairR.addTo(mapRight);

//FUNCTION check to see if service name needs to be renamed on to a more user friendly dropdown Name, checking renameArray
function renameItem (layer) {
  var found = false;
  var renameCounter = 0;
  while (found === false) {
    if (renameArray[renameCounter][0] === layer) {
      found = true;
      return renameArray[renameCounter][1];
    } else {
      renameCounter += 1;
    }
    if (renameCounter === renameArray.length) {
      return layer;
    }
  }
}

//FUNCTION when switching on the dropdown, need to convert the userfriendly name from the dropdown back to the original service name shown in postition 0 in renameArray
function renameBackToOfficialServiceName (layer) {
  var found = false;
  var renameCounter = 0;
  while (found === false) {
    if (renameArray[renameCounter][1] === layer) {
      found = true;
      return renameArray[renameCounter][0];
    } else {
      renameCounter += 1;
    }
    if (renameCounter === renameArray.length) {
      return layer;
    }
  }
}

//FUNCTION to change basemap on dropdown change. Pass in basemap from dropdown and if it was left or right dropdown
    function setBasemap(basemap, mapSide, attribution = "") {
        if (mapSide === "basemapsLeft") {
          //remove previous layer
            mapLeft.removeLayer(leftLayer);
            //create new layer
            leftLayer = L.esri.imageMapLayer({
              url: baseURL.concat('/', renameBackToOfficialServiceName(basemap), '/ImageServer'),
              maxZoom: 21,
              attribution: attribution
            });
            //add new layer
            mapLeft.addLayer(leftLayer);
        } else if (mapSide === "basemapsRight") {
            mapRight.removeLayer(rightLayer);
            if (basemap === 'Streets') {
                rightLayer = L.esri.basemapLayer(basemap);
            } else {
                rightLayer = L.esri.imageMapLayer({
                  url: baseURL.concat('/', renameBackToOfficialServiceName(basemap), '/ImageServer'),
                  maxZoom: 21,
                  attribution: attribution
                });
            }
            mapRight.addLayer(rightLayer);
        }
    }

  function changeBasemap(basemaps) {
        var whichMap = basemaps.id;
        //Need to force this to set because IE doesn't recognize normal dropdown onchange events
      //  var thisIndexToSet = document.getElementById("basemapsRight").selectedIndex;
      //  basemaps.options[thisIndexToSet].selected = true;
      if (whichMap === "basemapsRight") {
          document.getElementById("basemapsLeft").focus();
      } else {
          document.getElementById("basemapsRight").focus();
      }
        var basemap = basemaps.value;
        setBasemap(basemap, whichMap, configFile.attribution);
  }

    mapLeft.sync(mapRight);
    mapRight.sync(mapLeft);

    // Move the crosshair to the center of the map when the user pans. Only need to use mapRight since moving one moves both maps
    mapRight.on('move', function (e) {
        crosshairR.setLatLng(mapRight.getCenter());
        crosshairL.setLatLng(mapLeft.getCenter());
        document.getElementById("basemapsLeft").focus();
    });