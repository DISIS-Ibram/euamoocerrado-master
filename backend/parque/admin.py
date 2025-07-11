from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from parque.models import Parque, Atrativo, TipoBenfeitoria, TipoAtrativo, Benfeitoria, ContatoParque

class ContatoParqueInLine(admin.StackedInline):
    model = ContatoParque
    extra = 1

class BenfeitoriaParqueInLine(admin.StackedInline):
    model = Benfeitoria
    extra = 1
    # Remover openlayers_url, pois estamos usando Leaflet agora
    # openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'

class AtrativoParqueInLine(admin.StackedInline):
    model = Atrativo
    extra = 1
    # Remover openlayers_url também aqui
    # openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'

@admin.register(Parque)
class ParqueAdmin(LeafletGeoAdmin):
    inlines = [ContatoParqueInLine, BenfeitoriaParqueInLine, AtrativoParqueInLine]
    # Remover openlayers_url, pois estamos usando Leaflet
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11

@admin.register(Atrativo)
class AtrativoAdmin(LeafletGeoAdmin):
    # Remover openlayers_url
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11

@admin.register(Benfeitoria)
class BenfeitoriaAdmin(LeafletGeoAdmin):
    # Remover openlayers_url
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11
    
admin.site.register(ContatoParque, LeafletGeoAdmin)  # Usando LeafletGeoAdmin
admin.site.register(TipoBenfeitoria, LeafletGeoAdmin)  # Usando LeafletGeoAdmin
admin.site.register(TipoAtrativo, LeafletGeoAdmin)  # Usando LeafletGeoAdmin
# admin.site.register(Benfeitoria, LeafletGeoAdmin)  # Usando LeafletGeoAdmin
# admin.site.register(Atrativo, LeafletGeoAdmin)  # Usando LeafletGeoAdmin
