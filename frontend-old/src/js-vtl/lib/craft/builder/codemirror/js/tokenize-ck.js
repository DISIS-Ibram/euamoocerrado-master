// A framework for simple tokenizers. Takes care of newlines and
// white-space, and of getting the text from the source stream into
// the token object. A state is a function of two arguments -- a
// string stream and a setState function. The second can be used to
// change the tokenizer's state, and can be ignored for stateless
// tokenizers. This function should advance the stream over a token
// and return a string or object containing information about the next
// token, or null to pass and have the (new) state be called to finish
// the token. When a string is given, it is wrapped in a {style, type}
// object. In the resulting object, the characters consumed are stored
// under the content property. Any whitespace following them is also
// automatically consumed, and added to the value property. (Thus,
// content is the actual meaningful part of the token, while value
// contains all the text it spans.)
function tokenizer(e,t){function n(e){return e!="\n"&&/^[\s\u00a0]*$/.test(e)}var r={state:t,take:function(t){typeof t=="string"&&(t={style:t,type:t});t.content=(t.content||"")+e.get();/\n$/.test(t.content)||e.nextWhile(n);t.value=t.content+e.get();return t},next:function(){if(!e.more())throw StopIteration;var t;if(e.equals("\n")){e.next();return this.take("whitespace")}if(e.applies(n))t="whitespace";else while(!t)t=this.state(e,function(e){r.state=e});return this.take(t)}};return r};