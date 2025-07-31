import React from 'react';
import Sidebar from '../components/Sidebar';
import {DefaultRoute, Route, Router, Link, browserHistory } from 'react-router';
import { Divider, Form, Label, Input } from 'semantic-ui-react'
// import * as S3 from '../components/elements';
import  Slider  from 'react-slick';
import * as util from 'util/s3util'
import carregaModelo from 'hocs/carregaModelo';

import {SI3RC_MODELS} from 'models/models';

import {Statistic} from 'semantic-ui-react';



import LoginForm from 'components/form/LoginForm'

import criaconsole from 'util/myconsole'
const _debug = false;
const myconsole = criaconsole(_debug,' *** login.js | ', 'color:black;font-weight:bold')



import {loginRequest, logout} from 'auth';
/**
 * Home page component
 */


class Fundo extends React.Component{
    static defaultProps = {
      id:'all',
      autoForm:false,
      loadFormOptions:false,
      modelo:"fotohomelist",
      loader:false,
   } 
   
   render(){
        var settings = {
                dots: true,
                fade:true,
                autoplay:true,
                autoplaySpeed:1000,
                speed:3000
        }

        

        return(
            <div className="fundo" >
                 <Slider {...settings} autoplay={true} >
                     
                            <div className='slider' style={{backgroundImage:'url(images/cerrado-wwf.jpg)'}} >
                                <div className='description'>  </div>
                            </div>
                    </Slider>
                </div>
        )
    }

}



@carregaModelo
class Estatisticas extends React.Component{
    static defaultProps = {
      id:'all',
      autoForm:false,
      loadFormOptions:false,
      modelo:"/obter_relatorio/?model=relato,registro",
      loader:false
   
   } 
   
   render(){
    if(this.props.itens){
        // 
        // var registros = _.map(this.props.itens[0].registro, (v,k)=>{
        //                 { JSON.stringify(k) }
        //                 {/*<Statistic  label={v.nome} value={v.count} />*/}
        //                   })
        return(
             <div className='estatisticas'>
                           
                  <Statistic label='relatos' value={this.props.itens[0].relato} />
                  {_.map(this.props.itens[0].registro, (v,k)=>
                      (<Statistic  key={v.nome} label={v.nome} value={v.count} />)
                  )
                  }
                  
            </div>
        )
    }else{
        return null
    }
    
    }

}

 {/*<div className='slider' style={{backgroundImage:'url(images/slide2.jpg)'}} >
                                    <div className='description'> Foto:<b>Autor</b></div>
                                </div>

                                <div className='slider' style={{backgroundImage:'url(images/slide1.jpg'}} >
                                    <div className='description'> Foto:<b>Autor 2</b></div>
                                </div>*/}





export default class Login extends React.Component
{

    constructor(props){
        super(props)

     
            
    }

    componentWillMount() {
        this.state = {user:false}; 
        this.requireAuth();   
    }

    
    componentDidMount() {

         _.forEach(SI3RC_MODELS, (v,k) =>
         {
                
                try{
                     localStorage.removeItem(k+"_options");
                }catch(e){

                }
         })


         var h = $(window).height();
         $('.login-page').height(h+250);

         $(window).resize(function(){
                 var h = $(window).height();
                 $('.login-page').height(h+250);
         })


    }

    

    
    async requireAuth(nextState, replace) {
         var user = await logout();
        //  browserHistory.replace("/")
    }



 
    
    render(){
        return(
            <div className="login-page" key='loginpage'>
                
                <Fundo modelo="fotohomelist" />
                
                <div className='barra-lateral borda-container'>
                    <div className='borda br'></div>
                </div>

                {/*<div className='estatisticas'>
                  <S3.UI.Statistic label='relato' value='33' />
                  <S3.UI.Statistic  label='informacao' value='25' />
                </div>*/}

                <Estatisticas />


                <div id="footer">
                   
                    <div className="col-xs-7 pv4 f6 gray lh-copy pl5">
                       Eu Amo o Cerrado
                    </div>

                    <div className="assinaturas">
                        {/* <img src='images/assinaturas.png' /> */}
                    </div>
                </div>


                <div className="row mt-5">
                    <div className="col-sm-4 col-sm-offset-2">
                        <div className="formulario ">               
                            <div className="column logowrap">
                                <img className='logo' src='images/euamocerrado.png' />
                                <h3> Eu Amo o Cerrado </h3>
                                <LoginForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
