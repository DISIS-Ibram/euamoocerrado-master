from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from curupira_rest_api import viewsets
from curupira_rest_api.utils import get_filter_and_ordering_fields
from curupira_rest_api.serializers import SerializerFactory
from rest_framework.permissions import *
from rest_framework.decorators import permission_classes

from parque.models import Parque, VisitanteParque, ContatoParque, TipoBenfeitoria, Benfeitoria, TipoAtrativo, Atrativo,\
    VideoYoutubeParque, ImagemParque, ImagemAtrativoParque, VideoAtrativoParque


class ParqueViewSet (viewsets.KhartesModelViewSet):
    model = Parque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class VisitanteParqueViewSet (viewsets.KhartesModelViewSet):
    model = VisitanteParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class ImagemParqueViewSet (viewsets.KhartesModelViewSet):
    model = ImagemParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class VideoYoutubeParqueViewSet (viewsets.KhartesModelViewSet):
    model = VideoYoutubeParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class ContatoParqueViewSet (viewsets.KhartesModelViewSet):
    model = ContatoParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class TipoBenfeitoriaViewSet (viewsets.KhartesModelViewSet):
    model = TipoBenfeitoria
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class BenfeitoriaViewSet (viewsets.KhartesModelViewSet):
    model = Benfeitoria
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class TipoAtrativoViewSet (viewsets.KhartesModelViewSet):
    model = TipoAtrativo
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class AtrativoViewSet (viewsets.KhartesModelViewSet):
    model = Atrativo
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)

class ImagemAtrativoViewSet (viewsets.KhartesModelViewSet):
    model = ImagemAtrativoParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)

class VideoAtrativoViewSet (viewsets.KhartesModelViewSet):
    model = VideoAtrativoParque
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)
