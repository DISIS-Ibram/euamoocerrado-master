from euamoocerrado.settings import eac_router
from especie import especie_viewsets as viewsets


eac_router.register(r'rest_api/especie/tipoespecie', viewsets.TipoEspecieViewSet)
eac_router.register(r'rest_api/especie/imagemespecie', viewsets.ImagemEspecieViewSet)
eac_router.register(r'rest_api/especie/ocorrencia', viewsets.OcorrenciaViewSet)
