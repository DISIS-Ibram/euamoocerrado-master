from euamoocerrado.settings import eac_router
from especie import especie_viewsets as viewsets


eac_router.register(r'rest_api/especie/tipoespecie', viewsets.TipoEspecieViewSet, basename='tipoespecie')
eac_router.register(r'rest_api/especie/imagemespecie', viewsets.ImagemEspecieViewSet, basename='imagemespecie')
eac_router.register(r'rest_api/especie/ocorrencia', viewsets.OcorrenciaViewSet, basename='ocorrencia')

