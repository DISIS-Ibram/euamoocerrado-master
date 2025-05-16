from rest_framework.serializers import ModelSerializer
from rest_framework_gis.serializers import GeoFeatureModelSerializer
from curupira_rest_api.utils import get_serializer_funtion, get_related_fields,\
    get_fields_and_extra_kwargs, show_related_field, get_include_candidates

class KhartesSerializer(ModelSerializer):
    """
    Essa é a documentação da classe Khartes Serializer
    """
    def create(self, validated_data):
        """
        This method overrides the method create(self, validated_data)
        If you need to add a specific behavior when creating a new object, you must be put your code here.
        This method is called after is_valid
        """
        function = get_serializer_funtion(self.Meta.model, 'create')
        if function:
            return function(self, validated_data)                
        return super(KhartesSerializer, self).create(validated_data)


    def update(self, instance, validated_data):
        """
        This method overrides the method update(self, instance, validated_data)
        If you need to add a specific behavior when updating an instance of an object, you must be put your code here.
        This method is called after is_valid
        """
        function = get_serializer_funtion(self.Meta.model, 'update')
        if function:
            return function(self, instance, validated_data)                    
        return super(KhartesSerializer, self).update(instance, validated_data)


    def is_valid(self, raise_exception=False):
        """
        This method overrides the method is_valid(self, raise_exception=False)
        If you need to add a specific behavior for validation, you must be put your code here.
        This method is called before create or update
        """
        function = get_serializer_funtion(self.Meta.model, 'is_valid')
        if function:
            return function(self, raise_exception)                
        return super(KhartesSerializer, self).is_valid(raise_exception)


    def run_validation(self, data):
        """
        This method overrides the method run_validation(self, data)
        If you need to add a specific behavior for validation, you must be put your code here.
        """
        function = get_serializer_funtion(self.Meta.model, 'run_validation')
        if function:
            return function(self, data)        
        return super(KhartesSerializer, self).run_validation(data)


    def validate(self, data):
        """
        This method overrides the method validate(self, data)
        If you need to add a specific behavior for validation, you must be put your code here.
        This method is called after run_validation
        """
        function = get_serializer_funtion(self.Meta.model, 'validate')
        if function:
            return function(self, data)                
        return super(KhartesSerializer, self).validate(data)


class KhartesSerializerGeoJson(GeoFeatureModelSerializer):
    """
    Essa é a documentação da classe Khartes Serializer
    """
    def create(self, validated_data):
        """
        This method overrides the method create(self, validated_data)
        If you need to add a specific behavior when creating a new object, you must be put your code here.
        This method is called after is_valid
        """
        function = get_serializer_funtion(self.Meta.model, 'create')
        if function:
            return function(self, validated_data)                
        return super(KhartesSerializerGeoJson, self).create(validated_data)


    def update(self, instance, validated_data):
        """
        This method overrides the method update(self, instance, validated_data)
        If you need to add a specific behavior when updating an instance of an object, you must be put your code here.
        This method is called after is_valid
        """
        function = get_serializer_funtion(self.Meta.model, 'update')
        if function:
            return function(self, instance, validated_data)                    
        return super(KhartesSerializerGeoJson, self).update(instance, validated_data)


    def is_valid(self, raise_exception=False):
        """
        This method overrides the method is_valid(self, raise_exception=False)
        If you need to add a specific behavior for validation, you must be put your code here.
        This method is called before create or update
        """
        function = get_serializer_funtion(self.Meta.model, 'is_valid')
        if function:
            return function(self, raise_exception)                
        return super(KhartesSerializerGeoJson, self).is_valid(raise_exception)


    def run_validation(self, data):
        """
        This method overrides the method run_validation(self, data)
        If you need to add a specific behavior for validation, you must be put your code here.
        """
        function = get_serializer_funtion(self.Meta.model, 'run_validation')
        if function:
            return function(self, data)        
        return super(KhartesSerializerGeoJson, self).run_validation(data)


    def validate(self, data):
        """
        This method overrides the method validate(self, data)
        If you need to add a specific behavior for validation, you must be put your code here.
        This method is called after run_validation
        """
        function = get_serializer_funtion(self.Meta.model, 'validate')
        if function:
            return function(self, data)                
        return super(KhartesSerializerGeoJson, self).validate(data)

def SerializerFactory0(model, includes={}, fields=[], BaseClass=KhartesSerializer):
    f0, f1 = get_fields_and_extra_kwargs(model)
    fields = [i for i in fields if i in f0]
    if fields:
        f0 = fields
    meta = type('Meta', (), {"model":model,
                              "fields": f0,
                              "extra_kwargs": f1})
    attributes = {"Meta": meta}
    related_fields = get_related_fields(model)
    for model_field in includes:
        if model_field in related_fields.keys():
            model_aninhado = related_fields[model_field]['model']
            field = related_fields[model_field]['field']
            fields = includes[model_field]
            inc = {}
            if hasattr(model_aninhado, 'MetaSerializer'):
                if hasattr(model_aninhado.MetaSerializer, 'includes'):
                    inc = model_aninhado.MetaSerializer.includes 
            new_inc = dict()
            for i in inc.keys():
                if i in fields:
                    new_inc[i] = inc[i]
            value = SerializerFactory(model_aninhado, new_inc, fields )
            infos = {}
            if not field.concrete:
                _, infos = show_related_field(field)
            attributes[model_field] = value(many=related_fields[model_field]['many'], **infos)
    newclass = type('%sSerializer' % model.__name__, (BaseClass,), attributes)
    return newclass



def SerializerFactory(model, includes={}, fields=[], BaseClass=KhartesSerializer, deep=False, deeppath=None):
    if deeppath:
        deeppath+=model.__name__
    else:
        deeppath=model.__name__
    f0, f1 = get_fields_and_extra_kwargs(model)
    fields = [i for i in fields if i in f0]
    if fields:
        f0 = fields
    meta = type('Meta', (), {"model":model,
                              "fields": f0,
                              "extra_kwargs": f1, 
                              "depth":0,
                              "geo_field":'geom'})
    attributes = {"Meta": meta}
    related_fields = get_related_fields(model)
    for model_field in includes:
        if model_field in related_fields.keys():
            model_aninhado = related_fields[model_field]['model']
            if model_aninhado.__name__ in deeppath:
                continue                
            field = related_fields[model_field]['field']
            fields = includes[model_field]
            inc = {}
            if hasattr(model_aninhado, 'MetaSerializer'):
                if hasattr(model_aninhado.MetaSerializer, 'includes'):
                    inc = model_aninhado.MetaSerializer.includes 
            new_inc = dict()
            for i in inc.keys():
                if i in fields:
                    new_inc[i] = inc[i]
            if deep:
                fields, f1 = get_fields_and_extra_kwargs(model_aninhado)
                new_inc = dict()
                for i in get_include_candidates(model_aninhado):
                    new_inc[i] = []
            value = SerializerFactory(model_aninhado, new_inc, fields, BaseClass, deep, deeppath)
            infos = {}
            if not field.concrete:
                _, infos = show_related_field(field)
            attributes[model_field] = value(many=related_fields[model_field]['many'], **infos)
    newclass = type('%sSerializer' % model.__name__, (BaseClass,), attributes)
    return newclass
    
    