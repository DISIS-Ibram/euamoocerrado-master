
import _ from 'lodash'

//My Console
//input:
//  name prefix
//  cssformat
//  on or off







export default function(debug=true,prefix="si3rc",format="color:green"){

  var obj = {}
  for(var o in window.console){
      if(debug){
          obj[o] = window.console[o]
      }else{
          obj[o] = ()=>{return false}
      }
  }

  if(!debug)  return obj


  //faco o log direitinhos
  obj.log = function(){
      
      var txt = prefix;
      var arg = [...arguments];
     
      if( _.isString(arg[0]) ){
        txt = txt+" "+arg[0]
        arg = _.drop(arg);
      }
     
      console.log("%c "+txt,format,...arg) 
  }



  obj.head = function(){
      
      var txt = prefix;
      var arg = [...arguments];
     
      if( _.isString(arg[0]) ){
        txt = txt+" "+arg[0]
        arg = _.drop(arg);
      }
     
      console.log("%c "+txt+" ******************",format+"font-size:32px",...arg) 
  }



   obj.count = function(){
      
      var txt = prefix;
      var arg = [...arguments];
     
      if( _.isString(arg[0]) ){
        txt = txt+" "+arg[0]
        arg = _.drop(arg);
      }
     
      console.count(txt)
      
  }


  //se tiver em production, nao logo as coisas
  if(process.env.NODE_ENV == 'production'){
        obj.log = function(){}
  }


  return obj
}

