<template>
<div>
    <div v-if='loading && showLoader' class='tc pt2 pb2'>
          <i class="fa fa-spinner fa-pulse fa-2x fa-fw"></i>
    </div>
    <div v-show='!loading' ref="htmlcontent" class='ajaxcontent'>

    </div>
    </div>
</template>


<script>

   export default {
    data () {
        return {
            loading: false,
            post: null,
            error: null,
        }
    },

    props:{
        url:{
            default:'',
        },
        showLoader:{
            default:true,
        }
    },

    created () {
        this.fetchData();
    },

    watch: {
        // call again the method if the route changes
        '$route':function (to, from) {
            this.fetchData();
        },
    },



    methods: { 

        fetchData () {

            this.error = this.post = null;
            this.loading = true;
            var url;
            let urltemp = this.url+""

            if(urltemp.indexOf("//") > 1 ){
                url = this.url 
            }else{
                url =  `${this.api.apiurl}administracao/textohome/?identificador=${this.url}`
            }
            



            $.ajax({
                type: "get",
                url: url,
                dataType: "json",
                success:  (response)=> {
                    this.loading = false
                    let textoFinal = "";
                    _.each(response.results, item=>{
                        textoFinal += "<h1>"+item.titulo+"</h1>";
                        textoFinal += "<div>"+item.texto+"</div>";
                    })

                    // this.post = textoFinal //
                    this.parseHtml(textoFinal);
                    this.$emit('loaded')
                },
                error: (err)=>{
                        this.error = err.toString();
                        this.post = "Ocorreu um Erro!!!"
                        this.$emit('loaded')
                        this.$emit('error')
                },
            });
        },

        parseHtml:function(html){
                var htmlFinal = html.replace(/\/remote\//g,`${this.api.server}remote/`); //converto as imagens
                this.$nextTick(()=>{
                    $(this.$refs.htmlcontent).html(htmlFinal);
                    $(this.$refs.htmlcontent).find('a').each((i,item)=>$(item).attr('target','_blank'))
                })
        }


    }
    }

</script>


<style lang="stylus">
    @import "../css/variaveis"
  
    .ajaxcontent{
        color:white;
        text-align:left;
        a{
            color:#193435;
        }
    }


</style>
