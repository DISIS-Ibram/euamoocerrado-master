"""euamoocerrado URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.contrib import admin
from euamoocerrado import settings, views, user_viewset
from django.conf.urls.static import static

from django.conf.urls import url, include

from rest_auth.views import (
    LogoutView, PasswordChangeView,
    PasswordResetView, PasswordResetConfirmView, LoginView)
from rest_auth.views import UserDetailsView

from euamoocerrado.settings import eac_router

from especie import especie_urls
from parque import parque_urls
from trilha import trilha_urls
from administracao import administracao_urls

from rest_framework import routers, serializers, viewsets
from django.contrib.auth.models import User
from euamoocerrado.user_viewset import UserViewSet
from euamoocerrado.settings import eac_router
from euamoocerrado.thumbnails import thumbnails, obter_icone


# Routers provide an easy way of automatically determining the URL conf.
eac_router.register(r'^rest_api/administracao/users', UserViewSet)

urlpatterns = [
    url(r'^api/thumb/', thumbnails),
    url(r'^api/obtericone/', obter_icone),
    url(r'^api/', include(eac_router.urls)),
    url(r'^api/admin/', admin.site.urls),
    url(r'^api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    url(r'^api/rest-auth/', include('rest_auth.urls')),
    url(r'^api/obtergeojson/', views.obter_geojson),
    url(r'^api/obterstatsparque/', views.obter_stats_parque),
    url(r'^api/obterstatsespecie/', views.obter_stats_especie),
    url(r'^api/obterstatstrilha/', views.obter_stats_trilha),
    url(r'^api/conversaogeo/', views.upload_geo_file),
    url(r'^api/obterkmltrilha/', views.obterkmltrilha),

    url(r'^api/obtericone/', views.obter_icone),
    url(r'^api/register/', user_viewset.create_user),
]

urlpatterns += [
    # URLs that do not require a session or valid token
    url(r'^api/password/reset/$', views.SI3RCPasswordResetView,
        name='rest_password_reset'),
    url(r'^api/password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.SI3RCPasswordResetConfirmView,  name='password_reset_confirm'),
    url(r'^api/login/$', LoginView.as_view(), name='rest_login'),
    # URLs that require a user to be logged in with a valid session / token.
    url(r'^api/logout/$', LogoutView.as_view(), name='rest_logout'),
    url(r'^api/user/$', views.UserDetailsViewSI3RC.as_view(), name='rest_user_details'),

    #url(r'^api/user/$', UserDetailsView.as_view(), name='rest_user_details'),
    url(r'^api/password/change/$', PasswordChangeView.as_view(),
        name='rest_password_change'),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
