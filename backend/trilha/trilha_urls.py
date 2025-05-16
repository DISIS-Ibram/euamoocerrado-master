from euamoocerrado.settings import eac_router
from trilha import trilha_viewsets as viewsets


eac_router.register(r'rest_api/trilha/atividade', viewsets.TipoAtividadeViewSet)
eac_router.register(r'rest_api/trilha/trilha', viewsets.TrilhaViewSet)
eac_router.register(r'rest_api/trilha/visitantetrilha', viewsets.VisitanteTrilhaViewSet)
eac_router.register(r'rest_api/trilha/videoyoutubetrilha', viewsets.VideoYoutubeTrilhaViewSet)
eac_router.register(r'rest_api/trilha/imagemtrilha', viewsets.ImagemTrilhaViewSet)
# eac_router.register(r'rest_api/trilha/tipoatrativo', viewsets.TipoAtrativoViewSet)
eac_router.register(r'rest_api/trilha/atrativo', viewsets.AtrativoViewSet)
eac_router.register(r'rest_api/trilha/imagematrativotrilha', viewsets.ImagemAtrativoTrilhaViewSet)
eac_router.register(r'rest_api/trilha/videoatrativotrilha', viewsets.VideoAtrativoTrilhaViewSet)


