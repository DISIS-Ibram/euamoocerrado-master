from euamoocerrado.settings import eac_router
from parque import parque_viewsets as viewsets


eac_router.register(r'rest_api/parque/parque', viewsets.ParqueViewSet, basename='parque_viewset')
eac_router.register(r'rest_api/parque/visitanteparque', viewsets.VisitanteParqueViewSet, basename='visitanteparque_viewset')
eac_router.register(r'rest_api/parque/videoyoutubeparque', viewsets.VideoYoutubeParqueViewSet, basename='videoyoutubeparque_viewset')
eac_router.register(r'rest_api/parque/imagemparque', viewsets.ImagemParqueViewSet, basename='imagemparque_viewset')
eac_router.register(r'rest_api/parque/contatoparque', viewsets.ContatoParqueViewSet, basename='contatoparque_viewset')
eac_router.register(r'rest_api/parque/tipobenfeitoria', viewsets.TipoBenfeitoriaViewSet, basename='tipobenfeitoria_viewset')
eac_router.register(r'rest_api/parque/benfeitoria', viewsets.BenfeitoriaViewSet, basename='benfeitoria_viewset')
eac_router.register(r'rest_api/parque/tipoatrativo', viewsets.TipoAtrativoViewSet, basename='tipoatrativo_viewset')
eac_router.register(r'rest_api/parque/atrativo', viewsets.AtrativoViewSet, basename='atrativo_viewset')
eac_router.register(r'rest_api/parque/imagematrativoparque', viewsets.ImagemAtrativoViewSet, basename='imagematrativoparque_viewset')
eac_router.register(r'rest_api/parque/videoatrativoparque', viewsets.VideoAtrativoViewSet, basename='videoatrativoparque_viewset')

