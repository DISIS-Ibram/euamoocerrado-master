// import Flickity from 'flickity'
var Flickity = require('flickity-imagesloaded');
import 'flickity/css/flickity.css'


export default {

    bind: function(el, binding, vnode) {
        let value = binding.value;
        if( !_.isObject(value)) value = {};

        let options = {
            setGallerySize: true,
            autoPlay: 7000,
            cellAlign: 'left',
            freeScroll: false,
            adaptiveHeight: false,
            imagesLoaded: true,
            contain: true,
            prevNextButtons: true,
            pageDots: true
            }

        vnode.context.$nextTick(function() {
            setTimeout( ()=>{
                    var flkty = new Flickity( el, {...options,...value} );
            },200)
        })

    },
}