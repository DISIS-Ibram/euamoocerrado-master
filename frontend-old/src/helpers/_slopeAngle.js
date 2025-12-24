export default function( coord1, coord2){
    var horizontalDistance = measureDistance(coord1, coord2, 'kilometres')*1000;
    var verticalDistance = coord2[2] - coord1[2]
    return Math.atan2(verticalDistance, horizontalDistance) * (180 / Math.PI);
}