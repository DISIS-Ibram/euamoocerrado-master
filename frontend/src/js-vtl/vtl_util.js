







/////////////////////////////////////////////////
//  UTILITARIOS
/////////////////////////////////////////////////

vtl.Util = vtlu = (function(){

  var _that = {};

    //converto as cordenadas entre lat e long e o plano cartesiano do mapa
   _that.toMercator = function(lat,lon) {
            var x = lon * 20037508.34 / 180;
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            y = -y * 20037508.34 / 180;
            //converto para o tamanho do meu mapa
            x = x * _SCALEMAP + _XMOVEMAPA;
            y = y * _SCALEMAP - _YMOVEMAPA;
            return [x, y];
      },

    _that.inverseMercator = function(x, y) {
            //converto do tamanho do meu mapa
            x = (x - _XMOVEMAPA) / _SCALEMAP;
            y = -(y + _YMOVEMAPA) / _SCALEMAP;
            var lon = (x / 20037508.34) * 180;
            var lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return [lat,lon];
      };


     _that.inverseMercatorGoogleInit = function(x, y) {
            //converto do tamanho do meu mapa
            x = (x - _XMOVEMAPA) / 1;
            y = -(y + _YMOVEMAPA) / 1;
            var lon = (x / 20037508.34) * 180;
            var lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return [lat,lon];
      };


     _that.normalizeWheelDelta = function() {
        // Keep a distribution of observed values, and scale by the
        // 33rd percentile.
        var distribution = [], done = null, scale = 30;
        return function(n) {
          // Zeroes don't count.
          if (n == 0) return n;
          // After 500 samples, we stop sampling and keep current factor.
          if (done != null) return n * done;
          var abs = Math.abs(n);
          // Insert value (sorted in ascending order).
          outer: do { // Just used for break goto
            for (var i = 0; i < distribution.length; ++i) {
              if (abs <= distribution[i]) {
                distribution.splice(i, 0, abs);
                break outer;
              }
            }
            distribution.push(abs);
          } while (false);
          // Factor is scale divided by 33rd percentile.
          var factor = scale / distribution[Math.floor(distribution.length / 3)];
          if (distribution.length == 500) done = factor;
          return n * factor;
        };
      }();



      _that.slug = function(str) {
          str = str.replace(/^\s+|\s+$/g, ''); // trim
          str = str.toLowerCase();

          // remove accents, swap ñ for n, etc
          var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
          var to   = "aaaaaeeeeeiiiiooooouuuunc------";
          for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
          }

          str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

          return str;
        };





       _that.hourStringToObject = function(str){

          var mat = str.match(/(\d{1,2}):?(\d{1,2})?:?(\d{0,2})?/)

          var obj = {};
          obj.h = parseInt(mat[1])
          obj.m = mat[2] != undefined ? parseInt(mat[2]) : 00
          obj.s = mat[3] != undefined ? parseInt(mat[3]) : 00

          return obj;
       };


     _that.random_color = function() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    }


      
      _that.math = {



        fromToInterpolation: function(fromMin, fromMax, toMin, toMax, value, limit){

                      var a = (toMin - toMax)/(fromMin - fromMax);
                      var b = toMin - (a*fromMin);

                      var y = a*value + b;

                      if(limit){
                          if(toMin < toMax){
                           return this.clamp(y,toMin,toMax);
                        }else{
                            return this.clamp(y,toMax,toMin);
                        }
                      } else{
                          return y;
                      }
        },


/**@
     * #Crafty.math.abs
     * @comp Crafty.math
     * @sign public this Crafty.math.abs(Number n)
     * @param n - Some value.
     * @return Absolute value.
     *
     * Returns the absolute value.
     */
    abs: function (x) {
        return x < 0 ? -x : x;
    },

    /**@
     * #Crafty.math.amountOf
     * @comp Crafty.math
     * @sign public Number Crafty.math.amountOf(Number checkValue, Number minValue, Number maxValue)
     * @param checkValue - Value that should checked with minimum and maximum.
     * @param minValue - Minimum value to check.
     * @param maxValue - Maximum value to check.
     * @return Amount of checkValue compared to minValue and maxValue.
     *
     * Returns the amount of how much a checkValue is more like minValue (=0)
     * or more like maxValue (=1)
     */
    amountOf: function (checkValue, minValue, maxValue) {
        if (minValue < maxValue)
            return (checkValue - minValue) / (maxValue - minValue);
        else
            return (checkValue - maxValue) / (minValue - maxValue);
    },


    /**@
     * #Crafty.math.clamp
     * @comp Crafty.math
     * @sign public Number Crafty.math.clamp(Number value, Number min, Number max)
     * @param value - A value.
     * @param max - Maximum that value can be.
     * @param min - Minimum that value can be.
     * @return The value between minimum and maximum.
     *
     * Restricts a value to be within a specified range.
     */
    clamp: function (value, min, max) {
        if (value > max)
            return max;
        else if (value < min)
            return min;
        else
            return value;
    },

    /**@
     * Converts angle from degree to radian.
     * @comp Crafty.math
     * @param angleInDeg - The angle in degree.
     * @return The angle in radian.
     */
    degToRad: function (angleInDeg) {
        return angleInDeg * Math.PI / 180;
    },

    /**@
     * #Crafty.math.distance
     * @comp Crafty.math
     * @sign public Number Crafty.math.distance(Number x1, Number y1, Number x2, Number y2)
     * @param x1 - First x coordinate.
     * @param y1 - First y coordinate.
     * @param x2 - Second x coordinate.
     * @param y2 - Second y coordinate.
     * @return The distance between the two points.
     *
     * Distance between two points.
     */
    distance: function (x1, y1, x2, y2) {
        var squaredDistance = this.squaredDistance(x1, y1, x2, y2);
        return Math.sqrt(parseFloat(squaredDistance));
    },


    distance3d:function(x1,y1,z1,x2,y2,z2){
              var xd = x2-x1;
              var yd = y2-y1;
              var zd = z2-z1;
             return Math.sqrt(parseFloat(xd*xd + yd*yd + zd*zd));
      },


    /**@
     * #Crafty.math.lerp
     * @comp Crafty.math
     * @sign public Number Crafty.math.lerp(Number value1, Number value2, Number amount)
     * @param value1 - One value.
     * @param value2 - Another value.
     * @param amount - Amount of value2 to value1.
     * @return Linear interpolated value.
     *
     * Linear interpolation. Passing amount with a value of 0 will cause value1 to be returned,
     * a value of 1 will cause value2 to be returned.
     */
    lerp: function (value1, value2, amount) {
        return value1 + (value2 - value1) * amount;
    },

    /**@
     * #Crafty.math.negate
     * @comp Crafty.math
     * @sign public Number Crafty.math.negate(Number percent)
     * @param percent - If you pass 1 a -1 will be returned. If you pass 0 a 1 will be returned.
     * @return 1 or -1.
     *
     * Returnes "randomly" -1.
     */
    negate: function (percent) {
        if (Math.random() < percent)
            return -1;
        else
            return 1;
    },

    /**@
     * #Crafty.math.radToDeg
     * @comp Crafty.math
     * @sign public Number Crafty.math.radToDeg(Number angle)
     * @param angleInRad - The angle in radian.
     * @return The angle in degree.
     *
     * Converts angle from radian to degree.
     */
    radToDeg: function (angleInRad) {
        return angleInRad * 180 / Math.PI;
    },

    /**@
     * #Crafty.math.randomElementOfArray
     * @comp Crafty.math
     * @sign public Object Crafty.math.randomElementOfArray(Array array)
     * @param array - A specific array.
     * @return A random element of a specific array.
     *
     * Returns a random element of a specific array.
     */
    randomElementOfArray: function (array) {
        return array[Math.floor(array.length * Math.random())];
    },

    /**@
     * #Crafty.math.randomInt
     * @comp Crafty.math
     * @sign public Number Crafty.math.randomInt(Number start, Number end)
     * @param start - Smallest int value that can be returned.
     * @param end - Biggest int value that can be returned.
     * @return A random int.
     *
     * Returns a random int in within a specific range.
     */
    randomInt: function (start, end) {
        return start + Math.floor((1 + end - start) * Math.random());
    },

    /**@
     * #Crafty.math.randomNumber
     * @comp Crafty.math
     * @sign public Number Crafty.math.randomInt(Number start, Number end)
     * @param start - Smallest number value that can be returned.
     * @param end - Biggest number value that can be returned.
     * @return A random number.
     *
     * Returns a random number in within a specific range.
     */
    randomNumber: function (start, end) {
        return start + (end - start) * Math.random();
    },

    /**@
     * #Crafty.math.squaredDistance
     * @comp Crafty.math
     * @sign public Number Crafty.math.squaredDistance(Number x1, Number y1, Number x2, Number y2)
     * @param x1 - First x coordinate.
     * @param y1 - First y coordinate.
     * @param x2 - Second x coordinate.
     * @param y2 - Second y coordinate.
     * @return The squared distance between the two points.
     *
     * Squared distance between two points.
     */
    squaredDistance: function (x1, y1, x2, y2) {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    },

    /**@
     * #Crafty.math.withinRange
     * @comp Crafty.math
     * @sign public Boolean Crafty.math.withinRange(Number value, Number min, Number max)
     * @param value - The specific value.
     * @param min - Minimum value.
     * @param max - Maximum value.
     * @return Returns true if value is within a specific range.
     *
     * Check if a value is within a specific range.
     */
    withinRange: function (value, min, max) {
        return (value >= min && value <= max);
    }
};



   _that.parseHTML = function(html, idStr) {
      var root = document.createElement("div");
      root.innerHTML = html;
      // Get all child nodes of root div
      var allChilds = root.childNodes;
      for (var i = 0; i < allChilds.length; i++) {
        if (allChilds[i].id && allChilds[i].id == idStr) {
          delete root;
          return allChilds[i];
        }
      }
       return false;
  }

  //retorno uma pagina do concrete5 tirando as coisas basicas que são carregadas de primeira
  _that.parseC5page = function(html){


     return String(html)
                      .replace(/<\!DOCTYPE[^>]*>/i, '')
                      .replace(/<(html|head|body|title|meta)([\s\>])/gi,'<div style="display:none" class="document-$1"$2')
                      .replace(/<\/(html|head|body|title|meta)\>/gi,'</div>')
                      .replace(/.*js\/jquery.js.*/,'')
                       .replace(/.*js\/ccm.base.js.*/,'');

  }



  return _that;

})();





