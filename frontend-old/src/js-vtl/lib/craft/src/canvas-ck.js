/**@
* #Canvas
* @category Graphics
* @trigger Draw - when the entity is ready to be drawn to the stage - {type: "canvas", pos, co, ctx}
* @trigger NoCanvas - if the browser does not support canvas
* 
* When this component is added to an entity it will be drawn to the global canvas element. The canvas element (and hence all Canvas entities) is always rendered below any DOM entities. 
* 
* Crafty.canvas.init() will be automatically called if it is not called already to initialize the canvas element.
*
* Create a canvas entity like this
* ~~~
* var myEntity = Crafty.e("2D, Canvas, Color").color("green")
*                                             .attr({x: 13, y: 37, w: 42, h: 42});
*~~~
*/Crafty.c("Canvas",{init:function(){Crafty.canvas.context||Crafty.canvas.init();Crafty.DrawManager.total2D++;this.bind("Change",function(e){this._changed===!1?this._changed=Crafty.DrawManager.add(e||this,this):e&&(this._changed=Crafty.DrawManager.add(e,this))});this.bind("Remove",function(){Crafty.DrawManager.total2D--;Crafty.DrawManager.add(this,this)})},draw:function(e,t,n,r,i){if(!this.ready)return;if(arguments.length===4){i=r;r=n;n=t;t=e;e=Crafty.canvas.context}var s={_x:this._x+(t||0),_y:this._y+(n||0),_w:r||this._w,_h:i||this._h},o=e||Crafty.canvas.context,u=this.__coord||[0,0,0,0],a={x:u[0]+(t||0),y:u[1]+(n||0),w:r||u[2],h:i||u[3]};if(this._mbr){o.save();o.translate(this._origin.x+this._x,this._origin.y+this._y);s._x=-this._origin.x;s._y=-this._origin.y;o.rotate(this._rotation%360*(Math.PI/180))}if(this._flipX||this._flipY){o.save();o.scale(this._flipX?-1:1,this._flipY?-1:1);this._flipX&&(s._x=-(s._x+s._w));this._flipY&&(s._y=-(s._y+s._h))}if(this._alpha<1){var f=o.globalAlpha;o.globalAlpha=this._alpha}this.trigger("Draw",{type:"canvas",pos:s,co:a,ctx:o});(this._mbr||this._flipX||this._flipY)&&o.restore();f&&(o.globalAlpha=f);return this}});Crafty.extend({canvas:{context:null,init:function(){if(!Crafty.support.canvas){Crafty.trigger("NoCanvas");Crafty.stop();return}var e;e=document.createElement("canvas");e.width=Crafty.viewport.width;e.height=Crafty.viewport.height;e.style.position="absolute";e.style.left="0px";e.style.top="0px";Crafty.stage.elem.appendChild(e);Crafty.canvas.context=e.getContext("2d");Crafty.canvas._canvas=e}}});