from django.contrib.gis.db import models
from django.contrib.auth.models import User

from rest_framework import status
from rest_framework.response import Response
from curupira_rest_api.serializers import KhartesSerializer
from django.utils.timezone import now
from django.db.models.query import QuerySet

from django.db.models import Q

class ElementoBasico(models.Model):
    id = models.BigAutoField(primary_key=True)
    oficial = models.BooleanField(default=False)
    publico = models.BooleanField(default=False)

    def __str__(self):
        return ""

    class Meta:
        abstract=True


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
            if instance.publico or (request.user.is_staff or request.user.is_superuser) or (instance.user == request.user.pk):
                return Response(serializer.data)
            return Response({"detail": "Não encontrado."})

        @staticmethod
        def update(viewset, request, *args, **kwargs):
            partial = kwargs.pop('partial', False)
            instance = viewset.get_object()
            if not (request.user.is_staff or request.user.is_superuser):                
                request.data['publico'] = instance.publico
                request.data['oficial'] = instance.oficial            
            serializer = viewset.get_serializer(instance, data=request.data, partial=partial)
            serializer.is_valid(raise_exception=True)
            viewset.perform_update(serializer)

            if getattr(instance, '_prefetched_objects_cache', None):
                # If 'prefetch_related' has been applied to a queryset, we need to
                # refresh the instance from the database.
                instance = viewset.get_object()
                serializer = viewset.get_serializer(instance)

            return Response(serializer.data)            

        @staticmethod
        def create(viewset, request, *args, **kwargs):
            data = request.data.copy()            
            
            
            if not (request.user.is_staff or request.user.is_superuser):
                if viewset.need_moderation:
                    data['publico'] = False
                    data['oficial'] = False
                else:
                    data['oficial'] = False
            else:
                data['publico'] = True
                data['oficial'] = True

            data['user'] = request.user.id 
            serializer = viewset.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            viewset.perform_create(serializer)
            headers = viewset.get_success_headers(data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

        def destroy(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            if not (request.user.is_staff or request.user.is_superuser):
                if viewset.need_moderation and instance.publico:
                    return Response({"detail": "Esse elemento faz parte do acervo do site, você não possui autorização para excluí-lo."})
   
            instance.deletador = request.user
            instance.deleted_at = now()                             
            instance = viewset.get_object()
            viewset.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)

class SoftDeletionQuerySet(QuerySet):
    def delete(self):
        return super(SoftDeletionQuerySet, self).update(deleted_at=now())

    def hard_delete(self):
        return super(SoftDeletionQuerySet, self).delete()

    def alive(self):
        return self.filter(deleted_at=None)

    def dead(self):
        return self.exclude(deleted_at=None)
       
class SoftDeletionManager(models.Manager):
    def __init__(self, *args, **kwargs):
        self.alive_only = kwargs.pop('alive_only', True)
        super(SoftDeletionManager, self).__init__(*args, **kwargs)

    def get_queryset(self):
        if self.alive_only:
            return SoftDeletionQuerySet(self.model).filter(deleted_at=None)
        return SoftDeletionQuerySet(self.model)

    def hard_delete(self):
        return self.get_queryset().hard_delete()
    
class SoftDeletion(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(User, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=now)
    deleted_at = models.DateTimeField(null=True, blank=True)

    
    objects = SoftDeletionManager()
    all_objects = SoftDeletionManager(alive_only=False)
    
            
    def delete(self):
        self.deleted_at = now()
        self.save()

    def hard_delete(self):
        super(SoftDeletion, self).delete()
    
    class Meta:
        abstract = True
        
    class MetaSerializer:
        rest_api = False
        exclude_fields = []

        @staticmethod
        def run_validation(serializer, data):
            print('run_validation')
            return super(KhartesSerializer, serializer).run_validation(data=data)       
                
    class MetaViewSet:
        @staticmethod
        def create(viewset, request, *args, **kwargs):
            data = request.data.copy()            
            data['user'] = request.user.id    
            serializer = viewset.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            viewset.perform_create(serializer)  
            headers = viewset.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)            
            
        @staticmethod
        def destroy(viewset, request, *args, **kwargs):
            instance = viewset.get_object()
            instance.deletador = request.user
            instance.deleted_at = now()
            instance.save()
            return Response({"pk": instance.pk}, status=status.HTTP_204_NO_CONTENT)


