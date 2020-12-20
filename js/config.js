var configFile = {
  // url to services
  base_URL: "https://maps.raleighnc.gov/images/rest/services",

  // initial map on left hand map frame
  defaultLeft: "Orthos2019",

  // initial map on right hand map frame
  defaultRight: "Orthos1981",

  // rename map services names to user friendly names (if needed)
  rename: [
    ["Orthos1981", "1981 Aerial"],
    ["Orthos1988", "1988 Aerial"],
    ["Orthos1999", "1999 Aerial"],
    ["Orthos2002", "2002 Aerial"],
    ["Orthos2004", "2004 Aerial"],
    ["Orthos2005", "2005 Aerial"],
    ["Orthos2006", "2006 Aerial"],
    ["Orthos2007", "2007 Aerial"],
    ["Orthos2008", "2008 Aerial"],
    ["Orthos2009", "2009 Aerial"],
    ["Orthos2010", "2010 Aerial"],
    ["Orthos2011", "2011 Aerial"],
    ["Orthos2012", "2012 Aerial"],
    ["Orthos2013", "2013 Aerial"],
    ["Orthos2014", "2014 Aerial"],
    ["Orthos2015", "2015 Aerial"],
    ["Orthos2016", "2016 Aerial"],
    ["Orthos2017", "2017 Aerial"],
    ["Orthos2018", "2018 Aerial"],
    ["Orthos2019", "2019 Aerial"],
  ],

  // services to exclude from Historoscope
  exclude: [
    // "Elevation2014",
    // "Slope2014",
    // "UAV_HARDShoreline_KingTide_20180102",
    // "UAV_HARDShoreline_LowTide_20180305",
    // "COH_Dark_Gray"
  ],

  attribution: "City of Raleigh",

  mapCoords: [
    35.77717,-78.646118
  ],
  mapZoom: 17
}
