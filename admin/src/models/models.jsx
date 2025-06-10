
// URL - se comecar com / vai ser relativo ao root, 
//  se comecar sem barra relativo a resta_api

const SI3RC_MODELS = {

	//* ***************************
	// ADMINISTRACAO
	//* **************************

	// pessoa: {
	// 	type: 'pessoa',
	// 	url: 'gestao/avatar/',
	// 	idkey: 'cpf',
	// 	map: {
	// 		perfis: 'group',
	// 	},
	// },s	

	// SISTEMA UI
	especie: {
		type: 'especie',
		url: 'especie/tipoespecie/',
		map: {
			imagemespecie_set: 'imagemespecie',
			ocorrencia_set:'ocorrencia'
		},
		form:{
			hidden:['imagemespecie_set','ocorrencia_set'],
		},
			tabela:{
			coluna:[
				{name:'id', label:'Id'},
				{name:'nome', label:'Nome'},
				{name:'nome_cientifico', label:'Nome Cientifico'},
				{name:'link', label:'Link'},
				{name:'categoria', label:'Categoria'},
			]
		},
	},
	pessoa: {
		type: 'pessoa',
		url: 'administracao/users/',
		
	},
	user: {
		type: 'pessoa',
		url: 'administracao/users/',
		
	},
	atividade: {
		type: 'atividade',
		url: 'trilha/atividade/',
		
	},
	tipoatividade: {
		type: 'tipoatividade',
		url: 'trilha/atividade/',
		
	},
	conteudo: {
		type: 'conteudo',
		url: 'administracao/textohome/',
		form:{
			hidden:['user'],
			campo:{
					titulo:{ tipo:"input"},
					identificador:{ tipo:"input"},
					
				},
		},
		tabela:{
			coluna:[
				{name:'id', label:'Id'},
				{name:'titulo', label:'Titulo'},
				{name:'identificador', label:'Identificador'},
				{name:'texto', label:'Texto'},
			]
		}
		
	},

	imagemespecie: {
		type: 'imagemespecie',
		url: 'especie/imagemespecie/',
		map: {
			especie: 'especie',
		},
		form:{
			hidden:['especie']
		}
	},

	imagemparque: {
		type: 'imagemparque',
		url: 'parque/imagemparque/',
		map: {
			parque: 'parque',
		},
		form:{
			hidden:['parque']
		}
	},


	videoyoutubeparque: {
		type: 'videoyoutubeparque',
		url: 'parque/videoyoutubeparque/',
		map: {
			parque: 'parque',
		},
		form:{
			// campo:{
			// 	geom:{ tipo:"geo", geom:"line" },
			// },	
			hidden:['user']
		},
	},


	ocorrencia: {
		type: 'ocorrencia',
		url: 'especie/ocorrencia/',
		map: {
			especie: 'especie',
			parque: 'parque',
			trilha: 'trilha',
			usuario: 'user',
		},
		includeOnLoad:['especie','user'],
	},
	
	parque: {
		type: 'parque',
		url: 'parque/parque/',
		form:{
			
			exclude:['visitante'],
			hidden:['center','videoyoutub_set','visitantes','benfeitoria_set','atrativo_set','ocorrencia_set','contatoparque'],
			campo:{
					geom:{ tipo:"geo", geom:"area" },
					
				},
		},
		includeOnLoad:['benfeitoria_set','atrativo_set'],
		map: {
			videoyoutubeparque_set: 'videoyoutubeparque',
			contatoparque: 'contatoparque',
			benfeitoria_set: 'benfeitoria',
			atrativo_set: 'atrativo',
			ocorrencia_set: 'ocorrencia',
			imagemparque_set: 'imagemparque',
		},
	},


	
	visitanteparque: {
		type: 'visitanteparque',
		url: 'parque/visitanteparque/',
		map: {
			parque: 'parque',
			visitante: 'pessoa',
		},
	},
	


	contatoparque: {
		type: 'contatoparque',
		url: 'parque/contatoparque/',
		map: {
			parque: 'parque',
		},
	},

	tipobenfeitoria: {
		type: 'tipobenfeitoria',
		url: 'parque/tipobenfeitoria/',
	},
	
	benfeitoria: {
		type: 'benfeitoria',
		url: 'parque/benfeitoria/',
		map:{
			tipo_benfeitoria:'tipobenfeitoria'
		},
		includeOnLoad:['tipo_benfeitoria']
	},


	tipoatrativo: {
		type: 'tipoatrativo',
		url: 'parque/tipoatrativo/',
		
	},

	atrativo: {
			type: 'atrativo',
			url: 'parque/atrativo/',
			map:{
				tipo_atrativo:'tipoatrativotrilha',
				imagematrativoparque_set:'imagematrativoparque',
				videoatrativoparque_set:'videoatrativoparque',
			},
			includeOnLoad:['tipo_atrativo'],
			form:{
				hidden:['imagematrativoparque_set','videoatrativoparque_set'],
				campo:{
					geom:{ tipo:"geo", geom:"point" },
					cor:{ tipo:"color"},
	
				},
			}
		},


	imagematrativoparque: {
		type: 'imagematrativoparque',
		url: 'parque/imagematrativoparque/',
		map: {
			atrativo: 'atrativo',
		},
		form:{
			 hidden:['atrativo']
		}
	},

	videoatrativoparque: {
		type: 'videoatrativoparque',
		url: 'parque/videoatrativoparque/',
		map: {
			atrativo: 'atrativo',
		},
		form:{
			// hidden:['atrativo']
		}
	},

	imagematrativotrilha: {
		type: 'imagematrativotrilha',
		url: 'trilha/imagematrativotrilha/',
		map: {
			atrativo: 'atrativotrilha',
		},
		form:{
			 hidden:['atrativo']
		}
	},

	videoatrativotrilha: {
		type: 'videoatrativotrilha',
		url: 'trilha/videoatrativotrilha/',
		map: {
			atrativo: 'atrativotrilha',
		},
		form:{
			// hidden:['atrativo']
		}
	},



	atrativotrilha: {
		type: 'atrativotrilha',
		url: 'trilha/atrativo/',
		map:{
			tipo_atrativo:'tipoatrativotrilha',
			imagematrativotrilha_set:'imagematrativotrilha',
			videoatrativotrilha_set:'videoatrativotrilha',
		},
		includeOnLoad:['tipo_atrativo'],
		form:{
			hidden:['imagematrativotrilha_set','videoatrativotrilha_set'],
			campo:{
				geom:{ tipo:"geo", geom:"point" },
				cor:{ tipo:"color"},

			},
		}
	},
	
	

	visitantetrilha: {
		type: 'visitantetrilha',
		url: 'trilha/visitantetrilha/',
		map: {
			trilha: 'trilha',
			visitante: 'pessoa',
		},
	},


	imagemtrilha: {
		type: 'imagemtrilha',
		url: 'trilha/imagemtrilha/',
		map: {
			trilha: 'trilha',
		},
		form:{
			hidden:['trilha']
		}
	},


	videoyoutubetrilha: {
		type: 'videoyoutubetrilha',
		url: 'trilha/videoyoutubetrilha/',
		map: {
			trilha: 'trilha',
		},
		form:{
			hidden:['user','trilha']
		}
	},


	trilha: {
		type: 'trilha',
		url: 'trilha/trilha/',
		map:{
			parque:'parque',
			ocorrencia_set:'ocorrencia',
			visitantes:'visitantetrilha',
			atividades:'atividade',
			videoyoutubetrilha_set:'videoyoutubetrilha',
			imagemtrilha_set:'imagemtrilha',
			atrativotrilha_set:'atrativotrilha'


		},
		form:{
			campo:{
				geom:{ tipo:"geo", geom:"line" },
			},	
			hidden:['geom3d','visitantes','ocorrencia_set','parque']
		},
		tabela:{
			coluna:[
				{name:'id', label:'Id'},
				{name:'nome', label:'Nome'},
				{name:'descricao', label:'Descrição'},
				
			]
		},
		
	},

	contact: {
		type: 'contact',
		url: 'administracao/contact',
	},
};


