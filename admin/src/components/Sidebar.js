import React from 'react';
import { Router, Route, IndexRoute, browserHistory,  Link } from 'react-router';
import Icon from './elements/S3Icon';


const Sidebar = function(){
	return (
	<div className="ui vertical inverted sidebar menu left overlay visible" id="barra-lateral" >
		
		<Link to="/home" onlyActiveOnIndex={true}  name="si3rc" >
		{/* Não está carregando a imagem por causa do nginx */}
				<img style={{ width:'100%',padding:'10px' }} src="http://euamocerrado.com.br/images/euamocerrado.png" />
		</Link> 
		

		{/* <LinkMenu to="/" onlyActiveOnIndex={true} /> */}
		<LinkMenu to="/especies/lista" icon='ave' nome="Especies" />
		<LinkMenu to="/parques/lista" icon='arvore' nome="Parques" />
		<LinkMenu to="/trilhas/lista" icon='trilha' nome="Trilhas" />
		<LinkMenu to="/avistamentos/lista" tipo='fa' icon='fa-binoculars' nome="Avistamentos" />
		{/* <LinkMenu to="/registro/registro" icon='registros' nome="Registros" />
		<LinkMenu to="/fpe/lista" icon='fpe' nome="FPE" />
		<LinkMenu to="/expedicao/lista" icon='campo' tipo='svg' nome="Expedição" />
		<LinkMenu to="/recentecontato/aldeia" icon='reccontato' tipo='svg' nome="Recente Contato" /> */}
		{/*<LinkMenu to="/reccontato" icon='reccontato' nome="Recente Contato" />

		<LinkMenu to="/campo" icon='campo' tipo='svg' nome="campo" />*/}

		<div className='borda borda-right '></div>
	</div>

 )
}



const LinkMenu = function(props,args){

	var p = {...props};
	delete p.icon;
	delete p.nome;
	delete p.tipo;
	return(
		<div className="item">
			<Link {...p} activeClassName="active" >
				<span className='icone'>
					<Icon tipo={props.tipo || 'svg'} name={props.icon || ''} color="white" />
				</span>
				<span className='nome'>{props.nome || ''}</span>
			</Link>
		</div>
	)

}


export default Sidebar;