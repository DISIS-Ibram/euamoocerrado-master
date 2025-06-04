from euamoocerrado.settings import eac_router
from trilha import trilha_viewsets as viewsets


eac_router.register(r'rest_api/trilha/atividade', viewsets.TipoAtividadeViewSet, basename='atividade')
eac_router.register(r'rest_api/trilha/trilha', viewsets.TrilhaViewSet, basename='trilha')
eac_router.register(r'rest_api/trilha/visitantetrilha', viewsets.VisitanteTrilhaViewSet, basename='visitantetrilha')
eac_router.register(r'rest_api/trilha/videoyoutubetrilha', viewsets.VideoYoutubeTrilhaViewSet, basename='videoyoutubetrilha')
eac_router.register(r'rest_api/trilha/imagemtrilha', viewsets.ImagemTrilhaViewSet, basename='imagemtrilha')
# eac_router.register(r'rest_api/trilha/tipoatrativo', viewsets.TipoAtrativoViewSet)
eac_router.register(r'rest_api/trilha/atrativo', viewsets.AtrativoViewSet, basename='atrativo')
eac_router.register(r'rest_api/trilha/imagematrativotrilha', viewsets.ImagemAtrativoTrilhaViewSet, basename='imagematrativotrilha')
eac_router.register(r'rest_api/trilha/videoatrativotrilha', viewsets.VideoAtrativoTrilhaViewSet, basename='videoatrativotrilha')


