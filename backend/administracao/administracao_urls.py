from euamoocerrado.settings import eac_router
from administracao import administracao_viewsets as viewsets


eac_router.register(r'rest_api/administracao/contact', viewsets.ContactViewSet, basename='contact')
eac_router.register(r'rest_api/administracao/textohome', viewsets.TextoHomeViewSet, basename='textohome')
eac_router.register(r'rest_api/administracao/textotutorial', viewsets.TextoTutorialViewSet, basename='textotutorial')
eac_router.register(r'rest_api/administracao/comentario', viewsets.ComentarioViewSet, basename='comentario')
