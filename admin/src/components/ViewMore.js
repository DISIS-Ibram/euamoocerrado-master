import React from 'react';


export default class ViewMore extends React.Component{

  static defaultProps = {
    height: '1.1em'
  }

  state = {open:false,menorQueAltura:false}

  toogle=()=>{
    this.setState({open:!this.state.open})
  }
  
  componentDidMount(){
      if(this.state.open === false && (( this.div.scrollHeight - this.div.clientHeight) < 5)) {
        this.setState({open:true,menorQueAltura:true})
      }
  }
  
  componentDidUpdate(prevProps, prevState) {
     if(this.state.open === false && (( this.div.scrollHeight - this.div.clientHeight) < 5)) {
        this.setState({open:true,menorQueAltura:true})
      }
  }

  render(){
    
    let style={position:'relative'}
    let onclick=this.toogle;
    let onclickIcon=this.toogle;
    let icon = "fa-ellipsis-h";

    if(this.state.open){
      style.height = 'auto';
      onclick = ()=>{};
      icon = "fa-level-up";
    }else{
      style.height = this.props.height || '1.1em';
      style.overflow = 'hidden'
    }


    return(
        <div style={style} onClick={onclick} ref={el=>this.div=el} className="viewmore">
              <span style={{display:'inline-block',paddingRight:'16px'}}>
                  {this.props.children}
              </span>
              {!this.state.menorQueAltura &&
                    <div onClick={onclickIcon} ref={el=>this.ellipses=el} style={{position:'absolute',right:'0',bottom:'0',background:'#bfbaba',padding:'0 4px',borderRadius:'9px',height:'14px',lineHeight:'14px'}}>
                         
                        <i style={{fontSize:"0.8em"}} className={'fa '+icon}></i>
                    
                    </div>
              }
        </div>

      )
  }



}
