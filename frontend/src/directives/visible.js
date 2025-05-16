
var func = function(el, binding, vnode) {
    var valor = binding.value;
    var isVisible = 'hidden'
    if(valor==true){
        isVisible = 'visible'
    }
    el.style.visibility = isVisible
}

export default {
    bind: func,
    update: func
}