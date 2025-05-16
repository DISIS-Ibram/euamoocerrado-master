import React from 'react';
import Sidebar from '../components/Sidebar';
import PageInterna from './PageInterna';
import RelatoTabela from 'components/tabela/RelatoTabela';
import {Menu, Icon, Header, Dropdown, Input, Label, Divider, Button } from 'semantic-ui-react';

import { si3, si3Actions }  from 'actions/index';
import {MidiaList} from '../components/formfields/InputColecaoMidia.js';

import {  Link } from 'react-router';

import carregaModelo  from 'hocs/carregaModelo';

import { connect } from 'react-redux';

import criaconsole from 'util/myconsole'
const _debug = true;
const myconsole = criaconsole(_debug,' *** MidiaPage.js | ', 'color:green;font-weight:bold')



/**
 * Home page component
 */
export default class MidiaListPage extends React.Component
{
    componentDidMount() {
    document.title = "SI3RC :: Mídias";
  }

   menu = ()=>{
        var activeItem = 'home';

        return(  
            <Menu secondary>
                {/*<Menu.Item as={Link} activeClassName='active' to="/relato/0" icon='add' name='Lista' />
                <Menu.Item as={Link} activeClassName='active' to="/relato/lista" icon="list" name='Mapa' />
                       */}
            </Menu>)


    }

    render()
    {
        return(
            <PageInterna nome="Mídias" icon='picture' icontipo='fa' menu={this.menu()}>
                
                <div className='' >
                           
                          <MidiaTabela  />
               
                </div>

            </PageInterna>
        );
    }
}









@connect(null,si3Actions)
class MidiaConteudoAdicional extends React.Component{
   
    static defaultProps = {
        modelo:'colecao',
        id:'0',
        include:'none',
        loader:false,
        force:true,
    }

    state = {
        depedencia:'',
    }
    
    
    componentDidMount(){

        si3.getDepedenciaMidia(this.props.midiaid).then(
            (obj)=>{
                 this.setState({depedencia:obj})
            }
        )
    
    }


    abrePopup = (modelo,id)=>{
            

           this.props.openModal( {nome:"modal"+modelo,
                              tipo:'form',
                              modelo:modelo,
                              id:parseInt(id),
                              onSave:()=>{
                                 //   this.props.load('solicitacaocriacaoregistro')  //recarrega modelo
                              },
                              value:{}} 
                            )
    }



    render(){

            var dependencia = ""

            if(_.isObject(this.state.depedencia) && !_.isEmpty(this.state.depedencia)){
                var dep = this.state.depedencia;
                var k = _.keys(dep)[0]
                var v = _.values(dep)[0]
                var nomeModelo = si3.util.getModelNome(k)
                //letodo - fazer pegar o nome do modelo do options 'processprops'
                dependencia = (<Button onClick={(e)=>this.abrePopup(k,v)}  color="orange" size='mini'> {""+nomeModelo.toString()}</Button>)
            }
         

            return (<div className='ta-l detalhes-externo-midias'>
             
                <div className='ta-l mt-1'><small> Utilizado em: <br /><b>{dependencia}</b> </small></div>
                </div>
             )
    }

}






@carregaModelo
class MidiaTabela extends React.Component{

    static defaultProps = {
        modelo:'midia',
        id:'all',
        include:'tags__nome',
        force:true,
    }

    state = {
            arquivo : '',
            id:0,
            carregando:true,
            enviando:false,
            addIndex:0,
            totalFiles:0,
            ultimoTotal:0,
            colunas:8,
            listStyle:false,
            listOpen:true,
            filtroTipo:'',
            filtroNome:'',
            filtroColecao:'',
            filtering:false,
            keyword:'',
            buscaKey:'tudo',
            itensFinal:'',
  }



  //eventos component
  //------------------

  showAllToogle = () =>{
      this.setState({listOpen:!this.state.listOpen})
  }

  changeColumnSize = (v) =>{
      this.setState({colunas:v})
  }

  componentDidMount() {
      this.geraItensFiltrados()
  }


