
import bearing from "@turf/bearing";
import destination from "@turf/destination";
import measureDistance from "@turf/distance";
import { Feature, LineString, point, Point, Units } from "@turf/helpers";
import { getGeom } from "@turf/invariant";



var calculateSlopeAngle = function( coord1, coord2){
    var horizontalDistance = measureDistance(coord1, coord2, {units:'kilometres'})*1000;
    var verticalDistance = coord2[2] - coord1[2]
    return Math.atan2(verticalDistance, horizontalDistance) * (180 / Math.PI);
}



export default function( line, distance, options = {units: 'kilometres'}){
    // Get Coords
    const geom = getGeom(line);
    const coords = geom.coordinates;
    let travelled = 0;
    
    for (let i = 0; i < coords.length; i++) {
        if (distance >= travelled && i === coords.length - 1) { 
            break;
        } else if (travelled >= distance) {
            const overshot = distance - travelled;
            if (!overshot) { return point(coords[i]); //se o ponto é exatamente na distancia
            } else {
                const direction = bearing(coords[i], coords[i - 1]) - 180;
                const interpolated = destination(coords[i], overshot, direction, options);
                // return interpolated;

                var bigDist = measureDistance(coords[i], coords[i - 1], options);
                var shortDist = measureDistance(coords[i], interpolated, options);
                var factor = shortDist/bigDist;

                var z = coords[i][2] - (coords[i][2]-coords[i-1][2])*factor;
                interpolated.geometry.coordinates[2] = z;
                interpolated.properties['altitude'] =  z;
                var slopeAngle = calculateSlopeAngle(coords[i-1],coords[i]);
                interpolated.properties['slope'] = slopeAngle;

                return interpolated;

            }
        } else {
            travelled += measureDistance(coords[i], coords[i + 1], options);
        }
    }
    return point(coords[coords.length - 1]);
}






// export default function(line, distance, units) {
//     var coords;
//     if (line.type === 'Feature') coords = line.geometry.coordinates;
//     else if (line.type === 'LineString') coords = line.coordinates;
//     else throw new Error('input must be a LineString Feature or Geometry');
//     var travelled = 0;
//     for (var i = 0; i < coords.length; i++) {
//         if (distance >= travelled && i === coords.length - 1) break;
//         else if (travelled >= distance) {
//             var overshot = distance - travelled;
//             if (!overshot) return point(coords[i]);
//             else {
//                 var direction = bearing(coords[i], coords[i - 1]) - 180;
//                 var point3D = destination(coords[i], overshot, direction, units);

//                 // return point3D;

//                 var bigDist = measureDistance(coords[i], coords[i - 1], 'kilometres');
//                 var shortDist = measureDistance(coords[i], point3D, 'kilometers');
//                 var factor = shortDist/bigDist;
//                 var z = coords[i][2] - (coords[i][2]-coords[i-1][2])*factor;
//                 point3D.geometry.coordinates[2] = z;
//                 point3D.properties['altitude'] =  z;
//                 var slopeAngle = 0 //calculateSlopeAngle(coords[i-1],coords[i]);
//                 point3D.properties['slope'] = slopeAngle;


             

//                 return point3D;
//             }
//         } else {
//             travelled += measureDistance(coords[i], coords[i + 1], units);
//         }
//     }

//     return point(coords[coords.length - 1]);
// };