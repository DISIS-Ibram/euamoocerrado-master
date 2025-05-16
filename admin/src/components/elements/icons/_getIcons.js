let fileList = require.context('./svg', true, /[\s\S]*$/);

let dictionary = {};
fileList.keys().forEach(x => {
  x = x.replace('./', '');
  dictionary[x.replace('.svg', '')] = require(`./svg/${x}`);

});

export default dictionary