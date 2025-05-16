from django.contrib.gis.db import models
from parque.models import Parque
from trilha.models import Trilha
from curupira_rest_api.models import SoftDeletion, ElementoBasico, SoftDeletionQuerySet
from django.db.models import Q
from rest_framework.response import Response


CATEGORIA = (
    ('ave', 'Ave'),
    ('arvore', 'Árvore '),
    ('fruto', 'Fruto'),
    ('mamifero', 'Mamífero'),
    ('peixe', 'Peixe'),
    ('desconhecido', 'Desconhecido'),
)


class TipoEspecie(ElementoBasico, SoftDeletion):
    nome_cientifico = models.CharField(max_length=200,
                                       verbose_name='Nome Científico',
                                       help_text='')

    nome = models.CharField(max_length=200, null=True, blank=True,
                            verbose_name='Nome Popular',
                            help_text='')

    descricao = models.TextField(
        verbose_name='Descrição', null=True, blank=True,)

    link = models.CharField(max_length=3000, null=True, blank=True,
                            verbose_name='Link',
                            help_text='')
    categoria = models.CharField(
        max_length=12,
        choices=CATEGORIA,
        default='des',
    )
    cor =  models.CharField(max_length=7, null=True, blank=True,
                            verbose_name='Cor',
                            help_text='')
    def __str__(self):
        return self.nome

    """Espécie"""
    class Meta:
        verbose_name = "Espécie"

    class MetaSerializer:
        includes = {'imagemespecie_set': []}
        exclude_fields = ['created_at', 'deleted_at']


    class MetaViewSet:
        @staticmethod
        def list(viewset, request, *args, **kwargs):
            query = SoftDeletionQuerySet(viewset.model).filter(deleted_at=None)
            if not (request.user.is_staff or request.user.is_superuser):
                query = SoftDeletionQuerySet(viewset.model).filter( Q(deleted_at=None), Q(publico=True) | Q(user=request.user.pk) )
            queryset = viewset.filter_queryset(query)
            page = viewset.paginate_queryset(queryset)
            if page is not None:
                serializer = viewset.get_serializer(page, many=True, context={"request": request})
                return viewset.get_paginated_response(serializer.data)

            serializer = viewset.get_serializer(queryset, many=True, context={"request": request})
            
            return Response(serializer.data)                            
        
        @staticmethod
        def retrieve(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            serializer = viewset.get_serializer(instance, context={"request": request})
            if instance.publico or (request.user.is_staff or request.user.is_superuser) or (instance.user == request.user):
                return Response(serializer.data)
            return Response({"detail": "Não encontrado."})

        @staticmethod
        def update(viewset, request, *args, **kwargs):
            partial = kwargs.pop('partial', False)
            instance = viewset.get_object()
            if not (request.user.is_staff or request.user.is_superuser):                
                request.data['publico'] = instance.publico
                request.data['oficial'] = instance.oficial
            else:
                imagens = instance.imagemespecie_set.all()
                for i in imagens:
                    i.publico = 'publico' in request.data
                    i.save()
            serializer = viewset.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            viewset.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # refresh the instance from the database.
                instance = viewset.get_object()
                serializer = viewset.get_serializer(instance)

            return Response(serializer.data) 

class ImagemEspecie(ElementoBasico, SoftDeletion):
    autor = models.CharField(max_length=200, null=True, blank=True,
                             verbose_name='Autor',
                             help_text='')
    imagem = models.ImageField(upload_to='especie/')
    especie = models.ForeignKey(TipoEspecie)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'TipoEspecie': {'read_only': True, 'required': False,
                                  'label': 'Imagens',
                                  'help_text': 'Fotografias das espécies'}}


    class MetaViewSet:
        @staticmethod
        def list(viewset, request, *args, **kwargs):
            query = SoftDeletionQuerySet(viewset.model).filter(deleted_at=None)
            if not (request.user.is_staff or request.user.is_superuser):
                query = SoftDeletionQuerySet(viewset.model).filter( Q(deleted_at=None), Q(publico=True) | Q(user=request.user.pk) )
            queryset = viewset.filter_queryset(query)
            page = viewset.paginate_queryset(queryset)
            if page is not None:
                serializer = viewset.get_serializer(page, many=True, context={"request": request})
                return viewset.get_paginated_response(serializer.data)

            serializer = viewset.get_serializer(queryset, many=True, context={"request": request})
            
            return Response(serializer.data)                            
        
        @staticmethod
        def retrieve(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            serializer = viewset.get_serializer(instance, context={"request": request})
            if instance.publico or (request.user.is_staff or request.user.is_superuser) or (instance.user == request.user):
                return Response(serializer.data)
            return Response({"detail": "Não encontrado."})


class Ocorrencia(ElementoBasico, SoftDeletion):
    especie = models.ForeignKey(TipoEspecie)
    parque = models.ForeignKey(Parque, null=True, blank=True,)
    trilha = models.ForeignKey(Trilha, null=True, blank=True,)
    geom = models.PointField(srid=4674)
    foto = models.ImageField(upload_to='ocorrencia', null=True, blank=True)

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']
        nested = {'TipoEspecie': {'read_only': True, 'required': False,
                                  'label': 'Ocorrências',
                                  'help_text': 'Ocorrências de Espécies'},
                  'Parque': {'read_only': True, 'required': False,
                             'label': 'Ocorrências',
                             'help_text': 'Ocorrências de Espécies'},
                  'Trilha': {'read_only': True, 'required': False,
                             'label': 'Ocorrências',
                             'help_text': 'Ocorrências de Espécies'}}



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
