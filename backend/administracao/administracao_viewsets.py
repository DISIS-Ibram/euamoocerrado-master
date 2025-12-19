from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter

from curupira_rest_api import viewsets
from curupira_rest_api.utils import get_filter_and_ordering_fields
from curupira_rest_api.serializers import SerializerFactory

from administracao.models import Contact, TextoHome, TextoTutorial, Comentario

from rest_framework.permissions import *
from rest_framework.decorators import api_view, permission_classes

@permission_classes((AllowAny,))
class ContactViewSet (viewsets.KhartesModelViewSet):
    model = Contact
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      

class TextoHomeViewSet (viewsets.KhartesModelViewSet):
    model = TextoHome
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      


class TextoTutorialViewSet (viewsets.KhartesModelViewSet):
    model = TextoTutorial
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      


class ComentarioViewSet (viewsets.KhartesModelViewSet):
    need_moderation = True
    model = Comentario
    serializer_class = SerializerFactory(model)
    queryset = model.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filter_fields, ordering_fields = get_filter_and_ordering_fields(model)      
