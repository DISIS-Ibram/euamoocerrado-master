<template>

    <span class='popup-wrapper' :data-titulo="titulo" :class="{popupRef:popupRef !== undefined, refoutside:$slots.trigger == undefined}">

        <div ref='trigger' class='trigger' @click='abrePopup'>
            <slot name="trigger">
            </slot>
        </div>

        <div v-if="aberto" class='ui-popup' :style="{'background-color':corFundo, width:width}" :class="{'fade-left': effect=='fade-left', 'fade': effect=='fade', bottom:posicao=='bottom',right:posicao=='right'}"
            ref="popup">

            <!-- <close-button ref="closebutton" class='close-popup' @click="clickCloseButton"></close-button> -->

            <div v-if="popupRef===undefined" ref="seta" :style="{'border-color':corFundo}" class='ui-seta'></div>

            <div v-show="$_.isObject(popupRef)" class='voltar-menu-item toolbar ui-menu-item' @click.prevent.stop="fechaPopup()">
                <i class='fa fa-arrow-left'></i>
                <span class='textovoltar' v-if="!titulo.match(/popup_/)" v-html="titulo"></span>
            </div>

            <div v-show="$slots.toolbar" class='voltar-menu-item toolbar ui-menu-item'>
                <slot name="toolbar"></slot>
            </div>

            <div  class="popup-content" ref="popup_content" :style="{width:width}">

                <div>
                    <!-- div for mscrollb ar work when it changes sise -->
                    <slot></slot>
                    <slot name="content"></slot>
                    <slot name="dropdown"></slot>
                </div>
            </div>

        </div>

    </span>

</template>