  options = [
      {
        value: 'Filtrar',
        text: 'Tipo',
        children: <div><Icon name="" /> Todos </div>,
      },
      {
        value: 'Fotos',
        text: 'Fotos',
        children: <div><Icon name="file picture o" /> Fotos</div>,
      },
      {
        value: 'Audio',
        text: 'Audio',
         children: <div><Icon name="file audio o" /> Audio</div>,
      },
      {
        value: 'Videos',
        text: 'Videos',
        children: <div><Icon name="file video o" /> Videos</div>,
      },
        {
    
        value: 'Documentos',
        text: 'Docs.',
        children: <div><Icon name="file text o" /> Documentos</div>,
      },
  ]



  onChangeFilterTipo = (e, {name, value}) => {
            
          const tm = {'Filtrar':'',
                      'Fotos':0,
                      'Videos':1,
                      'Audio':2,
                      'Documentos':3
                    }


           let tipo = tm[value]
           this.setState({filtroTipo:tipo})
  }



  mudaBuscaKey = (e,data)=>{
    //   
      const key = _.trim(data.value);
      this.setState({buscaKey:key})


    //   this.filtraPorPalavra(this.state.keyword).then((data)=>{
    //           myconsole.log(" filtroPorPalavras | achados os ids: %o:", data);
    //           this.setState({itensFindByKeyword:data,filtering:false})
    //   })


  }
 

  onBusca =(e)=>{
        const palavra = _.trim(e.target.value);

        this.setState({keyword:palavra,filtering:true})

        this.filtraPorPalavra(palavra).then((data)=>{

                 myconsole.log(" filtroPorPalavras | achados os ids: %o:", data);
                 this.setState({itensFindByKeyword:data,filtering:false})
                 this.geraItensFiltrados()
        })
    }


  
  
  filtraPorConteudo = async (palavra) =>{

      var itensAchados;

   
      
      await si3.docSearch(palavra)
      .then((data)=>{
    
          
          itensAchados = _.filter(this.props.itens,(item)=> _.find( data, (v)=> v.id == item.id ) );           
      
    })

      return itensAchados

  }




  filtraPorPalavra = async (palavra) =>{
       //pego que campos eu filtro por palavra
       //faço um fuzzy searche
       //retorno os que aparecem
       
      myconsole.log(" filtroPorPalavras | chamando com palavra %s:", palavra);
       
      myconsole.log("vai procurar em %o",this.props.itens)

      var busca =  this.state.buscaKey;



      var itenAchados = []
      var itenAchados2 = [];
    //   
     
      if(busca == 'conteudo' || busca == 'tudo'){
          itenAchados = await this.filtraPorConteudo(palavra);
          myconsole.log("achou com conteudo %o",itenAchados)

      }

     if(busca === 'tudo'){
          busca =  ['arquivo','nome','autor','descricao','tags.nome']
     }
     if(busca != 'conteudo' ){
         itenAchados2 =  await si3.filterItens(this.props.itens, palavra, busca)
         myconsole.log("achou com palavras %o",itenAchados2)
     }

     var itensAchadosFinal = _.union(itenAchados,itenAchados2);

     myconsole.log("uniao %o", itensAchadosFinal);   
     
     return itensAchadosFinal;

  }



  geraItensFiltrados = ()=>{
    
    const { itensFindByKeyword,keyword } = this.state
    
    //aqui aplico os filtros normais
    var itens = this.props.itens
     
     //aqui aplico filtros do keyword
     if( ! _.isEmpty(itensFindByKeyword) && keyword !== ""){
      
        itens = _.filter(itens,(item)=> _.find( itensFindByKeyword, (v)=> v === item ) );
        
      }else if(_.isEmpty(itensFindByKeyword) && keyword !== ""){
          //não tenho itens
         itens = [];
      }

      this.setState({itensFinal:itens})
  }

 
 
