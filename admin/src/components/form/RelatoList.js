import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';
import { Modal, Header, Label, List, Icon, Accordion, Input, Dimmer, Loader, Image, Segment, Button } from 'semantic-ui-react';
import * as _  from 'lodash';
import FlipMove from 'react-flip-move';
import { t, d }  from 'models/models';
import { si3, si3Actions }  from 'actions/index';
import StringMask from 'string-mask';
// import { ModalYesNo } from 'components/modals';
import * as util from 'util/s3util'
import { LayersMapa } from 'components/elements/InputText';
import { Map, Marker, Popup, TileLayer, LayersControl, FeatureGroup, Circle, GeoJSON } from 'react-leaflet';
import wkx from 'wkx'



export class RelatoList extends React.Component
{  

      
    defaultProps = {

    }

    state = {
        model:'relato',
        includeOnLoad:['estado','municipio'],
        carregando:true,
        filter:'',
        addindex:0,
        displayAsMap:false
    }


    constructor(props){
        super(props)
        // this.getFaseEtapa = this.getFaseEtapa.bind(this);
        this.removeItem = this.removeItem.bind(this);
    }

    componentDidMount() {
        let data = this.props.load(this.props.model,{},{include:'all'})
        data.then(()=>this.setState({carregando:false})) 
      
    }


    handleSubmit(values,modelo){
        this.props.save(modelo, values);
        return true;
   }

   // createModel(values){
   //      this.props.save(this.props.model, values);
   //      this.setState({filter:''})
   //      const i = this.state.addindex+1;
   //      this.setState({addindex:i})
   //      return true;
   // }

   removeItem(id,modelo,nome){

      // this.props.openModal('removerelato'+modelo+id,
      //           <ModalYesNo  
      //                 onYes={() => this.props.remove(modelo,{id:id}) } 
      //                 nome={'removerelato'+modelo+id}
      //                 titulo={"Deseja excluir relato: "+id+"?"}
      //                 icon="trash"
      //           />)
   }


   displayToggle = ()=>{

      this.setState({displayAsMap:!this.state.displayAsMap})

   }


   filterItem(nome){
        console.log(nome)
        // console.log(ev);
        this.setState({filter:nome});
   }


   toogle(e){
      
      let quem = e.currentTarget;
      let pai = $(quem).parent();
      if(pai.hasClass('close')){
          pai.css('max-height',pai[0].scrollHeight+400);
          pai.removeClass('close')
      }else{
        pai.addClass('close')
      }

   }

   openAll(){
      $('.sublist.close').removeClass('close');
   }

   closeAll(){
      $('.sublist').addClass('close');
   }



   render() { 
       
    
            const itens = this.props.items;



            if(_.isObjectLike(itens)){


             return (
                <div className="pessoasList">

                    <Button color='brown' size="tiny" as={Link} to="/relatos/0"> <Icon  name='add' /> Adicionar Relato</Button>

                    {/*<UsuarioForm model="usuarios" />*/}


                    <div className="row middle-xs">
                        
                        <div className="col-xs-6">                    
                          <Input placeholder='Procurar' fluid onChange={(e)=>this.filterItem(e.target.value)} />
                        </div>
                        <div className="col-xs-6 ta-r link cl-p05 h-cl-ae07 trans">
                            <i className='fa fa-map' onClick={this.displayToggle} />
                        </div>
                    </div>

                  {this.state.displayAsMap ?
                   
                    <RelatoListAsMap items={itens} />
                  :
                    <RelatoListAsList items={itens} />
                  }

                </div>
            );
        }else{
            return (
                <div className="itemGenericoList">           
                      <Loader active content='Carregando usuários' inline='centered' />
                </div>
            );
        }
    }
}




const mapstp = (state, ownprops) => {      
     return {items: si3.serializeModel(state.api.entities.relatos,'relatos',state.api.entities)}
}


export default connect( mapstp , si3Actions)(RelatoList);









export class RelatoListAsList extends React.Component{

