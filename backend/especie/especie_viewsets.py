from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from curupira_rest_api import viewsets
from curupira_rest_api.utils import get_filter_and_ordering_fields
from curupira_rest_api.serializers import SerializerFactory

from especie.models import TipoEspecie, ImagemEspecie, Ocorrencia


class TipoEspecieViewSet (viewsets.KhartesModelViewSet):
    model = TipoEspecie
    need_moderation = True
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      

class ImagemEspecieViewSet (viewsets.KhartesModelViewSet):
    model = ImagemEspecie
    serializer_class = SerializerFactory(model)
    need_moderation = True
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      
   

class OcorrenciaViewSet (viewsets.KhartesModelViewSet):
    need_moderation = True
    model = Ocorrencia
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      
