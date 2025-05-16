from django.contrib.gis.db import models
from curupira_rest_api.models import SoftDeletion, ElementoBasico, SoftDeletionQuerySet
from django.contrib.auth.models import User
from django.db.models import Q


from rest_framework import status
from rest_framework.response import Response
from django.core.mail import send_mail
from euamoocerrado.settings import EMAIL_DEST


class Contact(SoftDeletion):
    name = models.CharField(max_length=500)
    email = models.EmailField()
    message = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Contact"

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']

    class MetaViewSet:
        @staticmethod
        def create(viewset, request, *args, **kwargs):
            data = request.data.copy()
            serializer = viewset.get_serializer(data=data)
            serializer.is_valid(raise_exception=True)
            viewset.perform_create(serializer)  
            headers = viewset.get_success_headers(serializer.data)

            subject = 'MSG - Eu amo o Cerrado - %s' %  data['name']
            msg = 'cidadão: %s\n' % data['name']
            msg += 'email: %s\n' % data['email']
            msg += 'Mensagem: %s\n' % data['message']
            send_mail(
                subject,
                msg,
                'Eu Amo o Cerrado <naoresponda@euamocerrado.com.br>',
                EMAIL_DEST,
                fail_silently=False
            )
            subject = 'Contato - Eu amo o Cerrado'
            msg = '%s, Obrigado por entrar em contato.\n\n' % data['name']
            msg += 'Sua Mensagem "%s" será lida em breve por nossos analistas.\n\n' % data['message']
            msg += 'Não responda a esse email.\n'
            send_mail(
                subject,
                msg,
                'naoresponda@euamocerrado.com.br',
                [data['email']],
                fail_silently=False,
            )

            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

def clearTexto(modelo):
    outros = modelo.objects.all()
    outros.delete()

class TextoHome(SoftDeletion):
    identificador = models.CharField(max_length=500, null=True, blank=True)
    titulo = models.CharField(max_length=500)
    texto = models.TextField()

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Texto Home"

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']

    def save(self, *args, **kwargs):
        #clearTexto(TextoHome)
        super(TextoHome, self).save(*args, **kwargs)


class TextoTutorial(SoftDeletion):
    titulo = models.CharField(max_length=500)
    texto = models.TextField()

    def __str__(self):
        return self.titulo

    class Meta:
        verbose_name = "Texto Home"

    class MetaSerializer:
        exclude_fields = ['created_at', 'deleted_at']

    def save(self, *args, **kwargs):
        clearTexto(TextoTutorial)
        super(TextoTutorial, self).save(*args, **kwargs)


class Comentario(ElementoBasico, SoftDeletion):
    url = models.CharField(max_length=200)
    conteudo =  models.TextField(max_length=1000)
    ref_comentario= models.ForeignKey('self',null=True,blank=True)

    def __str__(self):
        return self.url

    class Meta:
        verbose_name = "Comentario"

    class MetaSerializer:
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