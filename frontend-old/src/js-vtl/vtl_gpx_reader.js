var _MAX_POINT_INTERVAL_MS = 15000;
var _SECOND_IN_MILLIS = 1000;
var _MINUTE_IN_MILLIS = 60 * _SECOND_IN_MILLIS;
var _HOUR_IN_MILLIS = 60 * _MINUTE_IN_MILLIS;

var _DEFAULT_MARKER_OPTS = {
  startIconUrl: 'pin-icon-start.png',
  endIconUrl: 'pin-icon-end.png',
  shadowUrl: 'pin-shadow.png',
  iconSize: [33, 50],
  shadowSize: [50, 50],
  iconAnchor: [16, 45],
  shadowAnchor: [16, 47]
};
var _DEFAULT_POLYLINE_OPTS = {
    color:'blue'
};







vtl.GPXFROMGEOGJON = Class.extend({

// _trechos
//           .nome
//           .dist
//           .pis0
//           .pis1

// _pis
//       .nome
//       .pt ()
//       .dist

// _percursos
//           .nome
//           .kminicio
//           .dist
// _points
// _info
//        .length



  _points:[],
  _tracks:[],
  _pointsFromTime:[],
  _trechos:[],
  _percursos:[],
  _pis:[],

  _trechosPercursos:[],

  init: function(gpx, options) {

    options.max_point_interval = options.max_point_interval || _MAX_POINT_INTERVAL_MS;
    options.marker_options = this._merge_objs(
      _DEFAULT_MARKER_OPTS,
      options.marker_options || {});
    options.polyline_options = this._merge_objs(
      _DEFAULT_POLYLINE_OPTS,
      options.polyline_options || {});

   // L.Util.setOptions(this, options);

    // Base icon class for track pins.
  //  L.GPXTrackIcon = L.Icon.extend({ options: options.marker_options });


    this._trechos=[],
    this._percursos=[],
    this._pis=[],
    this._trechosPercursos=[],

    this._gpx = gpx;
    this._layers = {};
    this._info = {
      points:[],
      kms:null,
      pointsXY:[],
      name: null,
      length: 0.0,
      elevation: {gain: 0.0, loss: 0.0, _points: []},
      hr: {avg: 0, _total: 0, _points: []},
      duration: {start: null, end: null, moving: 0, total: 0},
    };

    if (gpx) {
      this._parse(gpx, options, options.async,options.func);
    }

    return this;

  },

  get_duration_string: function(duration, hidems) {
    var s = '';

    if (duration >= _HOUR_IN_MILLIS) {
      s += Math.floor(duration / _HOUR_IN_MILLIS) + ':';
      duration = duration % _HOUR_IN_MILLIS;
    }

    var mins = Math.floor(duration / _MINUTE_IN_MILLIS);
    duration = duration % _MINUTE_IN_MILLIS;
    if (mins < 10) s += '0';
    s += mins + '\'';

    var secs = Math.floor(duration / _SECOND_IN_MILLIS);
    duration = duration % _SECOND_IN_MILLIS;
    if (secs < 10) s += '0';
    s += secs;

    if (!hidems && duration > 0) s += '.' + Math.round(Math.floor(duration)*1000)/1000;
    else s += '"';

    return s;
  },

  to_miles:            function(v) { return v / 1.60934; },
  to_ft:               function(v) { return v * 3.28084; },
  m_to_km:             function(v) { return v / 1000; },
  m_to_mi:             function(v) { return v / 1609.34; },

  get_km_points: function(){  return this._get_km_points(); },

  get_name:            function() { return this._info.name; },
  get_distance:        function() { return this._info.length; },
  get_distance_imp:    function() { return this.to_miles(this.m_to_km(this.get_distance())); },

  get_start_time:      function() { return this._info.duration.start; },
  get_end_time:        function() { return this._info.duration.end; },
  get_moving_time:     function() { return this._info.duration.moving; },
  get_total_time:      function() { return this._info.duration.total; },

  get_moving_pace:     function() { return this.get_moving_time() / this.m_to_km(this.get_distance()); },
  get_moving_pace_imp: function() { return this.get_moving_time() / this.get_distance_imp(); },

  get_points: function() { return this._info.points },
  get_elevation_gain:     function() { return this._info.elevation.gain; },
  get_elevation_loss:     function() { return this._info.elevation.loss; },
  get_elevation_data:     function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' m'; });
      });
  },
  get_elevation_data_imp: function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, _this.to_ft,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' ft'; });
      });
  },

  get_average_hr:         function() { return this._info.hr.avg; },
  get_heartrate_data:     function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' bpm'; });
      });
  },
  get_heartrate_data_imp: function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, null,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' bpm'; });
      });
  },

  // Private methods




    _get_km_points: function(){

        if(this._info.kms !== null) return this._info.kms;

         var totalDist = this._info.length;
         var pointsKms = [];

         //pego de um em 1 km, ate a distancia total
         for (var i = 0; i < totalDist; i=i+1000) {
            pointsKms.push(this._getPointInKm(i/1000));
         };

         this._info.kms = pointsKms;
         return pointsKms;

    },




    _get_km_points_fast: function(){
        var pointsKm = [];
        var nextKm = 0;
        var smallDist = 1000;
        var ppAtual = this._info.points[0];
        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];

          //vejo qual dos dois esta mais perto do km desejado
          var distA = Math.abs(ppA._dist - nextKm*1000);
          var distB = Math.abs(ppB._dist - nextKm*1000);

          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }

          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao salvo ele e movo para o proximo km
          if(dist>smallDist){
            nextKm ++;
            pointsKm.push(ppAtual);
            smallDist = 1000;
          }else{
            smallDist = dist;
            ppAtual = pp;
          }
        };
        return pointsKm;
    },



    _get_points_avarege_dist: function(minDist,pointsSource){
         var points = [];
         var distAtual = 100;
         pointsSource = pointsSource || this._info.points;

         var ppAtual = pointsSource[0];
         points.push(pointsSource[0]);

         for (var i=1, j=pointsSource.length; i<j; i++) {
            pp = pointsSource[i];
            if((pp._dist - ppAtual._dist)>=minDist){
              ppAtual = pp;
              points.push(pp);
            }
        }
        return points;
    },



    _get_points_fromKM_toKM: function(kmA,kmB){
        return this._getPointsInTrecho(kmA,kmB);
    },




    _getPointsInTrecho: function(kmA,kmB){
          var points = [];

          points.push(this._getPointInKm(kmA));

         for (var i=0, j=this._info.points.length; i<j; i++) {
            ppA = this._info.points[i];

            if(ppA._dist>kmA*1000 && ppA._dist<kmB*1000){
                points.push(ppA);
            }

         }
       //   points.push(this._getPointInKm(kmB));

          points = this._get_points_avarege_dist(60,points);

          return points;

    },


    _getPointInKm: function(km){

        var smallDist,ppAtual,p0,p1;

         smallDist = this._info.length; // coloco a menor distancia o tamanho todo, para ir diminuindo a partir dele
         ppAtual = this._info.points[0];
         // p0;
         // p1;

        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];
          //vejo qual dos dois esta mais perto do km desejado
          var distA = Math.abs(ppA._dist - km*1000);
          var distB = Math.abs(ppB._dist - km*1000);
          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }
          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao pego oo meno mais perto possivel, e o maior mais perto possivel
          if(dist>smallDist){
            p0 = ppAtual;
            p1 = pp;
            break;
          }else{
            //so sempre garando um valor para eles caso a km seja perto do final  
            p0 = ppAtual;
            p1 = pp;

            smallDist = dist;
            ppAtual = pp;

          }
        };

        //agora que tenho o maior e o menor mais perto possivel, pego o kilometro exato usando regra de 3
        xKmCerto = vtl.Util.math.fromToInterpolation(p0._dist, p1._dist, p0._x, p1._x, km*1000);
        yKmCerto = vtl.Util.math.fromToInterpolation(p0._dist, p1._dist, p0._y, p1._y, km*1000);

         // xKmCerto = p1._x;
         // yKmCerto = p1._y;

  // console.log("km é:"+km+" p0._x:"+p0._x+" p0._y:"+p0._y+" p1._x:"+p1._x+" p1._y:"+p1._y);
  //     console.log(" xKmCerto:"+xKmCerto+" yKmCerto"+yKmCerto);


        //crio o ponto
        var point = new LatLng().xy(xKmCerto,yKmCerto);
        point._dist = km*1000;
        return point;
    },







    _getPointInTime: function(tempo){ //tempo em segundos
        var smallTime = this._info.duration.total; // coloco a menor distancia o tamanho todo, para ir diminuindo a partir dele

        if(smallTime)
        var ppAtual = this._info.points[0];
        var p0;
        var p1;

        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];

          //vejo qual dos dois esta mais perto do tempo desejado
          var distA = Math.abs(ppA._runtime - tempo*1000);
          var distB = Math.abs(ppB._runtime - tempo*1000);
          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }
          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao pego oo meno mais perto possivel, e o maior mais perto possivel
          if(dist>smallTime){
            p0 = ppAtual;
            p1 = pp;
            break;
          }else{
                     //so sempre garando um valor para eles caso a km seja perto do final  
            p0 = ppAtual;
            p1 = pp;

            smallTime = dist;
            ppAtual = pp;
          }
        };


        //agora que tenho o maior e o menor mais perto possivel, pego o kilometro exato usando regra de 3
        xKmCerto = vtl.Util.math.fromToInterpolation(p0._runtime, p1._runtime, p0._x, p1._x, tempo*1000);
        yKmCerto = vtl.Util.math.fromToInterpolation(p0._x, p1._x, p0._y, p1._y, xKmCerto);

        distCerto = vtl.Util.math.fromToInterpolation(p0._runtime, p1._runtime, p0._dist, p1._dist, tempo*1000);

        //crio o ponto
        var point = new LatLng().xy(xKmCerto,yKmCerto);
        point._runtime = tempo*1000;
        point._dist = distCerto;

        return point;
    },






  _merge_objs: function(a, b) {
    var _ = {};
    for (var attr in a) { _[attr] = a[attr]; }
    for (var attr in b) { _[attr] = b[attr]; }
    return _;
  },



  _prepare_data_point: function(p, trans1, trans2, trans_tooltip) {
    var r = [trans1 && trans1(p[0]) || p[0], trans2 && trans2(p[1]) || p[1]];
    r.push(trans_tooltip && trans_tooltip(r[0], r[1]) || (r[0] + ': ' + r[1]));
    return r;
  },






  _load_xml: function(url, cb, options, async) {
    if (async == undefined) async = this.options.async;
    if (options == undefined) options = this.options;

    // var req = new window.XMLHttpRequest();
    // req.open('GET', url, async);
    // try {
    //   req.overrideMimeType('text/xml'); // unsupported by IE
    // } catch(e) {}
    // req.onreadystatechange = function() {
    //   if (req.readyState != 4) return;
    //   if(req.status == 200) cb(req.responseXML, options);
    // };
    // req.send(null);

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'json',
      data: {param1: 'value1'},
      complete: function(xhr, textStatus) {
        //called when complete
      },
      success: function(data, textStatus, xhr) {
       cb(data, options);
      },
      error: function(xhr, textStatus, errorThrown) {
        //called when there is an error
      }
    });

  },




  _parse: function(url, options, async, func) {
    var _this = this;
   
    var cb = function(gpx, options) {
      var layers = _this._parse_geojson_data(gpx, options);

      if(func)
        options.scope[func].call( options.scope,_this);

     // if (!layers) return;
     // _this.addLayer(layers);
     // _this.fire('loaded');
    }


    this._load_xml(url, cb, options, async);
  },




    toHtml: function (r) {
      if(r==undefined)r="";
      var ii;
      var newline = r.indexOf('\r\n') != -1 ? '\r\n' : r.indexOf('\n') != -1 ? '\n' : '';
      r = r.replace(/</gm, '&lt;');
      r = r.replace(/^### (.*)=*/gm, '<h5>$1</h5>');
      r = r.replace(/^## (.*)=*/gm, '<h4>$1</h4>');
      r = r.replace(/^# (.*)=*/gm, '<h3>$1</h3>');
      r = r.replace(/^[-*][-*][-*]+/gm, '<hr>');
      r = r.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      r = r.replace(/\*(.*?)\*/g, '<em>$1</em>');
      r = r.replace(/^\*\* (.*)/gm, '<ul><ul><li>$1</li></ul></ul>');
      r = r.replace(/^\* (.*)/gm, '<ul><li>$1</li></ul>');
      for (ii = 0; ii < 3; ii++) r = r.replace(new RegExp('</ul>' + newline + '<ul>', 'g'), newline);
      r = r.replace(/(\[\[http)/g, '[[h_t_t_p');
      r = r.replace(/({{http)/g, '{{h_t_t_p');
      r = r.replace(/(https?[^ \)]*)/g, '<a target="_blank" href="$1">$1</a>');
      r = r.replace(/\[\[(h_t_t_ps?:[^\]|]*?)\]\]/g, '<a target="_blank" href="$1">$1</a>');
      r = r.replace(/\[\[(h_t_t_ps?:[^|]*?)\|(.*?)\]\]/g, '<a target="_blank" href="$1">$2</a>');
      r = r.replace(/\[\[([^\]|]*?)\]\]/g, '<a href="$1">$1</a>');
      r = r.replace(/\[\[([^|]*?)\|(.*?)\]\]/g, '<a href="$1">$2</a>');
      r = r.replace(/{{([^\]|]*?)}}/g, '<img src="$1">');
      r = r.replace(/{{([^|]*?)\|(.*?)}}/g, '<img src="$1" alt="$2">');
      r = r.replace(/(h_t_t_p)/g, 'http');
      r = r.replace(/<<(.*?)>>/g, '<embed class="video" src="$1" allowfullscreen="true" allowscriptaccess="never" type="application/x-shockwave/flash"></embed>');
      if (newline) r = r.replace(new RegExp(newline, 'g'), '<br>' + newline);
      return r;
  },


    //mudar para gson


    _parse_geojson_data: function(xml, options) {

          var j, i, el, layers = [];
          var percursoCoord = [];


           //processo os json
           if (xml.hasOwnProperty("features")) {
                for (var i = 0; i < xml["features"].length; i++) {
                  var obj = xml["features"][i];

                  if (obj.properties.name == "percurso" && obj.geometry.type=="LineString"){
                    percursoCoord = obj.geometry.coordinates
                  }


                  //se for trecho, processo ele - Na verdade Trecho é o PI LETODO: Mudar nome trecho aqui no no editor de trecho para PI

                  if(obj.properties._storage_options.tipotrecho == "percurso" || obj.properties._storage_options.tipotrecho == "trecho"){

                      var trechoLoc = new LatLng(obj.geometry.coordinates[1],obj.geometry.coordinates[0]);

                      var trecho = obj.properties._storage_options; //aqui ja passo abertura, distancia,fechamento,tipotrecho,PI
                      trecho.LatLng = trechoLoc;



                      
                      trecho.nome = obj.properties.name;
                      trecho.info = obj.properties.description;


                     // console.log(obj.properties.description_en);

                      if(LANG){
                        if(LANG == "en"){
                         if(obj.properties._storage_options.name_en !="")  trecho.nome = obj.properties._storage_options.name_en;
                         if(obj.properties._storage_options.description_en !="")  trecho.info = obj.properties._storage_options.description_en;
                        }
                      }

                      



                      trecho.info =  this.toHtml(trecho.info);

                      trecho.tipo = trecho.tipotrecho;

                      //se for trecho, vou processar ele depois
                      if(trecho.tipotrecho=="trecho"){
                        this._pis.push(trecho);

                      //se for percurso, adicino ele  
                      }else  if(trecho.tipotrecho=="percurso"){
                        trecho.dist = parseFloat(trecho.distancia);
                        trecho.km = parseFloat(trecho.kminicio);
                        this._percursos.push(trecho);
                      }
                  }
                };
            }


              //** Processo o percurso mesmo, onde vou convertes as lat e long e elevation 
              var coords = this._parse_GeoLineString(percursoCoord, options);



              //** Processo os PIS
              
                //1- pego em que km do percurso o pi esta
                var kminicio = 0;
                var smallDist = this._info.length;
                var currponto = coords[0];

                for (var i = 0; i < this._pis.length; i++) {
                    var tt = this._pis[i];
                    smallDist = this._info.length;
                    this._pis[i].kminicio = kminicio;

                    //faco um loop para ver qual é o ponto no percurso mais perto dele
                    for (var j = 0; j < coords.length; j++) {
                      var pontoatual = coords[j];
                      var dist = this._dist2d(tt.LatLng,pontoatual)
                      
                      if(dist<smallDist){
                         var currponto = pontoatual;
                          smallDist = dist;
                          this._pis[i].km = pontoatual._dist
                      }
                    };
                };


              //2 - ordeno eles conforme a km
              this._pis = this._pis.sort(function(a,b){ 
                                        var x = a.km < b.km ? -1:1; 
                                        return x; 
               });
              //so me certifico que a largada tem o km 0 mesmo
              this._pis[0].km = 0; 



            //** Processo os Trechos
              var totaldist = 0;
              for (var i = 0; i < this._pis.length-1; i++) {

                 var distancia = this._pis[i].km-totaldist;
                 totaldist += distancia;



                 var trecho = {nome:(vtlMsg.trecho+" "+(i+1)),
                              tipo:"trecho",
                              km:this._pis[i].km,
                              dist: parseFloat(((this._pis[i+1].km-this._pis[i].km)).toFixed(2)),
                              distInfo: parseFloat(((this._pis[i+1].km-this._pis[i].km)/1000).toFixed(2)),
                              pi0:this._pis[i],
                              pi1:this._pis[i+1],

                              }

                  this._trechos.push(trecho);

                  this._pis[i].dist = trecho.dist;
                    this._pis[i].distancia = trecho.dist;
              }


              this._info.hr.avg = Math.round(this._info.hr._total / this._info.hr._points.length);
              if (!layers.length) return;
              var layer = layers[0];

  },









  // _parse_GeoLineString: function(line, xml, options, tag) {

      _parse_GeoLineString: function(xml, options) {

    //var el = line.getElementsByTagName(tag);
   // if (!el.length) return [];
    var coords = [];
    var last = null;
    var timeStartSeconds = 0
    var timeEndSeconds = 24*60*60

    var el = xml;


    for (var i = 0; i < el.length; i++) {
     // try{

                  var _, ll = new LatLng(
                  el[i][1],
                  el[i][0]);

                  ll.meta = { time: null, ele: null, hr: null };

                  ll._dist = 0; //so para o primeiro objeto ter distancia tb

    
               //   _ = el[i][2];
               //   if (_.length > 0) {
                    ll.meta.ele = el[i][2];
                //  }


                  // _ = el[i].getElementsByTagNameNS('*', 'hr');
                  // if (_.length > 0) {
                  //   ll.meta.hr = parseInt(_[0].textContent);
                  //   this._info.hr._points.push([this._info.length, ll.meta.hr]);
                  //   this._info.hr._total += ll.meta.hr;
                  // }



                  this._info.elevation._points.push([this._info.length, ll.meta.ele]);
                  this._info.duration.end = ll.meta.time;

                  this._info.points.push(ll);


                  if (last != null) {

                    this._info.length += this._dist3d(last, ll);
                    ll._dist = this._info.length;

                    var t = ll.meta.ele - last.meta.ele;
                    if (t > 0) this._info.elevation.gain += t;
                    else this._info.elevation.loss += Math.abs(t);

                    t = Math.abs(ll.meta.time - last.meta.time);
                    this._info.duration.total += t;
                    ll._runtime = this._info.duration.total;

                    if (t < options.max_point_interval) this._info.duration.moving += t;

                  } else {
                    this._info.duration.start = ll.meta.time;
                  }

                  last = ll;
                  coords.push(ll);

     //   }catch(e){}

    }// end for


    return coords;
  },












  _dist2d: function(a, b) {
    var R = 6371000;
    var dLat = this._deg2rad(b.lat - a.lat);
    var dLon = this._deg2rad(b.lng - a.lng);
    var r = Math.sin(dLat/2) *
      Math.sin(dLat/2) +
      Math.cos(this._deg2rad(a.lat)) *
      Math.cos(this._deg2rad(b.lat)) *
      Math.sin(dLon/2) *
      Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1-r));
    var d = R * c;
    return d;
  },

  _dist3d: function(a, b) {
    var planar = this._dist2d(a, b);
    var height = Math.abs(b.meta.ele - a.meta.ele);
    return Math.sqrt(Math.pow(planar, 2) + Math.pow(height, 2));
  },

  _deg2rad: function(deg) {
    return deg * Math.PI / 180;
  }
});











































