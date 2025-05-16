// Minimal framing needed to use CodeMirror-style parsers to highlight
// code. Load this along with tokenize.js, stringstream.js, and your
// parser. Then call highlightText, passing a string as the first
// argument, and as the second argument either a callback function
// that will be called with an array of SPAN nodes for every line in
// the code, or a DOM node to which to append these spans, and
// optionally (not needed if you only loaded one parser) a parser
// object.
// Stuff from util.js that the parsers are using.
var StopIteration={toString:function(){return"StopIteration"}},Editor={},indentUnit=2;(function(){function e(e){var t="";for(var n=0;n<indentUnit;n++)t+=" ";e=e.replace(/\t/g,t).replace(/\u00a0/g," ").replace(/\r\n?/g,"\n");var r=0,i=[],s=e.split("\n");for(var o=0;o<s.length;o++){o!=0&&i.push("\n");i.push(s[o])}return{next:function(){if(r<i.length)return i[r++];throw StopIteration}}}window.highlightText=function(t,n,r){r=(r||Editor.Parser).make(stringStream(e(t)));var i=[];if(n.nodeType==1){var s=n;n=function(e){for(var t=0;t<e.length;t++)s.appendChild(e[t]);s.appendChild(document.createElement("br"))}}try{for(;;){var o=r.next();if(o.value=="\n"){n(i);i=[]}else{var u=document.createElement("span");u.className=o.style;u.appendChild(document.createTextNode(o.value));i.push(u)}}}catch(a){if(a!=StopIteration)throw a}i.length&&n(i)}})();