from django.contrib.gis import admin
from trilha.models import Trilha


@admin.register(Trilha)
class TrilhaAdmin(admin.OSMGeoAdmin):
    openlayers_url = 'https://openlayers.org/api/2.13.1/OpenLayers.js'
    default_lon = -47.9186917
    default_lat = -15.7680721
    default_zoom = 11