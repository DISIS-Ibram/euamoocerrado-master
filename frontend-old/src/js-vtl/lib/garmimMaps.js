// ---- extend Number object with methods for converting degrees/radians

/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

/** Converts radians to numeric (signed) degrees */
if (typeof(Number.prototype.toDeg) === "undefined") {
  Number.prototype.toDeg = function() {
    return this * 180 / Math.PI;
  }
}

/**
 * Formats the significant digits of a number, using only fixed-point notation (no exponential)
 *
 * @param   {Number} precision: Number of significant digits to appear in the returned string
 * @returns {String} A string representation of number which contains precision significant digits
 */
if (typeof(Number.prototype.toPrecisionFixed) === "undefined") {
  Number.prototype.toPrecisionFixed = function(precision) {
    if (isNaN(this)) return 'NaN';
    var numb = this < 0 ? -this : this;  // can't take log of -ve number...
    var sign = this < 0 ? '-' : '';

    if (numb == 0) { n = '0.'; while (precision--) n += '0'; return n };  // can't take log of zero

    var scale = Math.ceil(Math.log(numb)*Math.LOG10E);  // no of digits before decimal
    var n = String(Math.round(numb * Math.pow(10, precision-scale)));
    if (scale > 0) {  // add trailing zeros & insert decimal as required
      l = scale - n.length;
      while (l-- > 0) n = n + '0';
      if (scale < n.length) n = n.slice(0,scale) + '.' + n.slice(scale);
    } else {          // prefix decimal and leading zeros if required
      while (scale++ < 0) n = '0' + n;
      n = '0.' + n;
    }
    return sign + n;
  }
}

/** Trims whitespace from string (q.v. blog.stevenlevithan.com/archives/faster-trim-javascript) */
if (typeof(String.prototype.trim) === "undefined") {
  String.prototype.trim = function() {
    return String(this).replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  }
}

if(Garmin == undefined) var Garmin = {};
if(Garmin.Map == undefined) {
    Garmin.Map = {};
}

