from euamoocerrado.settings import eac_router
from parque import parque_viewsets as viewsets


eac_router.register(r'rest_api/parque/parque', viewsets.ParqueViewSet)
eac_router.register(r'rest_api/parque/visitanteparque',
                    viewsets.VisitanteParqueViewSet)
eac_router.register(r'rest_api/parque/videoyoutubeparque',
                    viewsets.VideoYoutubeParqueViewSet)
eac_router.register(r'rest_api/parque/imagemparque',
                    viewsets.ImagemParqueViewSet)

eac_router.register(r'rest_api/parque/contatoparque',
                    viewsets.ContatoParqueViewSet)
eac_router.register(r'rest_api/parque/tipobenfeitoria',
                    viewsets.TipoBenfeitoriaViewSet)
eac_router.register(r'rest_api/parque/benfeitoria',
                    viewsets.BenfeitoriaViewSet)
eac_router.register(r'rest_api/parque/tipoatrativo',
                    viewsets.TipoAtrativoViewSet)
eac_router.register(r'rest_api/parque/atrativo', viewsets.AtrativoViewSet)
eac_router.register(r'rest_api/parque/imagematrativoparque', viewsets.ImagemAtrativoViewSet)
eac_router.register(r'rest_api/parque/videoatrativoparque', viewsets.VideoAtrativoViewSet)
