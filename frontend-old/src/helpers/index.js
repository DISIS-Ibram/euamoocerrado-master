
//IMPORTO OS HELPERS
function requireAllComponents(requireContext) {
    var keys = requireContext.keys();

    _.forEach(keys, k => {
        var modulo = requireContext(k)
        var nome = k.match(/([^/]*).js$/)
        nome = nome[1];

        //se começa com _ é lodash
        if (nome.indexOf("_") == 0) {
            var nomeFuncao = nome.substring(1, 100);
            _[nomeFuncao] = modulo.default
            //se comeca como array é prototype da array
        } else if (nome.indexOf("array_") == 0) {
            var nomeFuncao = nome.substring(6, 100);
            Array.prototype[nomeFuncao] = modulo.default
            //e tb disponivel no lodash com o nome inteiro
            _[nomeFuncao] = modulo.default
        } 

    })
}
requireAllComponents(require.context("./", true, /^\.\/.*\.js$/));