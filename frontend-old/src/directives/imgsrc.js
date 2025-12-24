//so altera uma imagem que o src mudou depois que baixar a imagem

export default {

    bind: function (el, binding, vnode) {

        var valor = binding.value;
        el.src = valor;
    },

    update:function(el, binding, vnode) {
        var valor = binding.value;
        var img = new Image();   
        img.onload = function(){
            el.src = valor;
        };
        img.src = valor; 
    },

}