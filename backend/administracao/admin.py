from django.contrib.gis import admin
from administracao.models import Contact


admin.site.register(Contact, admin.OSMGeoAdmin)


