//cria um link para uma pagina
//quando retorno uma funcao é usado apra bind e update
export default  function(el, binding, vnode) {
        var valor = binding.value;
        el.style.cursor = `pointer`;
        var node = vnode;
        el.addEventListener('click', (el) => {
            
            if( valor.match(/^http/g) ){
                window.open(valor);
            }else{
            if (node.context.$router) {
                
                var router = node.context.$router;
                router.push(valor);
            }
            }
        }, false)
}
