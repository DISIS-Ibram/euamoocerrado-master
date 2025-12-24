/*
 * Raphael SVG Import Classic 0.1.3 - Extension to Raphael JS
 * https://github.com/crccheck/raphael-svg-import-classic
 *
 * Raphael SVG Import Classic Copyright (c) 2012 Chris Chang
 * Original Raphael SVG Import Copyright (c) 2009 Wout Fierens
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 *
 */

/* global Raphael */


Raphael.fn.drawGrid = function (x, y, w, h, wv, hv, color) {
    color = color || "#000";
    var path = ["M", Math.round(x) + .5, Math.round(y) + .5, "L", Math.round(x + w) + .5, Math.round(y) + .5, Math.round(x + w) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y + h) + .5, Math.round(x) + .5, Math.round(y) + .5],
        rowHeight = h / hv,
        columnWidth = w / wv;
    for (var i = 1; i < hv; i++) {
        path = path.concat(["M", Math.round(x) + .5, Math.round(y + i * rowHeight) + .5, "H", Math.round(x + w) + .5]);
    }
    for (i = 1; i < wv; i++) {
        path = path.concat(["M", Math.round(x + i * columnWidth) + .5, Math.round(y) + .5, "V", Math.round(y + h) + .5]);
    }
    return this.path(path.join(",")).attr({stroke: color});
};







//importo o sgv sem importar com o resto
Raphael.fn.importFileSVG = function(url,callback,context){
    var modelsLoaded = window.vtl.vtlLoadedModels;
    var that = this;

    if( modelsLoaded[url] !== undefined){
       that.importGroups = that.importSVG(modelsLoaded[url]);
       //dou um timeout, para os objetos no vtl_base_classes que incluem o metodo callback depois de attribuir a url, para da tempo de incluir, senão executa os callbacks desses antes de incluilos
       setTimeout(function(){
         callback.call(context,that.importGroups);
        }, 10);

    }else{
       var objname = url;
       $.ajax({
          type: "GET",
          url: url,
          context:that,
          dataType: "xml",
          success: function(data, textStatus, xhr) {
              modelsLoaded[objname] = data;
              this.importGroups = that.importSVG(modelsLoaded[url]);
              callback.call(context,this.importGroups);
          },
         error: function(xhr, textStatus, errorThrown) {
          //called when there is an error
        },
          complete: function(xhr, textStatus) {

  },
      });
    }
};






