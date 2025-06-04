from django.contrib.gis.db import models
from curupira_rest_api.models import SoftDeletion, ElementoBasico
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.response import Response

from curupira_rest_api.viewsets import KhartesListViewSet
import time


TIPO_GEOM = (
    ('0', 'Ponto'),
    ('1', 'Linha'),
    ('2', 'Polígono'),
)


class Parque(SoftDeletion):
    nome = models.CharField(max_length=250, null=True, blank=True)
    nome_decreto = models.CharField(max_length=256, null=True, blank=True)
    tipo = models.CharField(max_length=250, null=True, blank=True)
    categoria = models.CharField(max_length=250, null=True, blank=True)
    geom = models.MultiPolygonField(srid=4674,
                                    verbose_name='Limite',
                                    help_text='Limite oficial do parque.',
                                    null=True, blank=True)
    center = models.PointField(srid=4674,
                               verbose_name='Centro',
                               help_text='Centro do parque.',
                               null=True, blank=True)

    custo_entrada = models.CharField(max_length=250, null=True, blank=True)
    periodo_abertura = models.TextField(null=True, blank=True)

    descricao = models.TextField(verbose_name='Descrição',
                                 null=True, blank=True)

    regiao_administrativa = models.CharField(
        max_length=250, null=True, blank=True)

    visitantes = models.ManyToManyField(User,
                                        through='VisitanteParque',
                                        through_fields=(
                                            'parque', 'visitante',),
                                        related_name='visitante_parque')


    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Parque"

    class MetaSerializer:
        includes = {'imagemparque_set': [], 'videoyoutubeparque_set': [], 'trilha_set':['id','nome']}
        exclude_fields = ['created_at', 'deleted_at']

    @staticmethod
    def appendInfo(data_serialized):
        instance = Parque.objects.get(id=data_serialized['id'])
        data_serialized['possui_sede']= len([i for i in instance.benfeitoria_set.all() if i.tipo_benfeitoria.id == 6]) > 0
        return data_serialized

    class MetaViewSet:
              
        @staticmethod 
        def retrieve(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            serializer = viewset.get_serializer(instance)
            return Response(Parque.appendInfo(serializer.data))

        @staticmethod
        def list(viewset, request, *args, **kwargs):
            queryset = viewset.filter_queryset(viewset.get_queryset())

            page = viewset.paginate_queryset(queryset)
            if page is not None:
                serializer = viewset.get_serializer(page, many=True)
                return viewset.get_paginated_response([Parque.appendInfo(i) for i in serializer.data])

            serializer = viewset.get_serializer(queryset, many=True)
            return Response([Parque.appendInfo(i) for i in serializer.data])


class ImagemParque(SoftDeletion):
    autor = models.CharField(max_length=200, null=True, blank=True,
                             verbose_name='Autor',
                             help_text='')
    imagem = models.ImageField(upload_to='parque/')
    parque = models.ForeignKey(Parque, on_delete=models.CASCADE)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Imagens',
                             'help_text': 'Fotografias dos Parques'}}


class VideoYoutubeParque(SoftDeletion):
    parque = models.ForeignKey(Parque, on_delete=models.CASCADE)
    nome = models.CharField(max_length=250, null=True, blank=True)
    autor = models.CharField(max_length=250, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Vídeos no Youtube',
                             'help_text': 'Vídeos no Youtube sobre os Parques'}}

    def __str__(self):
        return self.nome


class VisitanteParque(ElementoBasico, SoftDeletion):
    parque = models.ForeignKey(Parque, on_delete=models.CASCADE)
    visitante = models.ForeignKey(
        User, related_name='visit', null=True, blank=True, on_delete=models.CASCADE)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']

    def __str__(self):
        return self.visitante.username

    class MetaViewSet:
        @staticmethod
        def create(viewset, request, *args, **kwargs):
            data = request.data.copy()
            data['user'] = request.user.id
            data['visitante'] = request.user.id
            serializer = viewset.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            viewset.perform_create(serializer)
            headers = viewset.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class ContatoParque(SoftDeletion):
    parque = models.OneToOneField(Parque, on_delete=models.CASCADE)
    endereco = models.CharField(max_length=100)
    email = models.EmailField(null=True, blank=True)
    telefone = models.CharField(max_length=100)
    responsavel = models.CharField(max_length=100, null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Contatos',
                             'help_text': 'Contatos'}}

    def __str__(self):
        return self.responsavel


class TipoBenfeitoria(SoftDeletion):
    nome = models.CharField(max_length=100)
    icone = models.FileField(upload_to='estrutura/')

    tipo_geom = models.CharField(
        max_length=1,
        choices=TIPO_GEOM,
        default='0',
    )


    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'Benfeitoria': {'read_only': True, 'required': False,
                                  'label': 'Tipo de Estrutura',
                                  'help_text': 'Tipo de Estrutura'}}

    def __str__(self):
        return self.nome


class Benfeitoria(SoftDeletion):
    parque = models.ForeignKey(Parque, on_delete=models.CASCADE)
    tipo_benfeitoria = models.ForeignKey(TipoBenfeitoria, on_delete=models.CASCADE)
    descricao = models.TextField( null=True, blank=True )
    geom = models.GeometryField(srid=4674)

    class MetaSerializer:
        exclude_fields = ['parque','user', 'created_at', 'deleted_at']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Estrutura',
                             'help_text': 'Estruturas existentes na UC'}}

    def __str__(self):
        return self.tipo_benfeitoria.nome


class TipoAtrativo(SoftDeletion):
    nome = models.CharField(max_length=100)
    icone = models.FileField(upload_to='atrativo/')
    tipo_geom = models.CharField(
        max_length=1,
        choices=TIPO_GEOM,
        default='0',
    )

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'Atrativo': {'read_only': True, 'required': False,
                               'label': 'Tipo Atrativo',
                               'help_text': 'Tipo de Atrativo'}}

    def __str__(self):
        return self.nome


class Atrativo(SoftDeletion):
    id = models.AutoField(primary_key=True)
    parque = models.ForeignKey(Parque, on_delete=models.CASCADE)
    tipo_atrativo = models.ForeignKey(TipoAtrativo, on_delete=models.CASCADE)
    descricao = models.TextField( null=True, blank=True)
    cor = models.TextField( null=True, blank=True)
    nome = models.CharField(max_length=250, null=True, blank=True)
    limitacao = models.TextField( null=True, blank=True)
    geom = models.GeometryField(srid=4674)

    class MetaSerializer:
        exclude_fields = ['parque', 'user', 'created_at', 'deleted_at']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Atrativos',
                             'help_text': 'Atrativos do Parque'}}

    def __str__(self):
        return self.tipo_atrativo.nome



class ImagemAtrativoParque(SoftDeletion):
    autor = models.CharField(max_length=200, null=True, blank=True,
                             verbose_name='Autor',
                             help_text='')
    imagem = models.ImageField(upload_to='atrativoimagens/')
    atrativo = models.ForeignKey(Atrativo, on_delete=models.CASCADE)
    
    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'Atrativo': {'read_only': True, 'required': False,
                             'label': 'Imagens',
                             'help_text': 'Fotografias dos Atrativo'}}


class VideoAtrativoParque(SoftDeletion):
    atrativo = models.ForeignKey(Atrativo, on_delete=models.CASCADE)
    nome = models.CharField(max_length=250, null=True, blank=True)
    autor = models.CharField(max_length=250, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'Atrativo': {'read_only': True, 'required': False,
                             'label': 'Vídeos no Youtube',
                             'help_text': 'Vídeos no Youtube sobre o Atrativo'}}

    def __str__(self):
        return self.nome
