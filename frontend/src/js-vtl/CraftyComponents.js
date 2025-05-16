
//Create or return raphael Paper

Crafty.c("Raphael", {
  _paper: {},
  ready: null,
  group:{},
  oriW:null,
  oriH:null,
  viewbox:null,
  url:"",
  _callBackfuncs:null,

  init: function(){
     this.requires("2D, DOM");
     this._paper = Raphael(this._element.id,'100%','100%');
     this.oriW = this.oriW;
     this._callBackfuncs = [];
     this.oriW = 0;
     this.oriH = 0;
     this.ready = false;
     this.viewbox="";




    // this.callBackfuncs = callBackfuncs;
    // this._paper.setViewBox(0, 0, this._w, this._h, false);
     //this._paper.setViewBox(0, 0, this._w, this._h, false);

     draw = function(){
      if(this.ready){
     // this._paper.circle(this._w/2,this._w/2,this._w/2).attr({'fill':'red'});
      if(this.oriW > 0){
           this._paper.setViewBox(0, 0,this.oriW,this.oriH);
           //this.group.anima();

      }
      if(this.viewbox != ""){
              var points = this.viewbox.split(' ');
           this._paper.setViewBox(points[0],points[1],points[2],points[3]);
           //this.group.anima();

      }

           this.group.toFront();

                //executos os callbacks
         for (var i = 0; i < this._callBackfuncs.length; i++) {
            var func = this._callBackfuncs[i];
            func[0].call(func[1],this);
         };

         return this;

      }
     };

     this.bind("Draw", draw);
   //  this.trigger("Change");
   return this;

  },

  importSVG: function(url){
          that=this;
          this.url = url;


           $.ajax({
              type: "GET",
              url: url,
              context:this,
              dataType: "xml",
              success: function(svgXML) {
                this.ready = true;
                    // var paper = Raphael(10, 10, 800, 600);
                    //  paper.setSize('100%', '100%');
                //    that._paper.setViewBox(0, 0, that._w, that._h, false);
                   this.group = this._paper.importSVG(svgXML);
                   this.trigger("Change");

              }
        });

    return this;
  },


  anima : function(){

   // console.log(this.group.groups);
    this.group.anima();

  },

  callback : function(func,quem){

    this._callBackfuncs.push([func,quem]);
    return this;

  },


  getPaper: function(func){
    return this._paper;
  },

  getSets: function(func){
    return this.group;
  }







});
















/**@
* #Image
* @category Graphics
* Draw an image with or without repeating (tiling).
*/
Crafty.c("Image2", {
  ready: false,

  init: function () {
    var draw = function (e) {
      if (e.type === "canvas") {
        //skip if no image
        if (!this.ready || !this._pattern) return;

        var context = e.ctx;

        context.fillStyle = this._pattern;

        context.save();
        context.translate(e.pos._x, e.pos._y);
        context.fillRect(0, 0, this._w, this._h);
        context.restore();
      } else if (e.type === "DOM") {
        if (this.__image)
          el = this._element;
          el.innerHTML = "<img src='"+this.__image +"' style='"+this._w+"px;height:"+this._h+"px'>";
          //e.style.background = "url(" + this.__image + ") " + this._repeat;


      }
    };

    this.bind("Draw", draw).bind("RemoveComponent", function (id) {
      if (id === "Image2") this.unbind("Draw", draw);
    });
  },

  /**@
  * #.image
  * @comp Image
  * @trigger Change - when the image is loaded
  * @sign public this .image(String url[, String repeat])
  * @param url - URL of the image
  * @param repeat - If the image should be repeated to fill the entity.
  *
  * Draw specified image. Repeat follows CSS syntax (`"no-repeat", "repeat", "repeat-x", "repeat-y"`);
  *
  * *Note: Default repeat is `no-repeat` which is different to standard DOM (which is `repeat`)*
  *
  * If the width and height are `0` and repeat is set to `no-repeat` the width and
  * height will automatically assume that of the image. This is an
  * easy way to create an image without needing sprites.
  *
  * @example
  * Will default to no-repeat. Entity width and height will be set to the images width and height
  * ~~~
  * var ent = Crafty.e("2D, DOM, Image").image("myimage.png");
  * ~~~
  * Create a repeating background.
  * ~~~
  * var bg = Crafty.e("2D, DOM, Image")
  *              .attr({w: Crafty.viewport.width, h: Crafty.viewport.height})
  *              .image("bg.png", "repeat");
  * ~~~
  *
  * @see Crafty.sprite
  */
  image2: function (url, repeat) {
    this.__image = url;
    this._repeat = repeat || "no-repeat";

    this.img = Crafty.asset(url);
    if (!this.img) {
      this.img = new Image();
      Crafty.asset(url, this.img);
      this.img.src = url;
      var self = this;

      this.img.onload = function () {
        if (self.has("Canvas")) self._pattern = Crafty.canvas.context.createPattern(self.img, self._repeat);
        self.ready = true;

        if (self._repeat === "no-repeat") {
          self.w = self.w || self.img.width;
          self.h = self.h || self.img.height;
        }

        self.trigger("Change");
      };

      return this;
    } else {
      this.ready = true;
      if (this.has("Canvas")) this._pattern = Crafty.canvas.context.createPattern(this.img, this._repeat);
      if (this._repeat === "no-repeat") {
        this.w = this.img.width;
        this.h = this.img.height;
      }
    }


    this.trigger("Change");

    return this;
  }



});


