Raphael.fn.importSVG = function(svgXML) {
  var myNewSet = this.set();
  var groupSet = {};
  var nivel = 0;
  var grupoAtual = undefined;
  var defaultTextAttr = {
    // stroke: "none"
    "text-anchor": "start" // raphael defaults to "middle"
  };


  this.stringtoXML = function(text) {
    if (window.ActiveXObject) {
      var doc = new ActiveXObject('Microsoft.XMLDOM');
      doc.async = 'false';
      doc.loadXML(text);
    } else {
      var parser = new DOMParser();
      var doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
  }


  // try {
  this.parseElement = function(elShape) {

    // skip text nodes
    if (elShape.nodeType == 3) {
      return;
    }


    var attr = {
      "stroke": "transparent",
      "stroke-width": 0,
      "fill": "#000"
    }, i;
    if (elShape.attributes) {
      // 
      for (i = elShape.attributes.length - 1; i >= 0; --i) {

        if (elShape.attributes[i].name == "stroke-dasharray") {
          attr['stroke-dasharray'] = "- ";
        } else {
          attr[elShape.attributes[i].name] = elShape.attributes[i].value;
        }
      }
    }

    var shape, style;
    var shapeName = elShape.nodeName;


    switch (shapeName) {
      case "svg":

      case "g":

          nivel++;


      if(nivel == 2){

            // pass the id to the first child, parse the children
            var groupId = elShape.getAttribute('id');

            if (groupId && elShape.childNodes.length &&  elShape.childNodes.item(1) != null) {
              // try{
              elShape.childNodes.item(1).setAttribute('id', groupId);
              // }catch(e){
              //}

            }

            var thisGroup = this.set();
            grupoAtual = thisGroup;

      }else{
        if(grupoAtual === undefined)
            grupoAtual = this.set();
      }


        for (i = 0; i < elShape.childNodes.length; ++i) {
            grupoAtual.push(this.parseElement(elShape.childNodes.item(i)));
        }






        // handle transform attribute
        if (attr.transform) {
          var match = /translate\(([^,]+),([^,]+)\)/.exec(attr.transform);
          if (match.length == 3) {
            thisGroup.translate(match[1], match[2]);
          }
        }

        // handle display=none
        if (attr.display === "none") {
          thisGroup.hide();
        }
        if (attr.visibility === "hidden") {
          thisGroup.hide();
        }

        try {

          styles = this.styleToAttr(attr.style);
          if (styles.visibility === 'hidden') {
            thisGroup.hide();
          }
        } catch (e) {

        }

        // hold onto thisGroup just in case
        if (groupId && elShape.childNodes.length) {
          groupSet[groupId] = thisGroup;
        }

       nivel--;


        return;


      case "rect":
        if (attr.rx && attr.ry) {
          attr.r = (+(attr.rx || 0) + (+(attr.ry || 0))) / 2;
          delete attr.rx;
          delete attr.ry;
        } else {
          attr.r = attr.rx || attr.ry || 0;
          delete attr.rx;
          delete attr.ry;
        }
        /* falls through */
      case "circle":
      case "ellipse":
        shape = this[shapeName]();
        break;
      case "path":
        shape = this.path(attr.d);

        delete attr.d;
        break;
      case "polygon":
        shape = this.polygon(attr);
        break;
      case "polyline":
        shape = this.polyline(attr);
        break;
      case "line":
        shape = this.line(attr);
        break;
      case "image":
        shape = this.image();
        break;
      case "text":
        for (var key in defaultTextAttr) {
          if (!attr[key] && defaultTextAttr.hasOwnProperty(key)) {
            attr[key] = defaultTextAttr[key];
          }
        }
        shape = this.text(attr.x, attr.y, elShape.text || elShape.textContent);
        break;


      default:

        var elSVG = elShape.getElementsByTagName("svg");

        if (elSVG.length) {
          elSVG[0].normalize();
          this.parseElement(elSVG[0]);
        }





        return;

    }

    // apply matrix transformation
    var matrix = attr.transform;
    if (matrix) {
      matrix = matrix.substring(7, matrix.length - 1).split(' ')
        .map(function(x) {
        return parseFloat(x);
      });
      var m = shape.matrix;
      m.add.apply(m, matrix);
      // this seems like a very odd step:
      shape.transform(m.toTransformString());
      delete attr.transform;
    }

    shape.attr(attr);

    styles = this.styleToAttr(attr.style);
    shape.attr(styles);

    // assign an arbitrary id
    var nodeID = elShape.getAttribute("id");
    if (nodeID) {
      shape.node.id = nodeID;
    }

    myNewSet.push(shape);
    return shape;
  };



  if (typeof(svgXML) === "string") {
    //  
    svgXML = this.stringtoXML(svgXML);
  }


  this.parseElement(svgXML);



  //} catch (error) {
  // throw "SVGParseError (" + error + ")";
  // }

  var groupsExist = false,
    x;
  for (x in groupSet) {
    groupsExist = true;
    break;
  }
  if (groupsExist) {
    myNewSet.groups = groupSet;
  }
  return myNewSet;
};


Raphael.fn.line = function(attr) {
  var pathString = ["M",
  attr.x1,
  attr.y1,
    "L",
  attr.x2,
  attr.y2,
    "Z"];
  delete attr.x1;
  delete attr.y1;
  delete attr.x2;
  delete attr.y2;
  return this.path(pathString);
};



Raphael.fn.styleToAttr = function(input) {
  var result = {};
  if (typeof(input) != 'string') return;
  var attributes = input.split(';');
  for (var i = 0; i < attributes.length; i++) {
    var entry = attributes[i].split(':');
    result[entry[0]] = entry[1];
  }

  return result;

}


// extending raphael with a polygon function
Raphael.fn.polygon = function(attr) {
  var pointString = attr.points;
  var poly = ['M'],
    point = pointString.split(' ');

  for (var i = 0; i < point.length; i++) {
    var c = point[i].split(',');
    for (var j = 0; j < c.length; j++) {
      var d = parseFloat(c[j]);
      if (!isNaN(d)) poly.push(d);
    }
    if (i === 0) poly.push('L');
  }
  poly.push('Z');
  delete attr.points;
  return this.path(poly);
};


Raphael.fn.polyline = function(attr) {
  var pointString = attr.points;
  var poly = ['M'],
    point = pointString.split(' ');

  for (var i = 0; i < point.length; i++) {
    var c = point[i].split(',');
    for (var j = 0; j < c.length; j++) {
      var d = parseFloat(c[j]);
      if (!isNaN(d)) poly.push(d);
    }
    if (i === 0) poly.push('L');
  }
  delete attr.points;
  return this.path(poly);
};