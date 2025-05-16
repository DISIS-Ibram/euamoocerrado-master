<template>

    <div ref="menu" class='ui-menu-item i3-menu-item' 
            :class="{semicone:!$slots.icone,
                    hover:hover,
                    disable:disable}" 
                    @click.capture="openToogle"
                    @hover="hover"
                    >
        
            <div v-if="$slots.icone" class="icone-esq">
                <slot name="icone"></slot>
            </div>
            
            <div class="conteudo" >
                <slot></slot>
            </div>

            <div class="icone-dir">
                <slot name="icone_dir"></slot>
                <i v-if="$_.has($slots,'submenu')" class='submenu fa fa-caret-right'></i>
            </div>

            <template v-if="$_.has($slots,'submenu')">
                <popup :titulo="titulo" :width="subMenuLargura" @close="fechaPopup" :triggerRef="$refs.menu" trigger="click" :offset="-10" :open="open" >
                    <template v-if="open">
                        <slot name="submenu">
                        </slot>
                    </template>
                </popup>
            </template>

    </div>

</template>





<script>
    
    export default {
        name: 'menu-item',
        
        data () {
            return {
                open:false,
                trigger:'hover',
            }
        },

        mounted:function(){
            this.$nextTick(()=>{
                 if( _.has(this.$listeners,'click') ){
                    //  
                     this.$el.addEventListener('click',this.$listeners.click,false)
                    //  this.$el.addEventListener('mouseover',()=>console.log("====click====="),false)
                 }
            })
        },

        props: {

            // cor do fundo
            icone: {
                type: [String,Boolean],
                default:true
            },
            //cor do texto do popup
            corTexto: {
                type: String,
                default:'white'
            },

            //define se muda a cor com mouse hover ou não
            hover: {
                type: Boolean,
                default:true
            },
         
            // como é acionado - [click ou hover]
            subMenu: {
                type: Boolean,
                default: false,
            },

            // largura do submenu popup
            subMenuLargura: {
                type: String,
                default: '300px',
            },

            disable: {
                type: Boolean,
                default: false,
            },
            
            //elemento que abre o popup
            triggerRef:{
                type:Object,
                default:undefined,
            },

            //  a largura
            largura:{
                type:String,
                default:'300px',
            },

            //a posicao
            posicao:{
                type:String,
                default:'right' //[right,bottom]
            },
            
            //a posicao
            titulo:{
                type:String,
                default:'menu-item' //[right,bottom]
            },

            meta:null,

            //se quando clico fora do popup, propaga o evento ou não
            propagaClickFora:{
                type:Boolean,
                default:true,
            }

        },

    

        watch:{
            disable:function(){
                if(disable === true){
                    this.$refs.menu.addEventListener("mousedown", this.ignoraClick, true);
                }else{
                    this.$refs.menu.removeEventListener("mousedown", this.ignoraClick);

                }
            },

            open:function(){
                
                if(open==true){
                    this.$emit('close');
                }else{
                    this.$emit('open');
                }
            }
        },


        methods:{
            openToogle:function(){
                if( _.has(this.$slots,'submenu') && this.open === false ){
                        this.open = true;
                        this.$emit('open')
                }
            },

            ignoraClick:function(ev){
                    ev.stopPropagation();
                    ev.stopImmediatePropagation()
                    ev.preventDefault();
            },

            fechaPopup:function(){
                
                // this.open = false;
            },

           
        }

    }
</script>




<style lang="stylus" >

    @import "../css/variaveis";

    



</style>