// Aplico o attributo Type a todo elemento do modelo
_.forOwn(SI3RC_MODELS, (v, k) => {
	SI3RC_MODELS[k].type = k;

	// so apra ter uma versao com os nomes todo em lowercase;
	const kl = k.toLowerCase();
	SI3RC_MODELS[kl] = v;
	SI3RC_MODELS[kl].type = kl;
});

export { SI3RC_MODELS };


// mapeio os nomes dos modelos que
// uso internamente para os nomes dos modelos usados na api
// serve para funcoes como obterItens?, filtro dos mapas etc
//---------------------------
export const SI3RC_MODELS_API_MAP = {
	// usuarios: 'avatar',
	colecao: 'Colecao',
};


export const SI3RC_MODELS_API_TO_ME_MAP = {
	Pessoa: 'usuarios',
};


// NAME
// So conversão de nomes
//---------------------------
export const SI3RC_NOMES = {

	// traducao dos nomes decampos
	nome: {
		nome: 'Nome',
		descricao: '',
	},
	descricao: {
		nome: 'Descrição',
		descricao: '',
	},
	endereco: {
		nome: 'Endereço',
		descricao: '',
	},
	matricula: {
		nome: 'Matrícula',
		descricao: '',
	},
	'Doc solicitacao': {
		nome: 'Documento Solicitações',
	},
	'aldeia': {
		nome: 'Aldeias',
	},

};