<script>
    import Popper from 'popper.js';

    export default {
        name: 'popup',

        data() {
            return {
                aberto: false,
                minHeight: 'initial',
                popupRef: undefined,
                maxHeight: 1,
                _id: 0,
            }
        },

        props: {

            // cor do fundo
            corFundo: {
                type: String,
                default: 'white'
            },
            effect: {
                type: String,
                default: 'fade-left' //[none, fade-left, fade]
            },

            titulo: {
                default: _.uniqueId('popup_')
            },

            //cor do texto do popup
            corTexto: {
                type: String,
                default: 'white'
            },

            // como é acionado - [click ou hover]
            trigger: {
                type: String,
                required: false,
                default: 'click'
            },

            offset: {
                type: Number,
                required: false,
                default: 0
            },

            //elemento que abre o popup
            triggerRef: {
                type: [Object, HTMLElement],
                default: undefined,
            },

            //  a largura
            width: {
                type: String,
                default: '300px',
            },

            //a posicao
            posicao: {
                type: String,
                default: 'right' //[right,bottom]
            },

            meta: null,

            //se esta aberto ou não
            open: {
                type: Boolean,
                default: false,
            },

            disable: {                type: Boolean,
                default: false,
            },

            //se quando clico fora do popup, propaga o evento ou não
            propagaClickFora: {
                type: Boolean,
                default: true,
            },

            fechaQuandoClica: {
                type: Boolean,
                default: false,
            },

            fechaQuandoClicaFora: {
                type: Boolean,
                default: true,
            },

            //se quando o trigger elemente move de lugar, fecho ou nao o popup
            fechaTriggerRefMudaPos: {
                type: Boolean,
                default: false,
            },

            //maximo de subpopups que podem abrir para a mesma direcao.
            //uma vez alcancado esse numero, abro o popup novo no mesmo lugar do popup pai
            maximoPopupFilhos: {
                default: undefined
            },

            // keep popup max height.
            //if it contents change, and is small than before, will not change its height.
            //useful for content that cam be filter, for example
            keepMaxHeight: {
                type: Boolean,
                default: false,
            }

        },

        created: function () {
            this.aberto = this.open;
        },

        mounted: function () {
            this.$nextTick(() => {

                // setInterval(this.atualizaDimencaoPopup, 30)

                // VERIFICO OS POPUPS PAIS
                var popupsPais = this.popupsPais;
                var maximoFilhos = 0;
                var maximoFilhosIndex = -1;

                //pego o ultimo popup que define o maximo de popup filhos pode ter
                for (var i = 0; i < popupsPais.length; i++) {
                    var popupEl = popupsPais[i];

                    if (popupEl.$props.maximoPopupFilhos) {
                        maximoFilhos = popupEl.$props.maximoPopupFilhos;
                        maximoFilhosIndex = i;
                    }
                }

                //aqui verifico se já esta dentro da condicao de ser popupfilho
                if ((maximoFilhosIndex !== -1) && (popupsPais.length - maximoFilhosIndex) >= maximoFilhos) {
                    this.popupRef = _.last(this.popupsPais)
                }

                this.atualizaDimencaoPopup();

                if (navigator.userAgent.search("Firefox") > 0) {
                    $(this.$el).on('wheel', (ev) => {
                        console.log('********* mousewhellll')
                        ev.stopPropagation();

                        ev.preventDefault();
                        return false
                    });
                }   

        
                // var closeButton = this.$refs.closebutton

                // $(this.$refs.popup).get(0).addEventListener("mousemove", 
                
                //             (ev)=>{ 
                //                 ev.preventDefault();
                //                 ev.stopImmediatePropagation();
                //                 var bbox = this.$refs.popup.getBoundingClientRect();
                //                 if( bbox.left < ev.clientX && bbox.right > ev.clientX){
                //                     $(closeButton.$el).addClass('active');
                //                 }else{
                //                     $(closeButton.$el).removeClass('active');
                //                 }
                //             }

                // , true);



                // $(this.$refs.popup).get(0).addEventListener("mouseleave", 
                
                //             (ev)=>{ 
                             
                //                 var bbox = this.$refs.popup.getBoundingClientRect();
                //                 if( bbox.left < ev.clientX && bbox.right > ev.clientX){
                //                    // $(closeButton.$el).addClass('active');
                //                 }else{
                //                     $(closeButton.$el).removeClass('active');
                //                 }
                //             }

                // , true);

                // $(this.$refs.popup).on('mousemove mouseleave',  (ev)=>{ 
                //     ev.preventDefault();
                //     ev.stopImmediatePropagation();
                //     var bbox = this.$refs.popup.getBoundingClientRect();
                //     if( bbox.left < ev.clientX && bbox.right > ev.clientX){
                //         $(closeButton.$el).addClass('active');
                //     }else{
                //         $(closeButton.$el).removeClass('active');
                //     }
                // })



            })
        },

        updated: function () {

            this.$nextTick(() => this.atualizaDimencaoPopup())
        },

        //before destroy tb removo os listnes, caso o pop up seja destruido e nao fechado
        beforeDestroy: function () {
            document.body.removeEventListener('click', this.clickoutside, true);
            document.body.removeEventListener('mouseup', this.clickoutside, true);
            window.removeEventListener("resize", this.atualizaDimencaoPopup, false);

        },

        computed: {

            triggerElement: function () {
                if (this.triggerRef != undefined) {
                    return this.triggerRef;
                } else {
                    return this.$refs.trigger;
                }
            },

            //VOLTA TODOS OS COMPONENTES 
            popupsPais: function () {
                var pais = [];
                var ref = this;
                while (ref.$parent) {
                    if (ref.$parent.$options.name == 'popup') {
                        pais.push(ref.$parent)
                    }
                    ref = ref.$parent;
                }
                return pais.reverse(); //assim garanto a ordem
            },
        },


        watch: {
            triggerRef: function () {
                if (this.triggerRef) {
                    if (this.trigger == 'click') {
                        this.triggerRef.addEventListener('click', this.abrePopup, false);
                    } else if (this.trigger == 'hover' || this.trigger == 'over') {
                        //LETODO - fazer over, move e out funcionar, aplicando tecnica de timeout fora da area para usabilidade
                        
                        this.triggerRef.addEventListener('mouseover', this.abrePopup, false);
                        this.triggerRef.addEventListener('mouseout', this.fechaPopup, false);
                    }
                }
            },

            open: function () {
                this.aberto = this.open;
                this._id = Math.random();
            },

            //quando o open muda, crio scrollbar no popup
            aberto: function () {

                if (this.aberto === true) {

                    // Intervalo para verificar se o elemento trigger mudou de lugar
                    var _this = this;
                    _this.triggerPos = this.pegaTriggerPosition();
                    this.intervaloCheckPosicaoTrigger = setInterval(() => {
                        var triggerPosicaoAtual = this.pegaTriggerPosition();
                        if (_this.triggerPos.y !== triggerPosicaoAtual.y) {

                            if (this.fechaTriggerRefMudaPos) {
                                this.fechaPopup();
                            } else {
                                _this.triggerPos = triggerPosicaoAtual;
                                _this.atualizaDimencaoPopup()
                                console.log("Atualizou")
                            }
                        }
                    }, 40)

                    this.$nextTick(function () {
                        this.iniciaScrollBar();
                    })

                    document.body.addEventListener('click', this.clickoutside, true);
                    //para não funcionar no click do mapa tb;
                    document.body.addEventListener('mouseup', this.clickoutside, true);

                    $(this.$refs.popup).on({
                        keydown: (e) => {
                            if (e.which === 27) {
                                this.fechaPopup();
                                e.preventDefault();
                            }
                        }
                    });

                    window.addEventListener("resize", this.atualizaDimencaoPopup, false);

                } else {

                    document.body.removeEventListener('click', this.clickoutside, true);
                    document.body.removeEventListener('mouseup', this.clickoutside, true);
                    window.removeEventListener("resize", this.atualizaDimencaoPopup, false);
                    clearInterval(this.intervaloCheckPosicaoTrigger);

                    this.maxHeight = 0;

                }
            }

        },

        methods: {

            abrePopup: function () {
                if (this.disable === false) {
                    this.aberto = true;
                    this.$emit('open');
                }
            },

            fechaPopup: function () {
                this.aberto = false;
                this.$emit('close');
            },

            iniciaScrollBar: function () {

                //previno, quando o popup não precisar de scrollbar,
                // que a rolagem nele suba apra o pai
                this.$refs.popup_content.onmousewheel = function (e) {
                    // this.$refs.popup_content.scrollTop -= e.wheelDeltaY; 
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }

                $(this.$refs.popup_content).mCustomScrollbar({
                    theme: "dark",
                    scrollbarPosition: "inside",
                    autoHideScrollbar: true,
                    mouseWheel: {
                        preventDefault: true
                    },
                    advanced: {
                        updateOnContentResize: true,
                        updateOnSelectorChange: "ul li"
                    }
                });

            },

            atualizaDimencaoPopup: function () {

                if (this.aberto === false) return false;
                // ;
                if (this.popupRef) {
                    this.atualizaDimencaoPopupRef()
                } else if (this.posicao == 'bottom') {
                    this.atualizaDimencaoPopupBottom()
                } else {
                    this.atualizaDimencaoPopupRight();
                }

            },

            atualizaDimencaoPopupRef: function () {

                if (this.aberto === false) return false;

                if (this.$refs.popup === undefined) {
                    return false
                }

                //DEFINO MEUS ELEMENTOS
                var popup = this.$refs.popup;
                var conteudo = this.$refs.popup_content;
                var seta = this.$refs.seta;

                //reseto para a posicao iniciao, pois considero ela para os calculos sempre
                var popupStyle = {
                    top: 'initial',
                    bottom: 'initial',
                    left: 'initial',
                    backgroundColor: this.corFundo,
                    width: this.width,
                }
                $(popup).css(popupStyle);
                $(seta).removeClass('flip');

                //DEFINO VARIAVEIS QUE VOU USAR
                var triggerBB = this.pegaTriggerPosition();
                var popupBB = popup.getBoundingClientRect();

                var popupRefBB = this.popupRef.$refs.popup.getBoundingClientRect();

                var alturaConteudo = conteudo.scrollHeight;
                if ($(conteudo).find('.mCSB_container').length > 0)
                    alturaConteudo = $(conteudo).find('.mCSB_container')[0].scrollHeight


                var larguraJanela = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                var alturaJanela = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                var popupStyle = {
                    top: popupRefBB.top,
                    width: popupRefBB.width,
                    height: popupRefBB.height,
                    minHeight: popupRefBB.height + 20, //garanto que nunca vai ser menor
                    left: popupRefBB.left,
                }

                //vejo se altura conteudo é maior que o popup ref
                if (alturaConteudo > popupRefBB.height) {

                    //CONTROLE DE POSICAO NA ALTURA
                    //vejo se a altura do container é maior que o window, se for coloco ele do top ate o buttom
                    if (alturaConteudo > alturaJanela) {
                        popupStyle.top = "20px";
                        popupStyle.bottom = "20px";
                        popupStyle.height = "initial";
                        popupStyle.minHeight = "initial";
                        //se for menor, 
                    } else {
                        //vejo se cabe da altura atual ate o final do window
                        if (popupRefBB.top + alturaConteudo < alturaJanela) {
                            popupStyle.top = popupRefBB.top + "px";
                            popupStyle.height = alturaConteudo + 20 + 45 + "px"; //45 o tamanho do header

                            //se não couber, eu subo o top do container ate caber
                        } else {
                            // var diferencaTamanho = (triggerBB.top + alturaConteudo) - alturaJanela;
                            popupStyle.top = "initial";
                            popupStyle.height = alturaConteudo + 20 + "px";
                            popupStyle.bottom = "20px";
                        }
                    }

                }

                $(popup).css(popupStyle);
                $(this.$refs.popup_content).mCustomScrollbar('update')

            },

            atualizaDimencaoPopupRight: function () {

                if (this.aberto === false) return false;

                if (this.$refs.popup === undefined) {
                    return false
                }
                //DEFINO MEUS ELEMENTOS
                var popup = this.$refs.popup;
                var conteudo = this.$refs.popup_content;
                var seta = this.$refs.seta;

                //reseto para a posicao iniciao, pois considero ela para os calculos sempre
                var popupStyle = {
                    top: 'initial',
                    bottom: 'initial',
                    left: 'initial',
                    backgroundColor: this.corFundo,
                    width: this.width,
                }

                $(popup).css(popupStyle);
                $(seta).removeClass('flip');

                //DEFINO VARIAVEIS QUE VOU USAR
                var triggerBB = this.pegaTriggerPosition();
                var popupBB = popup.getBoundingClientRect();

                var alturaConteudo = conteudo.scrollHeight;
                if ($(conteudo).find('.mCSB_container').length > 0)
                    alturaConteudo = $(conteudo).find('.mCSB_container')[0].scrollHeight


                if (this.keepMaxHeight) {
                    if (alturaConteudo < this.maxHeight) {
                        alturaConteudo = this.maxHeight;
                    } else {
                        this.maxHeight = alturaConteudo;
                    }
                }

                var larguraJanela = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                var alturaJanela = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                // if( ! (triggerBB.top >= 0 && triggerBB.left >= 0 && triggerBB.bottom <= alturaJanela && triggerBB.right <= larguraJanela) ){
                //     this.fechaPopup();
                //     return false;
                // }

                //CONTROLE DE POSICAO NA ALTURA
                //vejo se a altura do container é maior que o window, se for coloco ele do top ate o buttom
                if (alturaConteudo > alturaJanela) {
                    popupStyle.top = "20px";
                    popupStyle.bottom = "20px";
                    //se for menor, 
                } else {
                    //vejo se cabe da altura atual ate o final do window
                    if (triggerBB.top + alturaConteudo < alturaJanela) {
                        popupStyle.top = triggerBB.top + "px";
                        //se não couber, eu subo o top do container ate caber
                    } else {
                        // var diferencaTamanho = (triggerBB.top + alturaConteudo) - alturaJanela;
                        popupStyle.top = "initial";
                        popupStyle.height = alturaConteudo + 20 + "px";
                        popupStyle.bottom = "20px";
                    }
                }

                //CONTROLE DE POSICAO NA LARGURA
                // se a largura do popup é maior que a largura da janela;
                if (larguraJanela < popupBB.width) {
                    popupStyle.left = "5px";
                    popupStyle.right = "5px";
                    popupStyle.width = "initial";

                    //se nao for
                } else {
                    // se a lateral mais a largura do popup cabe ja janela
                    if (triggerBB.right + popupBB.width > larguraJanela) {
                        //se não cabe, mexo para a esquerda
                        var diferencaLargura = (triggerBB.right + popupBB.width) - larguraJanela;
                        popupStyle.left = "initial";
                        popupStyle.right = "5px";
                        // popupStyle.width = popupBB.width+diferencaLargura+"px";
                        //se cabe
                    } else {
                        popupStyle.left = triggerBB.right + 10 + this.offset + "px";
                    }
                }

                //posiciono o popup
                $(popup).css(popupStyle);

                //POSITIONO A SETA
                //a seta é a posicao do trigger menos a posicao topo do popupStyle
                popupBB = popup.getBoundingClientRect();
                var setaTop = (triggerBB.top + triggerBB.height / 2) - popupBB.top - 10; // 5 metade da seta


                if (setaTop < 5) setaTop = 20;
                if (setaTop >= popupBB.height) setaTop = setaTop - 35;

                $(seta).css({
                    top: setaTop + "px",
                    marginTop: '0',
                })

                $(this.$refs.popup_content).mCustomScrollbar('update')
            },


            atualizaDimencaoPopupBottom: function () {

                if (this.aberto === false) return false;

                //DEFINO MEUS ELEMENTOS
                var popup = this.$refs.popup;
                var conteudo = this.$refs.popup_content;
                var seta = this.$refs.seta;

                //reseto para a posicao iniciao, pois considero ela para os calculos sempre
                var popupStyle = {
                    top: 'initial',
                    bottom: 'initial',
                    left: 'initial',
                    height: 'initial',
                    backgroundColor: this.corFundo,
                    width: this.width,
                }

                $(popup).css(popupStyle);

                $(seta).addClass('normal').removeClass('flip');

                //DEFINO VARIAVEIS QUE VOU USAR
                var triggerBB = this.pegaTriggerPosition();
                var popupBB = popup.getBoundingClientRect();

                var alturaConteudo = conteudo.scrollHeight;
                if ($(conteudo).find('.mCSB_container').length > 0)
                    alturaConteudo = $(conteudo).find('.mCSB_container')[0].scrollHeight


                var larguraJanela = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
                var alturaJanela = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

                // if( ! (triggerBB.top >= 0 && triggerBB.left >= 0 && triggerBB.bottom <= alturaJanela && triggerBB.right <= larguraJanela) ){
                //     this.fechaPopup();
                //     return false;
                // }

                // Pego a altura maxima do popup

                var alturaAbaixoPopup = alturaJanela - triggerBB.bottom;
                var alturaAcimaPopup = triggerBB.top;

                var localizacaobottom = (alturaJanela - triggerBB.top + 10);
                // var xmeio = triggerBB.left + (triggerBB.width/2) - 30 //-((triggerBB.width-popupBB.width)/2)  
                var xmeio = triggerBB.left + 10 // triggerBB.left + (triggerBB.width - popupBB.width ) + 10 //-((triggerBB.width-popupBB.width)/2)  

                //se cabe abaixo do item, coloco ele la ou  
                if (alturaConteudo < alturaAbaixoPopup) {

                    popupStyle.top = triggerBB.bottom + "px";
                    popupStyle.left = xmeio //-((triggerBB.right-popupBB.width)/2)+"px"; 
                    popupStyle.height = alturaConteudo;

                //se nao cabe, vejo se tem mais espaco em cima ou embaixo
                }else{

                    //mais emcima
                    if( triggerBB.top > alturaJanela - triggerBB.top ){
                        popupStyle.top = "20px";
                        popupStyle.bottom = localizacaobottom + "px"
                        popupStyle.height = alturaConteudo + "px";
                        popupStyle.left = xmeio + "px";
                        $(seta).removeClass('normal').addClass('flip');
                    //mais espaco abaixo
                    }else{
                        popupStyle.top = triggerBB.bottom + "px";
                        popupStyle.left = xmeio //-((triggerBB.right-popupBB.width)/2)+"px"; 
                        popupStyle.bottom = '20px';
                    }

                }
                //posiciono o popup
                $(popup).css(popupStyle);
            },



            pegaTriggerPosition: function (a) {
                var trigger;
                if (this.triggerRef != undefined) {
                    trigger = this.triggerRef;
                } else {
                    trigger = this.$refs.trigger;
                }
                if (trigger instanceof HTMLElement) {
                    return trigger.getBoundingClientRect();
                } else {
                    return {}
                }
            },

            clickCloseButton: function () {
                _.each(this.popupsPais, popupPai => {
                    popupPai.fechaPopup();
                })
                this.fechaPopup();
            },

            clickoutside: function (evt) {

                var cliqueiNoPopup = _.some(evt.path, d => d === this.$refs.popup);

                //se cliquei fora do popup
                if (cliqueiNoPopup === false) {

                    var cliqueiNotrigger = (_.some(evt.path, d => d === this.triggerElement) || false)

                    if (this.propagaClickFora == false || cliqueiNotrigger) {
                        evt.preventDefault();
                        evt.stopImmediatePropagation();
                        evt.stopPropagation();
                    }

                    this.fechaPopup()
                    this.$emit('clickOutside')

                    //se cliquei no popup
                } else {
                    if (this.fechaQuandoClica) {
                        this.fechaPopup();
                    }
                }

                //se estou clicando no elemento que abre o popup
                //fecho ele ignorando a propagacao de eventos
                // if(  _.some(evt.path, d => d===this.triggerElement)  ){
                //   
                if (evt.target === this.triggerElement) {

                    evt.stopPropagation();
                    evt.preventDefault();
                    evt.stopImmediatePropagation();
                    this.fechaPopup();
                }

            },

        },
    }
