from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from especie.models import TipoEspecie, ImagemEspecie
from especie.models import Ocorrencia


class ImageInline(admin.StackedInline):
    model = ImagemEspecie


@admin.register(TipoEspecie)
class Especie(admin.ModelAdmin):
    list_display = ('nome', 'nome_cientifico')
    list_filter = ('categoria',)
    search_fields = ['nome', 'nome_cientifico']
    # autocomplete_fields = ['nome', 'nome_cientifico']
    inlines = [ ImageInline, ]



# Register your models here.
admin.site.register(Ocorrencia, LeafletGeoAdmin)
