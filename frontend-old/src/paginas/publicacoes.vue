<template>

        <conteudo :ajax="false">
            <div class="ph4">
                <list-title title="Coleção eu Amo o Cerrado" />
                
                <div class="ph4">

                    <h3 class="mt4">Cerrado Dobrado</h3>
                    <hr/>
                    <div>
                        <a class="white" href="/images/cerrado_dobrado05dez2019.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Cerrado Dobrado</a>
                    </div>

                    <h3 class="mt4">Aves</h3>
                    <hr/>
                    <div>
                        <a class="white" href="/images/aves-cartaz.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Aves Cartaz</a>
                    </div>
                    <div>
                        <a class="white" href="/images/aves-folder.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Aves Folder</a>
                    </div>

                    <h3 class="mt4">Mamíferos</h3>
                    <hr/>
                    <div>
                        <a class="white" href="/images/mamiferos-cartaz.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Mamíferos Cartaz</a>
                    </div>
                    <div>
                        <a class="white" href="/images/mamiferos-folder.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Mamíferos Folder</a>
                    </div>
                
                    <h3 class="mt4">Frutos</h3>
                    <hr/>
                    <div>
                        <a class="white" href="/images/frutos-cartaz.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Frutos Cartaz</a>
                    </div>
                    <div>
                        <a class="white" href="/images/frutos-folder.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Frutos Folder</a>
                    </div>
                
                    <h3 class="mt4">Árvores</h3>
                    <hr/>
                    <div>
                        <a class="white" href="/images/arvores-cartaz.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Árvores Cartaz</a>
                    </div>
                    <div>
                        <a class="white" href="/images/arvores-folder.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Árvores Folder</a>
                    </div>
                    
                    <h3 class="mt4">Peixes</h3>
                    <hr/>
                    <div class='mb-5'>
                        <a class="white" href="/images/peixes-cartaz.pdf" target="_blank"> <i class="fa fa-file-pdf-o"></i> Peixes Cartaz</a>
                    </div>
                    <h3 class="mt4">Anfíbios</h3>
                    <hr/>
                    <div class='mb-5'>
                        <a class="white" href="/images/053368ad-cc6c-4434-81f2-4ad729e911c5.jpg" target="_blank"> <i class="fa fa-file-image-o"></i> Anfíbios do Cerrado</a>
                    </div>
                    <h3 class="mt4">FLores</h3>
                    <hr/>
                    <div class='mb-5'>
                        <a class="white" href="/images/1847790e-f9d9-4305-9466-a898f4b2760c.jpg" target="_blank"> <i class="fa fa-file-image-o"></i> Amarelas</a>
                    </div>
                    <div class='mb-5'>
                        <a class="white" href="/images/70d0b8f2-4d8a-49ca-928b-25d2a6d0ac1d.jpg" target="_blank"> <i class="fa fa-file-image-o"></i> Roxos e Azuis </a>
                    </div>
                    <div class='mb-5'>
                        <a class="white" href="/images/40e5a9fe-4f55-482f-ace5-08a09f9c2ac4" target="_blank"> <i class="fa fa-file-image-o"></i> Vermelhas e Alaranjadas </a>
                    </div>
                </div>


            </div>
        </conteudo>

</template>


<script>
    import Conteudo from './conteudo.vue'
    // import marked from 'marked'

    export default {
        data(){
            return {
                mudando:false
            }
        },

        components: {
            'conteudo':Conteudo
        },

        computed:{
        
        },




        watch:{
         
        },

       
        methods:{
        

        }


    }
    
</script>



<style lang="stylus">
    @import "../css/variaveis"


</style>