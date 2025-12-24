<template>


        
        <a :href="url" class='download' v-tooltip="'Fazer Download da Trilha'">
            <i class="fa fa-download" aria-hidden="true"></i>
        </a>               
       


</template>

<script>

import {urls} from '../api'

export default {

    data() {
        return {
            url: urls.apibase+`obterkmltrilha/?id=${this.id}`
        }
    },

    props: ['id']

}

</script>

<style lang='stylus'>
.download{
    width: 40px
    height:40px
    display:flex
    align-content center
    align-items center
    justify-content center
    border-radius 100%
    background: #00000080
    color:white
    text-decoration:none;
    text-decoration none !important
    &:hover{
          background: #00000080

    }
}

</style>