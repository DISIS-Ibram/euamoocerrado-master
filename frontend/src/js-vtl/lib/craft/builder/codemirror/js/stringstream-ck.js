/* String streams are the things fed to parsers (which can feed them
 * to a tokenizer if they want). They provide peek and next methods
 * for looking at the current character (next 'consumes' this
 * character, peek does not), and a get method for retrieving all the
 * text that was consumed since the last time get was called.
 *
 * An easy mistake to make is to let a StopIteration exception finish
 * the token stream while there are still characters pending in the
 * string stream (hitting the end of the buffer while parsing a
 * token). To make it easier to detect such errors, the stringstreams
 * throw an exception when this happens.
 */// Make a stringstream stream out of an iterator that returns strings.
// This is applied to the result of traverseDOM (see codemirror.js),
// and the resulting stream is fed to the parser.
var stringStream=function(e){function i(){while(n==t.length){r+=t;t="";n=0;try{t=e.next()}catch(i){if(i!=StopIteration)throw i;return!1}}return!0}var t="",n=0,r="";return{peek:function(){return i()?t.charAt(n):null},next:function(){if(!i())throw r.length>0?"End of stringstream reached without emptying buffer ('"+r+"').":StopIteration;return t.charAt(n++)},get:function(){var e=r;r="";if(n>0){e+=t.slice(0,n);t=t.slice(n);n=0}return e},push:function(e){t=t.slice(0,n)+e+t.slice(n)},lookAhead:function(i,s,o,u){function a(e){return u?e.toLowerCase():e}i=a(i);var f=!1,l=r,c=n;o&&this.nextWhileMatches(/[\s\u00a0]/);for(;;){var h=n+i.length,p=t.length-n;if(h<=t.length){f=i==a(t.slice(n,h));n=h;break}if(i.slice(0,p)!=a(t.slice(n)))break;r+=t;t="";try{t=e.next()}catch(d){if(d!=StopIteration)throw d;break}n=0;i=i.slice(p)}if(!f||!s){t=r.slice(l.length)+t;n=c;r=l}return f},lookAheadRegex:function(r,i){if(r.source.charAt(0)!="^")throw new Error("Regexps passed to lookAheadRegex must start with ^");while(t.indexOf("\n",n)==-1)try{t+=e.next()}catch(s){if(s!=StopIteration)throw s;break}var o=t.slice(n).match(r);o&&i&&(n+=o[0].length);return o},more:function(){return this.peek()!==null},applies:function(e){var t=this.peek();return t!==null&&e(t)},nextWhile:function(e){var t;while((t=this.peek())!==null&&e(t))this.next()},matches:function(e){var t=this.peek();return t!==null&&e.test(t)},nextWhileMatches:function(e){var t;while((t=this.peek())!==null&&e.test(t))this.next()},equals:function(e){return e===this.peek()},endOfLine:function(){var e=this.peek();return e==null||e=="\n"}}};