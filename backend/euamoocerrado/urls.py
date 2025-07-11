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

from django.urls import path, re_path, include

from dj_rest_auth.views import (
    LogoutView, PasswordChangeView,
    PasswordResetView, PasswordResetConfirmView, LoginView)

from dj_rest_auth.views import UserDetailsView

# Adiciona as demais rotas
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
# eac_router.register(r'^rest_api/administracao/users', UserViewSet)
# eac_router.register(r'^rest_api/administracao/users', UserViewSet)

urlpatterns = [
    re_path(r'^api/thumb/', thumbnails),
    re_path(r'^api/obtericone/', obter_icone),
    re_path(r'^api/', include(eac_router.urls)),
    re_path(r'^api/admin/', admin.site.urls),
    re_path(r'^api/api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    re_path(r'^api/rest-auth/', include('dj_rest_auth.urls')),
    re_path(r'^api/obtergeojson/', views.obter_geojson),
    re_path(r'^api/obterstatsparque/', views.obter_stats_parque),
    re_path(r'^api/obterstatsespecie/', views.obter_stats_especie),
    re_path(r'^api/obterstatstrilha/', views.obter_stats_trilha),
    re_path(r'^api/conversaogeo/', views.upload_geo_file),
    re_path(r'^api/obterkmltrilha/', views.obterkmltrilha),
    re_path(r'^api/obtericone/', views.obter_icone),
    re_path(r'^api/register/', user_viewset.create_user),
]

urlpatterns += [
    # URLs that do not require a session or valid token
    re_path(r'^api/password/reset/$', views.SI3RCPasswordResetView,
        name='rest_password_reset'),
    re_path(r'^api/password-reset/confirm/(?P<uidb64>[0-9A-Za-z_\-]+)/(?P<token>[0-9A-Za-z]{1,13}-[0-9A-Za-z]{1,20})/$',
        views.SI3RCPasswordResetConfirmView,  name='password_reset_confirm'),
    re_path(r'^api/login/$', LoginView.as_view(), name='rest_login'),
    # URLs that require a user to be logged in with a valid session / token.
    re_path(r'^api/logout/$', LogoutView.as_view(), name='rest_logout'),
    re_path(r'^api/user/$', views.UserDetailsViewSI3RC.as_view(), name='rest_user_details'),

    #url(r'^api/user/$', UserDetailsView.as_view(), name='rest_user_details'),
    re_path(r'^api/password/change/$', PasswordChangeView.as_view(),
        name='rest_password_change'),
]


urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
