//cria um link para uma pagina

export default {

    bind: function(el, binding, vnode) {

        // var valor = binding.value;
        // el.style.overflow = `hidden`;


        vnode.context.$nextTick(function() {

            setTimeout(() => {
                var wrap = $(el).wrap("<div style='overflow:hidden;width:100%;height:100%'></div>")
                $(wrap).mCustomScrollbar({
                    theme: "dark",
                    scrollbarPosition: "inside",
                    autoHideScrollbar: true,
                    mouseWheel: { preventDefault: true },
                    advanced: { updateOnContentResize: true }
                });
            }, 0)
        })

    },

    // update: function(el, binding, vnode) {

    // // var valor = binding.value;
    // el.style.overflow = `hidden`;


    // vnode.context.$nextTick(function() {
    //     $(el).mCustomScrollbar({
    //         theme: "dark",
    //         scrollbarPosition: "inside",
    //         autoHideScrollbar: true,
    //         mouseWheel: { preventDefault: true },
    //         advanced: { updateOnContentResize: true }
    //     });
    // })

    // },

}