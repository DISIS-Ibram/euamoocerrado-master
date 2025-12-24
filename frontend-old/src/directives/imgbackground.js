//cria um link para uma pagina

export default {

    bind: function (el, binding, vnode) {
        
        var valor = binding.value;
        el.style.backgroundImage = `url('${valor}')`;
    },

    update:function(el, binding, vnode) {
        var valor = binding.value;
        var img = new Image();   
        img.onload = function(){
            el.style.backgroundImage = `url('${valor}')`;
        };
        img.src = valor; 
    },

}