function log(a){
  $("#info").text(a);
}





//sliderrr

(function ($) {

    var PPSliderClass = function (el, opts) {
        var element = $(el);
        var options = opts;
        var isMouseDown = false;
        var currentVal = 0;

        element.wrap('<div/>')
        var container = $(el).parent();

        currentVal = $(el).val();

        container.addClass('pp-slider');
        container.addClass('clearfix');

        container.append('<div class="pp-slider-min">-</div><div class="pp-slider-scale"><div class="pp-slider-button"><div class="pp-slider-divies"></div></div><div class="pp-slider-tooltip"></div></div><div class="pp-slider-max">+</div>');
        
        if (typeof(options) != 'undefined' && typeof(options.hideTooltip) != 'undefined' && options.hideTooltip == true)
        {
          container.find('.pp-slider-tooltip').hide();
        }

        if (typeof(options.width) != 'undefined')
        {
          container.css('width',(options.width+'px'));
        }
        container.find('.pp-slider-scale').css('width',(container.width()-30)+'px');

           container.find('.pp-slider-button').css("left", ((container.width()-30)/2)+'px');

        var startSlide = function (e) {            
          
          isMouseDown = true;
          var pos = getMousePosition(e);
          startMouseX = pos.x;
          
          lastElemLeft = ($(this).offset().left - $(this).parent().offset().left);
          updatePosition(e);

          return false;
        };


        
        var getMousePosition = function (e) {
          //container.animate({ scrollTop: rowHeight }, options.scrollSpeed, 'linear', ScrollComplete());
          var posx = 0;
          var posy = 0;

          if (!e) var e = window.event;

          if (e.pageX || e.pageY) {
            posx = e.pageX;
            posy = e.pageY;
          }
          else if (e.clientX || e.clientY) {
            posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
            posy = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
          }

          return { 'x': posx, 'y': posy };
        };

        var updatePosition = function (e) {
          var pos = getMousePosition(e);

          var spanX = (pos.x - startMouseX);

          var newPos = (lastElemLeft + spanX)
          var upperBound = (container.find('.pp-slider-scale').width()-container.find('.pp-slider-button').width());
          newPos = Math.max(0,newPos);
          newPos = Math.min(newPos,upperBound);
          currentVal = Math.round((newPos/upperBound)*100,0);

          vtlTrigger('vEV_SIMULADOR_SLIDE',currentVal);

          container.find('.pp-slider-button').css("left", newPos);
          container.find('.pp-slider-tooltip').html(currentVal+'%');
          container.find('.pp-slider-tooltip').css('left', newPos-6);
        };

        var moving = function (e) {
          if(isMouseDown){
            updatePosition(e);
            return false;
          }
        };

        var dropCallback = function (e) {
          isMouseDown = false;
          element.val(currentVal);
          if(typeof element.options != 'undefined' && typeof element.options.onChanged == 'function'){
            element.options.onChanged.call(this, null);
          }

        };

        container.find('.pp-slider-button').bind('mousedown',startSlide);

        $(document).mousemove(function(e) { moving(e); });
        $(document).mouseup(function(e){ dropCallback(e); });
        
    };

    /*******************************************************************************************************/

    $.fn.PPSlider = function (options) {
        var opts = $.extend({}, $.fn.PPSlider.defaults, options);

        return this.each(function () {
            new PPSliderClass($(this), opts);
        });
    }

    $.fn.PPSlider.defaults = {
        width: 150,
        hideTooltip:true
    };


})(jQuery);















