/**
* TODO
*
* //wysiwyg
* Add all entities on the stage as DOM elements
* Drag and drop updates its props
* Context menu to copy/cut/paste/delete and properties
* Snap to grid
* 
* //Saving
* Save all objects into JSON
* Load all JSON into object
*/Crafty.c("_GUI",{_GUI:function(){function t(t){e.x=t.clientX-Crafty.stage.x-e._startX;e.y=t.clientY-Crafty.stage.y-e._startY;e.draw()}this.requires("DOM");var e=this;$(this._element).mousedown(function(n){e._startX=n.clientX-Crafty.stage.x-e._x;e._startY=n.clientY-Crafty.stage.y-e._y;$workarea.mousemove(t)});$workarea.mouseup(function(){$workarea.unbind("mousemove",t)})},_startX:0,_startY:0,comps:function(e){var t=e.split(/\s*,\s*/),n=0,r=t.length;for(;n<r;++n){if(t[n]==="Canvas")continue;this.addComponent(t[n])}this._GUI();return this}});