vtl.GPX = Class.extend({

  _points:[],
  _tracks:[],
  _pointsFromTime:[],

  init: function(gpx, options) {

    options.max_point_interval = options.max_point_interval || _MAX_POINT_INTERVAL_MS;
    options.marker_options = this._merge_objs(
      _DEFAULT_MARKER_OPTS,
      options.marker_options || {});
    options.polyline_options = this._merge_objs(
      _DEFAULT_POLYLINE_OPTS,
      options.polyline_options || {});

   // L.Util.setOptions(this, options);

    // Base icon class for track pins.
  //  L.GPXTrackIcon = L.Icon.extend({ options: options.marker_options });

    this._gpx = gpx;
    this._layers = {};
    this._info = {
      points:[],
      kms:null,
      pointsXY:[],
      name: null,
      length: 0.0,
      elevation: {gain: 0.0, loss: 0.0, _points: []},
      hr: {avg: 0, _total: 0, _points: []},
      duration: {start: null, end: null, moving: 0, total: 0},
    };

    if (gpx) {
      this._parse(gpx, options, options.async,options.func);
    }

    return this;

  },

  get_duration_string: function(duration, hidems) {
    var s = '';

    if (duration >= _HOUR_IN_MILLIS) {
      s += Math.floor(duration / _HOUR_IN_MILLIS) + ':';
      duration = duration % _HOUR_IN_MILLIS;
    }

    var mins = Math.floor(duration / _MINUTE_IN_MILLIS);
    duration = duration % _MINUTE_IN_MILLIS;
    if (mins < 10) s += '0';
    s += mins + '\'';

    var secs = Math.floor(duration / _SECOND_IN_MILLIS);
    duration = duration % _SECOND_IN_MILLIS;
    if (secs < 10) s += '0';
    s += secs;

    if (!hidems && duration > 0) s += '.' + Math.round(Math.floor(duration)*1000)/1000;
    else s += '"';

    return s;
  },

  to_miles:            function(v) { return v / 1.60934; },
  to_ft:               function(v) { return v * 3.28084; },
  m_to_km:             function(v) { return v / 1000; },
  m_to_mi:             function(v) { return v / 1609.34; },

  get_km_points: function(){  return this._get_km_points(); },

  get_name:            function() { return this._info.name; },
  get_distance:        function() { return this._info.length; },
  get_distance_imp:    function() { return this.to_miles(this.m_to_km(this.get_distance())); },

  get_start_time:      function() { return this._info.duration.start; },
  get_end_time:        function() { return this._info.duration.end; },
  get_moving_time:     function() { return this._info.duration.moving; },
  get_total_time:      function() { return this._info.duration.total; },

  get_moving_pace:     function() { return this.get_moving_time() / this.m_to_km(this.get_distance()); },
  get_moving_pace_imp: function() { return this.get_moving_time() / this.get_distance_imp(); },

  get_points: function() { return this._info.points },
  get_elevation_gain:     function() { return this._info.elevation.gain; },
  get_elevation_loss:     function() { return this._info.elevation.loss; },
  get_elevation_data:     function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' m'; });
      });
  },
  get_elevation_data_imp: function() {
    var _this = this;
    return this._info.elevation._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, _this.to_ft,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' ft'; });
      });
  },

  get_average_hr:         function() { return this._info.hr.avg; },
  get_heartrate_data:     function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_km, null,
        function(a, b) { return a.toFixed(2) + ' km, ' + b.toFixed(0) + ' bpm'; });
      });
  },
  get_heartrate_data_imp: function() {
    var _this = this;
    return this._info.hr._points.map(
      function(p) { return _this._prepare_data_point(p, _this.m_to_mi, null,
        function(a, b) { return a.toFixed(2) + ' mi, ' + b.toFixed(0) + ' bpm'; });
      });
  },

  // Private methods




    _get_km_points: function(){

        if(this._info.kms !== null) return this._info.kms;

         var totalDist = this._info.length;
         var pointsKms = [];

         //pego de um em 1 km, ate a distancia total
         for (var i = 0; i < totalDist; i=i+1000) {
            pointsKms.push(this._getPointInKm(i/1000));
         };

         this._info.kms = pointsKms;
         return pointsKms;

    },




    _get_km_points_fast: function(){
        var pointsKm = [];
        var nextKm = 0;
        var smallDist = 1000;
        var ppAtual = this._info.points[0];
        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];

          //vejo qual dos dois esta mais perto do km desejado
          var distA = Math.abs(ppA._dist - nextKm*1000);
          var distB = Math.abs(ppB._dist - nextKm*1000);

          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }

          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao salvo ele e movo para o proximo km
          if(dist>smallDist){
            nextKm ++;
            pointsKm.push(ppAtual);
            smallDist = 1000;
          }else{
            smallDist = dist;
            ppAtual = pp;
          }
        };
        return pointsKm;
    },



    _get_points_avarege_dist: function(minDist,pointsSource){
         var points = [];
         var distAtual = 100;
         pointsSource = pointsSource || this._info.points;

         var ppAtual = pointsSource[0];
         points.push(pointsSource[0]);

         for (var i=1, j=pointsSource.length; i<j; i++) {
            pp = pointsSource[i];
            if((pp._dist - ppAtual._dist)>=minDist){
              ppAtual = pp;
              points.push(pp);
            }
        }
        return points;
    },



    _get_points_fromKM_toKM: function(kmA,kmB){
        return this._getPointsInTrecho(kmA,kmB);
    },




    _getPointsInTrecho: function(kmA,kmB){
          var points = [];

          points.push(this._getPointInKm(kmA));

         for (var i=0, j=this._info.points.length; i<j; i++) {
            ppA = this._info.points[i];

            if(ppA._dist>kmA*1000 && ppA._dist<kmB*1000){
                points.push(ppA);
            }

         }
       //   points.push(this._getPointInKm(kmB));

          points = this._get_points_avarege_dist(60,points);

          return points;

    },


    _getPointInKm: function(km){

        var smallDist = this._info.length; // coloco a menor distancia o tamanho todo, para ir diminuindo a partir dele
        var ppAtual = this._info.points[0];
        var p0;
        var p1;

        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];
          //vejo qual dos dois esta mais perto do km desejado
          var distA = Math.abs(ppA._dist - km*1000);
          var distB = Math.abs(ppB._dist - km*1000);
          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }
          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao pego o meno mais perto possivel, e o maior mais perto possivel
          if(dist>smallDist){
            p0 = ppAtual;
            p1 = pp;
            break;
          }else{
                     //so sempre garando um valor para eles caso a km seja perto do final  
            p0 = ppAtual;
            p1 = pp;

            smallDist = dist;
            ppAtual = pp;
          }
        };

        //agora que tenho o maior e o menor mais perto possivel, pego o kilometro exato usando regra de 3
        xKmCerto = vtl.Util.math.fromToInterpolation(p0._dist, p1._dist, p0._x, p1._x, km*1000);
        yKmCerto = vtl.Util.math.fromToInterpolation(p0._x, p1._x, p0._y, p1._y, xKmCerto);

        console.log("km é:"+km+" p0._x:"+p0._x+" p0._y:"+p0._y+" p1._x:"+p1._x+" p1._y:"+p1._y);
              console.log(" xKmCerto:"+xKmCertox+" yKmCerto"+yKmCerto);


        //crio o ponto
        var point = new LatLng().xy(xKmCerto,yKmCerto);
        point._dist = km*1000;
        return point;
    },




    _getPointInTime: function(tempo){ //tempo em segundos
        var smallTime = this._info.duration.total; // coloco a menor distancia o tamanho todo, para ir diminuindo a partir dele
        var ppAtual = this._info.points[0];
        var p0;
        var p1;

        for (var i=0, j=this._info.points.length; i<(j-1); i++) {
          ppA = this._info.points[i];
          ppB = this._info.points[i+1];

          //vejo qual dos dois esta mais perto do tempo desejado
          var distA = Math.abs(ppA._runtime - tempo*1000);
          var distB = Math.abs(ppB._runtime - tempo*1000);
          //entre os 2 pontos, pego o que esta mais perto
          if(distA < distB){
            pp = ppA;
            dist = distA;
          }else{
            pp = ppB;
            dist = distB;
          }
          //agora vejo se eles sao mais perto que os ponto antigo
          //se for maior, que dizer que ja chegamos o mais perto possivel,
          //entao pego oo meno mais perto possivel, e o maior mais perto possivel
          if(dist>smallTime){
            p0 = ppAtual;
            p1 = pp;
            break;
          }else{
                     //so sempre garando um valor para eles caso a km seja perto do final  
            p0 = ppAtual;
            p1 = pp;

            smallTime = dist;
            ppAtual = pp;
          }
        };


        //agora que tenho o maior e o menor mais perto possivel, pego o kilometro exato usando regra de 3
        xKmCerto = vtl.Util.math.fromToInterpolation(p0._runtime, p1._runtime, p0._x, p1._x, tempo*1000);
        yKmCerto = vtl.Util.math.fromToInterpolation(p0._x, p1._x, p0._y, p1._y, xKmCerto);

        distCerto = vtl.Util.math.fromToInterpolation(p0._runtime, p1._runtime, p0._dist, p1._dist, tempo*1000);

        //crio o ponto
        var point = new LatLng().xy(xKmCerto,yKmCerto);
        point._runtime = tempo*1000;
        point._dist = distCerto;

        return point;
    },





  _merge_objs: function(a, b) {
    var _ = {};
    for (var attr in a) { _[attr] = a[attr]; }
    for (var attr in b) { _[attr] = b[attr]; }
    return _;
  },

  _prepare_data_point: function(p, trans1, trans2, trans_tooltip) {
    var r = [trans1 && trans1(p[0]) || p[0], trans2 && trans2(p[1]) || p[1]];
    r.push(trans_tooltip && trans_tooltip(r[0], r[1]) || (r[0] + ': ' + r[1]));
    return r;
  },

  _load_xml: function(url, cb, options, async) {
    if (async == undefined) async = this.options.async;
    if (options == undefined) options = this.options;

    // var req = new window.XMLHttpRequest();
    // req.open('GET', url, async);
    // try {
    //   req.overrideMimeType('text/xml'); // unsupported by IE
    // } catch(e) {}
    // req.onreadystatechange = function() {
    //   if (req.readyState != 4) return;
    //   if(req.status == 200) cb(req.responseXML, options);
    // };
    // req.send(null);

    $.ajax({
      url: url,
      type: 'GET',
      dataType: 'xml',
      data: {param1: 'value1'},
      complete: function(xhr, textStatus) {
        //called when complete
      },
      success: function(data, textStatus, xhr) {
       cb(data, options);
      },
      error: function(xhr, textStatus, errorThrown) {
        //called when there is an error
      }
    });

  },

  _parse: function(url, options, async, func) {
    var _this = this;
    var cb = function(gpx, options) {
      var layers = _this._parse_gpx_data(gpx, options);

      if(func)
        options.scope[func].call( options.scope,_this);

     // if (!layers) return;
     // _this.addLayer(layers);
     // _this.fire('loaded');
    }
    this._load_xml(url, cb, options, async);
  },

  _parse_gpx_data: function(xml, options) {

    var j, i, el, layers = [];
    var tags = [['rte','rtept'], ['trkseg','trkpt']];

    var name = xml.getElementsByTagName('name');
    if (name.length > 0) {
      this._info.name = name[0].textContent;
    }

    for (j = 0; j < tags.length; j++) {
      el = xml.getElementsByTagName(tags[j][0]);
      for (i = 0; i < el.length; i++) {
        var coords = this._parse_trkseg(el[i], xml, options, tags[j][1]);
      }
    }


    this._info.hr.avg = Math.round(this._info.hr._total / this._info.hr._points.length);

    if (!layers.length) return;
    var layer = layers[0];

  },

  _parse_trkseg: function(line, xml, options, tag) {

    var el = line.getElementsByTagName(tag);
    if (!el.length) return [];
    var coords = [];
    var last = null;
    var timeStartSeconds = 0
    var timeEndSeconds = 24*60*60

    if(options.clampByTimeStart != undefined){
        timeS = vtl.Util.hourStringToObject(options.clampByTimeStart);
        timeStartSeconds = (timeS.h*60+timeS.m)*60+timeS.s
    }

    if(options.clampByTimeEnd != undefined){
        timef = vtl.Util.hourStringToObject(options.clampByTimeEnd);
        timeEndSeconds = (timef.h*60+timef.m)*60+timef.s
    }

    for (var i = 0; i < el.length; i++) {
      try{

            timenode = el[i].getElementsByTagName('time');
            if (timenode.length > 0){
                d = new Date(Date.parse(timenode[0].textContent));
                timenodeSecondes = (d.getHours()*60+d.getMinutes())*60+d.getSeconds()
            }else{
                timenodeSecondes = 1
            }



            if (timenodeSecondes > timeStartSeconds && timenodeSecondes < timeEndSeconds) {

                  var _, ll = new LatLng(
                  el[i].getAttribute('lat'),
                  el[i].getAttribute('lon'));

                  ll.meta = { time: null, ele: null, hr: null };

                  _ = el[i].getElementsByTagName('time');
                  if (_.length > 0) {
                    ll.meta.time = new Date(Date.parse(_[0].textContent));
                  }

                  _ = el[i].getElementsByTagName('ele');
                  if (_.length > 0) {
                    ll.meta.ele = parseFloat(_[0].textContent);
                  }


                  _ = el[i].getElementsByTagNameNS('*', 'hr');
                  if (_.length > 0) {
                    ll.meta.hr = parseInt(_[0].textContent);
                    this._info.hr._points.push([this._info.length, ll.meta.hr]);
                    this._info.hr._total += ll.meta.hr;
                  }



                  this._info.elevation._points.push([this._info.length, ll.meta.ele]);
                  this._info.duration.end = ll.meta.time;

                  this._info.points.push(ll);


                  if (last != null) {

                    this._info.length += this._dist3d(last, ll);
                    ll._dist = this._info.length;

                    var t = ll.meta.ele - last.meta.ele;
                    if (t > 0) this._info.elevation.gain += t;
                    else this._info.elevation.loss += Math.abs(t);

                    t = Math.abs(ll.meta.time - last.meta.time);
                    this._info.duration.total += t;
                    ll._runtime = this._info.duration.total;

                    if (t < options.max_point_interval) this._info.duration.moving += t;

                  } else {
                    this._info.duration.start = ll.meta.time;
                  }

                  last = ll;
                  coords.push(ll);

            }

        }catch(e){}

    }// end for

    return coords;
  },






  _dist2d: function(a, b) {
    var R = 6371000;
    var dLat = this._deg2rad(b.lat - a.lat);
    var dLon = this._deg2rad(b.lng - a.lng);
    var r = Math.sin(dLat/2) *
      Math.sin(dLat/2) +
      Math.cos(this._deg2rad(a.lat)) *
      Math.cos(this._deg2rad(b.lat)) *
      Math.sin(dLon/2) *
      Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(r), Math.sqrt(1-r));
    var d = R * c;
    return d;
  },

  _dist3d: function(a, b) {
    var planar = this._dist2d(a, b);
    var height = Math.abs(b.meta.ele - a.meta.ele);
    return Math.sqrt(Math.pow(planar, 2) + Math.pow(height, 2));
  },

  _deg2rad: function(deg) {
    return deg * Math.PI / 180;
  }
});