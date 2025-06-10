// let fileList = require.context('./svg', true, /\.svg$/);

// let dictionary = {};
// fileList.keys().forEach(key => {
//   const cleanKey = key.replace('./', '').replace('.svg', '');
//   dictionary[cleanKey] = fileList(key).default || fileList(key);
// });

// export default dictionary;


const fileList = require.context('./svg', true, /\.svg$/);

let dictionary = {};
fileList.keys().forEach(key => {
  const cleanKey = key.replace('./', '').replace('.svg', '');
  dictionary[cleanKey] = fileList(key); // vai retornar string do SVG
});

export default dictionary;
