from django.apps import apps
from django.template import Context, Template
import os
from django.contrib.admin.utils import NestedObjects


from pip._vendor.distlib.compat import raw_input
from django.contrib.gis.db.models.fields import GeometryField
from django.db.models.fields.files import FileField
from euamoocerrado.settings import INSTALLED_APPS
import unicodedata
from curupira_rest_api import models
from django.db.models.fields.related import ForeignKey, ManyToManyField

KHARTES_REST_API_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATE_VIEWSET = os.path.join(KHARTES_REST_API_DIR, 'templates', 'viewset')
TEMPLATE_URL = os.path.join(KHARTES_REST_API_DIR, 'templates', 'urls')

from django.core.mail import send_mail
from euamoocerrado.settings import EMAIL_DEST

def send_email(subject, msg, email):
            send_mail(
                subject,
                msg,
                'naoresponda@euamocerrado.com.br',
                [email, 'moreira.geo@gmail.com'],
                fail_silently=False,
            )
            print('enviando email para:', email)

def clean_name(name):
    text = unicodedata.normalize("NFKD", name)
    return text.encode("ascii", "ignore")


def has_dependency(instance, deep=False):
    def unpack_list(lista):
        flat_lista = []
        for i in lista:
            if type(i) == list:
                if deep:
                    flat_lista += unpack_list(i)
            else:
                flat_lista.append(i)
        return flat_lista
    collector = NestedObjects(using='default')
    collector.collect([instance])
    protected = collector.protected
    elementos=collector.nested()[1:]
    if elementos:
        elementos = elementos[0]
    if type(elementos) != list:
        elementos = [elementos]
    nested = set(unpack_list(elementos))
    deleteable, changeable = {},{}
    if protected:
        deleteable = [{i.__class__.__name__.lower(): i.pk} for i in protected] 
    if nested:
        models = get_models()
        for i in nested:
            name = i.__class__.__name__
            if name in models:
                if name.lower() in deleteable.keys():
                    deleteable[name.lower()].append(i.pk) 
                else:
                    deleteable[name.lower()] = [i.pk]  
            else:
                m_name = name.split('_')[0]
                if m_name in models and m_name.lower() != instance.__class__.__name__.lower():
                    if hasattr(i, m_name.lower()):
                        j = getattr(i,  m_name.lower())
                        
                        if name.lower() in changeable:
                            changeable[j.__class__.__name__].append(j.pk) 
                        else:
                            changeable[j.__class__.__name__] = [j.pk]
                
                
    return  deleteable, changeable


def get_serializer_funtion(model, function):
    if hasattr(model, 'MetaSerializer'):
        if hasattr(model.MetaSerializer, function):
            return getattr(model.MetaSerializer, function)
    return False


def get_viewset_funtion(model, function):
    from curupira_rest_api.models import ElementoBasico

    if hasattr(model, 'MetaViewSet'):
        if hasattr(model.MetaViewSet, function):
            return getattr(model.MetaViewSet, function)
    if issubclass(model, ElementoBasico):
        if hasattr(ElementoBasico.MetaViewSet, function):
             return getattr(ElementoBasico.MetaViewSet, function)
    return False

def show_related_field(field):
    if hasattr(field.field.model, 'MetaSerializer'):
        if hasattr(field.field.model.MetaSerializer, 'nested'):
            if field.model.__name__ in field.field.model.MetaSerializer.nested.keys():
                return True, field.field.model.MetaSerializer.nested[field.model.__name__]
    return False, {}

def get_related_fields(model):
    related_fields = {}
    fields, _ = get_fields_and_extra_kwargs(model)
    for i in model._meta.get_fields():
        if isinstance(i, GeometryField) or isinstance(i, FileField):
            continue
        if (i.many_to_one or i.one_to_one) or (i.many_to_many or i.one_to_many):
            name = i.name if i.concrete else i.get_accessor_name()
            if name in fields:
                related_fields[name] = {'many': i.many_to_many or i.one_to_many,
                                        'field': i,
                                        'model': i.related_model().__class__}                  
    return related_fields