Garmin.Map.Utils = {

    MEASURE_STATUTE: 'statute',
    RADIUS_KILOMETERS: 6371,
    RADIUS_MILES: 3959,
    FEET_PER_METER: 3.28083989501312,
    MARKER: "marker-",
    POLYLINE: "polyline-",
    LAP_MARKER_URL: "/image/map/lap-marker-",
    SHADOW_URL: "/api/activity-search/style/explore/images/pin-shadow.png",
    METRIC: "metric",
    GEO_OFFSET: 0.00007, // Used to keep markers from overlapping on return to start function.
    GEO_BUFFER: 0.00007, // Used to test if the end marker is already near the start marker
    BUSY_DIV_ID: 'loading-mask',
    MAP_CUSTOM_CONTROLS: 'custom-map-controls',
    MAP_CNTL_ZOOM_IN: 'map_control_zoom_in',
    MAP_CNTL_ZOOM_OUT: 'map_control_zoom_out',
    MAP_STYLE_ROAD: 'road',
    MAP_STYLE_SATELLITE: 'satellite',
    MAP_STYLE_HYBRID: 'hybrid',
    MAP_STYLE_AUTO: 'auto',
    MAP_STYLE_TERRAIN: 'terrain',
    MAP_STYLE_BICYCLE: 'bicycle',
    MAP_STYLE_OSM: 'osm',
    PROVIDER_TYPE_BING: 'bing',
    PROVIDER_TYPE_GOOGLE: 'google',
    PROVIDER_TYPE_OSM: 'osm',
    PROVIDER_TYPE_MOCK: 'mock',
    MAXIMUM_ELEVATION_SAMPLES: 512,
    MAXIMUM_ELEVATION_PATH_POINTS: 375,

    LINE_COLOR: [255, 0, 0],

    LINE_OPACITY: 0.8,

    LINE_WIDTH: 4,

    /**
     * Occurs when the location of the pushpin or polyline or any of the pushpinâ€™s, polyline's options change.
     */
    EVENT_MARKER_CHANGED: "changed",

    /**
     *  Occurs when the mouse is used to click the pushpin, polyline, or map.
     */
    EVENT_MOUSE_CLICK: "click",

    /**
     * Occurs when the mouse is used to double click the pushpin, polyline, or map.
     */
    EVENT_MOUSE_DBLCLICK: "doubleclick",

    /**
     *  Occurs when the left mouse button is pressed when the mouse is over the pushpin, polyline, or map.
     */
    EVENT_MOUSE_DOWN: "mousedown",

    /**
     * Occurs when the mouse cursor moves out of the area covered by the pushpin, polyline, or map.
     */
    EVENT_MOUSE_OUT: "mouseout",

    /**
     * Occurs when the mouse is over the pushpin, polyline, or map.
     */
    EVENT_MOUSE_OVER: "mouseover",

    /**
     * Occurs when the left mouse button is lifted up when the mouse is over the pushpin, polyline, or map.
     */
    EVENT_MOUSE_UP: "mouseup",

    /**
     * Occurs when the right mouse button is used to click the pushpin, polyline, or map.
     */
    EVENT_MOUSE_RIGHT_CLICK: "rightclick",

    /**
     * Occurs when the map view starts changing.
     */
    EVENT_MAP_VIEW_CHANGE_START: "viewchangestart",

    /**
     * Occurs when the map view is done changing.
     */
    EVENT_MAP_VIEW_CHANGE_END: "viewchangeend",

    EVENT_MAP_ZOOM_CHANGED: "zoomchanged",

    EVENT_MAP_IDLE: "idle",

    EVENT_DRAG_START: "dragstart",

    EVENT_DRAG_END: "dragend",

    EVENT_DRAGGING: "dragging",

    EVENT_TARGET_MAP: "map",

    EVENT_TARGET_MARKER: "marker",

    EVENT_TARGET_POLYLINE: "polyline",

    EVENT_TOGGLE_HEATMAP_ITEMS: "toggleHeatmapItems",

    /**
     * The layer upon which polylines are drawn.
     */
    LAYER_POLYLINES: "polylineLayer",

    /**
     * The entity index of the layer upon which start and end markers are placed.
     */
    LAYER_TERMINUS: "terminusLayer",

    /**
     * The layer upon which markers OTHER than distance, start and end markers are placed.
     */
    LAYER_MARKERS: "markerLayer",

    /**
     * The layer upon which distance markers are placed.
     */
    LAYER_DISTANCE_CLOSE: "distanceLayerClose",
    LAYER_DISTANCE_MEDIUM: "distanceLayerMedium",
    LAYER_DISTANCE_FAR: "distanceLayerFar",
    LAYER_DISTANCE_MAX: "distanceLayerMax",

    heatmapPreferences: null,
    heatmapFolderDataList: null,
    heatmapRenderedTileDataList: new Object(),
    activityType: "",

    /**
     * Given a set of points, return an array of two Garmin.Map.Point
     * representing the minimum and maximum lat/long values.
     *
     * @param points - An array of Garmin.Map.Points
     * @return - Set of three Garmin.Map.Points.
     * minimum = min lat/lon Garmin.Map.Point,
     * maximum = max lat/lon Garmin.Map.Point
     * center = avg lat/lon  Garmin.Map.Poin (for center)
     */
    findMinMaxPoints: function(points) {
        if (typeof(points) != 'undefined' && points != null && points.length > 0) {
            var sumLat = 0;
            var sumLon = 0;
            var minLat = null;
            var minLon = null;
            var maxLat = null;
            var maxLon = null;
            var point = null;
            for (var i = 0; i < points.length; i++) {
                point = points[i];
                sumLat += point.lat;
                sumLon += point.lon;
                if (maxLat ==  null || point.lat > maxLat) {
                    maxLat = point.lat;
                }
                if (minLat == null || point.lat < minLat) {
                    minLat = point.lat;
                }
                if (maxLon ==  null || point.lon > maxLon) {
                    maxLon = point.lon;
                }
                if (minLon == null || point.lon < minLon) {
                    minLon = point.lon;
                }
            }
            var results = {
                minimum:  new Garmin.Map.Point(minLat,minLon),
                maximum:  new Garmin.Map.Point(maxLat, maxLon),
                center: new Garmin.Map.Point(sumLat/points.length, sumLon/points.length)
            }
        }
        return results;
    },

    calculateDistanceOfPoints: function(points, isMetric) {
        var distance = 0;
        if (typeof(points) != 'undefined') {
            var start;
            var end;
            var limit = points.length - 1;
            for (var i = 0; i < limit; i++) {
                start = points[i];
                end = points[i+1];
                distance += this.calculateDistanceBetweenPoints(start, end, isMetric);
            }
        }
        return distance;
    },

    /**
     * From http://www.movable-type.co.uk/scripts/latlong.html.
     *  Returns the distance from this point to the supplied point, in km
     * (using Haversine formula)
     *
     * from: Haversine formula - R. W. Sinnott, "Virtues of the Haversine",
     *       Sky and Telescope, vol 68, no 2, 1984
     * @param point1 - Starting Garmin.Map.Point.
     * @param point2 - Ending Garmin.Map.Point.
     * @param  isMetric - True for kilometers, otherwise, miles
     * @return Distance between points.
     */
    calculateDistanceBetweenPoints: function(point1, point2, isMetric) {
      if (typeof(point1) == 'undefined') {
            throw "point 1 is required";
        }
        if (typeof(point2) == 'undefined') {
            throw "point 2 is required";
        }
        var radius = Garmin.Map.Utils.RADIUS_MILES
        if (isMetric) {
            radius =  Garmin.Map.Utils.RADIUS_KILOMETERS;
        }
        var dLat = (point2.lat - point1.lat).toRad();
        var dLon = (point2.lon - point1.lon).toRad();

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat.toRad()) * Math.cos(point2.lat.toRad()) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return radius * c;
//        var dx = Math.cos(point1.lat) * dLon;
//        return  radius * Math.sqrt((dLat*dLat) + (dx*dx));
    },

    /**
     * Calculates the bearing of a line.
     * See http://www.movable-type.co.uk/scripts/latlong.html
     * @param start - starting Garmin.Map.Point.
     * @param end - Ending Garmin.Map.Point.
     * @param longitude2 - longitude of ending point.
     */
    calculateBearingOfPoints: function(start, end) {
            if (typeof(start) == 'undefined') {
                throw "start is required";
            }
            if (typeof(end) == 'undefined') {
                throw "end is required";
            }
            var lat1 = start.lat.toRad();
            var lat2 = end.lat.toRad();
            var dLon = (end.lon-start.lon).toRad();
            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1)*Math.sin(lat2) -
                  Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
            return Math.atan2(y, x).toDeg();
    },

    /**
     * Calculates a destination point a certain distance from a starting point
     * along a given bearing.
     * See http://www.movable-type.co.uk/scripts/latlong.html
     *  @param point - Starting Garmin.Map.Point in degrees.
     * @param dist - The distance to the destination
     * @param bearing - The bearing of the destination point from the starting point in degrees.
     * @param isMetric
     * @return Destination Garmin.Map.Point.
     */
    calculateDestinationPoint: function(point, dist, bearing, isMetric){
        if (typeof(point) == 'undefined') {
            throw "point 1 is required";
        }
        if (typeof(dist) == 'undefined') {
            throw "Distance is required";
        }
        if (typeof(bearing) == 'undefined') {
            throw "Bearing is required";
        }
        var radius = Garmin.Map.Utils.RADIUS_MILES; // miles
        if (isMetric) {
            radius = Garmin.Map.Utils.RADIUS_KILOMETERS; // km
        }
        var brng = bearing.toRad();
        var lat1 = point.lat.toRad();
        var lon1 = point.lon.toRad();

        var angularDistance = dist/radius;
        var lat2 = Math.asin( Math.sin(lat1)*Math.cos(angularDistance) +
                              Math.cos(lat1)*Math.sin(angularDistance)*Math.cos(brng) );

        var lon2 = lon1 + Math.atan2(Math.sin(brng)*Math.sin(angularDistance)*Math.cos(lat1),
                                     Math.cos(angularDistance)-Math.sin(lat1)*Math.sin(lat2));

        lon2 = (lon2+3*Math.PI)%(2*Math.PI) - Math.PI; // normalise to -180...+180
        return new Garmin.Map.Point(lat2.toDeg(), lon2.toDeg())
    },

    /**
     * The purpose of this method is to test whether a given point
     * falls exactly between two other points.
     * @param prevPoint - Garmin.Map.Point of first point.
     * @param middlePoint - Garmin.Map.Point of point to be tested.
     * @param nextPoint - Garmin.Map.Point of last point
     * @return - True if the middle point falls between the first and last points.
     */
    isExactlyBetweenPoints: function(prevPoint, middlePoint, nextPoint) {
        if (typeof(buffer) == 'undefined') {
            buffer = 0;
        }
        var isLatBetween = false;
        var isLonBetween = false;
        // Find any exact matches
        if (prevPoint.lat < nextPoint.lat) {
            isLatBetween = prevPoint.lat <= middlePoint.lat && middlePoint.lat <= nextPoint.lat;
        } else {
            isLatBetween =  prevPoint.lat >= middlePoint.lat && middlePoint.lat >= nextPoint.lat;
        }
        if (prevPoint.lon < nextPoint.lon) {
            isLonBetween = prevPoint.lon <= middlePoint.lon && middlePoint.lon <= nextPoint.lon;
        } else {
            isLonBetween =  prevPoint.lon >= middlePoint.lon && middlePoint.lon >= nextPoint.lon;
        }
        return isLatBetween && isLonBetween;
    },

        /**
     * The purpose of this method is to test whether a given point
     * falls roughly between two other points.
     * @param prevPoint - Garmin.Map.Point of first point.
     * @param middlePoint - Garmin.Map.Point of point to be tested.
     * @param nextPoint - Garmin.Map.Point of last point
     * @param buffer - (optional) A positive float tolerance for error
     * @return - True if the middle point falls between the first and last points.
     */
    isRoughlyBetweenPoints: function(prevPoint, middlePoint, nextPoint, buffer) {
        if (typeof(buffer) == 'undefined') {
            buffer = 0;
        }
        var isLatBetween = false;
        var isLonBetween = false;
        // Find any exact matches
        if (prevPoint.lat < nextPoint.lat) {
            isLatBetween = prevPoint.lat <= middlePoint.lat && middlePoint.lat <= nextPoint.lat;
        } else {
            isLatBetween =  prevPoint.lat >= middlePoint.lat && middlePoint.lat >= nextPoint.lat;
        }
        if (prevPoint.lon < nextPoint.lon) {
            isLonBetween = prevPoint.lon <= middlePoint.lon && middlePoint.lon <= nextPoint.lon;
        } else {
            isLonBetween =  prevPoint.lon >= middlePoint.lon && middlePoint.lon >= nextPoint.lon;
        }
        var latBuffer = buffer;
        var lonBuffer = buffer*2;
        // If not both true, using exact matches, continue using buffer.
        if (!(isLatBetween && isLonBetween)) {
            var diff1 = 0;
            var diff2 = 0;
            // See if other measure is within the allowable buffer NEAR either the two points. For example, clicking below a horizontal line
            // will be below (less than) the longitude of both points, not in between
            if (!isLonBetween) {
                diff1 = Math.abs(prevPoint.lon - middlePoint.lon);
                diff2 = Math.abs(nextPoint.lon - middlePoint.lon);
                isLonBetween = diff1 < lonBuffer && diff2 < lonBuffer;
            } else if (!isLatBetween) {
                diff1 = Math.abs(prevPoint.lat - middlePoint.lat);
                diff2 = Math.abs(nextPoint.lat - middlePoint.lat);
                isLatBetween = diff1 < latBuffer && diff2 < latBuffer;
            }
        }
        return isLatBetween && isLonBetween;
    },

        /**
     * This function is from Google's polyline utility.
     * @param encodedSamples - The encodedSamples attribute from GPolyline
     */
    decodeLine: function (encodedSamples) {

      var index = 0;
      var decodedSamples = [];
      var lat = 0;
      var lng = 0;
      if (encodedSamples && encodedSamples != undefined) {
          var len = encodedSamples.length;
          while (index < len) {
            var charVal;
            var offset = 0;
            var value = 0;
            do {
              charVal = encodedSamples.charCodeAt(index++) - 63;
              value |= (charVal & 0x1f) << offset;
              offset += 5;
            } while (charVal >= 0x20);
            var decodedLat = ((value & 1) ? ~(value >> 1) : (value >> 1));
            lat += decodedLat;

            offset = 0;
            value = 0;
            do {
              charVal = encodedSamples.charCodeAt(index++) - 63;
              value |= (charVal & 0x1f) << offset;
              offset += 5;
            } while (charVal >= 0x20);
            var decodedLng = ((value & 1) ? ~(value >> 1) : (value >> 1));
            lng += decodedLng;

            decodedSamples.push([lat * 1e-5, lng * 1e-5]);
          }
      }
      return decodedSamples;
    },

        /**
     * Calculates time as the quotient of distance/speed.
     * If either are zero then zero is returned.
     * @param distance - The distance traveled
     * @param speed - The speed in units per hour
     * @return distance/speed
     */
    calculateTime: function(distance, speed) {
       if (distance == 0 || speed == 0) {
           return 0;
       }
       return distance/speed;
    },

    /**
     * Calculates speed as the quotient of distance/time.
     * If either are zero then zero is returned.
     * @param distance - The distance traveled
     * @param time - The time to travel the given distance
     * @return distance/time
     */
    calculateSpeed: function(distance, time) {
       if (distance == 0 || time == 0) {
           return 0;
       }
       return distance/time;
    },

    formatTime: function(totalSeconds) {

       // Time is format to seconds, so round to the nearest second before formatting. This avoids
       // rounding errors when formatting time like 59.999999
       totalSeconds = Math.round(totalSeconds);

       var rval = new Array();
       var hours =  Math.floor(totalSeconds/3600);
       if (hours > 0)  {
           rval.push(hours);
           rval.push(":")
       }
       var minutes =  Math.floor((totalSeconds - (hours * 3600)) / 60);
       if (minutes < 10 && totalSeconds >= 3600) {
           rval.push(0);
       }
       rval.push(minutes);
       rval.push(":");
       var seconds =  Math.floor(totalSeconds - (hours * 3600) - (minutes * 60));
       if (seconds < 10) {
           rval.push(0);
       }
       if (seconds.length > 2) {
           seconds = seconds.substring(2);
       }
       rval.push(seconds);
       return rval.join("");
    },

    /**
     * Formats a float for display
     * @param value - The number to format
     * @param numberFormat (optional) 'decimal_comma', EU format, or 'decimal_period', default
     */
    formatFloat: function(value, numberFormat) {
      var rval = "";
      if (typeof(value) != 'undefined') {
        rval = value.toFixed(2);
        var lastDigit = rval.substr(rval.length - 1 );
        if (lastDigit == '0') {
            rval = rval.substr(0, rval.length - 1 );
            lastDigit = rval.substr(rval.length - 1 );
        }
      }
      if (typeof(numberFormat) == 'undefined' || numberFormat != 'decimal_comma') {
        return this.addNumberSeparators(rval, ',', '.');
      }
      return this.addNumberSeparators(rval, '.' , ',');
    },

    /**
     * Formats a float as a speed value. Speed is rounded to the nearest 10th.
     * @param value - The number to format
     * @param numberFormat (optional) 'decimal_comma', EU format, or 'decimal_period', default
     */
    formatSpeed: function(value, numberFormat) {
        var rval = "";
        if (typeof(value) != 'undefined') {
            rval = value.toFixed(1);
        }

        // Don't remove trailing zero if rounding to nearest 10th.
        if (typeof(numberFormat) == 'undefined' || numberFormat != 'decimal_comma') {
           return this.addNumberSeparators(rval, ',', '.');
         }
        return this.addNumberSeparators(rval, '.' , ',');
    },

    /**
     * Adds thousands separator and decimal place to number. Assumes that
     * input String does not have any thousands separator and is using a
     * period as the decimal place.
     *
     * http://www.mredkj.com/javascript/numberFormat.html
     * @param nStr
     * @param thousandsSeparator - Character used for thousands Separator
     * @param decimalPlace - Character used for decimal place
     */
    addNumberSeparators: function (nStr, thousandsSeparator, decimalPlace)
    {
        var x;
        nStr += '';
        x = nStr.split('.');
        var x1 = x[0];
        var x2 = x.length > 1 ? decimalPlace + x[1] : '';
        var rgx = /(\d+)(\d{3})/;
        while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + thousandsSeparator + '$2');
        }
        return x1 + x2;
    },

    getCityFolderMatchesForBoundingBoxAndActivityType:function(northwest_point, southeast_point, activityType, performRenderedTileCheck, x, y, zoom) {
        if (Garmin.Map.Utils.heatmapFolderDataList == null) {
            if (Garmin.Map.Utils.heatmapPreferences == null) {
                Garmin.Map.Utils.getHeatMapPreferences();
            }
            Garmin.Map.Utils.heatmapFolderDataList = Garmin.Map.Utils.getAllHeatMapFolderData(Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion);
        }
        var cityName = '';
        var cityNames = new Array();
        if (Garmin.Map.Utils.heatmapFolderDataList != null
            && Garmin.Map.Utils.heatmapFolderDataList.length > 0) {
            for(var i = 0; i < Garmin.Map.Utils.heatmapFolderDataList.length; i++) {
                var heatmapData = Garmin.Map.Utils.heatmapFolderDataList[i];
                var cityLatLngNW = new Garmin.Map.Point(heatmapData.boundBoxNWLatitude, heatmapData.boundBoxNWLongitude, 0);
                var cityLatLngSE = new Garmin.Map.Point(heatmapData.boundBoxSELatitude, heatmapData.boundBoxSELongitude, 0);
                if (cityNames.size() < 3
                    && heatmapData.activityType == activityType
                    && Garmin.Map.Utils.doBoundingBoxesIntersect(northwest_point, southeast_point, cityLatLngNW, cityLatLngSE)) {
                    if (performRenderedTileCheck) {
                        if (Garmin.Map.Utils.doTileCoordindatesHaveRenderedTilesForFolderName(x, y, zoom, heatmapData.folderName, heatmapData.folderId)) {
                            cityName = heatmapData.folderName;
                            cityNames.push(cityName);
                        }
                    } else {
                        cityName = heatmapData.folderName;
                        cityNames.push(cityName);
                    }
                }
            }
        }

        return cityNames;
    },

    getCityFolderMatchesForLocationAndActivityType:function(x, y, zoom, activityType, performRenderedTileCheck) {
        var nwLatLng = Garmin.Map.Utils.minPointToLatLng(x, y, zoom);
        var seLatLng = Garmin.Map.Utils.maxPointToLatLng(x, y, zoom);
        var northwest_point = new Garmin.Map.Point(nwLatLng.lat(), nwLatLng.lng(), 0);
        var southeast_point = new Garmin.Map.Point(seLatLng.lat(), seLatLng.lng(), 0);
        return Garmin.Map.Utils.getCityFolderMatchesForBoundingBoxAndActivityType(northwest_point, southeast_point, activityType, performRenderedTileCheck, x, y, zoom);
    },

    getGlobalFolderMatchesForLocationAndActivityType:function(x, y, zoom, activityType, performRenderedTileCheck) {
        if (Garmin.Map.Utils.heatmapFolderDataList == null) {
            if (Garmin.Map.Utils.heatmapPreferences == null) {
                Garmin.Map.Utils.getHeatMapPreferences();
            }
            Garmin.Map.Utils.heatmapFolderDataList = Garmin.Map.Utils.getAllHeatMapFolderData(Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion);
        }
        var cityName = '';
        var cityNames = new Array();
        if (Garmin.Map.Utils.heatmapFolderDataList != null
            && Garmin.Map.Utils.heatmapFolderDataList.length > 0) {
            for(var i = 0; i < Garmin.Map.Utils.heatmapFolderDataList.length; i++) {
                var heatmapData = Garmin.Map.Utils.heatmapFolderDataList[i];
                if (cityNames.size() < 3
                    && heatmapData.activityType == activityType
                    && heatmapData.boundBoxNWLatitude == 0) {
                    if (performRenderedTileCheck) {
                        if (Garmin.Map.Utils.doTileCoordindatesHaveRenderedTilesForFolderName(x, y, zoom, heatmapData.folderName, heatmapData.folderId)) {
                            cityName = heatmapData.folderName;
                            cityNames.push(cityName);
                        }
                    } else {
                        // override for quick local testing. Rendered tile check was put in place to avoid 403s as we only produce tiles that we have heat for
                        cityName = heatmapData.folderName;
                        cityNames.push(cityName);
                    }
                }
            }
        }

        return cityNames;
    },

    doTileCoordindatesHaveRenderedTilesForFolderName:function(x, y, zoom, foldername, folderid) {
        var renderedTilesExistForFolderName = false;
        if (Garmin.Map.Utils.heatmapRenderedTileDataList[folderid] == null) {
            Garmin.Map.Utils.heatmapRenderedTileDataList[folderid] = Garmin.Map.Utils.getHeatMapRenderedTileDataForFolder(foldername);
        }
        if (Garmin.Map.Utils.heatmapRenderedTileDataList[folderid] != null
            && Garmin.Map.Utils.heatmapRenderedTileDataList[folderid].length > 0) {
            for(var i = 0; i < Garmin.Map.Utils.heatmapRenderedTileDataList[folderid].length; i++) {
                var heatmapRenderedTileData = Garmin.Map.Utils.heatmapRenderedTileDataList[folderid][i];
                if (heatmapRenderedTileData.tileZoomLevel == zoom
                    && heatmapRenderedTileData.tileXCoordinate == x
                    && heatmapRenderedTileData.tileYCoordinate == y) {
                    renderedTilesExistForFolderName = true;
                    return renderedTilesExistForFolderName;
                }
            }
        }

        return renderedTilesExistForFolderName;
    },

    populateTileUrls: function (cityNames, tileBaseUrl, zoom, google_coord, tileUrls) {
        if (cityNames != null && cityNames.size() > 0) {
            if (cityNames[2] != null) {
                var tileUrl2 = tileBaseUrl + Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion + "/" + cityNames[2] +
                    "/" + zoom + "/tile_" + google_coord.x + "_" + google_coord.y + ".png";
                tileUrls.push(tileUrl2);
            }
            if (cityNames[1] != null) {
                var tileUrl1 = tileBaseUrl + Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion + "/" + cityNames[1] +
                    "/" + zoom + "/tile_" + google_coord.x + "_" + google_coord.y + ".png";
                tileUrls.push(tileUrl1);
            }
            if (cityNames[0] != null) {
                var tileUrl0 = tileBaseUrl + Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion + "/" + cityNames[0] +
                    "/" + zoom + "/tile_" + google_coord.x + "_" + google_coord.y + ".png";
                tileUrls.push(tileUrl0);
            }
        }
    },

    getHeatMapPreferences: function() {
        jQuery.ajax({
            type: 'GET',
            contentType: 'application/json',
            async: false,
            url: '/proxy/image-service/heatmapservice/heatmap/pref',
            cache: true,
            success: function(response, xhr) {
                Garmin.Map.Utils.heatmapPreferences = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                if (xhr.status == 401) {
                    // ok. user is not signed in
                } else {
                    Garmin.Map.Utils.log('Error finding heatmap preference data. Status=', xhr.status, ', status text=', xhr.statusText);
                }
            }
        });
        return Garmin.Map.Utils.heatmapPreferences;
    },

    getAllHeatMapFolderData: function(version) {
        var heatMapFolderData = null;
        jQuery.ajax({
            type: 'GET',
            contentType: 'application/json',
            async: false,
            url: '/proxy/image-service/heatmapservice/heatmap/folders/' + version + '?' + version,
            cache: true,
            success: function(response, xhr) {
                heatMapFolderData = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                Garmin.Map.Utils.log('Error finding heatmap folder data for version=', version, '. Status=', xhr.status, ', status text=', xhr.statusText);
            }
        });
        return heatMapFolderData;
    },

    getHeatMapRenderedTileDataForFolder: function(foldername) {
        var heatMapRenderedTileData = null;
        jQuery.ajax({
            type: 'GET',
            contentType: 'application/json',
            async: false,
            url: '/proxy/image-service/heatmapservice/heatmap/tiles/' + foldername + '?' + Garmin.Map.Utils.heatmapPreferences.heatmapActiveVersion,
            cache: true,
            success: function(response, xhr) {
                heatMapRenderedTileData = response;
            },
            error: function(xhr, ajaxOptions, thrownError) {
                Garmin.Map.Utils.log('Error finding heatmap rendered tile data for foldername=', foldername, '. Status=', xhr.status, ', status text=', xhr.statusText);
            }
        });
        return heatMapRenderedTileData;
    },

    log: function() {
        if (typeof console !== 'undefined' && typeof console.log !== 'undefined') {
            if (jQuery.browser.msie) {
                var str = "";
                for (var i = 0; i < arguments.length; i++) {
                    str += arguments[i] + ", ";
                }
                str = str.substring(0, str.length - 2); // remove the ", "
                console.log(str);
            } else { // real browser
                console.log(arguments);
            }
        }
    },

    getHeatMapUrls: function(x, y, zoom) {
        var google_coord = Garmin.Map.Utils.getNormalizedCoord(x, y, zoom);
        if (!google_coord) {
            return null;
        }

        var tileUrls = new Array();

        var tileBaseUrl = Garmin.Map.Utils.heatmapPreferences.s3Url + Garmin.Map.Utils.heatmapPreferences.heatmapBaseBucketName + "/";

        if (zoom >= Garmin.Map.Utils.heatmapPreferences.heatmapCityZoomLevelStart) {
            var cityNames = Garmin.Map.Utils.getCityFolderMatchesForLocationAndActivityType(x, y, zoom, Garmin.Map.Utils.activityType, Garmin.Map.Utils.heatmapPreferences.performRenderedTileCheck);
            Garmin.Map.Utils.populateTileUrls(cityNames, tileBaseUrl, zoom, google_coord, tileUrls);
        } else if (zoom >= Garmin.Map.Utils.heatmapPreferences.heatmapGlobalZoomLevelStart) {
            var globalNames = Garmin.Map.Utils.getGlobalFolderMatchesForLocationAndActivityType(x, y, zoom, Garmin.Map.Utils.activityType, Garmin.Map.Utils.heatmapPreferences.performRenderedTileCheck);
            Garmin.Map.Utils.populateTileUrls(globalNames, tileBaseUrl, zoom, google_coord, tileUrls);
        }
        return tileUrls;

    },

    // Normalizes the coords that tiles repeat across the x axis (horizontally)
    // to ensure we have Google map tile coordinates
    getNormalizedCoord: function (x, y, zoom) {
        // tile range in one direction range is dependent on zoom level
        // 0 = 1 tile, 1 = 2 tiles, 2 = 4 tiles, 3 = 8 tiles, etc
        var tileRange = 1 << zoom;

        // don't repeat across y-axis (vertically)
        if (y < 0 || y >= tileRange) {
            return null;
        }

        // repeat across x-axis
        if (x < 0 || x >= tileRange) {
            x = (x % tileRange + tileRange) % tileRange;
        }

        return {
            x: x,
            y: y
        }
    },

    // Determines whether two bounding boxes intersect (Garmin.Map.Point model is used)
    doBoundingBoxesIntersect:function(bb1_northwest, bb1_southeast, bb2_northwest, bb2_southeast) {

        var rabx = Math.abs(bb1_northwest.lon + bb1_southeast.lon - bb2_northwest.lon - bb2_southeast.lon);
        var raby = Math.abs(bb1_northwest.lat + bb1_southeast.lat - bb2_northwest.lat - bb2_southeast.lat);

        var raxPrbx = bb1_southeast.lon - bb1_northwest.lon + bb2_southeast.lon - bb2_northwest.lon;
        var rayPrby = bb1_northwest.lat - bb1_southeast.lat + bb2_northwest.lat - bb2_southeast.lat;

        if(rabx <= raxPrbx && raby <= rayPrby)
        {
            return true;
        }
        return false;
    },

    // Returns min (northwest corner of the box) lat lon for a given Tile coordinate
    minPointToLatLng:function(x, y, zoom) {

        var minPixelX = x * 256;
        var minPixelY = y * 256;
        return Garmin.Map.Utils.fromPointToLatLng(minPixelX, minPixelY, zoom);
    },

    // Returns max (southeast corner of the box) lat lon for a given Tile coordinate
    maxPointToLatLng:function(x, y, zoom) {

        var maxPixelX = (x + 1) * 256 - 1;
        var maxPixelY = (y + 1) * 256 - 1;
        return Garmin.Map.Utils.fromPointToLatLng(maxPixelX, maxPixelY, zoom);
    },

    // Converts a pixel from pixel XY coordinates at a specified level of detail
    // into latitude/longitude WGS-84 coordinates (in degrees).
    // <param name="pixelX">X coordinate of the point, in pixels.</param>
    // <param name="pixelY">Y coordinates of the point, in pixels.</param>
    // <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    // to 23 (highest detail).</param>
    // <param name="latitude">Output parameter receiving the latitude in degrees.</param>
    // <param name="longitude">Output parameter receiving the longitude in degrees.</param>
    fromPointToLatLng:function(pixelX, pixelY, zoom) {

        var mapSize = Garmin.Map.Utils.mapSize(zoom);
        var calc_x = (Garmin.Map.Utils.clip(pixelX, 0, mapSize - 1) / mapSize) - 0.5;
        var calc_y = 0.5 - (Garmin.Map.Utils.clip(pixelY, 0, mapSize - 1) / mapSize);
        var latitude = (90 - 360 * Math.atan(Math.exp(-calc_y * 2 * Math.PI)) / Math.PI).toFixed(3);
        var longitude = (360 * calc_x).toFixed(3);
        return new google.maps.LatLng(latitude, longitude);
    },

    // Determines the map width and height (in pixels) at a specified level
    // of detail.
    // <param name="levelOfDetail">Level of detail, from 1 (lowest detail)
    // to 23 (highest detail).</param>
    // <returns>The map width and height in pixels.</returns>
    mapSize:function(levelOfDetail)
    {
        var mapSize = ((256 << levelOfDetail) >>> 0);
        return mapSize;
    },

    // Clips a number to the specified minimum and maximum values.
    // <param name="n">The number to clip.</param>
    // <param name="minValue">Minimum allowable value.</param>
    // <param name="maxValue">Maximum allowable value.</param>
    // <returns>The clipped value.</returns>
    clip:function (n, minValue, maxValue)
    {
        return Math.min(Math.max(n, minValue), maxValue);
    }

}