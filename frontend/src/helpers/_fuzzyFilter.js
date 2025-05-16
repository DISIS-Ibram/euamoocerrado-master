import Fuse from 'fuse.js'

export default function(filtro = "", itens, limit = 100, options) {

    var defaultOptions = {
        minMatchCharLength: 2,
        threshold: 0.2,
        location: 0,
        distance: 225,
        shouldSort: true,
        keys: [{
            name: '_nome',
            weight: 1
        }]
    };

    options = {...defaultOptions, ...options };
    
    itens = _.map(itens,item=>{
        if(_.has(item,'nome')){
            item._nome = item.nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        }
        return item
    })

    var fuse = new Fuse(itens, options)

    var resultado = fuse.search(_.trim(filtro))
    return _.slice(resultado, 0, limit)

}