      render(){
        return(
            <List selection verticalAlign='' divided size='large'>
                  {_.map(this.props.items, (item)=>(
                    item.id &&
                      <List.Item >
                       
                        <List.Content floated='right'>
                              <Icon onClick={()=>this.removeItem(item.cpf,'usuarios',item.nome)} circular name='trash' />
                        </List.Content>

                        <List.Content as={Link} to={"/relatos/"+item.id}>
                          <List.Header>Relato id:{item.id}
                          &emsp;
                          </List.Header> 
                          <List.Description as='a'>{item.email}</List.Description>
                          <List.Description as='a'><small>{new StringMask('000.000.000-00').apply(item.cpf)}</small></List.Description>
                          <List.Description as='a'><small>Receptor: {item.receptor.nome} | {si3.util.formatCPF(item.receptor.cpf)} </small></List.Description>
                          <List.Description as='a'><small>Informante: {item.informante_nome} </small></List.Description>
                          <List.Description as='a'><small>Qtd Midias: {item.colecao_midia.midia_set.length} </small></List.Description>
                   
                          {item.telefone &&
                            <List.Description as='a'><small>{item.telefone}</small></List.Description>
                          }
                          {item.endereco &&
                            <List.Description as='a'><small>{item.endereco}</small></List.Description>
                          }

                        </List.Content>
                      </List.Item>

                  ))}
              </List>
          )
      }
}




class RelatoListAsMap extends React.Component{


    componentDidUpdate(xp,xs){
          // if(!_.isEqual(prevState.GeoJSON, this.state.GeoJSON)){
                // console.log('mudou geogsom')
                // 
                this.refs.map.leafletElement.fitBounds(this.refs.markers.leafletElement.getBounds())
                // 

        // }
    }

    componentDidMount(){
          // if(!_.isEqual(prevState.GeoJSON, this.state.GeoJSON)){
                // console.log('mudou geogsom')
                // 
                // this.refs.map.leafletElement.fitBounds(this.refs.markers.leafletElement.getBounds())
                // 

        // }
        this.forceUpdate(); //so apra chamar o didupdate
    }


    render(){

          return( 
            <div className='row-500px col-12'>
                <Map 
                ref='map'
                zoom={8}
                center={[-43,-11]}
                className='col-xs-12 row-xs-12'>
                             
                <LayersMapa  />

                  <FeatureGroup ref='markers'>
                   {_.map(this.props.items, (item)=>(
                        <RelatoMarker key={item.id} item={item} />
                    ))} 
                  </FeatureGroup>
             
              </Map>
            </div>
                
          )
    }

}


RelatoListAsMap = connect()(RelatoListAsMap)
export {RelatoListAsMap as RelatoListAsMap}





 const relatoItem = L.icon({
              iconUrl: '/images/mark-relatos.svg',
              shadowUrl: '/images/mark-relatos-shadow.svg',
              
              iconSize: [45, 56],
              iconAnchor: [22, 56],

              shadowSize:   [51, 32],
              shadowAnchor: [7, 28],

              popupAnchor: [22, -60],
    });



class RelatoMarker extends React.Component{

    getPositon = () =>{
        var p = this.props.item.localizacao
        var convertido;
        try{
          convertido = wkx.Geometry.parse(p);
        }catch(e){
          convertido = {x:1,y:1}
        }
        
        const point = {x:convertido.x,y:convertido.y};
        return [point.x,point.y];
    }
    
    //isso pq popup usa o reactdom fora do nosso context/provider principal
    onClick = ()=>{
      
      this.props.router.push('/relatos/'+this.props.item.id)
    }

  render(){

      const pos = this.getPositon()

      const item = this.props;

      return(

        <Marker 
          icon={relatoItem}
          position={pos}
          draggable={false}>
              <Popup>
                 <div>
                  <div as='a'><b>{"Relato "+this.props.item.id}</b></div>
                  <div as='a'><small>Receptor: {this.props.item.receptor.nome} </small></div>
                  <div as='a'><small>Informante: {this.props.item.informante_nome} </small></div>
                  <div as='a'><small>Qtd Midias: {this.props.item.colecao_midia.midia_set.length} </small></div>
                   
                    <a onClick={this.onClick} ><i className='fa fa-pencil' /> editar </a>
                </div>
              </Popup>
      </Marker>

      )
    }
}

RelatoMarker = withRouter(connect()(RelatoMarker))

export { RelatoMarker as RelatoMarker }



