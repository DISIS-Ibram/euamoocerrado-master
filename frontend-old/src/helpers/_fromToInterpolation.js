
export default function(fromMin, fromMax, toMin, toMax, value, limit=true){
    var a = (toMin - toMax)/(fromMin - fromMax);
    var b = toMin - (a*fromMin);
    var y = a*value + b;

    if(limit){
        if(value>fromMax) return toMax
        if(value<fromMin) return toMin
    }
    return y;
}