from __future__ import unicode_literals

from collections import OrderedDict

from django.core.exceptions import PermissionDenied
from django.http import Http404
from django.utils.encoding import force_text

from rest_framework import exceptions, serializers
from rest_framework.request import clone_request
from rest_framework.metadata import SimpleMetadata
from rest_framework.serializers import ListSerializer
from rest_framework.utils.field_mapping import ClassLookupDict
from curupira_rest_api.utils import get_filter_and_ordering_fields,\
    get_related_fields


class KhartesMetadata(SimpleMetadata):
    label_lookup = ClassLookupDict({
        serializers.Field: 'field',
        serializers.BooleanField: 'boolean',
        serializers.NullBooleanField: 'boolean',
        serializers.CharField: 'string',
        serializers.URLField: 'url',
        serializers.EmailField: 'email',
        serializers.RegexField: 'regex',
        serializers.SlugField: 'slug',
        serializers.IntegerField: 'integer',
        serializers.FloatField: 'float',
        serializers.DecimalField: 'decimal',
        serializers.DateField: 'date',
        serializers.DateTimeField: 'datetime',
        serializers.TimeField: 'time',
        serializers.ChoiceField: 'choice',
        serializers.MultipleChoiceField: 'multiple choice',
        serializers.FileField: 'file upload',
        serializers.ImageField: 'image upload',
        serializers.ListField: 'list',
        serializers.DictField: 'nested object',
        serializers.Serializer: 'nested object',
    })

    def determine_metadata(self, request, view):
        metadata = OrderedDict()
        metadata['name'] = view.get_view_name()
        metadata['description'] = view.model.__doc__
        metadata['renders'] = [renderer.media_type for renderer in view.renderer_classes]
        metadata['parses'] = [parser.media_type for parser in view.parser_classes]
        if hasattr(view, 'get_serializer'):
            actions = self.determine_actions(request, view)
            if actions:
                metadata['actions'] = actions
        return metadata
    
    
    def determine_actions(self, request, view):
        """
        For generic class based views we return information about
        the fields that are accepted for 'PUT' and 'POST' methods.
        """
        actions = {}
        for method in {'PUT', 'POST'} & set(view.allowed_methods):
            view.request = clone_request(request, method)
            try:
                # Test global permissions
                if hasattr(view, 'check_permissions'):
                    view.check_permissions(view.request)
                # Test object permissions
                if method == 'PUT' and hasattr(view, 'get_object'):
                    view.get_object()
            except (exceptions.APIException, PermissionDenied, Http404):
                
                pass
            else:
                # If user has appropriate permissions for the view, include
                # appropriate metadata about the fields that should be supplied.
                serializer = view.get_serializer()
                actions[method] = self.get_serializer_info(serializer)
            finally:
                view.request = request
        serializer = view.get_serializer()
        actions['GET'] = self.get_serializer_info(serializer, True)                    
        return actions


    def get_serializer_info(self, serializer, read_only=False):
        """
        Given an instance of a serializer, return a dictionary of metadata
        about its fields.
        """
        if hasattr(serializer, 'child'):
            # If this is a `ListSerializer` then we want to examine the
            # underlying child serializer instance instead.
            serializer = serializer.child
        return OrderedDict([
            (field_name, self.get_field_info(field, read_only))
            for field_name, field in serializer.fields.items()
        ])
    
    def get_field_info_extra(self, field):
        field_info = {}
        if hasattr(field.parent, 'Meta'):
            if hasattr(field.parent.Meta, 'model'):
                model = field.parent.Meta.model
                model_fields = {i.name if i.concrete else i.get_accessor_name(): i for i in model._meta.get_fields()}
                model_field = model_fields.get(field.field_name) 
                name = model_field.name 
                
                filter_fields, ordering_fields = get_filter_and_ordering_fields(model) 
                
                field_info['searchable'] = name if name  in filter_fields else False
                field_info['orderable'] = name if name  in ordering_fields else False
                
                chained = {}
                if hasattr(model, 'MetaSerializer'):
                    if hasattr(model.MetaSerializer, 'chained'):
                        chained = model.MetaSerializer.chained
                                
                if chained:
                    if field.field_name in chained.keys():
                        field_info['chained'] = chained[field.field_name]
        return field_info
     
    def get_field_info(self, field, read_only=False):
        """
        Given an instance of a serializer field, return a dictionary
        of metadata about it.
        """
        field_info = OrderedDict()
        field_info['type'] = self.label_lookup[field]
        field_info['required'] = getattr(field, 'required', False) 
        field_info.update(self.get_field_info_extra(field))
        attrs = [
            'read_only', 'label', 'help_text',
            'min_length', 'max_length',
            'min_value', 'max_value'
        ]
        choice = True
        if 'field' == field_info['type']:
            choice = False
            value = getattr(field.parent.Meta.model, field.field_name, None)
            relateds = get_related_fields(field.parent.Meta.model)
            if value:
                value = getattr(value, 'field', None)
                if value:
                    field_info['model'] = value.model.__name__
                    field_info['many'] = 'ManyRel' in value.__class__.__name__ or  isinstance(field, ListSerializer)                    
                                                
                    if field.field_name in relateds.keys():
                        related  = relateds[field.field_name]
                        field_info['model'] = related['model'].__name__
                        field_info['many'] = related['many']
        for attr in attrs:
            if read_only and attr == 'read_only':
                field_info[attr] = read_only
            else:                                
                value = getattr(field, attr, None)
                if value is not None and value != '':
                    field_info[attr] = force_text(value, strings_only=True)
        if getattr(field, 'child', None):
            field_info['child'] = self.get_field_info(field.child)
        elif getattr(field, 'fields', None):
            field_info['children'] = self.get_serializer_info(field)
        if choice:
            if not field_info.get('read_only') and hasattr(field, 'choices'):
                field_info['choices'] = [
                                         {'value': choice_value, 'display_name': force_text(choice_name, strings_only=True)} 
        
                                      for choice_value, choice_name in field.choices.items()]
        return field_info
    