var EventEmitter = require('eventemitter3');
import util from "./util.js"


var lagoNormalRes = '/images/lago.png';
var lagoHeightRes = '/images/lago@4x.png';
var zoomThreshold = 18;

var TL = util.inverseMercator(0, 0)
var TR = util.inverseMercator(0, 2057.6)
var BL = util.inverseMercator(1865.6, 2057.6)
var BR = util.inverseMercator(1865.6, 0)
var coordinate = [ TL, TR, BL, BR];




export default class Lago extends EventEmitter {

    constructor(map, file) {
        super();
        this._map = map;
        this._lagoHeighResLoaded = false;
        // this.show()

    }

    show(time){
        
        this.createLayer("lagoNormal", lagoNormalRes);
        this._map.setLayerZoomRange("lagoNormal",0,22           )

        setTimeout( ()=>{
                var img = new Image();
                img.onload = ()=>{
                    this.createLayer("lagoHeight", lagoHeightRes, "lagoNormal");
                    //set zoom limits for the each lake layer
                    this._map.setLayerZoomRange("lagoNormal",0,14)
                    this._map.setLayerZoomRange("lagoHeight",14,22)
                }
                img.src=lagoHeightRes
        }, 10000)

    }


    createLayer(name,url, before = undefined){

        this._map.addLayer({
            id: name,
            source: {
                type: "image",
                url: url,
                coordinates: coordinate
            },
            type: 'raster',
            paint: {
                'raster-fade-duration':0,
                'raster-hue-rotate':30,
                'raster-opacity': {
                    "base": 1,
                    "stops": [
                        [9, 0.2],
                        [11, 1]
                    ]
                },
            },
        }, before)

    }

     


}