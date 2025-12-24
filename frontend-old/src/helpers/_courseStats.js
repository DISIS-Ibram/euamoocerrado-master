import lineDistance from '@turf/length'
import distance from '@turf/distance'




function sum(a) {
    var s = 0;
    for (var i = 0; i < a.length; i++) s += a[i];
    return s;
} 
 


function variance(array) {
    var mean = avg(array);
    return avg(array.map(function(num) {
        return Math.pow(num - mean, 2);
    }));
}

function standardDeviation(array) {
    return Math.sqrt(variance(array));
}


function degToRad(a) {
    return Math.PI / 180 * a;
}
 
function meanAngleDeg(a) {
    return 180 / Math.PI * Math.atan2(
        sum(a.map(degToRad).map(Math.sin)) / a.length,
        sum(a.map(degToRad).map(Math.cos)) / a.length
    );
}

// var sum = function(array) {
//     var num = 0;
//     for (var i = 0, l = array.length; i < l; i++) num += array[i];
//     return num;
// }

var avg = function(array) {
    return sum(array) / array.length;
}


export default function(GeoJson){
    
    if( _.get(GeoJson,'geometry.type','') != 'LineString' )
        return false

    var distUp = 0;
    var distDown = 0;
    var slope = [];
    var difficult = [];
    var alt = [];
    var pointsGeoJson = GeoJson.geometry.coordinates;
    var courseDistance = lineDistance(GeoJson)

    for (let i = 1; i < pointsGeoJson.length; i++) {
        const p0 = pointsGeoJson[i-1];
        const p1 = pointsGeoJson[i];
        var horizontalDistance = distance(p0, p1, {units:'kilometres'})*1000;
        //make sure both have height.
        //if just one have, use it from another point
        if(p0[2] || p1[2]){
            p0[2] = p0[2] || p1[2]
            p1[2] = p1[2] || p0[2]
        }
        if(p1[2]){
            var verticalDistance = p1[2] - p0[2];
            if (verticalDistance > 0){
                distUp += horizontalDistance;
            }
            else{
                distDown += horizontalDistance;
            }
            alt.push(p0[2])


            //LETODO - slot is not making sence
            slope.push( Math.atan2(verticalDistance, horizontalDistance) * (180 / Math.PI) )
            difficult.push( hikeDiff(horizontalDistance, verticalDistance) )
        }
    }
    

    // var verticalDistanceCourse = pointsGeoJson[pointsGeoJson.length-1][2] - pointsGeoJson[0][2];
    // var curseSlopeAngle = Math.atan2(verticalDistanceCourse, courseDistance) * (180 / Math.PI)
    


function hikeDiff(dist, gain) {
        //convert km to mile
        // dist = dist*0.621371
        //convert gian km to feet
        // gain = gain*3280.84
        // dist=eval(form.dist.value);
        // gain=eval(form.gain.value);
        var diff=(((((gain/(dist*5280)*100)*5.5)+(Math.sqrt((dist*dist)*6))))/2.5);
            // console.log(`dist ${dist.toFixed(2)}  gain ${gain.toFixed(2)}  difficult ${diff.toFixed(2)}`);
        if(gain == 0) return 0
        return diff
        // form.hikediff.value = diff;
        // hike2 = form.hikediff.value;
        // form.hikediff.value = Math.round(hike2);
}


    //
    slope =  _.remove(slope, n=> _.isNaN(n) === false && n !== 0 )
    difficult =  _.remove(difficult, n=> _.isNaN(n) === false )

    var difficultSum = difficult.reduce(function(a, b) { return a + b; });
    var difficultavg = difficultSum / difficult.length;
    // console.log(`Sum:${difficultSum}  Avarage:${difficultavg}`)

        // console.log(difficult);
    // console.log(slope)
    var slopeStdDev = standardDeviation(slope)
    return {    
        dificult:hikeDiff(courseDistance, distUp-distDown),
        dist_up: distUp,
        dist_down: distDown,
        max_slope: avg(slope) + 2*slopeStdDev,
        min_slope: avg(slope) - 2*slopeStdDev,
        avg_slope: avg(slope),
        avg_angle: avg(slope) * (180 / Math.PI),
        max_alt: Math.max.apply(null, alt),
        min_alt: Math.min.apply(null, alt),
        avg_alt: avg(alt),
        diffficult: avg(difficult),
    }

}