/**@
* #HTML
* @category Graphics
* Component allow for insertion of arbitrary HTML into an entity
*/Crafty.c("HTML",{inner:"",init:function(){this.requires("2D, DOM")},replace:function(e){this.inner=e;this._element.innerHTML=e;return this},append:function(e){this.inner+=e;this._element.innerHTML+=e;return this},prepend:function(e){this.inner=e+this.inner;this._element.innerHTML=e+this.inner;return this}});