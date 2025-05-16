<template>
        <span class='dropdown'>
            <span class='dropdown-link'>
               <slot> <i class='fa fa-sort-amount-desc sort-icon'></i> </slot>
            </span>

            <ul class=''>
                <li @click="onClick(option)" v-for='option in options' :key="option.value" :class='{active: selected.value == option.value}'> {{option.label}} </li>
            </ul>

        </span>

</template>

<script>
    export default{

        data(){
            return { 
                selected:{ value:'' } 
            }
        },

        props:{
            options:{
                devault: ()=>[ {value:'',label:'----'} ]
            },
        },

        methods:{
            onClick:function(option){
                this.selected = option;
                this.$emit('input', this.selected)
                this.$emit('change', this.selected)
            }
        }
    }

</script>

<style lang='stylus'>
     @import "../css/variaveis";

span.dropdown{

    .dropdown-link{
        display:inline-block;
        padding-bottom:10px;
    }
    ul{
        &:before{
            seta(7px,white,top,90%)
        }
        display:none;
        position:absolute;
        z-index:1000
        min-width:160px;
        max-height 300px;
        overflow:auto;
        padding:10px 0px;
        right:0;
        background:white;
        border-radius:10px 0 10px 10px;
        list-style:none;
        li{
            padding:5px 10px;
            color:gray;
            cursor:pointer;
            
            &.active{
                color:black;
                font-weight bolder
            }
        }

    }

    &:hover{
        ul{
            display:block !important;
        }
    }
}


</style>