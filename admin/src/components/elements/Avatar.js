import React, { Component } from 'react';
import { si3 }  from 'actions/index';
import {Image, Icon } from 'semantic-ui-react';


export default class Avatar extends React.Component {

    static defaultProps = {
        size:80,
        url:""
    }

    render(){
        
        if(this.props.url == "" || this.props.url === null){
            return (<span className='ui avatar image'>
                <center>
                 <i className='fa fa-user gray' style={{fontSize:'1.5em'}}></i>
            </center> </span>)
        }else{
            return (<Image avatar src={si3.util.thumb(this.props.url,this.props.size)}  />)
        }

    }
}