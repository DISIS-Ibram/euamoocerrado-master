from rest_framework.filters import OrderingFilter, DjangoFilterBackend

from curupira_rest_api import viewsets
from curupira_rest_api.utils import get_filter_and_ordering_fields
from curupira_rest_api.serializers import SerializerFactory

from trilha.models import Trilha, VisitanteTrilha, TipoAtividade, ImagemTrilha, VideoYoutubeTrilha, AtrativoTrilha, \
    ImagemAtrativoTrilha, VideoAtrativoTrilha

from rest_framework.permissions import *
from rest_framework.decorators import permission_classes




class TipoAtividadeViewSet (viewsets.KhartesModelViewSet):
    model = TipoAtividade
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      


class TrilhaViewSet (viewsets.KhartesModelViewSet):
    model = Trilha
    permission_classes = (IsAuthenticatedOrReadOnly, viewsets.IsOwnerOrReadOnly)
    need_moderation = True
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      


class VisitanteTrilhaViewSet (viewsets.KhartesModelViewSet):
    model = VisitanteTrilha
    permission_classes = (IsAuthenticatedOrReadOnly, viewsets.IsOwnerOrReadOnly)
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class ImagemTrilhaViewSet (viewsets.KhartesModelViewSet):
    model = ImagemTrilha
    permission_classes = (IsAuthenticatedOrReadOnly, viewsets.IsOwnerOrReadOnly)
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)

class VideoYoutubeTrilhaViewSet (viewsets.KhartesModelViewSet):
    model = VideoYoutubeTrilha
    permission_classes = (IsAuthenticatedOrReadOnly, viewsets.IsOwnerOrReadOnly)
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)

# class TipoAtrativoViewSet (viewsets.KhartesModelViewSet):
#     model = TipoAtrativoTrilha
#     serializer_class = SerializerFactory(model)
#     queryset = model.objects.all()
#     filter_backends = (DjangoFilterBackend, OrderingFilter)
#     filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class AtrativoViewSet (viewsets.KhartesModelViewSet):
    model = AtrativoTrilha
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class ImagemAtrativoTrilhaViewSet (viewsets.KhartesModelViewSet):
    model = ImagemAtrativoTrilha
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)


class VideoAtrativoTrilhaViewSet (viewsets.KhartesModelViewSet):
    model = VideoAtrativoTrilha
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)