 render(){


     const { itensFindByKeyword,keyword } = this.state

     const options = [
        { key: 'tudo', text: 'tudo', value: 'tudo' },
        { key: 'nome', children: (<Label color="gray" >nome mídia</Label>), text: 'nome', value: 'nome' },
        { key: 'autor', children: (<Label color="gray" >autor</Label>), text: 'autor', value: 'autor' },
        { key: 'descricao',children: (<Label color="gray" >descrição</Label>), text: 'descricao', value: 'descricao' },
        { key: 'tags', children: (<Label color="gray" >tags</Label>), text: 'tags', value: 'tags.nome' },
        { key: 'conteudo', children: (<Label color="blue" >conteúdo dos arquivos</Label>), text:'conteúdo', value: 'conteudo' },
        ]
  


    let classeOpen = (this.state.listOpen) ? 'fa-caret-up' : 'fa-caret-down';
    
    return (

        <div className='col-md-11 col-xs-12'>
    <div className='formulario'>

       <div className='ui InputColecaoMidia inputcolecalmidialista mb-100'  >

            <div className="ui colecao-midia-drop">
           
           {/*LINHA FILTROS*/}
            <div className="row start-xs middle-xs mr15 pb06 mb-2">
                  
              


                <div className="col-xs-5 ta-r">
                       <div className='ui busca '>
                     
                          <Input
                            fluid
                            className="normal"
                            loading={this.state.filtering}
                            icon='search'
                            iconPosition='left'
                            placeholder={'Buscar em '+this.state.buscaKey}
                            onChange={this.onBusca}
                            label={<Dropdown onChange={this.mudaBuscaKey} defaultValue={this.state.buscaKey} options={options} />}
                            labelPosition='right'
                          />


                                          
                     </div>

                </div>
                

                <div className="col-xs-1">
                       <Header as='h5' className='fl-r'>
                          <Icon name='filter' />
                          <Header.Content>
                            {' '}
                            <Dropdown inline  
                            onChange={this.onChangeFilterTipo}
                            options={this.options} 
                            defaultValue={this.options[0].value} />
                          </Header.Content>
                        </Header>
                </div>
                

                <div className="col-xs-5 end-xs middle-xs">
                       
                         <div className="row end-xs middle-xs ">

                              {!this.state.listStyle &&
                            
                              <div className='row middle-xs'>

                                <div className='col-xs mr05 pt20px'>
                                   <i className='fa fs09 fa-picture-o op05 iln mt05' />
                                </div>

                                <div className="col-45px mr05 ml05">
                                    <input className='' onChange={(e)=>this.changeColumnSize(e.target.value)} type="range" min="3" max="10" value={this.state.colunas} id="fader" />
                                </div>

                                <div className='col-xs mr05 pt20px'>
                                  <i className='fa  fs05 fa-picture-o op05 iln mt05' />
                                </div>
                              </div>
                              }

                              {!this.state.listStyle &&
                              <div onClick={()=>this.setState({listStyle:true})} className=' cp ml1 mr05 pt20px'>
                                 <i className='fs1 op05 iln mt05 fa fa-list' />
                              </div>
                              }

                              {this.state.listStyle &&
                              <div onClick={()=>this.setState({listStyle:false})} className=' cp ml1 mr05 pt20px'>
                                 <i className='fs1 op05 iln mt05 fa fa-th' />
                              </div>
                              }
                          </div>
                  </div>
            </div>





            <div className="bg-white02 h-bg-white08 t04 mt-4"  
              ref={(i)=>this.dropI = i} 
              style={{display:'block'}}
              onDoubleClick={this.showAllToogle}
              className='ui colecao-midia-drop'>

                <MidiaList colunas={this.state.colunas} ref={(el) => this.midiacontainer = el}
                                 midias={this.state.itensFinal} 
                                 listStyle={this.state.listStyle}
                                 listOpen={this.state.listOpen}
                                 filtroTipo = {this.state.filtroTipo}
                                 conteudoAdicionalMidia = { (elm)=>(<MidiaConteudoAdicional id={elm.colecao} midiaid={elm._id} />) }
                                 />

                         

                <div className="mt1 toolbar row">
                  
                  {/*<div ref={v=>this.seta = v }className='loat-left ta-r col-xs-6'>
                    <i onClick={this.showAllToogle} className={classeOpen+" mr--20px mt--30px fs2 op04 t02 h-cl-ae1 h-op1 fa fr"} ></i>
                  </div>*/}

                </div>

             


            </div>
          
        </div>
     </div>
    </div>

    </div>
    )

    }


}


