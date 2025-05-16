/**@
* #.WiredHitBox
* @comp Collision
* 
* Components to display Crafty.polygon Array for debugging collision detection
* 
* @example
* This will display a wired square over your original Canvas screen
* ~~~
* Crafty.e("2D,DOM,Player,Collision,WiredHitBox").collision(new Crafty.polygon([0,0],[0,300],[300,300],[300,0]))
* ~~~
*/Crafty.c("WiredHitBox",{init:function(){if(Crafty.support.canvas){var e=document.getElementById("HitBox");if(!e){e=document.createElement("canvas");e.id="HitBox";e.width=Crafty.viewport.width;e.height=Crafty.viewport.height;e.style.position="absolute";e.style.left="0px";e.style.top="0px";e.style.zIndex="1000";Crafty.stage.elem.appendChild(e)}var t=e.getContext("2d"),n=0,r=Crafty("WiredHitBox").length;this.requires("Collision").bind("EnterFrame",function(){if(n==r){t.clearRect(0,0,Crafty.viewport.width,Crafty.viewport.height);n=0}t.beginPath();for(var e in this.map.points)t.lineTo(Crafty.viewport.x+this.map.points[e][0],Crafty.viewport.y+this.map.points[e][1]);t.closePath();t.stroke();n++})}return this}});Crafty.c("SolidHitBox",{init:function(){if(Crafty.support.canvas){var e=document.getElementById("HitBox");if(!e){e=document.createElement("canvas");e.id="HitBox";e.width=Crafty.viewport.width;e.height=Crafty.viewport.height;e.style.position="absolute";e.style.left="0px";e.style.top="0px";e.style.zIndex="1000";Crafty.stage.elem.appendChild(e)}var t=e.getContext("2d"),n=0,r=Crafty("SolidHitBox").length;this.requires("Collision").bind("EnterFrame",function(){if(n==r){t.clearRect(0,0,Crafty.viewport.width,Crafty.viewport.height);n=0}t.beginPath();for(var e in this.map.points)t.lineTo(Crafty.viewport.x+this.map.points[e][0],Crafty.viewport.y+this.map.points[e][1]);t.closePath();t.fill();n++})}return this}});