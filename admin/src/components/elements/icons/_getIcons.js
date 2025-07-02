// src/components/icons/_getIcons.js

// require.context: lê todos os arquivos .svg da pasta ./svg
const reqSvgs = require.context('./svg', false, /\.svg$/);

// Objeto final onde vamos armazenar os ícones
const icons = {};

console.log('[LOG] Lendo SVGs da pasta ./svg');

// Itera sobre as chaves (nomes dos arquivos)
reqSvgs.keys().forEach((filename) => {
  const key = filename.replace('./', '').replace('.svg', '');
  const content = reqSvgs(filename); // deve ser string se o raw-loader estiver ativo

  // Log para debug
  console.log(`[LOG] Ícone: ${key}, tipo: ${typeof content}`);
  console.log(`[LOG] Conteúdo:\n`, content.slice(0, 200)); // printa os primeiros 200 caracteres

  icons[key] = content;
});

console.log('[LOG] Dicionário final de ícones:', Object.keys(icons));

export default icons;
