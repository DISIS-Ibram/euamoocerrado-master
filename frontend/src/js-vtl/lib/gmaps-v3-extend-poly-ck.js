/*********************************************************************\
*                                                                     *
* epolys.js                                          by Mike Williams *
* updated to API v3                                  by Larry Ross    *
*                                                                     *
* A Google Maps API Extension                                         *
*                                                                     *
* Adds various Methods to google.maps.Polygon and google.maps.Polyline *
*                                                                     *
* .Contains(latlng) returns true is the poly contains the specified   *
*                   GLatLng                                           *
*                                                                     *
* .Area()           returns the approximate area of a poly that is    *
*                   not self-intersecting                             *
*                                                                     *
* .Distance()       returns the length of the poly path               *
*                                                                     *
* .Bounds()         returns a GLatLngBounds that bounds the poly      *
*                                                                     *
* .GetPointAtDistance() returns a GLatLng at the specified distance   *
*                   along the path.                                   *
*                   The distance is specified in metres               *
*                   Reurns null if the path is shorter than that      *
*                                                                     *
* .GetPointsAtDistance() returns an array of GLatLngs at the          *
*                   specified interval along the path.                *
*                   The distance is specified in metres               *
*                                                                     *
* .GetIndexAtDistance() returns the vertex number at the specified    *
*                   distance along the path.                          *
*                   The distance is specified in metres               *
*                   Returns null if the path is shorter than that      *
*                                                                     *
* .Bearing(v1?,v2?) returns the bearing between two vertices          *
*                   if v1 is null, returns bearing from first to last *
*                   if v2 is null, returns bearing from v1 to next    *
*                                                                     *
*                                                                     *
***********************************************************************
*                                                                     *
*   This Javascript is provided by Mike Williams                      *
*   Blackpool Community Church Javascript Team                        *
*   http://www.blackpoolchurch.org/                                   *
*   http://econym.org.uk/gmap/                                        *
*                                                                     *
*   This work is licenced under a Creative Commons Licence            *
*   http://creativecommons.org/licenses/by/2.0/uk/                    *
*                                                                     *
***********************************************************************
*                                                                     *
* Version 1.1       6-Jun-2007                                        *
* Version 1.2       1-Jul-2007 - fix: Bounds was omitting vertex zero *
*                                add: Bearing                         *
* Version 1.3       28-Nov-2008  add: GetPointsAtDistance()           *
* Version 1.4       12-Jan-2009  fix: GetPointsAtDistance()           *
* Version 3.0       11-Aug-2010  update to v3                         *
*                                                                     *
\*********************************************************************/google.maps.LatLng.prototype.kmTo=function(e){var t=Math,n=t.PI/180,r=this.lat()*n,i=e.lat()*n,s=r-i,o=this.lng()*n-e.lng()*n,u=2*t.asin(t.sqrt(t.pow(t.sin(s/2),2)+t.cos(r)*t.cos(i)*t.pow(t.sin(o/2),2)));return u*6378.137};google.maps.Polyline.prototype.inKm=function(e){var t=this.getPath(e),n=t.getLength(),r=0;for(var i=0;i<n-1;i++)r+=t.getAt(i).kmTo(t.getAt(i+1));return r};google.maps.LatLng.prototype.distanceFrom=function(e){var t=6378137,n=this.lat(),r=this.lng(),i=e.lat(),s=e.lng(),o=(i-n)*Math.PI/180,u=(s-r)*Math.PI/180,a=Math.sin(o/2)*Math.sin(o/2)+Math.cos(n*Math.PI/180)*Math.cos(i*Math.PI/180)*Math.sin(u/2)*Math.sin(u/2),f=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a)),l=t*f;return l};google.maps.LatLng.prototype.latRadians=function(){return this.lat()*Math.PI/180};google.maps.LatLng.prototype.lngRadians=function(){return this.lng()*Math.PI/180};google.maps.Polygon.prototype.Contains=function(e){var t=0,n=!1,r=e.lng(),i=e.lat();for(var s=0;s<this.getPath().getLength();s++){t++;t==this.getPath().getLength()&&(t=0);(this.getPath().getAt(s).lat()<i&&this.getPath().getAt(t).lat()>=i||this.getPath().getAt(t).lat()<i&&this.getPath().getAt(s).lat()>=i)&&this.getPath().getAt(s).lng()+(i-this.getPath().getAt(s).lat())/(this.getPath().getAt(t).lat()-this.getPath().getAt(s).lat())*(this.getPath().getAt(t).lng()-this.getPath().getAt(s).lng())<r&&(n=!n)}return n};google.maps.Polygon.prototype.Area=function(){var e=0,t=0,n=this.Bounds(),r=n.getSouthWest().lng(),i=n.getSouthWest().lat();for(var s=0;s<this.getPath().getLength();s++){t++;t==this.getPath().getLength()&&(t=0);var o=this.getPath().getAt(s).distanceFrom(new google.maps.LatLng(this.getPath().getAt(s).lat(),r)),u=this.getPath().getAt(t).distanceFrom(new google.maps.LatLng(this.getPath().getAt(t).lat(),r)),a=this.getPath().getAt(s).distanceFrom(new google.maps.LatLng(i,this.getPath().getAt(s).lng())),f=this.getPath().getAt(t).distanceFrom(new google.maps.LatLng(i,this.getPath().getAt(t).lng()));e+=o*f-u*a}return Math.abs(e*.5)};google.maps.Polygon.prototype.Distance=function(){var e=0;for(var t=1;t<this.getPath().getLength();t++)e+=this.getPath().getAt(t).distanceFrom(this.getPath().getAt(t-1));return e};google.maps.Polygon.prototype.Bounds=function(){var e=new google.maps.LatLngBounds;for(var t=0;t<this.getPath().getLength();t++)e.extend(this.getPath().getAt(t));return e};google.maps.Polygon.prototype.GetPointAtDistance=function(e){if(e==0)return this.getPath().getAt(0);if(e<0)return null;if(this.getPath().getLength()<2)return null;var t=0,n=0;for(var r=1;r<this.getPath().getLength()&&t<e;r++){n=t;t+=this.getPath().getAt(r).distanceFrom(this.getPath().getAt(r-1))}if(t<e)return null;var i=this.getPath().getAt(r-2),s=this.getPath().getAt(r-1),o=(e-n)/(t-n);return new google.maps.LatLng(i.lat()+(s.lat()-i.lat())*o,i.lng()+(s.lng()-i.lng())*o)};google.maps.Polygon.prototype.GetPointsAtDistance=function(e){var t=e,n=[];if(e<=0)return n;var r=0,i=0;for(var s=1;s<this.getPath().getLength();s++){i=r;r+=this.getPath().getAt(s).distanceFrom(this.getPath().getAt(s-1));while(r>t){var o=this.getPath().getAt(s-1),u=this.getPath().getAt(s),a=(t-i)/(r-i);n.push(new google.maps.LatLng(o.lat()+(u.lat()-o.lat())*a,o.lng()+(u.lng()-o.lng())*a));t+=e}}return n};google.maps.Polygon.prototype.GetIndexAtDistance=function(e){if(e==0)return this.getPath().getAt(0);if(e<0)return null;var t=0,n=0;for(var r=1;r<this.getPath().getLength()&&t<e;r++){n=t;t+=this.getPath().getAt(r).distanceFrom(this.getPath().getAt(r-1))}return t<e?null:r};google.maps.Polygon.prototype.Bearing=function(e,t){if(e==null){e=0;t=this.getPath().getLength()-1}else t==null&&(t=e+1);if(e<0||e>=this.getPath().getLength()||t<0||t>=this.getPath().getLength())return;var n=this.getPath().getAt(e),r=this.getPath().getAt(t);if(n.equals(r))return 0;var i=n.latRadians(),s=n.lngRadians(),o=r.latRadians(),u=r.lngRadians(),a=-Math.atan2(Math.sin(s-u)*Math.cos(o),Math.cos(i)*Math.sin(o)-Math.sin(i)*Math.cos(o)*Math.cos(s-u));a<0&&(a+=Math.PI*2);a=a*180/Math.PI;return parseFloat(a.toFixed(1))};google.maps.Polyline.prototype.Contains=google.maps.Polygon.prototype.Contains;google.maps.Polyline.prototype.Area=google.maps.Polygon.prototype.Area;google.maps.Polyline.prototype.Distance=google.maps.Polygon.prototype.Distance;google.maps.Polyline.prototype.Bounds=google.maps.Polygon.prototype.Bounds;google.maps.Polyline.prototype.GetPointAtDistance=google.maps.Polygon.prototype.GetPointAtDistance;google.maps.Polyline.prototype.GetPointsAtDistance=google.maps.Polygon.prototype.GetPointsAtDistance;google.maps.Polyline.prototype.GetIndexAtDistance=google.maps.Polygon.prototype.GetIndexAtDistance;google.maps.Polyline.prototype.Bearing=google.maps.Polygon.prototype.Bearing;