import React, { Component } from 'react';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { si3, si3Actions }  from 'actions/index';


export class ColetaniaMidia extends Component {
  
  constructor(props){
        super(props)
        this.onDrop = this.onDrop.bind(this);
        this.state = {uploded:0,total:0,id:this.props.id} //pq o id pode ser dinamico
  }

  componentDidMount(){
      
      this.midias = this.props.load('colecao',{id:this.state.id});
      this.midias = this.props.load('colecao',{id:"2"});
       this.midias = this.props.load('midia');
      

      // this.midias = this.props.load('colecao');

      console.log(this.midias)
  }



  onDrop(acceptedFiles, rejectedFiles) {

      //crio uma coletania se ja nao existe uma
      if (this.props.id===0){
          this.props.save('coletania', {nome:'_coletania_teste'});
      }
      
        this.setState({total:0,uploded:0})


      acceptedFiles.forEach((file,index) =>{

        //pego o nome do arquivo
        const nome = file.name;

        console.log(file.size);

        this.setState({total:this.state.total+file.size})
       
        //pego o tipo do arquivo
        const tipo = 0 //file.type; 
       
        //preparo o formulario para envio
        const arquivo = file;

        //
        var data = new FormData();
        data.append("nome",nome);
        data.append("tipo_midia","0");
        data.append("arquivo",file);
        data.append("colecao",1);
        data.append("tags",'');

        let _t = this;  //jogo sujo

        $.ajax({
          xhr: function() { //somente para acompanhar o progresso
                var xhr = new window.XMLHttpRequest();

                xhr.upload.addEventListener("progress", function(evt) {
                  if (evt.lengthComputable) {
                    var percentComplete = evt.loaded / evt.total;

                    _t.setState({uploded:evt.loaded})

                    percentComplete = parseInt(percentComplete * 100);
                    console.log(percentComplete);

                    if (percentComplete > 50) {
                    // xhr.abort();
                    }

                    if (percentComplete === 100) {

                    }

                  }
                }, false);

                return xhr;
          },
          url:'http://162.243.186.165/midia/midia/',
          method:'POST',
          data:data,
          cache: false,
          processData: false, // Don't process the files
          contentType: false, // Set content type to false as jQuery will tell the server its a query string request
          success: function(data, textStatus, jqXHR)
          {
            if(typeof data.error === 'undefined')
            {
                // Success so call function to process the form
                console.log(data);
            }
            else
            {
                // Handle errors here
                console.log('ERRORS: ' + data.error);
            }
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
            // Handle errors here
            console.log('ERRORS: ' + textStatus);
            // STOP LOADING SPINNER
        }
    });


        //comeco o envio
        
        //nesse caso simulando o envio por formulario ao inves de utilizar json-api, 
        //para poder a api aceitar o multifor que estamos lidando

        //depoisde enviar, eu dou um get nas midias da coletania
        // especifica para poder forcar a atualizacao via redux
     })
    }


  render() {
    return (
      <div>
      
            <Dropzone onDrop={this.onDrop}>
                
                <div>Try dropping some files here, or click to select files to upload.</div>
                TOTAL: <b>{parseInt((this.state.uploded/this.state.total * 100),10)}</b>
                {this.state.midias}

            </Dropzone>
      
      </div>
    );
  }
}




export default connect( (state, ownprops)=> {return {api:state.api}} , si3Actions)(ColetaniaMidia);
