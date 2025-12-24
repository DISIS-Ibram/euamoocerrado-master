/* Raphael extensions to support SVG filters on Raphael shapes.
 *
 * @author: SebastiÃ¡n Gurin (sg - sgurin - cancerbero_sgx)
 *
 * The api consist on  a general API for administer "filter". the API for this is general and is very similar to SVG:
 * Concepts:
 *
 * Filter: define a filter for one or more shapes to use. Each filter is added in paper.defs
 *  and one or more shapes can use this filter. A filter contains one or more FilterOperations.
 *
 * FilterOperation: a filter contains an array of FilterOperations that correspond to one SVG filter operation like
 * feSpecularLighting, feComposwite, etc.
 *
 * FilterOperationParams - an object that contains the filter operation parameters.
 *
 *  Use case
 *  var paper = Raphael(...);
 *  var filter1 = paper.filterCreate("filter1");
 *
 *  var fop1Params = {funcR: {..}, ...}, //def of a svg componentTransfer
 *      fop1 = Raphael.filter.componentTransfer(fop1Params); //the filteroperation object
 *
 *  //add the filter operation to the filter object
 *  filter1.appendOperation(fop1);
 *
 *  var img1 = paper.image(...)
 *  img1.filterInstall(filter1);
 *  ..
 *  aSet.filterUninstall(filter1);
 *  ..
 *  img1.filterUninstall(filter1);
 *
 *
 *
 *  Reference:
 *
 *  - Filter: an object{filterId}
 *
 *  - FilterOperation: an object {name, appendToFilterEl, filter} - where name is
 *  the name of the filter operation such as feGaussianBlur, feSpecularLighting, etc.
 *  and where appendToFilterEl is a function that appends  a SVG filter
 *  operation inside the passed SVG filter element.
 *  Note: SVG filter operations are currently expressed as XML elements.
 *  the appendToFilterEl defines de filter operation by creating this element according to the
 *  FilterOperationParams object. So the user work with json objects that
 *  currently will create the svg filter children.
 *
 *  TODO: svg filter common attributes, and filter output, referencing and composing....
 *
 *  common attributes sollution:
 * */(function(){var e=function(e,t){if(!t)return document.createElementNS("http://www.w3.org/2000/svg",e);for(var n in t)t.hasOwnProperty(n)&&e.setAttribute(n,t[n])};Raphael.fn.filterCreate=function(t){var n=this;n._filters||(n._filters={});var r=e("filter");n._filters[t]=r;e(r,{id:t});n.defs.appendChild(r);return{paper:n,filterId:t,appendOperation:function(e){this.paper.filterAddOperation(this,e)},removeOperation:function(e){this.paper.filterRemoveOperation(this,e)}}};Raphael.fn.filterRemove=function(e){this.node.style.filter=null};Raphael._filterOpCounter=0;Raphael.fn.filterAddOperation=function(e,t){var n=this,r=n._filters[e.filterId],i=t.appendToFilterEl(r);if(i){Raphael._filterOpCounter++;var s="svgfilterop"+Raphael._filterOpCounter;i.setAttribute("id",s);t.filterOperationId=s}t.filter=e};Raphael.fn.filterRemoveOperation=function(e,t){var n=this,r=n._filters[e.filterId];for(var i=0;i<r.childNodes.length;i++){var s=r.childNodes[i];s.getAttribute("id")==t.filterOperationId&&r.removeChild(s)}};Raphael.el.filterInstall=function(t){e(this.node,{filter:"url(#"+t.filterId+")"})};Raphael.el.filterUninstall=function(t){e(this.node,{filter:""})};Raphael.filterOps={};Raphael.filterOps.svgFilter=function(t,n){return{params:n,appendToFilterEl:function(n){var r=e(t);for(var i in this.params)try{r.setAttribute(i,this.params[i])}catch(s){alert("invalid parameter "+i+" value: "+this.params[i]+". Error: "+s)}n.appendChild(r);return r}}};Raphael.filterOps.feGaussianBlur=function(e){return Raphael.filterOps.svgFilter("feGaussianBlur",e)};Raphael.filterOps.feColorMatrix=function(e){return Raphael.filterOps.svgFilter("feColorMatrix",e)};Raphael.filterOps.feComponentTransfer=function(t){return{params:t,appendToFilterEl:function(t){var n=e("feComponentTransfer");for(var r in this.params){var i=e(r);for(var s in this.params[r])i.setAttribute(s,this.params[r][s]);n.appendChild(i)}t.appendChild(n);return n}}};Raphael.filterOps.feConvolveMatrix=function(e){return Raphael.filterOps.svgFilter("feConvolveMatrix",e)};Raphael.filterOps.feMorphology=function(e){return Raphael.filterOps.svgFilter("feMorphology",e)};Raphael.filterOps.feTurbulence=function(e){return Raphael.filterOps.svgFilter("feTurbulence",e)};Raphael.filterOps.feOffset=function(e){return Raphael.filterOps.svgFilter("feOffset",e)};Raphael.filterOps.feComposite=function(e){return Raphael.filterOps.svgFilter("feComposite",e)};Raphael.filterOps.feMerge=function(t){return{params:t,appendToFilterEl:function(t){var n=e("feMerge");if(this.params.merge)for(var r=0;r<this.params.merge.length;r++){var i=e("feMergeNode");i.setAttribute("in",this.params.merge[r]);n.appendChild(i)}t.appendChild(n);return n}}};Raphael.filterOps.feSpecularLighting=function(t){return{params:t,appendToFilterEl:function(t){var n=e("feSpecularLighting");for(var r in this.params)r!="lightSource"&&n.setAttribute(r,this.params[r]);if(this.params.lightSource&&this.params.lightSource.lightSourceName){var i=e(this.params.lightSource.lightSourceName);for(var r in this.params.lightSource)r!="lightSourceName"&&i.setAttribute(r,this.params.lightSource[r]);n.appendChild(i)}t.appendChild(n);return n}}};Raphael.filterOps.feDiffuseLighting=function(t){return{params:t,appendToFilterEl:function(t){var n=e("feDiffuseLighting");for(var r in this.params)r!="lightSource"&&n.setAttribute(r,this.params[r]);if(this.params.lightSource&&this.params.lightSource.lightSourceName){var i=e(this.params.lightSource.lightSourceName);for(var r in this.params.lightSource)r!="lightSourceName"&&i.setAttribute(r,this.params.lightSource[r]);n.appendChild(i)}t.appendChild(n);return n}}}})();