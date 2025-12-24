// import  Tooltip from 'tooltip.js'

var tippy = require('tippy.js');
var a = require('tippy.js/dist/tippy.css')

export default {

    tip:null,

    bind: function (el, binding, vnode) {
        var texto;
        var valor = binding.value;
        var delay = _.get(binding,'arg',100);

        var defaults = {size:'big',
                        arrow:true,
                        sticky:true,
                        delay:[delay,10],
                        position:'bottom',
                        theme: 'transparent'
                        }
        
        if(_.isObject(valor)){
            defaults = {defaults,...valor}
            if(_.has(options,'title')){
                el.setAttribute('title', options.title)
            }
        }else{
            el.setAttribute('title', valor)
        }
     
        vnode.tip = tippy(el, defaults)

    },

    unbind: function (el, binding, vnode) {
            // vnode.tip.destroy()
    }

}