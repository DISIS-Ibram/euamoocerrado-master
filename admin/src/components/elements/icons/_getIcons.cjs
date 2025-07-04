const reqSvgs = require.context('./svg', false, /\.svg$/);

// Objeto final onde vamos armazenar os ícones
const icons = {};

// console.log('[LOG] Lendo SVGs da pasta ./svg');

// Itera sobre as chaves (nomes dos arquivos)
reqSvgs.keys().forEach((filename) => {
  const key = filename.replace('./', '').replace('.svg', '');

  // console.log(`[LOG] Processando ícone: ${key}`);

  const content = reqSvgs(filename); // deve ser string se o raw-loader estiver ativo

  // Log para debug
  // console.log(`[LOG] Ícone: ${key}, tipo: ${typeof content}`);

  icons[key] = content;
});

// console.log('[LOG] Dicionário final de ícones:', Object.keys(icons));

// export default icons; // ESM
module.exports = icons; // CJS


