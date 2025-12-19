from django.contrib import admin
from leaflet.admin import LeafletGeoAdmin
from administracao.models import Contact

@admin.register(Contact)
class ContactAdmin(LeafletGeoAdmin):
    pass




