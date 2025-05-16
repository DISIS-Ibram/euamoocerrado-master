from rest_framework import viewsets, mixins
from rest_framework.permissions import IsAuthenticatedOrReadOnly, DjangoModelPermissionsOrAnonReadOnly, BasePermission, SAFE_METHODS
from curupira_rest_api.utils import get_viewset_funtion, get_fields_and_extra_kwargs,\
    has_dependency, get_include_candidates
from curupira_rest_api.serializers import SerializerFactory, KhartesSerializer
from curupira_rest_api.metadata import KhartesMetadata

from rest_framework import status
from rest_framework.response import Response


class IsOwnerOrReadOnly(BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        # Instance must have an attribute named `owner`.
        return obj.user == request.user or request.user.is_staff or request.user.is_superuser



class KhartesListViewSet(mixins.ListModelMixin,
                             mixins.RetrieveModelMixin,
                             viewsets.GenericViewSet):

    metadata_class = KhartesMetadata

    def get_view_name(self):
        try:
            return self.model._meta.verbose_name
        except:
            return self.model.__name__
        
    def get_fields_and_includes(self, request):
        fields, includes, excludes = '', '', ''
        try:
            fields =  request.GET["fields"]
        except:
            pass
        try:
            fields =  request.POST["fields"]
        except:
            pass
        
        model_fields, _ = get_fields_and_extra_kwargs(self.model)
        fields = set(fields.replace(' ', '').split(','))
        fields = [i for i in fields if i in model_fields]
        if not fields:
            fields = model_fields
        try:
            includes =  request.GET["includes"]
        except:
            pass
        try:
            includes =  request.POST["includes"]
        except:
            pass
        
        if(includes):
            includes = set(includes.replace(' ', '').split(','))
        else:
            includes = set()
        
        if 'all' in includes:
            includes = get_include_candidates(self.model)
                
        includes_fields = {}
        for i in includes:
            t = i.split("__")
            if not t[0] in includes_fields:
                includes_fields[t[0]] = []
            if len(t) == 2:
                includes_fields[t[0]] += [t[1]]
            else:
                includes_fields[t[0]] += []

        try:
            excludes =  request.GET["excludes"]
        except:
            pass
        try:
            excludes =  request.POST["excludes"]
        except:
            pass        
        if(excludes):
            excludes = set(excludes.replace(' ', '').split(','))
            for i in excludes:
                if i in fields:
                    fields.remove(i)


        if hasattr(self.model, 'MetaSerializer'):
            if hasattr(self.model.MetaSerializer, 'includes'):
                includes_fields.update(self.model.MetaSerializer.includes)
        
        return fields, includes_fields

    def validate_serializer(self, request, fields, includes, try_deep=True):
        deep = False
        if try_deep:
            try:
                deep =  request.GET["deep"].lower() == 'true'
            except:
                pass
            try:
                deep =  request.GET["deep"].lower() == 'true'
            except:
                pass
        
        self.serializer_class = SerializerFactory(self.model, includes, fields, self.get_base_class(request), deep)
        if fields:
            self.serializer_class.Meta.fields = fields
    
    def _allowed_methods(self):
        
        return [m.upper() for m in self.http_method_names if hasattr(self, m)]  

    def get_base_class(self, request):
        base_class = KhartesSerializer
        try:
            fields = request.GET["base_class"]
        except:
            pass
        try:
            fields = request.POST["base_class"]
        except:
            pass
        
        return base_class 
                
    def list(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, True)
        function = get_viewset_funtion(self.model, 'list')
        if function:
            return function(self, request, *args, **kwargs)                
        return super(KhartesListViewSet, self).list(request, *args, **kwargs)
    
    
    def retrieve(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, True)                
        function = get_viewset_funtion(self.model, 'retrieve')
        if function:
            return function(self, request, *args, **kwargs)  
        return super(KhartesListViewSet, self).retrieve(request, *args, **kwargs)
    
    
    def options(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, True)
        
        return super(KhartesListViewSet, self).options(request, *args, **kwargs)
        
    
class KhartesModelViewSet (mixins.CreateModelMixin,
                   mixins.UpdateModelMixin,
                   mixins.DestroyModelMixin,
                   KhartesListViewSet):
    need_moderation = False
    permission_classes = (IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly, DjangoModelPermissionsOrAnonReadOnly)

    def create(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, False)
                
        function = get_viewset_funtion(self.model, 'create')
        if function:
            return function(self, request, *args, **kwargs)  
        return super(KhartesModelViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, False)
        
        function = get_viewset_funtion(self.model, 'update')
        if function:
            return function(self, request, *args, **kwargs)
        return super(KhartesModelViewSet, self).update(request, *args, **kwargs)

    
    def partial_update(self, request, *args, **kwargs):
        fields, includes = self.get_fields_and_includes(request)
        self.validate_serializer(request, fields, includes, False)
        
        function = get_viewset_funtion(self.model, 'partial_update')
        if function:
            return function(self, request, *args, **kwargs)
        return super(KhartesModelViewSet, self).partial_update(request,  *args, **kwargs)

    
    def destroy(self, request,  *args, **kwargs):
        function = get_viewset_funtion(self.model, 'destroy')
        if function:
            return function(self, request, *args, **kwargs)  
        
        instance = self.get_object()
        deleteable, changeable = has_dependency(instance)
        if deleteable or changeable:
            data = {"msg": "Para excluir o item selecionado é necessário excluir os seguintes objetos relacionados antes:",}
            data['deleteable'] = deleteable
            data['changeable'] = changeable
            return Response(data, status.HTTP_405_METHOD_NOT_ALLOWED)
        
        pk = instance.pk
        self.perform_destroy(instance)
        return Response({"pk": pk}, status=status.HTTP_204_NO_CONTENT)
    