def get_filter_and_ordering_fields(model):
    concrete_fields, realted_fields = [], []
    for i in model._meta.get_fields():
        if isinstance(i, GeometryField) or isinstance(i, FileField):
            continue
        if i.concrete:
            concrete_fields.append(i.name)
        else:
            show, _ = show_related_field(i)
            if show:
                realted_fields.append(i.name)       
    filter_fields, ordering_fields = [], []
    if hasattr(model, 'MetaViewSet'):
        if hasattr(model.MetaViewSet, 'filter_fields'):
            filter_fields = model.MetaViewSet.filter_fields + realted_fields
        else:
            filter_fields = concrete_fields + realted_fields
        if hasattr(model.MetaViewSet, 'ordering_fields'):
            ordering_fields = model.MetaViewSet.ordering_fields + realted_fields
        else:
            ordering_fields = concrete_fields + realted_fields
    else:
        filter_fields = concrete_fields + realted_fields
        ordering_fields = concrete_fields + realted_fields
    return filter_fields, ordering_fields             


def get_fields_and_extra_kwargs(model):
    extra_kwargs = {}
    concrete_fields, related_fields, exclude = [], [], []
    for i in model._meta.get_fields():
        if i.concrete:
            concrete_fields.append(i.name)    
        else:
            show, extras = show_related_field(i)
            if show:
                field_name = i.get_accessor_name()
                related_fields.append(field_name)
                if extras:
                    extra_kwargs[field_name] = extras
    if hasattr(model, "MetaSerializer"):
        if hasattr(model.MetaSerializer, "fields"):
            concrete_fields = model.MetaSerializer.fields
        if hasattr(model.MetaSerializer, "extra_kwargs"):
            extra_kwargs.update(model.MetaSerializer.extra_kwargs)
        if hasattr(model.MetaSerializer, "exclude_fields"):
            exclude = model.MetaSerializer.exclude_fields
    fields = concrete_fields+related_fields
    if issubclass(model, models.SoftDeletion):
        exclude += models.SoftDeletion.MetaSerializer.exclude_fields    
    for i in exclude:
        try:
            fields.remove(i)
        except:
            pass
    return fields, extra_kwargs             

def write_in_template(path_to_template, context, output_path):
    try:
        file = open(path_to_template)
    except IOError:
        print ('Cannot open: %s' % path_to_template)
        return False
    if os.path.exists(output_path):
        print("This file already exists. All modification will be lost!!!")
    try:
        output_file = open(output_path, 'w')
    except IOError:
        print ('Cannot open: %s' % output_path)
        return False
    template = Template(file.read())
    content = template.render(context)
    output_file.write(content)
    output_file.close()
    file.close()
    return True
    
def get_models(lower=False):
    return {j.__name__.lower() if lower else j.__name__: j for i in INSTALLED_APPS for j in apps.get_app_config(i.split('.')[-1]).get_models()}

def get_include_candidates(model):
    includes = []
    fields, _ = get_fields_and_extra_kwargs(model)
    for i in fields:
        try:
            f = model._meta.get_field(i)
            if isinstance(f, ForeignKey) or isinstance(f, ManyToManyField):
                includes.append(i)
        except:
            pass
    return includes

def create_rest_api(app_name):
    app = apps.get_app_config(app_name)
    dict_serializer = {"app_name": app_name}
    models_names = []
    models = []
    read_only = False
    for model in app.get_models():
        if hasattr(model, "Meta"):
            if hasattr(model.Meta, "abstract"):
                if model.Meta.abstract:
                    print('merda1')
                    continue
        if hasattr(model, "MetaSerializer"):
            if hasattr(model.MetaSerializer, "read_only"):
                read_only = model.MetaSerializer.read_only            
            if hasattr(model.MetaSerializer, "rest_api"):
                if not model.MetaSerializer.rest_api: 
                    print('merda')
                    continue        
        model_ = {}
        name = model.__name__
        print(name)
        models_names.append(name)
        model_["name"] = name
        model_["viewset_class_base_name"] = "KhartesListViewSet" if read_only else 'KhartesModelViewSet'
        model_["uri"] = {'path': '%s/%s' % (app_name.lower(), name.lower()), 'view':'%sViewSet'%name }
        models.append(model_)
        print(models)
    dict_serializer["models_names"] =  models_names
    dict_serializer["models"] = models
    context = Context(dict_serializer)
    print(context)
    viewset_path = os.path.join(app.path, '%s_viewsets.py' % app_name)
    if write_in_template(TEMPLATE_VIEWSET, context, viewset_path):
        print('%s_viewset.py criado com sucesso' % app_name)
    
    url_path = os.path.join(app.path, '%s_urls.py' % app_name)
    if write_in_template(TEMPLATE_URL, context, url_path): 
        print('%s_urls.py criado com sucesso' % app_name)
        
'''        
from curupira_rest_api.utils import create_rest_api
apps = ['especie', 'parque', 'trilha', 'curupira_rest_api']
for i in apps:
    create_rest_api(i)

exit()

'''
