from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from trilha.models import Trilha

@admin.register(Trilha)
class ContactAdmin(LeafletGeoAdmin):
    pass

