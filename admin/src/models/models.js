
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
			// campo:{
			// 		geom:{ tipo:"geo", geom:"area" },
					
			// 	},
		},
			tabela:{
			coluna:[
				{name:'id', label:'Id'},
				{name:'nome', label:'Nome'},
				{name:'nome_cientifico', label:'Nome Cientifico'},
				{name:'link', label:'Link'},
				{name:'categoria', label:'Categoria'},
				// {name:'registro', label:'Registro', render:(elm)=> _.get(elm,'registo.nome','-') },
				// {name:'povo', label:'Povo', render:(elm)=> _.get(elm,'povo.nome') },
				// {name:'imagem', label:'Confi. Povo', render:(elm)=>{ if(elm.confirmacao_povo){ return "√" }else{ return "-"} }},
				// {name:'lingua', label:'Lingua', render:(elm)=> _.get(elm,'lingua.nome') },
				// {name:'confirmacao_lingua', label:'Confi. Lingua', render:(elm)=>{ if(elm.confirmacao_lingua){ return "√" }else{ return "-"} }},
				// {name:'localizacaostr', label:'Localização'},
			
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



	// // // SISTEMA UI
	// fotohome: {
	// 	type: 'fotohome',
	// 	url: 'administracao/fotohome/',
	// },

	// fotohomelist: {
	// 	type: 'fotohomelist',
	// 	url: 'administracao/fotohomelist/',
	// },

	// basemap: {
	// 	type: 'basemap',

	// 	url: 'administracao/basemap/',
	// },

	// // TERRITORIOS
	// tipolegislacao: {
	// 	type: 'tipolegislacao',
	// 	url: 'administracao/tipolegislacao/',
	// },

	// legislacao: {
	// 	type: 'legislacao',
	// 	url: 'administracao/legislacao/',
	// 	map: {
	// 		tipo: 'tipolegislacao',
	// 		leg_associada: 'legislacao',
	// 	},
	// },

	// faseterraindigena: {
	// 	type: 'faseterraindigena',
	// 	url: 'administracao/faseterraindigena/',
	// },

	// modalidadeterraindigena: {
	// 	type: 'modalidadeterraindigena',
	// 	url: 'administracao/modalidadeterraindigena/',
	// },


	// // GESTAO

	// funcao: {
	// 	type: 'funcao',
	// 	url: 'administracao/funcao/',
	// },

	// atribuicao: {
	// 	type: 'atribuicao',
	// 	url: 'administracao/atribuicao/',
	// },

	// acesso: {
	// 	type: 'acesso',
	// 	url: 'administracao/acesso/',
	// },




	// // EXPEDICAO

	// tipodeexpedicao: {
	// 	type: 'tipodeexpedicao',
	// 	url: 'administracao/tipodeexpedicao/',
	// },

	// tipoderecurso: {
	// 	type: 'tipoderecurso',
	// 	url: 'administracao/tipoderecurso/',
	// },

	// caracterizacaotipoambiente: {
	// 	url: 'administracao/caracterizacaotipoambiente/',
	// },

	// caracterizacaotipoinundacao: {
	// 	url: 'administracao/caracterizacaotipoinundacao/',
	// },

	// CaracterizacaoTipoHidrografia: {
	// 	url: 'administracao/caracterizacaotipohidrografia/',
	// },

	// CaracterizacaoPosicaoHidrografica: {
	// 	url: 'administracao/caracterizacaoposicaohidrografica/',
	// },

	// tipovestigio: {
	// 	type: 'tipovestigio',
	// 	url: 'administracao/tipovestigio/',
	// },

	// recursonatural: {
	// 	type: 'recursonatural',
	// 	url: 'administracao/recursonatural/',
	// },

	// culturamaterial: {
	// 	type: 'culturamaterial',
	// 	url: 'administracao/culturamaterial/',
	// },

	// finalidadehabitacao :{
	// 	url: 'administracao/finalidadehabitacao/',
	// },


	// // COPIRC
	// programa: {
	// 	type: 'programa',
	// 	url: 'administracao/programa/',
	// },

	// tipoevento: {
	// 	type: 'tipoevento',
	// 	url: 'administracao/tipoevento/',
	// },

	// aparelho: {
	// 	type: 'aparelho',
	// 	url: 'administracao/aparelho/',
	// },

	// vacina: {
	// 	type: 'situacao',
	// 	url: 'administracao/vacina/',
	// },

	// //COPLII
	// lingua: {
	// 	type: 'lingua',
	// 	url: 'administracao/lingua/',
	// },

	// situacao: {
	// 	type: 'situacao',
	// 	url: 'administracao/situacao/',
	// },

	// povo: {
	// 	url: 'administracao/povo/',
	// },

	// adorno: {
	// 	url: 'administracao/adorno/',
	// },

	// contato: {
	// 	url: 'administracao/contato/',
	// },

	// graudecomunicacao: {
	// 	url: 'administracao/graudecomunicacao/',
	// },



	// // RECENTE CONTATO

	// // "rest_api/copirc/aldeia": "http://localhost:8000/rest_api/copirc/aldeia/",
    // // "rest_api/copirc/politicapublicaacessada": "http://localhost:8000/rest_api/copirc/politicapublicaacessada/",
    // // "rest_api/copirc/ocorrencia": "http://localhost:8000/rest_api/copirc/ocorrencia/",
    // // "rest_api/copirc/indigena": "http://localhost:8000/rest_api/copirc/indigena/",
    // // "rest_api/copirc/nomeindigena": "http://localhost:8000/rest_api/copirc/nomeindigena/",
    // // "rest_api/copirc/aldeiaindigena": "http://localhost:8000/rest_api/copirc/aldeiaindigena/",
    // // "rest_api/copirc/filiacao": "http://localhost:8000/rest_api/copirc/filiacao/",
    // // "rest_api/copirc/anamnese": "http://localhost:8000/rest_api/copirc/anamnese/",
    // // "rest_api/copirc/vacinacao": "http://localhost:8000/rest_api/copirc/vacinacao/",
	// aldeia: {
	// 	url: 'copirc/aldeia/',
	// 	map:{
	// 		registro:'registro',
	// 		povo:'povo',
	// 		lingua:'lingua',
	// 		colecao_midia:'colecao',
	// 		aldeiaindigena_set:'aldeiaindigena',
	// 		ocorrencia_set:'ocorrencia',
	// 	},

	// 	form:{
	// 		hidden:['estado','municipio','terra_indigena','ocorrencia_set','aldeiaindigena_set']
	// 	},

	// 	propriedadeVirtual: {	
	// 		localizacaostr:{
	// 			label: 'Localizacao',
	// 			required: false,
	// 			valueFn: (elm)=>{
	// 				if( _.has(elm,'terra_indigena.nome') ){
    //                     return "TI. "+_.get(elm,'terra_indigena.nome')
    //                 }else{
    //                     return _.get(elm,'municipio.nome')+" - " + _.get(elm,'estado.sigla','')
    //                 }
	// 			}
	// 		},
	// 	},

	// 	tabela:{
	// 		coluna:[
	// 			{name:'id', label:'Id'},
	// 			{name:'nome', label:'Nome'},
	// 			{name:'descricao', label:'Descricao'},
	// 			{name:'registro', label:'Registro', render:(elm)=> _.get(elm,'registo.nome','-') },
	// 			{name:'povo', label:'Povo', render:(elm)=> _.get(elm,'povo.nome') },
	// 			{name:'confirmacao_povo', label:'Confi. Povo', render:(elm)=>{ if(elm.confirmacao_povo){ return "√" }else{ return "-"} }},
	// 			{name:'lingua', label:'Lingua', render:(elm)=> _.get(elm,'lingua.nome') },
	// 			{name:'confirmacao_lingua', label:'Confi. Lingua', render:(elm)=>{ if(elm.confirmacao_lingua){ return "√" }else{ return "-"} }},
	// 			{name:'localizacaostr', label:'Localização'},
			
	// 		]
	// 	},

	// 	includeOnLoad:'all'


	// },

	
	// politicapublicaacessada: {
	// 	url: 'copirc/politicapublicaacessada/',
	// 	map:{
	// 		aldeia:'aldeia',
	// 		programa:'programa',
	// 	},
	// 	form:{
	// 		hidden:['aldeia'],
	// 	}
	// },

	// ocorrencia: {
	// 	url: 'copirc/ocorrencia/',
	// 	map:{
	// 		aldeia:'aldeia',
	// 		tipo_evento:'tipo_evento',
	// 	},
	// 	form:{
	// 		hidden:['aldeia'],
	// 	}
	// },
	// ocorrencia: {
	// 	url: 'copirc/ocorrencia/',
	// 	map:{
	// 		aldeia:'aldeia',
	// 		tipo_evento:'tipoevento',
	// 	},
	// 	includeOnLoad: ['tipo_evento__nome']

	// },

	// indigena: {
	// 	url: 'copirc/indigena/',
	// 	map:{
	// 		fotos:'colecao',
	// 		aldeias:'aldeia',
	// 		filiacao:'indigena',
	// 		casamento:'indigena',
	// 		anamnese:'aparelho',
	// 		vacinacao:'vacina',
	// 		aldeiaindigena_set:'aldeiaindigena',
	// 		nomeindigena_set:'nomeindigena',
	// 	},
	// 	tabela:{
	// 		coluna:[
	// 			{name:'numero', label:'Identificacao'},
	// 			{name:'registro', label:'Último Nome', render:(elm)=> _.get(elm,'nomeindigena_set[0].nome') },
	// 			{name:'sexo', label:'Sexo'},
	// 			{name:'nascimento', label:'Data Nascimento'},
	// 			{name:'obito', label:'Data Óbito'},
			
	// 		]
	// 	},

	// 	includeOnLoad: ['nomeindigena_set']
	// },
	
	// nomeindigena: {
	// 	url: 'copirc/nomeindigena/',
	// 	map:{
	// 		indigena:'indigena',
	// 	},
	// 	form:{
	// 		hidden:['indigena']
	// 	},
	// },

	// aldeiaindigena: {
	// 	url: 'copirc/aldeiaindigena/',
	// 	map:{
	// 		indigena:'indigena',
	// 		aldeia:'aldeia',
	// 	},
	// 	form:{
	// 		// hidden:['aldeia'],
	// 	},
	// 	includeOnLoad:['indigena','indigena__nomeindigena_set','indigena__numero','indigena__nomeindigena_id']
	// },
	

	// filiacao: {
	// 	url: 'copirc/filiacao/',
	// 	map:{
	// 		filho:'indigena',
	// 		genitor:'indigena',
	// 	},
	// 	form:{
	// 		hidden:['indigena'],
	// 	},
	// 	includeOnLoad:['genitor__nomeindigena_set']
	// },

	// anamnese: {
	// 	url: 'copirc/anamnese/',
	// 	map:{
	// 		indigena:'indigena',
	// 		aparelho:'aparelho',
	// 	}
	// },

	// vacinacao: {
	// 	url: 'copirc/vacinacao/',
	// 	map:{
	// 		indigena:'indigena',
	// 		vacina:'vacina',
	// 	},
	// 	form:{
	// 		hidden:['indigena'],
	// 	},
	// 	includeOnLoad:['vacina']
	// },



	// //* ***************************
	// // Expedicao
	// //* **************************
	// expedicao: {
	// 	url : 'expedicao/expedicao/',
	// 	map:{
	// 		responsavel:'pessoa',
	// 		registros:'registro',
	// 		fpe:'fpe',
	// 		tipo_de_expedicao:'tipodeexpedicao'
	// 	},
	// 	form:{
	// 		campo:{
	// 			regiao:{ tipo:"geo", geom:"area" }
	// 		},
	// 	},

	// 	// tabela:{
	// 	// 	coluna:[
	// 	// 		{name:'id', label:'id'},
	// 	// 		{name:'nome', label:'Nome'},
	// 	// 		{name:'responsavel.nome', label:'Responsável'},
	// 	// 		{name:'justificativa', label:'Justificativa'},
	// 	// 		{name:'justificativa', label:'Justificativa'},
	// 	// 	]
	// 	// },

	// 	includeOnLoad:'all',


	// },

	// planejamentoexpedicao:{
	// 	url:'expedicao/planejamentoexpedicao/',
	// 	map:{
	// 		expedicao:'expedicao',
	// 		autor:'pessoa',
	// 		sobrevoo:'dadossobrevoo',
	// 		equipe:'pessoa'
	// 	},
	// 	form:{
	// 		campo:{
	// 			rota:{ tipo:"geo", geom:"line" },
	// 		},
	// 		hidden:['expedicao']
	// 	},

	// 	includeOnLoad:'all'
	// },

	// relatoriodeexpedicao:{
	// 	url: "expedicao/relatoriodeexpedicao/",
	// 	map: {
	// 		expedicao:'expedicao',
	// 		autor:'pessoa',
	// 		sobrevoo:'dadossobrevoo',
	// 		equipe:'pessoa',
	// 		registros:'registro',
	// 	},
	// 	form:{
	// 		hidden:['vestigios','sitios_rel_set','avistamentos_rel'],
	// 		campo:{
	// 			regiao:{ tipo:"geo", geom:"area" },
	// 			rota:{ tipo:"geo", geom:"line" },
	// 		},
	// 		popupSempreAberto:true,
	// 	},

	// 	includeOnLoad:'all'
	// },



	// dadossobrevoo:{
	// 	url:'expedicao/dadossobrevoo/',
	// 	map:{
	// 		equipe:'pessoa',
	// 	},
	// 	form:{
	// 		campo:{
	// 			trajeto:{ tipo:"geo", geom:"line" },
	// 		},
	// 	},
	// },
	

	// avistamento: {
	// 	url : 'expedicao/avistamento/',
		
	// 	form:{
	// 		hidden:['estado','municipio','terra_indigena']
	// 	},
	// 	includeOnLoad:['estado__geocode','estado__nome','estado__sigla',
	// 				'municipio_geocode','municipio__nome',
	// 				'terra_indigena__cod_ti', 'terra_indigena__nome','registro__num_registro','registro__nome'],

	// 	propriedadeVirtual: {	
	// 		localizacaostr:{
	// 			label: 'Localizacao',
	// 			required: false,
	// 			valueFn: (elm)=>{
	// 				if( _.has(elm,'terra_indigena.nome') ){
    //                     return "TI. "+_.get(elm,'terra_indigena.nome')
    //                 }else{
    //                     return _.get(elm,'municipio.nome')+" - " + _.get(elm,'estado.sigla','')
    //                 }
	// 			}
	// 		},
	// 	},

	// 	tabela:{
	// 		coluna:[
	// 			{name:'id', label:'Id'},
	// 			{name:'registro', label:'registro', render:(elm)=> _.get(elm,'registro.nome') +" "+ _.get(elm,'registro._id') },
	// 			{name:'localizacaostr', label:'Localizacao' },
	// 			{name:'observacoes', label:'Observações' },
	// 		]
	// 	},
	// },


	// vestigio: {
	// 	url : 'expedicao/vestigio/',
	// 	map:{
	// 		relatorio:'relatorio',
	// 		registro:'registro',
	// 		sitio:'sitio',
	// 		habitacao:'habitacao',
	// 		tipo:'tipovestigio',
	// 		caracterizacao_inundacao:'caracterizacaotipoinundacao',
	// 		caracterizacao_tipo_hidrografia:'caracterizacaotipohidrografia',
	// 		caracterizacao_posicao_hidrografia:'caracterizacaoposicaohidrografica',
	// 		caracterizacao_ambiente:'CaracterizacaoTipoAmbiente',
	// 		colecao_midia:'colecao',
	// 		recurso:'tipoderecurso',
	// 		materiais:'recursonatural',
	// 		ferramentas:'culturamaterial',
	// 	},
	// 	form:{
	// 		hidden:['relatorio','sitio','habitacao','estado','municipio','terra_indigena']
	// 	},
	// 	includeOnLoad:'all',

	// 	propriedadeVirtual: {	
	// 		localizacaostr:{
	// 			label: 'Localizacao',
	// 			required: false,
	// 			valueFn: (elm)=>{
	// 				if( _.has(elm,'terra_indigena.nome') ){
    //                     return "TI. "+_.get(elm,'terra_indigena.nome')
    //                 }else{
    //                     return _.get(elm,'municipio.nome')+" - " + _.get(elm,'estado.sigla','')
    //                 }
	// 			}
	// 		},
	// 	},

	// 	tabela:{
	// 		coluna:[
	// 			{name:'id', label:'Id'},
	// 			{name:'registro', label:'registro', render:(elm)=> _.get(elm,'registro.nome') +" "+ _.get(elm,'registro._id') },
	// 			{name:'tipo', label:'Tipo', render:(elm)=>_.get(elm,'tipo.nome') },
	// 			{name:'localizacaostr', label:'Localizacao' },
	// 			{name:'observacoes', label:'Observações' },
	// 		]
	// 	},

	// },


	// sitios_rel:{
	// 	url: 'expedicao/sitios_rel/',
	// 	form:{
	// 		hidden:['relatorio'],
	// 	},
	// 	map:{
	// 		sitio:'sitio',
	// 		relatorio:'relatoriodeexpedicao',
	// 	},
	// 	includeOnLoad:['sitio']
	// },






	// //* ***************************
	// // MIDIA
	// //* **************************
	// tag: {
	// 	type: 'tag',
	// 	url: 'midia/tag/',
	// 	idkey: 'nome',
	// },

	// colecao: {
	// 	type: 'colecao',
	// 	url: 'midia/colecao/',
	// 	map: {
	// 		midia_set: 'midia',
	// 		tags:'tag'
	// 	},
	// 	includeOnLoad: ['midia_set'],
	// },

	// midia: {
	// 	type: 'midia',
	// 	url: 'midia/midia/',
	// 	map: {
	// 		tags:'tag',
	// 		colecao:'colecao'
	// 	},
	// },


	// padraoregistro: {
	// 	type: 'padraoregistro',
	// 	url: 'administracao/padraoregistro/',
	// },

	// statusregistro: {
	// 	type: 'statusregistro',
	// 	url: 'administracao/statusregistro/',
	// 	// map:{padrao:'padraoregistro'}
	// },

	// faseregistro: {
	// 	type: 'faseregistro',
	// 	url: 'administracao/faseregistro/',
	// 	// map:{status:'statusregistro'}
	// },

	// etaparegistro: {
	// 	type: 'etaparegistro',
	// 	url: 'administracao/etaparegistro/',
	// 	// map:{fase:'faseregistro'}
	// },

	// classificacao: {
	// 	type: 'classificacao',
	// 	url: 'administracao/classificacao/',
	// 	map: {
	// 		padrao: 'padraoregistro',
	// 		status: 'statusregistro',
	// 		fase: 'faseregistro',
	// 		etapa: 'etaparegistro',
	// 	},
	// 	// includeOnLoad:'all',
	// 	includeOnLoad: ['padrao', 'status', 'fase', 'etapa'],
	// },

	// pessoa: {
	// 	type: 'pessoa',
	// 	url: 'gestao/avatar/',
	// 	idkey: 'cpf',
	// 	map: {
	// 		perfis: 'group',
	// 	},

	// 	propriedadeVirtual: {
	// 		tipoDeAcesso: {
	// 			label: 'Tipo De Acesso',
	// 			required: true,
	// 			type: 'choice',
	// 			default: null,
	// 			choices: [
	// 				{
	// 					display_name: 'Normal',
	// 					value: {
	// 						usuario_s: false,
	// 						administrador: false,
	// 					},
	// 				},
	// 				{
	// 					display_name: 'Usuário',
	// 					value: {
	// 						usuario_s: true,
	// 						administrador: false,
	// 					},
	// 				},
	// 				{
	// 					display_name: 'Administrador',
	// 					value: {
	// 						usuario_s: true,
	// 						administrador: true,
	// 					},
	// 				},
	// 			],
	// 		},
	// 	}, // fim propriedadeVirtual

	// 	hidden: ['usuario_s', 'administrador'],
	// 	includeOnLoad:['perfis__id','perfis__name']
	// },

	// group: {
	// 	type: 'group',
	// 	url: 'gestao/group/',
	// 	exclude:['permission']
	// },



	// // TERRITORIOS
	// estado: {
	// 	type:"estado",
	// 	url:'territorio/estado/',
	// 	idkey:'geocod'
	// },

	// municipio:{
	// 	type:"municipio",
	// 	url:'territorio/municipio/',
	// 	idkey:'geocod'
	// },

	// terraindigena:{
	// 	url: 'territorio/terraindigena/',
	// 	idkey:'cod_ti'
	// },

	// // restricaodeuso:{
	// // 	url: 'territorio/restricaodeuso/',
	// // 	map:{
	// // 		atualizacao:'restricaodeuso',
	// // 		legislacao:'legislacao',
	// // 		municipios:'municipio'
	// // 	}
	// // },




	// relato: {
	// 	type: 'relato',
	// 	url: 'coplii/relato/',
	// 	map: {
	// 		colecao_midia:'colecao',
	// 		receptor: 'pessoa',
	// 		estado:'estado',  //se eu colocar no map, preciso ter certeza de incluir o id no include on load
	// 		municipio:'municipio',
	// 		terra_indigena:'terraindigena',
	// 		tags:'tag',
	// 		// caracterizacao_ambiente:'caracterizacaotipoambiente'
	// 	},
	// 	// includeOnLoad:['colecao_midia','receptor'],
	// 	includeOnSave: ['informante'],
	// 	includeOnLoad: ['colecao_midia','estado__sigla','estado__geocod','estado__nome','municipio__geocod','municipio__nome','terra_indigena__cod_ti','terra_indigena__nome'],
	// 	// includeOnLoad:'all'

	// 	propriedadeVirtual: {	
	// 		localizacaoNome:{
	// 			label: 'Localizacao',
	// 			required: false,
	// 			valueFn: (elm)=>{
	// 				if( _.has(elm,'terra_indigena.nome') ){
    //                     return "TI. "+_.get(elm,'terra_indigena.nome')
    //                 }else{
    //                     return _.get(elm,'municipio.nome')+" - " + _.get(elm,'estado.sigla','')
    //                 }
	// 			}
	// 		},
	// 	}

	// },


	// solicitacaocriacaoregistro: {
	// 	type: 'solicitacaocriacaoregistro',
	// 	url: 'coplii/solicitacaocriacaoregistro/',
	// 	map: {
	// 		classificacao_inicial: 'classificacao',
	// 		autor: 'pessoa',
	// 		doc_solicitacao: 'colecao',
	// 		relatos: 'relato',
	// 		parecersolicitacaocriacaoregistro_set:'parecersolicitacaocriacaoregistro'
	// 	},
	// 	includeOnLoad: ['relatos','autor','parecersolicitacaocriacaoregistro_set'],
	// 	// includeOnSave:['informante']
	// 	propriedadeVirtual: {	
	// 		parecerStr:{
	// 			label: 'Parecer status',
	// 			required: false,
	// 			valueFn: (elm)=>{
					
	// 				if(_.isEmpty(elm.parecersolicitacaocriacaoregistro_set)){
	// 					return 'pendente emitir'
	// 				}
	// 				if( _.get(elm,'parecersolicitacaocriacaoregistro_set[0].favoravel') ){
	// 					return 'favoravel'
	// 				}else{
	// 					return 'desfavoravel'
	// 				}
				
	// 		}
	// 		},
	// 	},

	// },

	// parecersolicitacaocriacaoregistro: {
	// 	type: 'parecersolicitacaocriacaoregistro',
	// 	url: 'coplii/parecersolicitacaocriacaoregistro/',
	// 	map: {
	// 		solicitacao: 'solicitacaocriacaoregistro',
	// 		registro:'registro',
	// 	},
	// 	form:{
	// 		hidden:['registro']
	// 	},
	// 	includeOnLoad:['solicitacao']
	// },

	// registroclassificacao: {
	// 		url: 'coplii/registroclassificacao/',
	// 		map:{
	// 			registro:'registro',
	// 			classificacao:'classificacao',
	// 		}
	// },


	// registro: {
	// 	type: 'registro',
	// 	url: 'coplii/registro/',
	// 	idkey: 'num_registro',
	// 	hidden: ['estado', 'municio', 'terra_indigena'],
	// 	exclude: ['estado', 'municio', 'terras_indigenas'],

	// 	map: {
	// 		autorizacao: 'parecersolicitacaocriacaoregistro',
	// 		classificacoes: 'classificacao',
	// 		doc_solicitacao: 'colecao',
	// 		// retricao_de_uso: 'restricaodeuso',
	// 		sitio_set:'sitio',
	// 		planodecontingencia_set:'planodecontingencia',
	// 		notatecnica_set:'notatecnica',

	// 		registroclassificacao_set:'registroclassificacao',
	// 		// solicitacaoalteracaoclassificacao_set:'solicitacaoalteracaoclassificacao',
	// 		// pareceralteracaoclassificacao_set:'pareceralteracaoclassificacao',
	// 		// resolucaoconselho_set:'resolucaoconselho',
	// 	},

	// 	form:{
	// 		exclude:['estado','municipio','terra_indigena','retricao_de_uso'],
	// 		hidden:['autorizacao'],
	// 		campos:{
	// 			fpe:{}
	// 		},
	// 		popupSempreAberto:true,
	// 	},


	// 	propriedadeVirtual: {
			
	// 		localizacaostr:{
	// 			label: 'Localizacao',
	// 			required: false,
	// 			valueFn: (elm)=>{
	// 				if( _.has(elm,'terra_indigena[0].nome') ){
    //                     return "TI. "+_.get(elm,'terra_indigena[0].nome')
    //                 }else{
    //                     return _.get(elm,'municipio.nome')+" - " + _.get(elm,'estado.sigla','')
    //                 }
	// 			}
	// 		},

	// 		classificacaoAtual:{
	// 			label: 'Classificacação Atual',
	// 			required: false,
	// 			type: 'choice',
	// 			default: '',
	// 			valueFn: (elm)=>{
	// 					// solicitacao, parecer ou resolucao
	// 					var classificacaoSet = _.sortBy( elm.registroclassificacao_set, 'id');
	// 					var classificacalAtual = _.last(classificacaoSet);
	// 					return classificacalAtual
	// 			}
	
	// 		},

	// 		classificacaoAtualStr:{
	// 			label: 'Classificacação Atual',
	// 			required: false,
	// 			type: 'choice',
	// 			default: '',
	// 			valueFn: (elm)=>{
						
	// 					// solicitacao, parecer ou resolucao
	// 					var classificacaoSet = _.sortBy( elm.registroclassificacao_set, 'id');
	// 					var classificacalAtual = _.last(classificacaoSet);

	// 					var classificacaoNome = _.get(classificacalAtual,'classificacao.padrao.nome','')
	// 					classificacaoNome +=" "+ _.get(classificacalAtual,'classificacao.status.nome','')
	// 					classificacaoNome +=" "+ _.get(classificacalAtual,'classificacao.fase.nome','')
	// 					classificacaoNome +=" "+ _.get(classificacalAtual,'classificacao.etapa.nome','')

	// 					return classificacaoNome
	// 			}
	
	// 		},

	// 		statusSolicitacaoAlteracaoClassificacao: {
	// 			label: 'statusSolicitacaoAlteracaoClassificacao',
	// 			required: false,
	// 			type: 'choice',
	// 			default: 'solicitacao',
	// 			valueFn: (elm)=>{
	// 					// solicitacao, parecer ou resolucao
	// 					var classificacaoSet = _.sortBy( elm.registroclassificacao_set, 'id');
	// 					var solicitacaoClassificacaoSet = _.sortBy( elm.solicitacaoalteracaoclassificacao_set, 'id');
	// 					var solicitacaoClassificacaoAtual = _.last(solicitacaoClassificacaoSet);
	// 					var parecerAlteracaoClassificacaoSet = _.sortBy( elm.pareceralteracaoclassificacao_set, 'id');
	// 					var resolucaoConselhoSet = _.sortBy( elm.resolucaoconselho_set, 'id');
						
	// 					//O QUE MOSTRAR
	// 					var mostrar = "solicitacao";
	// 					var classificacaosolicitada = "";

	// 					//Se ja tenho uma solicitacao
	// 					if( ! _.isEmpty(solicitacaoClassificacaoAtual) ){
	// 							classificacaosolicitada = solicitacaoClassificacaoAtual.classificacao_solicitada;
	// 							//pego o parecer
	// 							var parecer = _.find(parecerAlteracaoClassificacaoSet,{solicitacao:solicitacaoClassificacaoAtual.id})
	// 							//vejo se tenho um parecer
	// 							if( _.isEmpty(parecer) ){
	// 								//se nao tenho vou mostrar para emitir um parecer
	// 								mostrar = "parecer"
	// 							}else{
	// 								//se parecer depende de uma resolucao do conselho
	// 								if(parecer.solucao == "2" ){
	// 										var resolucao = _.find(resolucaoConselhoSet, {parecer:parecer.id} );
	// 										//se nnao tenho a resolucao, vou mostrar a emissao desse
	// 										if(_.isEmpty(resolucao) ){
	// 											mostrar = "resolucao"   
	// 										}
	// 								}
	// 							}
	// 					}

	// 					//retorno o que esta atualmente
	// 					return mostrar
	// 			} 
	// 		},
	// 	}, // fim propriedadeVirtual

	// 	includeOnLoad:[
	// 				'estado__geocod',
	// 				'estado__nome',
	// 				'estado__sigla',
	// 				'municipio__geocod',
	// 				'municipio__nome',
	// 				'terra_indigena__cod_ti',
	// 				'terra_indigena__nome',
	// 				'lingua__id',
	// 				'lingua__nome',
	// 				'registroclassificacao_set',
	// 				'solicitacaoalteracaoclassificacao_set',
	// 				'pareceralteracaoclassificacao_set',
	// 				'resolucaoconselho_set'
	// 				]
	// 	// includeOnLoad:['autorizacao'],//,'classificacoes','doc_solicitacao','retricao_de_uso']
	// },

	// solicitacaoalteracaoclassificacao: {
	// 	url : 'coplii/solicitacaoalteracaoclassificacao/',
	// 	map:{
	// 		registro:'registro'
	// 	},
	// 	form:{
	// 		exclude:['parecer'],
	// 	}
	// },


	// pareceralteracaoclassificacao: {
	// 	url : 'coplii/pareceralteracaoclassificacao/',
	// 	map:{
	// 		parecer:'pareceralteracaoclassificacao',
	// 		autor:'pessoa',
	// 		registro:'registro'
	// 	}
	// },


	// resolucaoconselho: {
	// 	url : 'coplii/resolucaoconselho/',
	// 	map:{
	// 		solicitacao:'solicitacaoalteracaoclassificacao',
	// 		autores:'pessoa'
	// 	}
	// },

	// fpe: {
	// 	type: 'fpe',
	// 	url: 'gestao/fpe/',
	// 	map:{
	// 		registro_set:'registro',
	// 	},
	// 	form:{
	// 		exclude:['equipe','estados','municipios','terras_indigenas'],
	// 		campo:{
	// 			abrangencia:{ tipo:"mapaponto", geom:"area" }
	// 		}
	// 	},

	// 	includeOnLoad:['estados','municipios','terras_indigenas']
	// },

	// membro: {
	// 	type: 'membro',
	// 	url: 'gestao/membro/',
	// 	map:{
	// 		integrante:'pessoa',
	// 		funcao:'funcao'
	// 	},
	// 	form:{
	// 		hidden:['fpe']
	// 	},
	// 	includeOnLoad:['integrante','funcao']
	// },

	// bape: {
	// 	type: 'bape',
	// 	url: 'gestao/bape/',
	// 	map:{
	// 		frente:'fpe',
	// 		tis_atendidas:'terraindigena',
	// 		tipo_acesso:'acesso',
	// 		tipo_atribuicao:'atribuicao',
	// 		registro_set:'registro',
	// 	},

	// 	propriedadeVirtual: {	
	// 		tis_atendidas_str:{
	// 			label: 'Tis Atendidas',
	// 			required: false,
	// 			type: 'string',
	// 			default: '',
	// 			valueFn: (elm)=>{
	// 				var tis = "";
	// 				_.each(elm.tis_atendidas,ti=>{
	// 					tis += _.get(ti,'nome','')+ ', '
	// 				})

	// 				return tis.replace(/,\s$/,'')
	// 			}	
	// 		}
	// 	},

	// 	form:{
	// 		hidden:['frente'],
	// 		exclude:['estado','municipio','terra_indigena'],
	// 		campo:{tis_atendidas:{ allowAdditions:false}}
	// 	},
		
	// 	tabela:{
	// 		coluna:[
	// 				{label:"id", name:"id"},
	// 				{label:"Nome", name:"nome", width:"20%"},
	// 				{label:"Tis Atendidas", name:"tis_atendidas_str"},
	// 				{label:"FPE", name:"frente.nome"}
	// 			]
	// 	},

	// 	includeOnLoad:'all'
	// },


	// notatecnica:{
	// 	url: 'coplii/notatecnica/',
	// },


	// sitio:{
	// 	url:'coplii/sitio/',
	// 	idkey:'numero_sitio',
	// 	map:{
	// 		registro:'registro',
	// 		colecao_midia:'colecao',
	// 		equipe:'pessoa',
	// 		tags:'tag',
	// 		habitacao_set:'habitacao',
	// 	},

	// 	form:{
	// 		// exclude:['estado','municipio','terra_indigena','retricao_de_uso'],
	// 		hidden:['vestigio_set','habitacao_set'],
	// 		campos:{
	// 		},
	// 		popupSempreAberto:true,
	// 	},

	// 	tabela:{
	// 		coluna:[
	// 			{name:'numero_sitio', label:'Número do Sítio'},
	// 			{name:'registro', label:'registro', render:(elm)=> _.get(elm,'registro.nome') +" "+ _.get(elm,'registro._id') },
	// 		]
	// 	},


	// },

	// planodecontingencia:{
	// 	url:'coplii/planodecontingencia/',
	// 	map: {
	// 		autores:'pessoa',
	// 		registros:'registro',
	// 		tags:'tag',

	// 	}
	// },

	// habitacao:{
	// 	url:'coplii/habitacao/',
	// 	map:{
	// 		sitio:'sitio',
	// 		finalidade:'FinalidadeHabitacao',
	// 		materiais:'material',
	// 		ferramenta:'ferramenta',
	// 		tags:'tag',
	// 	},
	// 	form:{
	// 		// exclude:['estado','municipio','terra_indigena','retricao_de_uso'],
	// 		hidden:['vestigio_set'],
	// 		campos:{
	// 			sitio:{ disabled:true }
	// 		},
	// 		// popupSempreAberto:true,
	// 	},
	// },






};


// Aplico o attributo Type a todo elemento do modelo
_.forOwn(SI3RC_MODELS, (v, k) => {
	SI3RC_MODELS[k].type = k;


	// so apra ter uma versao com os nomes todo em lowercase;
	const kl = k.toLowerCase();
	SI3RC_MODELS[kl] = v;
	SI3RC_MODELS[kl].type = kl;

	//a url ddos modelos que uso a api
	// SI3RC_MODELS[kl].url = window.SI3CONFIG.urlAPI+SI3RC_MODELS[kl].url;

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

	// tag: {
	// 	nome: 'Tag',
	// 	descricao: 'Escreva os nomes das tags',
	// },
	// funcao: {
	// 	nome: 'Função',
	// 	descricao: 'Descrição do que é a função',
	// },
	// tipodecampo: {
	// 	nome: 'Tipo de campo',
	// 	descricao: 'Descrição do que é a um tipo de campo',
	// },
	// material: {
	// 	nome: 'Tipo de campo',
	// 	descricao: 'Descrição do que é a um material',
	// },
	// expediente: {
	// 	nome: 'Expediente',
	// 	descricao: 'Descrição do que é a um expediente',
	// },
	// programa: {
	// 	nome: 'Programa',
	// 	descricao: 'Descrição do que é o programa',
	// },
	// tipoevento: {
	// 	nome: 'Tipo de evento',
	// 	descricao: 'Descrição do que é o programa',
	// },
	// aparelho: {
	// 	nome: 'Aparelho',
	// 	descricao: 'Descrição do que é o programa',
	// },
	// material: {
	// 	nome: 'Material',
	// 	descricao: 'Descrição do que é o material',
	// },
	// tipovestigio: {
	// 	nome: 'Tipo de Vestigio',
	// 	descricao: 'Descrição do que é ...',
	// },
	// ferramenta: {
	// 	nome: 'Ferramenta',
	// 	descricao: 'Descrição do que é ...',
	// },
	// statusregistro: {
	// 	nome: 'Status/Fases/Etapas do Registro',
	// 	descricao: '',
	// },
	// faseregistro: {
	// 	nome: 'Fase',
	// 	descricao: '',
	// },
	// etaparegistro: {
	// 	nome: 'Etapa ',
	// 	descricao: '',
	// },
	// situacao: {
	// 	nome: 'Situação ',
	// 	descricao: '',
	// },

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


// export const t = (nome) => {
// 	nome = nome.toLowerCase();
// 	if (SI3RC_NOMES[nome]) {
// 		return (SI3RC_NOMES[nome].nome || _.startCase(nome));
// 	}
// 	return _.startCase(nome);
// };



export const t = (nome) => {

	var state = window.STORE.getState() 

	return _.get(state,'api.modelOptions.' + nome + '.name', nome)

	// nome = nome.toLowerCase();
	// if (SI3RC_NOMES[nome]) {
	// 	return (SI3RC_NOMES[nome].nome || _.startCase(nome));
	// }
	// return _.startCase(nome);
};


export const d = (nome) => {
	var state = window.STORE.getState() 
	return _.get(state,'api.modelOptions.' + nome + '.description', nome)
};

  
export default SI3RC_MODELS;

