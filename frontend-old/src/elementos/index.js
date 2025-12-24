

// import { TweenMax } from "gsap";


export default {
    install: function(Vue, options) {

        Vue.$trad = function(palavra) {
            return palavra;
            var palavraTraduzida = window.$trad(palavra);
            if (palavraTraduzida == "" || palavraTraduzida == undefined) {
                return palavra;
            } else {
                return palavraTraduzida;
            }
        }
        Vue.$t = function(palavra) {
            return palavra;
            var palavraTraduzida = window.$trad(palavra);
            if (palavraTraduzida == "" || palavraTraduzida == undefined) {
                return palavra;
            } else {
                return palavraTraduzida;
            }
        }


        Vue.prototype.$trad = Vue.$trad;
        // window.t = Vue.$trad;

        Vue.prototype.$decode = window._.decode; //uso o decode que ja defini no main.js e coloquei no lodash

        // Vue.prototype.$t = Vue.prototype.$trad;

        // Vue.prototype.$TweenMax = window.TweenMax;

        //lodash acessivel via instancia
        Vue.prototype.$_ = window._;

    }
}