</script>

<style lang="stylus">
    @import "../css/variaveis";
    .trigger {
        display: block;
        position: relative;
    }

    .popup-wrapper {
        padding: 0;
        margin: 0;
        display: inline-block;
        &.refoutside {
            position: absolute;
        }
    }

    @keyframes fadeleft {
        from {
            opacity: 0;
            margin-left: -20px
        }
        to {
            opacity: 1;
            margin-left: 0
        }
    }

    @keyframes fade {
        from {
            opacity: 0 // margin-left:-20px;
        }
        to {
            opacity: 1 // margin-left:0;
        }
    }

    .ui-popup.fade-left {
        animation-name: fadeleft;
        animation-duration: 300ms;
    } //LETODO - verificar pq o fade nao funciona
    .ui-popup.fade {
        animation-name: fade;
        animation-duration: 300ms;
    }

    .ui-popup {
        position: fixed;
        width: 300px;
        min-height: 100px;
        background: cor-fundo-popup;
        left: 210px;
        margin-top: 0px;
        border-radius: 7px;
        text-align: left;
        padding-top: 10px;
        padding-bottom: 10px;
        box-shadow: -1px 3px 15px 0px rgba(0, 0, 0, 0.2);
        z-index: 40;
        display: flex;
        flex-direction: column;
        .popup-content {
            height: 100%;
            width: 100%;
            overflow: hidden;
        } // SETA ===============
        & .ui-seta {
            // content: '';
            width: 0px;
            height: 0px;
            position: absolute !important;
        }
        &.right {
            &>.ui-seta {
                margin-left: -20px;
                margin-top: 20px;
                border: 10px solid transparent;
                border-right: 10px solid #333;
                border-left-color: transparent !important;
                border-top-color: transparent !important;
                border-bottom-color: transparent !important;
            }
        }
        &.bottom {
            &>.ui-seta.normal {
                top: -20px;
                margin-left: 20px;
                border: 10px solid transparent;
                border-bottom: 10px solid #333;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-top-color: transparent !important;
            }
            &>.ui-seta.flip {
                bottom: -20px;
                top: initial !important;
                margin-left: 20px;
                border: 10px solid transparent;
                border-bottom: 10px solid #333;
                border-left-color: transparent !important;
                border-right-color: transparent !important;
                border-bottom-color: transparent !important;
            }
        }
        .header {
            border-bottom: 1px solid rgba(white, 0.2);
            padding: 10px 5px 10px 15px;
            .nome {
                font-size: 11px;
                opacity: 0.6;
            }
            .acoes {
                box r 40px t 15px w 80;
                right: 30px !important;
                text-align: right;
                i {
                    opacity: 0.6;
                    &:hover {
                        opacity: 0.9;
                    }
                }
            }
        }
    }

    .popup-wrapper.popupRef {
        .ui-popup {
            box-shadow: none;
        }
        .voltar-menu-item {
            // position:fixed;
            // background:#cccccc;
            width: 100%;
            border-bottom: 1px solid darken(white, 10%);
            color: gray;
            background: darken(white, 5%);
            margin-top: -10px;
            border-radius: 10px 10px 0 0;
            padding: 2em initial 2em initial !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            i {
                color: cor-azul;
            }
            span.textovoltar {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                display: inline-block;
                color: darken(white, 35%);
                font-weight: 600;
                padding-left: 1em;
                font-size: 14px;
            }
        }
        .popup-content {
            // margin-top:55px; //espacamento para o voltar-menu-item que vai ficar parado agora
        }
    }

    .close-popup {
        // display:none;
        opacity: 0;
        transition: all 200ms;
        &.active,&:hover {
                opacity: 1; 
        }
    }


  

    

</style>