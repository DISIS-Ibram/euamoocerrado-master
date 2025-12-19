from django.contrib.gis.db import models
from parque.models import Parque
from django.contrib.auth.models import User
from curupira_rest_api.models import SoftDeletion, ElementoBasico, SoftDeletionQuerySet
from django.db.models import Q
from rest_framework import status
from rest_framework.response import Response
from curupira_rest_api.serializers import  KhartesSerializer
from parque.models import  TipoAtrativo

TIPO_GEOM = (
    ('0', 'Ponto'),
    ('1', 'Linha'),
    ('2', 'Polígono'),
)

DIFICULDADE = (
    ('0', 'Fácil'),
    ('1', 'Moderada'),
    ('2', 'Difícil'),
    ('3', 'Muito Difícil'),
    ('3', 'Para Especialistas'),
    ('-1', 'Desconhecido'),
)

class TipoAtividade(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    icone = models.FileField(upload_to='atividade/')

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        # nested = {'Trilha': {'read_only': True, 'required': False,
        #                        'label': 'Atividades',
        #                        'help_text': 'Atividades realizadas na Trilha'}}

    def __str__(self):
        return self.nome


class Trilha(ElementoBasico, SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(max_length=100)
    atividades = models.ManyToManyField(TipoAtividade, blank=True)
    parques = models.ManyToManyField(Parque, blank=True,
                               verbose_name='Parques',
                               help_text='Parques associados')

    sinalizada = models.BooleanField(default=False)
    geom = models.LineStringField(srid=4674,null=True, blank=True,
                                  verbose_name='Traçado da Trilha',
                                  help_text='Linha que define a Trilha')
    geom3d = models.LineStringField(srid=4674, dim=3,
                                    verbose_name='Traçado 3D',
                                    help_text='Linha 3D que define a Trilha',
                                    null=True, blank=True)
    descricao = models.TextField(verbose_name='Descrição',)
    regiao_administrativa = models.CharField(
        max_length=250, null=True, blank=True)
    visitantes = models.ManyToManyField(User,
                                        through='VisitanteTrilha',
                                        through_fields=('trilha', 'visitante',),
                                        related_name='visitante_trilha')


    categoria = models.CharField(
        max_length=2,
        choices=DIFICULDADE,
        default='-1',
    )

    def __str__(self):
        return self.nome

    # def save(self, *args, **kwargs):        
    #     super(Trilha, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Trilha"

    class MetaSerializer:
        includes = {'imagemtrilha_set': [], 'videoyoutubetrilha_set': [], 'atrativotrilha_set':['id','geom','descricao','cor','imagematrativotrilha_set','videoatrativotrilha_set','tipo_atrativo']}
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'Parque': {'read_only': True, 'required': False,
                             'label': 'Trilhas',
                             'help_text': 'Trilhas'}}        

        @staticmethod
        def run_validation(serializer, data):
            validated_data = super(KhartesSerializer, serializer).run_validation(data=data)
            parque_lista = []
            if ("geom" in validated_data):
                geom = validated_data["geom"]
                parques = Parque.objects.filter(geom__intersects=geom)
                for i in parques:
                    parque_lista.append(i)
                validated_data["parques"] = parque_lista
            return validated_data



    class MetaViewSet:
        @staticmethod
        def list(viewset, request, *args, **kwargs):
            query = SoftDeletionQuerySet(viewset.model).filter(deleted_at=None)
            if not (request.user.is_staff or request.user.is_superuser):
                query = SoftDeletionQuerySet(viewset.model).filter( Q(deleted_at=None), Q(publico=True) | Q(user=request.user.pk) )
            queryset = viewset.filter_queryset(query)
            page = viewset.paginate_queryset(queryset)
            if page is not None:
                serializer = viewset.get_serializer(page, many=True)
                return viewset.get_paginated_response(serializer.data)

            serializer = viewset.get_serializer(queryset, many=True)
            
            return Response(serializer.data)                            
        
        @staticmethod
        def retrieve(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            serializer = viewset.get_serializer(instance)
            if instance.publico or (request.user.is_staff or request.user.is_superuser) or (instance.user == request.user):
                return Response(serializer.data)
            return Response({"detail": "Não encontrado."})


            
class Trilha_3d(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    nome = models.CharField(max_length=100)

    geom3d = models.LineStringField(srid=4674, dim=3,
                                    verbose_name='Traçado 3D',
                                    help_text='Linha 3D que define a Trilha',
                                    null=True, blank=True)

    def __str__(self):
        return self.nome

    class Meta:
        verbose_name = "Trilha"

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']


class VisitanteTrilha(ElementoBasico, SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    trilha = models.ForeignKey(Trilha, on_delete=models.CASCADE)
    visitante = models.ForeignKey(
        User, related_name='visit_t', null=True, blank=True, on_delete=models.CASCADE)

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

class ImagemTrilha(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    autor = models.CharField(max_length=200, null=True, blank=True,
                            verbose_name='Autor',
                            help_text='')
    imagem = models.ImageField(upload_to='trilha/')
    trilha = models.ForeignKey(Trilha, on_delete=models.CASCADE)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at', 'user']
        nested = {'Trilha': {'read_only': True, 'required': False,
                            'label': 'Imagens',
                            'help_text': 'Fotografias das Trilhas'}}

class VideoYoutubeTrilha(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    trilha = models.ForeignKey(Trilha, on_delete=models.CASCADE)
    nome = models.CharField(max_length=250, null=True, blank=True)
    autor = models.CharField(max_length=250, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'Trilha': {'read_only': True, 'required': False,
                            'label': 'Vídeos no Youtube',
                            'help_text': 'Vídeos no Youtube sobre as Trilhas'}}

    def __str___(self):
        return self.nome

        

# class TipoAtrativoTrilha(SoftDeletion):
#     nome = models.CharField(max_length=100)
#     icone = models.FileField(upload_to='atrativo/')
#     tipo_geom = models.CharField(
#         max_length=1,
#         choices=TIPO_GEOM,
#         default='0',
#     )

#     class MetaSerializer:
#         exclude_fields = ['created_at', 'deleted_at','user']
#         nested = {'AtrativoTrilha': {'read_only': True, 'required': False,
#                                'label': 'Tipo Atrativo',
#                                'help_text': 'Tipo de Atrativo'}}

#     def __str__(self):
#         return self.nome



class AtrativoTrilha(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    trilha = models.ForeignKey(Trilha, on_delete=models.CASCADE)
    tipo_atrativo = models.ForeignKey(TipoAtrativo, on_delete=models.CASCADE)
    descricao = models.TextField( null=True, blank=True)
    cor = models.TextField( null=True, blank=True)
    limitacao = models.TextField( null=True, blank=True)
    geom = models.GeometryField(srid=4674)

    class MetaSerializer:
        exclude_fields = ['user', 'created_at', 'deleted_at']
        includes = {'imagematrativotrilha_set': [], 'videoatrativotrilha_set': []}
        nested = {'Trilha': {'read_only': True, 'required': False,
                             'label': 'Atrativos',
                             'help_text': 'Atrativos da Trilha'},
                             }

    def __str__(self):
        return self.tipo_atrativo.nome




class ImagemAtrativoTrilha(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    autor = models.CharField(max_length=200, null=True, blank=True,
                             verbose_name='Autor',
                             help_text='')
    imagem = models.ImageField(upload_to='atrativoimagens/')
    atrativo = models.ForeignKey(AtrativoTrilha, on_delete=models.CASCADE)
    
    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'AtrativoTrilha': {'read_only': True, 'required': False,
                              'label': 'Imagens atrativo',
                              'help_text': 'Fotografias dos Atrativo'}}


class VideoAtrativoTrilha(SoftDeletion):
    id = models.BigAutoField(primary_key=True)
    atrativo = models.ForeignKey(AtrativoTrilha, on_delete=models.CASCADE)
    nome = models.CharField(max_length=250, null=True, blank=True)
    autor = models.CharField(max_length=250, null=True, blank=True)
    url = models.URLField(null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at','user']
        nested = {'AtrativoTrilha': {'read_only': True, 'required': False,
                              'label': 'Videos atrativo',
                              'help_text': 'Videos do Atrativo'}}

    def __str__(self):
        return self.nome