export const getIDValue = (resource, modeloSchema) => {
	if (_.isString(modeloSchema)) {
		modeloSchema = SI3RC_MODELS[modeloSchema];
	}

	// vejo se tenho o id que usa como key
	const key = (_.has(modeloSchema, 'idkey')) ? modeloSchema.idkey : 'id';

	// vejo se o resource tem/esta usando esse key
	if (_.has(resource, key)) {
		return resource[key];
	} else if (_.has(resource, 'id')) {''
		return resource.id;
	}
	return 0;
};


export const getIDKey = (resourceOrType = {}, modeloSchema = {}) => {
	if (_.isString(modeloSchema)) {
		modeloSchema = SI3RC_MODELS[modeloSchema];
	}

	// string quer dizer que deve ser o tipo do modelo
	if (_.isString(resourceOrType)) {
		if (_.has(SI3RC_MODELS, resourceOrType)) {
			return (SI3RC_MODELS[resourceOrType].idkey) ? SI3RC_MODELS[resourceOrType].idkey : 'id';
		}
		return 'id';
	}

	// vejo se tenho o id que usa como key
	const key = (_.has(modeloSchema, 'idkey')) ? modeloSchema.idkey : 'id';

	// vejo se o resourceOrType tem/esta usando esse key
	if (_.has(resourceOrType, key)) {
		return key;
	}
	return 'id';
};


export const getIDKeyFromMap = (modeloType, attr) => {
	// pego o modelo
	const modelo = SI3RC_MODELS[modeloType];

	// vejo se tem o atributo no map do modelo
	if (_.has(modelo, (`map.${attr}`))) {
		const modeloType = modelo.map[attr];
		// const modeloReferencia = SI3RC_MODELS[modeloType]
		return getIDKey(modeloType);
	}
	return 'id';


	// se tiver pego o modelo que ele se refere

// e pego o id dele
};


export const getModel = (type) => {
	if (_.has(SI3RC_MODELS, type)) {
		return SI3RC_MODELS[type];
	}
	// throw new Error(`Tipo ${type} não existe no modelo`);
	// return type;
	// se não existe o medelo, eu crio ele utilizando a url como o path
	const modeloObj = {};

	modeloObj.type = type; // _.kebabCase(type); // pq kebaba quera a referencia aos modelos nos connects,que uso a outra versao
	modeloObj.url = `${type  }/`;

	return modeloObj;
	// vacina:{type:'situacao', url:'administracao/Vacina/'}
};


export const t = (nome) => {

	var state = window.STORE.getState() 

	return _.get(state,'api.modelOptions.' + nome + '.name', nome)
};


export const d = (nome) => {
	var state = window.STORE.getState() 
	return _.get(state,'api.modelOptions.' + nome + '.description', nome)
};

export default SI3RC_MODELS;

