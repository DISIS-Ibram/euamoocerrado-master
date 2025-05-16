/**@
 * #Storage
 * @category Utilities
 * Utility to allow data to be saved to a permanent storage solution: IndexedDB, WebSql, localstorage or cookies
 *//**@
	 * #.open
	 * @comp Storage
	 * @sign .open(String gameName)
	 * @param gameName - a machine readable string to uniquely identify your game
	 * 
	 * Opens a connection to the database. If the best they have is localstorage or lower, it does nothing
	 *
	 * @example
	 * Open a database
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * ~~~
	 *//**@
	 * #.save
	 * @comp Storage
	 * @sign .save(String key, String type, Mixed data)
	 * @param key - A unique key for identifying this piece of data
	 * @param type - 'save' or 'cache'
	 * @param data - Some kind of data.
	 * 
	 * Saves a piece of data to the database. Can be anything, although entities are preferred.
	 * For all storage methods but IndexedDB, the data will be serialized as a string
	 * During serialization, an entity's SaveData event will be triggered.
	 * Components should implement a SaveData handler and attach the necessary information to the passed object
	 *
	 * @example
	 * Saves an entity to the database
	 * ~~~
	 * var ent = Crafty.e("2D, DOM")
	 *                     .attr({x: 20, y: 20, w: 100, h:100});
	 * Crafty.storage.open('MyGame');
	 * Crafty.storage.save('MyEntity', 'save', ent);
	 * ~~~
	 *//**@
	 * #.load
	 * @comp Storage
	 * @sign .load(String key, String type)
	 * @param key - A unique key to search for
	 * @param type - 'save' or 'cache'
	 * @param callback - Do things with the data you get back
	 * 
	 * Loads a piece of data from the database.
	 * Entities will be reconstructed from the serialized string

	 * @example
	 * Loads an entity from the database
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * Crafty.storage.load('MyEntity', 'save', function (data) { // do things });
	 * ~~~
	 *//**@
	 * #.getAllKeys
	 * @comp Storage
	 * @sign .getAllKeys(String type)
	 * @param type - 'save' or 'cache'
	 * Gets all the keys for a given type

	 * @example
	 * Gets all the save games saved
	 * ~~~
	 * Crafty.storage.open('MyGame');
	 * var saves = Crafty.storage.getAllKeys('save');
	 * ~~~
	 *//**@
	 * #.external
	 * @comp Storage
	 * @sign .external(String url)
	 * @param url - URL to an external to save games too
	 * 
	 * Enables and sets the url for saving games to an external server
	 * 
	 * @example
	 * Save an entity to an external server
	 * ~~~
	 * Crafty.storage.external('http://somewhere.com/server.php');
	 * Crafty.storage.open('MyGame');
	 * var ent = Crafty.e('2D, DOM')
	 *                     .attr({x: 20, y: 20, w: 100, h:100});
	 * Crafty.storage.save('save01', 'save', ent);
	 * ~~~
	 *//**@
	 * #SaveData event
	 * @comp Storage
	 * @param data - An object containing all of the data to be serialized
	 * @param prepare - The function to prepare an entity for serialization
	 * 
	 * Any data a component wants to save when it's serialized should be added to this object.
	 * Straight attribute should be set in data.attr.
	 * Anything that requires a special handler should be set in a unique property.
	 *
	 * @example
	 * Saves the innerHTML of an entity
	 * ~~~
	 * Crafty.e("2D DOM").bind("SaveData", function (data, prepare) {
	 *     data.attr.x = this.x;
	 *     data.attr.y = this.y;
	 *     data.dom = this.element.innerHTML;
	 * });
	 * ~~~
	 *//**@
	 * #LoadData event
	 * @param data - An object containing all the data that been saved
	 * @param process - The function to turn a string into an entity
	 * 
	 * Handlers for processing any data that needs more than straight assignment
	 *
	 * Note that data stored in the .attr object is automatically added to the entity.
	 * It does not need to be handled here
	 *
	 * @example
	 * ~~~
	 * Sets the innerHTML from a saved entity
	 * Crafty.e("2D DOM").bind("LoadData", function (data, process) {
	 *     this.element.innerHTML = data.dom;
	 * });
	 * ~~~
	 */Crafty.storage=function(){function process(e){if(e.c){var t=Crafty.e(e.c).attr(e.attr).trigger("LoadData",e,process);return t}if(typeof e=="object")for(var n in e)e[n]=process(e[n]);return e}function unserialize(str){if(typeof str!="string")return null;var data=JSON?JSON.parse(str):eval("("+str+")");return process(data)}function prep(e){if(e.__c){var t={c:[],attr:{}};e.trigger("SaveData",t,prep);for(var n in e.__c)t.c.push(n);t.c=t.c.join(", ");e=t}else if(typeof e=="object")for(var r in e)e[r]=prep(e[r]);return e}function serialize(e){if(JSON){var t=prep(e);return JSON.stringify(t)}alert("Crafty does not support saving on your browser. Please upgrade to a newer browser.");return!1}function external(e){url=e}function openExternal(){if(typeof url=="undefined")return;var xml=new XMLHttpRequest;xhr.open("POST",url);xhr.onreadystatechange=function(evt){if(xhr.readyState==4&&xhr.status==200){var data=eval("("+xhr.responseText+")");for(var i in data)Crafty.storage.check(data[i].key,data[i].timestamp)&&loadExternal(data[i].key)}};xhr.send("mode=timestamps&game="+gameName)}function saveExternal(e,t,n){if(typeof url=="undefined")return;var r=new XMLHttpRequest;r.open("POST",url);r.send("mode=save&key="+e+"&data="+encodeURIComponent(t)+"&ts="+n+"&game="+gameName)}function loadExternal(key){if(typeof url=="undefined")return;var xhr=new XMLHttpRequest;xhr.open("POST",url);xhr.onreadystatechange=function(evt){if(xhr.readyState==4&&xhr.status==200){var data=eval("("+xhr.responseText+")");Crafty.storage.save(key,"save",data)}};xhr.send("mode=load&key="+key+"&game="+gameName)}function ts(){var e=new Date;return e.getTime()}var db=null,url,gameName,timestamps={},transactionType={READ:"readonly",READ_WRITE:"readwrite"};if(typeof indexedDB!="object"){window.indexedDB=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;window.IDBTransaction=window.IDBTransaction||window.webkitIDBTransaction;if(typeof IDBTransaction=="object"){transactionType.READ=IDBTransaction.READ||IDBTransaction.readonly||transactionType.READ;transactionType.READ_WRITE=IDBTransaction.READ_WRITE||IDBTransaction.readwrite||transactionType.READ_WRITE}}return typeof indexedDB=="object"?{open:function(e){function r(){try{var e=db.transaction(["save"],transactionType.READ),t=e.objectStore("save"),n=t.getAll();n.onsuccess=function(e){var t=0,n=event.target.result,r=n.length;for(;t<r;t++)timestamps[n[t].key]=n[t].timestamp}}catch(r){}}function i(){var e=db.setVersion("1.0");e.onsuccess=function(e){for(var n=0;n<t.length;n++){var r=t[n];if(db.objectStoreNames.contains(r))continue;db.createObjectStore(r,{keyPath:"key"})}}}gameName=e;var t=[];if(arguments.length==1){t.push("save");t.push("cache")}else{t=arguments;t.shift();t.push("save");t.push("cache")}if(db==null){var n=indexedDB.open(gameName);n.onsuccess=function(e){db=e.target.result;i();r();openExternal()}}else{i();r();openExternal()}},save:function(e,t,n){if(db==null){setTimeout(function(){Crafty.storage.save(e,t,n)},1);return}var r=serialize(n),i=ts();t=="save"&&saveExternal(e,r,i);try{var s=db.transaction([t],transactionType.READ_WRITE),o=s.objectStore(t),u=o.put({data:r,timestamp:i,key:e})}catch(a){console.error(a)}},load:function(e,t,n){if(db==null){setTimeout(function(){Crafty.storage.load(e,t,n)},1);return}try{var r=db.transaction([t],transactionType.READ),i=r.objectStore(t),s=i.get(e);s.onsuccess=function(e){n(unserialize(e.target.result.data))}}catch(o){console.error(o)}},getAllKeys:function(e,t){db==null&&setTimeout(function(){Crafty.storage.getAllkeys(e,t)},1);try{var n=db.transaction([e],transactionType.READ),r=n.objectStore(e),i=r.getCursor(),s=[];i.onsuccess=function(e){var n=e.target.result;if(n){s.push(n.key);n["continue"]()}else t(s)}}catch(o){console.error(o)}},check:function(e,t){return timestamps[e]>t},external:external}:typeof openDatabase=="function"?{open:function(e){gameName=e;if(arguments.length==1)db={save:openDatabase(e+"_save","1.0","Saves games for "+e,5242880),cache:openDatabase(e+"_cache","1.0","Cache for "+e,5242880)};else{var t=arguments,n=0;t.shift();for(;n<t.length;n++)typeof db[t[n]]=="undefined"&&(db[t[n]]=openDatabase(gameName+"_"+t[n],"1.0",type,5242880))}db.save.transaction(function(e){e.executeSql("SELECT key, timestamp FROM data",[],function(e,t){var n=0,r=t.rows,i=r.length;for(;n<i;n++)timestamps[r.item(n).key]=r.item(n).timestamp})})},save:function(e,t,n){typeof db[t]=="undefined"&&gameName!=""&&this.open(gameName,t);var r=serialize(n),i=ts();t=="save"&&saveExternal(e,r,i);db[t].transaction(function(t){t.executeSql("CREATE TABLE IF NOT EXISTS data (key unique, text, timestamp)");t.executeSql("SELECT * FROM data WHERE key = ?",[e],function(t,n){n.rows.length?t.executeSql("UPDATE data SET text = ?, timestamp = ? WHERE key = ?",[r,i,e]):t.executeSql("INSERT INTO data VALUES (?, ?, ?)",[e,r,i])})})},load:function(e,t,n){if(db[t]==null){setTimeout(function(){Crafty.storage.load(e,t,n)},1);return}db[t].transaction(function(t){t.executeSql("SELECT text FROM data WHERE key = ?",[e],function(e,t){if(t.rows.length){res=unserialize(t.rows.item(0).text);n(res)}})})},getAllKeys:function(e,t){if(db[e]==null){setTimeout(function(){Crafty.storage.getAllKeys(e,t)},1);return}db[e].transaction(function(e){e.executeSql("SELECT key FROM data",[],function(e,n){t(n.rows)})})},check:function(e,t){return timestamps[e]>t},external:external}:typeof window.localStorage=="object"?{open:function(e){gameName=e},save:function(e,t,n){var r=gameName+"."+t+"."+e,i=serialize(n),s=ts();t=="save"&&saveExternal(e,i,s);window.localStorage[r]=i;t=="save"&&(window.localStorage[r+".ts"]=s)},load:function(e,t,n){var r=gameName+"."+t+"."+e,i=window.localStorage[r];n(unserialize(i))},getAllKeys:function(e,t){var n={},r=[],i=gameName+"."+e;for(var s in window.localStorage)if(s.indexOf(i)!=-1){var o=s.replace(i,"").replace(".ts","");n[o]=!0}for(s in n)r.push(s);t(r)},check:function(e,t){var n=window.localStorage[gameName+".save."+e+".ts"];return parseInt(t)>parseInt(n)},external:external}:{open:function(e){gameName=e},save:function(e,t,n){if(t!="save")return;var r=serialize(n),i=ts();t=="save"&&saveExternal(e,r,i);document.cookie=gameName+"_"+e+"="+r+"; "+gameName+"_"+e+"_ts="+i+"; expires=Thur, 31 Dec 2099 23:59:59 UTC; path=/"},load:function(e,t,n){if(t!="save")return;var r=new RegExp(gameName+"_"+e+"=[^;]*"),i=r.exec(document.cookie),s=unserialize(i[0].replace(gameName+"_"+e+"=",""));n(s)},getAllKeys:function(e,t){if(e!="save")return;var n=new RegExp(gameName+"_[^_=]","g"),r=n.exec(document.cookie),i=0,s=r.length,o={},u=[];for(;i<s;i++){var a=r[i].replace(gameName+"_","");o[a]=!0}for(i in o)u.push(i);t(u)},check:function(e,t){var n=gameName+"_"+e+"_ts",r=new RegExp(n+"=[^;]"),i=r.exec(document.cookie),s=i[0].replace(n+"=","");return parseInt(t)>parseInt(s)},external:external}}();