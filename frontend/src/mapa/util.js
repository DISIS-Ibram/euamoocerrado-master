

var _XMOVEMAPA = 558447
var _YMOVEMAPA = 185317
var _SCALEMAP = 0.10463600819214298


/////////////////////////////////////////////////
//  UTILITARIOS
/////////////////////////////////////////////////

    var vtlu = {}

  

    //converto as cordenadas entre lat e long e o plano cartesiano do mapa
   vtlu.toMercator = function(lat,lon) {
            var x = lon * 20037508.34 / 180;
            var y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180);
            y = -y * 20037508.34 / 180;
            //converto para o tamanho do meu mapa
            x = x * _SCALEMAP + _XMOVEMAPA;
            y = y * _SCALEMAP - _YMOVEMAPA;
            return [x, y];
      },

    vtlu.inverseMercator = function(y,x) {
            //converto do tamanho do meu mapa
            x = (x - _XMOVEMAPA) / _SCALEMAP;
            y = -(y + _YMOVEMAPA) / _SCALEMAP;
            var lon = (x / 20037508.34) * 180;
            var lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return [lon,lat];
      };


     vtlu.inverseMercatorGoogleInit = function(x, y) {
            //converto do tamanho do meu mapa
            x = (x - _XMOVEMAPA) / 1;
            y = -(y + _YMOVEMAPA) / 1;
            var lon = (x / 20037508.34) * 180;
            var lat = (y / 20037508.34) * 180;
            lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
            return [lat,lon];
      };


     vtlu.normalizeWheelDelta = function() {
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


      vtlu.slug = function(str) {
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



    //    _that.hourStringToObject = function(str){

    //       var mat = str.match(/(\d{1,2}):?(\d{1,2})?:?(\d{0,2})?/)

    //       var obj = {};
    //       obj.h = parseInt(mat[1])
    //       obj.m = mat[2] != undefined ? parseInt(mat[2]) : 00
    //       obj.s = mat[3] != undefined ? parseInt(mat[3]) : 00

    //       return obj;
    //    };


     vtlu.random_color = function() {
      var letters = '0123456789ABCDEF'.split('');
      var color = '#';
      for (var i = 0; i < 6; i++ ) {
          color += letters[Math.round(Math.random() * 15)];
      }
      return color;
    }



export default vtlu;
