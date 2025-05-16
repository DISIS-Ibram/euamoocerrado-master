from django.contrib.gis import admin
from parque.models import Parque, Atrativo , TipoBenfeitoria, TipoAtrativo, Benfeitoria,\
    ContatoParque

class ContatoParqueInLine(admin.StackedInline):
    model = ContatoParque
    extra = 1

class BenfeitoriaParqueInLine(admin.StackedInline):
    model = Benfeitoria
    extra = 1
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'

class AtrativoParqueInLine(admin.StackedInline):
    model = Atrativo
    extra = 1
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'

@admin.register(Parque)
class ParqueAdmin(admin.OSMGeoAdmin):
    inlines = [ ContatoParqueInLine, BenfeitoriaParqueInLine, AtrativoParqueInLine]
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11


@admin.register(Atrativo)
class AtrativoAdmin(admin.OSMGeoAdmin):
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11

@admin.register(Benfeitoria)
class BenfeitoriaAdmin(admin.OSMGeoAdmin):
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11
    
admin.site.register(ContatoParque, admin.OSMGeoAdmin)
admin.site.register(TipoBenfeitoria, admin.OSMGeoAdmin)
admin.site.register(TipoAtrativo, admin.OSMGeoAdmin)
# admin.site.register(Benfeitoria, admin.OSMGeoAdmin)
# admin.site.register(Atrativo, admin.OSMGeoAdmin)

