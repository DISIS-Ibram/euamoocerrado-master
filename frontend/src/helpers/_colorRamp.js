// import fromToInterpolation from './_fromToIntepolation';


export default function( valorMin, valorMax, valor, cores=[]){

    if(cores.length == 0){
        // cores = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB",
        // "#63FF9B", "#63FF6B", "#7BFF63", "#BBFF63", "#DBFF63", "#FBFF63",
        // "#FFD363", "#FFB363", "#FF8363", "#FF7363", "#FF6364","#FF0000"];
        cores = ["#6363FF", "#6373FF", "#63A3FF", "#63E3FF", "#63FFFB", "#63FFCB", "#63FF6B", "#7BFF63", "#FBFF63", "#FFB363", "#FF8363", "#FF7363", "#FF6364","#FF0000"];
    }

    return cores[Math.round(_.fromToInterpolation(valorMin,valorMax,0,cores.length-1,valor,true))]
}