from euamoocerrado.settings import eac_router
from administracao import administracao_viewsets as viewsets


eac_router.register(r'rest_api/administracao/contact', viewsets.ContactViewSet)
eac_router.register(r'rest_api/administracao/textohome', viewsets.TextoHomeViewSet)
eac_router.register(r'rest_api/administracao/textotutorial', viewsets.TextoTutorialViewSet)
eac_router.register(r'rest_api/administracao/comentario', viewsets.ComentarioViewSet)
