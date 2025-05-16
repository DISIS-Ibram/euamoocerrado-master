


/* PubSubJS
Copyright (c) 2010,2011,2012 Morgan Roderick http://roderick.dk
License: MIT - http://mrgnrdrck.mit-license.org


// create a function to receive messages
var mySubscriber = function( msg, data ){
    console.log( msg, data );
};

// add the function to the list of subscribers for a particular message
// we're keeping the returned token, in order to be able to unsubscribe
// from the message later on
var token = PubSub.subscribe( 'MY MESSAGE', mySubscriber );

// publish a message asyncronously
PubSub.publish( 'MY MESSAGE', 'hello world!' );

https://github.com/mroderick/PubSubJS
*/
/*jslint white:true, plusplus:true, stupid:true*/
/*global
    setTimeout,
    module,
    exports,
    define,
    require,
    window
*/

(function(root, factory){
    'use strict';

    // CommonJS
    if (typeof exports === 'object'){
        module.exports = factory();

    // AMD
    } else if (typeof define === 'function' && define.amd){
        define(factory);
    // Browser
    } else {
        root.PubSub = factory();
    }
}( ( typeof window === 'object' && window ) || this, function(){

    'use strict';

    var PubSub = {
            name: 'PubSubJS',
            version: '1.3.4'
        },
        messages = {},
        objects = [],
        lastUid = -1;

    /**
     *  Returns a function that throws the passed exception, for use as argument for setTimeout
     *  @param { Object } ex An Error object
     */




    function throwException( ex ){
        return function reThrowException(){
            throw ex;
        };
    }

    function callSubscriberWithDelayedExceptions( subscriber, message, data ){
        try {
            subscriber( message, data );
        } catch( ex ){
            setTimeout( throwException( ex ), 0);
        }
    }

    function callSubscriberWithImmediateExceptions( subscriber, message, data ){
        subscriber( message, data );
    }

    function deliverMessage( originalMessage, matchedMessage, data, immediateExceptions ){
        var subscribers = messages[matchedMessage],
            callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions,
            i, j;

        if ( !messages.hasOwnProperty( matchedMessage ) ) {
            return;
        }

        for ( i = 0, j = subscribers.length; i < j; i++ ){
            callSubscriber( subscribers[i].func, originalMessage, data );
        }
    }

    function createDeliveryFunction( message, data, immediateExceptions ){
        return function deliverNamespaced(){
            var topic = String( message ),
                position = topic.lastIndexOf( '.' );

            // deliver the message as it is now
            deliverMessage(message, message, data, immediateExceptions);

            // trim the hierarchy and deliver message to each level
            while( position !== -1 ){
                topic = topic.substr( 0, position );
                position = topic.lastIndexOf('.');
                deliverMessage( message, topic, data );
            }
        };
    }

    function messageHasSubscribers( message ){
        var topic = String( message ),
            found = messages.hasOwnProperty( topic ),
            position = topic.lastIndexOf( '.' );

        while ( !found && position !== -1 ){
            topic = topic.substr( 0, position );
            position = topic.lastIndexOf('.');
            found = messages.hasOwnProperty( topic );
        }

        return found;
    }

    function publish( message, data, sync, immediateExceptions ){
        var deliver = createDeliveryFunction( message, data, immediateExceptions ),
            hasSubscribers = messageHasSubscribers( message );



        publishInObjects( message, data, sync, immediateExceptions );

        if ( !hasSubscribers ){
            return false;
        }

        if ( sync === true ){
            deliver();
        } else {
            setTimeout( deliver, 0 );
        }


        return true;
    }




    function createDeliver(obj,message,data){
        return function(){
            obj[message].call(obj,data)
        }
    }



    function publishInObjects( message, data, sync, immediateExceptions){

        //para cada objeto registrado, dou um loop e vejo se tem alguma funcao com o nome da acao registrado, e se tiver eu chamo
        //LETODO - ver se isso nnao é muito demorado
        for (var i = objects.length - 1; i >= 0; i--) {
            var obj = objects[i].obj;
            var msg = objects[i].msg;

            var patt = new RegExp("\\b"+message+"\\b","g");
            if(msg==="" || patt.test(msg)){
            //verifico se tem a funcao com o nome, se tiver publish ela
                //console.log(obj.classid+" - "+message+"  -  "+typeof(obj[message]));
                if (typeof(obj[message]) === 'function'){

                      var deliver = createDeliver(obj,message,data);
                     setTimeout( deliver, 0 );
                }
            }

        };
    }




    /**
     *  PubSub.publish( message[, data] ) -> Boolean
     *  - message (String): The message to publish
     *  - data: The data to pass to subscribers
     *  Publishes the the message, passing the data to it's subscribers
    **/
    PubSub.publish = function( message, data ){
        return publish( message, data, false, PubSub.immediateExceptions );
    };

    /**
     *  PubSub.publishSync( message[, data] ) -> Boolean
     *  - message (String): The message to publish
     *  - data: The data to pass to subscribers
     *  Publishes the the message synchronously, passing the data to it's subscribers
    **/
    PubSub.publishSync = function( message, data ){
        return publish( message, data, true, PubSub.immediateExceptions );
    };


    /**
     *  PubSub.subscribeAnObject( object, messages) -> String
     *  - object (String): The object to subscribe
     *  - messages (String): If passed, will execute only functions that is in it. space separate. ex:"eventName1 EventeNameX"
     *  Subscribes an object, so every pubish will verify if the function exists in object, if so will execute it
    **/


    PubSub.subscribeAnObject = function(obj,messages){
            messages = messages || "";
            for (var i = objects.length - 1; i >= 0; i--) {
                var objatual = objects[i].obj;
                if(objatual==obj){
                    var msgatual = objects[i].msg;
                    if(msgatual==="" || messages===""){
                        messages="";
                    }else{
                        var allMessages = msgatual+" "+messages;
                        var msgArray = allMessages.replace(/\s\s*/," ").split();
                        messages = msgArray.unique().join(" ");
                    }
                    objects.splice([i],1); //delete because going to substitute for the new one bellow
                }
            }
            objects.push({obj:obj,msg:messages});
    };



   PubSub.unsubscribeAnObject = function(obj){
         for (var i = objects.length - 1; i >= 0; i--) {
            var objatual = objects[i].obj;
            if(objatual==obj){ ; }
        }
    };



        /**
     *  PubSub.subscribe( message, func ) -> String
     *  - message (String): The message to subscribe to
     *  - func (Function): The function to call when a new message is published
     *  Subscribes the passed function to the passed message. Every returned token is unique and should be stored if
     *  you need to unsubscribe
    **/


    PubSub.subscribe = function( message, func ){
        // message is not registered yet
        if ( !messages.hasOwnProperty( message ) ){
            messages[message] = [];
        }

        // forcing token as String, to allow for future expansions without breaking usage
        // and allow for easy use as key names for the 'messages' object
        var token = String(++lastUid);
        messages[message].push( { token : token, func : func } );

        // return token for unsubscribing
        return token;
    };

    /**
     *  PubSub.unsubscribe( tokenOrFunction ) -> String | Boolean
     *  - tokenOrFunction (String|Function): The token of the function to unsubscribe or func passed in on subscribe
     *  Unsubscribes a specific subscriber from a specific message using the unique token
     *  or if using Function as argument, it will remove all subscriptions with that function
    **/
    PubSub.unsubscribe = function( tokenOrFunction ){
        var isToken = typeof tokenOrFunction === 'string',
            key = isToken ? 'token' : 'func',
            succesfulReturnValue = isToken ? tokenOrFunction : true,

            result = false,
            m, i;

        for ( m in messages ){
            if ( messages.hasOwnProperty( m ) ){
                for ( i = messages[m].length-1 ; i >= 0; i-- ){
                    if ( messages[m][i][key] === tokenOrFunction ){
                        messages[m].splice( i, 1 );
                        result = succesfulReturnValue;

                        // tokens are unique, so we can just return here
                        if ( isToken ){
                            return result;
                        }
                    }
                }
            }
        }

        return result;
    };

    return PubSub;
}));


//helper thath create a unique function
if(Array.prototype.unique === undefined){
Array.prototype.unique =
  function() {
    var a = [];
    var l = this.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (this[i] === this[j])
          j = ++i;
      }
      a.push(this[i]);
    }
    return a;
  };

}
if(Array.prototype.remove === undefined){
    Array.prototype.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
}

