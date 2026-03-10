import os
import json

from django.http import (
    JsonResponse,
    HttpResponse,
    HttpResponseRedirect
)
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth.tokens import default_token_generator
from django.contrib.sites.shortcuts import get_current_site
from django.core.mail import send_mail
from django.core import serializers
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.db import connection
from django import forms
from django.views.decorators.csrf import csrf_exempt

from django.utils.encoding import force_bytes, force_str
from django.utils.http import (
    urlsafe_base64_encode,
    urlsafe_base64_decode
)

from rest_framework.response import Response
from rest_framework import status
from dj_rest_auth.views import UserDetailsView

from django.apps import apps
from django.contrib.gis.geos import GEOSGeometry

from django.conf import settings

from curupira_rest_api.utils import clean_name
from parque.models import Parque, Benfeitoria, Atrativo
from especie.models import Ocorrencia


methods = ['add', 'change', 'delete']


class UserDetailsViewSI3RC(UserDetailsView):

    def get(self, request, *args, **kwargs):
        user = self.get_object()
        permissions_dic = {}

        for app_name in settings.INSTALLED_APPS:
            app = apps.get_app_config(app_name.split('.')[-1])

            for model in app.get_models():
                model_name = model.__name__.lower()

                if user.is_superuser:
                    permissions_dic[model_name] = {m: True for m in methods}
                else:
                    perms = set()
                    perms.update(
                        p.codename.split('_')[0]
                        for p in user.user_permissions.filter(
                            content_type__model=model_name
                        )
                    )

                    for group in user.groups.all():
                        perms.update(
                            p.codename.split('_')[0]
                            for p in group.permissions.filter(
                                content_type__model=model_name
                            )
                        )

                    permissions_dic[model_name] = {
                        m: m in perms for m in methods
                    }

        data = {
            "user": {
                "pk": user.pk,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            },
            "permissions": permissions_dic,
        }

        return Response(data, status=status.HTTP_200_OK)


GEO_FORMATS = ['.dxf', '.shp', '.gtm', '.gpx', '.gtz', '.kml', '.kmz']
geom_json = '{"geometry": %s, "type": "Feature", "properties": {"nome": "%s"}}'
lyr_json = '{"type": "FeatureCollection", \
             "crs": {"type": "name","properties": {"name": "EPSG:4326"}}, \
             "features": [%s]}'


@csrf_exempt
def SI3RCPasswordResetView(request):
    try:
        params = json.loads(request.body.decode("utf-8"))
        email = params.get("email")
    except Exception:
        return JsonResponse(
            {"msg": "JSON inválido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.filter(email=email).first()

    if not user:
        return JsonResponse(
            {"msg": "Usuário para esse email não existe"},
            status=status.HTTP_412_PRECONDITION_FAILED
        )

    current_site = get_current_site(request)

    context = {
        "email": user.email,
        "domain": current_site.domain,
        "site_name": current_site.name,
        "uid": urlsafe_base64_encode(force_bytes(user.pk)),
        "token": default_token_generator.make_token(user),
        "protocol": "http",
    }

    send_email(context)

    return JsonResponse(
        {"msg": f"Um link para recuperar a senha foi enviado para: {user.email}"},
        status=status.HTTP_200_OK
    )


@csrf_exempt
def SI3RCPasswordResetConfirmView(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except Exception:
        return JsonResponse(
            {"uid": ["Invalid value"]},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not default_token_generator.check_token(user, token):
        return JsonResponse(
            {"token": ["Invalid or expired token"]},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        params = json.loads(request.body.decode("utf-8"))
        pw1 = params.get("new_password1")
        pw2 = params.get("new_password2")
    except Exception:
        return JsonResponse(
            {"msg": "JSON inválido"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if pw1 != pw2:
        return JsonResponse(
            {"msg": "Passwords não conferem"},
            status=status.HTTP_400_BAD_REQUEST
        )

    from django.contrib.auth.password_validation import validate_password
    from django.core.exceptions import ValidationError

    try:
        validate_password(pw1, user)
    except ValidationError as e:
        return JsonResponse(
            {"password": e.messages},
            status=status.HTTP_400_BAD_REQUEST,
            safe=False
        )

    user.set_password(pw1)
    user.save()

    return JsonResponse(
        {"msg": "Password alterado com sucesso"},
        status=status.HTTP_200_OK
    )


def send_email(data):
    subject = "Eu amo o Cerrado - Recuperação de SENHA"

    msg = (
        f"Você solicitou a redefinição da senha da sua conta em "
        f"{data['domain']}\n\n"
        f"Acesse o link abaixo:\n\n"
        f"{data['protocol']}://{data['domain']}/recoverypassword/"
        f"{data['uid']}/{data['token']}/\n\n"
    )

    print('send_email: ', msg)
    print("EMAIL DESTINO:", data["email"])

    return send_mail(
        subject,
        msg,
        settings.DEFAULT_FROM_EMAIL,
        [data["email"]],
        fail_silently=False,
    )



@csrf_exempt
def handle_uploaded_file(geo_file):
    from django.contrib.gis.gdal import DataSource
    ds = DataSource(geo_file)
    geoms = []
    for i in range(len(ds)):
        lyr = ds[i]
        for feat in lyr:
            geom = feat.geom
            geom.coord_dim = 2
            geom = geom.transform(4326, True)
            geoms.append(geom.json)
    return geoms

@csrf_exempt
class UploadFileForm(forms.Form):
    file_field = forms.FileField(
        # widget=forms.ClearableFileInput(attrs={'multiple': True}),
        widget=forms.ClearableFileInput(attrs={'multiple': False}),
        label="Selecione os arquivos",
        required=False,
        help_text="Selecione os arquivos para upload",
    )

@csrf_exempt
def upload_geo_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        files = request.FILES.getlist('file_field')  # agora compatível com o form
        folder = "geo_temp"
        if form.is_valid():
            geo_files = []
            for f in files:
                f_name = str(clean_name(f.name))[2:-1]
                path = default_storage.save(os.path.join(
                    folder, f_name), ContentFile(f.read()))
                f_path = os.path.join(default_storage.base_location, path)
                if os.path.splitext(f_name)[1].lower() in GEO_FORMATS:
                    geo_files.append(f_path)
            geoms_list = []
            for g_file in geo_files:
                geoms = handle_uploaded_file(g_file)
                for geom in geoms:
                    geoms_list.append(geom_json % (geom, 'geom'))

            result = lyr_json % (','.join(geoms_list))
            response = HttpResponse(result,
                                    content_type='application/json',
                                    charset='latin1')
            response['Content-Length'] = len(result)

            # Limpeza
            for f in files:
                file_path = os.path.join(default_storage.base_location,
                                         os.path.join(folder, str(clean_name(f.name))[2:-1]))
                if os.path.exists(file_path):
                    os.remove(file_path)

            return response
        return HttpResponseRedirect('/conversaogeo/')
    else:
        form = UploadFileForm()
        return render(request, 'euamoocerrado/upload.html', {'form': form})



geojson_null = '{"crs": {"properties": {"name": "EPSG:4326"}, "type": "name"}, "type": "FeatureCollection", "features": null}'


query = 'SELECT jsonb_build_object(\'type\',\'FeatureCollection\',\'crs\', jsonb_build_object(\'type\',\'name\',\'properties\', jsonb_build_object(\'name\',\'EPSG:4326\')),\'features\', json_agg(f.feature) ) as feature FROM (select jsonb_build_object(\'properties\', jsonb_build_object(\'pk\',"{0}"."{1}"),\'type\',\'Feature\',\'geometry\', (ST_ASgeojson("{0}"."{2}"))::JSON) AS feature FROM "{0}" /**/) as f'


query_relate = "select table_schema, table_name, column_name \
            from information_schema.key_column_usage where \
            constraint_name in(\
                                select constraint_name from \
                                information_schema.constraint_column_usage \
                                where table_name = '{0}' AND column_name = '{1}')\
                                AND table_name = '{2}'"

modelo_geo = {'parque': {'modelo': Parque, 'geom': 'geom'},
              'parque_center': {'modelo': Parque, 'geom': 'center'},
              'benfeitoria': {'modelo': Benfeitoria, 'geom': 'geom'},
              'atrativo': {'modelo': Atrativo, 'geom': 'geom'},
              'ocorrencia': {'modelo': Ocorrencia, 'geom': 'geom'}
              }


@login_required
def obter_usuarios(request):
    if request.user.is_staff:
        data = serializers.serialize("json", User.objects.all())
        response = HttpResponse(data,
                                content_type='application/json',
                                charset='utf-8')
        response['Content-Length'] = len(data)
        return response
    else:
        data = serializers.serialize("json", request.user)
        response = HttpResponse(data,
                                content_type='application/json',
                                charset='utf-8')
        response['Content-Length'] = len(data)
        return response


def obter_relacionamento(n_modelo, modelo_filtro, id_modelo_filtro):
    resultado = []
    if modelo_filtro in modelo_geo.keys():
        modelo = modelo_geo[modelo_filtro]['modelo']

        table_name = modelo._meta.db_table
        column_name = modelo._meta.pk.__str__().split('.')[-1]

        if n_modelo in modelo_geo:
            ref_modelo = modelo_geo[n_modelo]['modelo']
            ref_table_name = ref_modelo._meta.db_table
            ref_column_name = ref_modelo._meta.pk.__str__().split('.')[-1]
            geo_column = modelo_geo[n_modelo]['geom']

            sql = query_relate.format(table_name, column_name, ref_table_name)

            with connection.cursor() as cursor:
                cursor.execute(sql)
                itens = cursor.fetchall()
                if itens:
                    item = itens[0]
                    sql = query.format(item[1], ref_column_name, geo_column)
                    sql = sql.replace(
                        '/**/', ' WHERE  {0} = {1}'.format(item[2], id_modelo_filtro))
                    with connection.cursor() as cursor:
                        cursor.execute(sql)
                        itens = cursor.fetchall()
                        resultado = json.dumps(itens[0][0])
                        response = HttpResponse(resultado,
                                                content_type='application/json',
                                                charset='utf-8')
                        response['Content-Length'] = len(resultado)
                        return response
                else:
                    sql = query_relate.format(
                        ref_table_name, ref_column_name, table_name)
                    with connection.cursor() as cursor:
                        cursor.execute(sql)
                        itens = cursor.fetchall()
                        if itens:
                            item = itens[0]
                            sql = 'select {0} from {1} where {2} = {3}'.format(
                                item[2], item[1], column_name, id_modelo_filtro)
                        with connection.cursor() as cursor:
                            cursor.execute(sql)
                            itens = cursor.fetchall()
                            sql = query.format(
                                ref_table_name, ref_column_name, geo_column)
                            sql = sql.replace(
                                '/**/', ' WHERE  {0} = {1}'.format(ref_column_name, itens[0][0]))
                            with connection.cursor() as cursor:
                                cursor.execute(sql)
                                itens = cursor.fetchall()
                                resultado = json.dumps(itens[0][0])
                                response = HttpResponse(resultado,
                                                        content_type='application/json',
                                                        charset='utf-8')
                                response['Content-Length'] = len(resultado)
                                return response
    resultado = geojson_null
    response = HttpResponse(resultado,
                            content_type='application/json',
                            charset='utf-8')
    response['Content-Length'] = len(resultado)
    return response


def obter_geojson(request):
    params = request.GET
    erro = {}
    try:
        n_modelo = params['modelo']
    except:
        n_modelo = ''
        erro['modelo'] = 'É necessário informar um modelo'
    try:
        geom_text = params['geom']
        geom = GEOSGeometry(geom_text)
    except:
        geom = None

    modelo_filtro = None
    try:
        for i in modelo_geo.keys():
            if i in params:
                modelo_filtro = i
                id_modelo_filtro = params[i]
    except:
        modelo_filtro = None

    if modelo_filtro:
        return obter_relacionamento(n_modelo, modelo_filtro, id_modelo_filtro)

    dic_model = modelo_geo[n_modelo.lower(
    )] if n_modelo.lower() in modelo_geo else None
    tentar_consulta = True
    if dic_model == None:
        erro['modelo'] = 'Informe um modelo válido'
        erro['modelos_validos'] = [i for i in modelo_geo.keys()]
        tentar_consulta = False
        return JsonResponse(erro, safe=False)

    resultado = []
    if tentar_consulta:
        modelo = dic_model['modelo']
        geom_nome = dic_model['geom']
        if geom:
            params = {'%s__intersects' % geom_nome: geom}
            itens = modelo.objects.filter(**params).values('pk', geom_nome)
        else:
            with connection.cursor() as cursor:
                q = query.format(
                    modelo._meta.db_table, modelo._meta.pk.__str__().split('.')[-1], geom_nome)
                cursor.execute(q)
                itens = cursor.fetchall()
                resultado = json.dumps(itens[0][0])
        response = HttpResponse(resultado,
                                content_type='application/json',
                                charset='utf-8')

        response['Content-Length'] = len(resultado)
        return response
    erro['erro'] = 'Erro Desconhecido'
    return JsonResponse(erro, safe=False)


def obter_stats_parque(request):
    sql = 'select*from sumario_parque;'
    resultado = []
    with connection.cursor() as cursor:
        cursor.execute(sql)
        itens = cursor.fetchall()
    for i in itens[0][0]:
        i['num_avistamentos'] = [
        ] if i['num_avistamentos'] == None else i['num_avistamentos']
        i['num_trilhas'] = 0 if i['num_trilhas'] == None else i['num_trilhas']
        resultado.append(i)
    resultado = json.dumps(resultado)

    response = HttpResponse(resultado,
                            content_type='application/json',
                            charset='utf-8')

    response['Content-Length'] = len(resultado)
    return response


def obter_stats_trilha(request):
    sql = 'select*from sumario_trilha;'
    resultado = []
    with connection.cursor() as cursor:
        cursor.execute(sql)
        itens = cursor.fetchall()
    for i in itens[0][0]:
        i['num_avistamentos'] = [
        ] if i['num_avistamentos'] == None else i['num_avistamentos']
        i['num_visitantes'] = 0 if i['num_visitantes'] == None else i['num_visitantes']
        resultado.append(i)
    resultado = json.dumps(resultado)

    response = HttpResponse(resultado,
                            content_type='application/json',
                            charset='utf-8')

    response['Content-Length'] = len(resultado)
    return response


def obter_stats_especie(request):
    sql = 'select*from sumario_especie;'
    resultado = []
    with connection.cursor() as cursor:
        cursor.execute(sql)
        itens = cursor.fetchall()

        resultado = json.dumps(itens[0][0])

    response = HttpResponse(resultado,
                            content_type='application/json',
                            charset='utf-8')

    response['Content-Length'] = len(resultado)
    return response


'''from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
'''


def obter_icone(request):
    pass
    '''params = request.GET
    path_ = '#bfbfbf'
    try:
        path_ = params['path']
    except:
        pass
    path_ = os.path.join(MEDIA_ROOT, path_)
    print(path_)
    if os.path.isfile(path_):
        n_name = os.path.join(MEDIA_ROOT,'temp',os.path.basename(path_).replace('svg', 'png'))
        drawing = svg2rlg(path_)
        renderPM.drawToFile(drawing, n_name, fmt='PNG')
        image_data = open(n_name, "rb").read()
        return HttpResponse(image_data, content_type="image/png")

    n_name = os.path.join(MEDIA_ROOT,'temp','hein.png')
    image_data = open(n_name, "rb").read()
    return HttpResponse(image_data, content_type="image/png")'''




template_kml = '<?xml version="1.0" encoding="utf-8" ?> <kml xmlns="http://www.opengis.net/kml/2.2"> <Document id="root_doc"> <Schema name="{0}" id="{0}"> {1} </Schema> <Folder><name>{0}</name> <Placemark> <Style><LineStyle><color>ff0000ff</color></LineStyle><PolyStyle><fill>0</fill></PolyStyle></Style> <ExtendedData><SchemaData schemaUrl="#{0}"> {2} </SchemaData></ExtendedData> {3} </Placemark> </Folder> </Document></kml>'
template_tag = '<SimpleField name="{0}" type="string"></SimpleField>'
template_value = '<SimpleData name="{0}">{1}</SimpleData>'
def obterkmltrilha(request):
    id = None
    params = request.GET
    erro = {}
    try:
        id = params['id']
    except:
        erro['id'] = 'É necessário informar um id'
    

    sql = 'SELECT id, nome, regiao_administrativa, sinalizada, descricao, ST_askml(trilha_trilha.geom) as geom FROM public.trilha_trilha WHERE id=%s;' % id
    trilha = None
    result = None

    nome = None
    with connection.cursor() as cursor:
        cursor.execute(sql)
        trilha = cursor.fetchall()
        if not trilha:
            erro['id'] = 'Elemento não encontrado'
        else:
            trilha = trilha[0]
            campos_dict = {}
            for i in  range(len(cursor.description)):
                campos_dict[cursor.description[i].name] = trilha[i]
            geom = campos_dict.pop('geom')
            nome = campos_dict['nome']
            tag = ''.join([template_tag.format(k) for k,v in campos_dict.items()])
            values = ''.join([template_tag.format(k) for k,v in campos_dict.items()])

            result = template_kml.format(nome, tag, values, geom)
    if erro:
        result = json.dumps(erro)
        response = HttpResponse(result,
                                status=status.HTTP_404_NOT_FOUND,
                                content_type='application/json',
                                charset='utf-8')
        response['Content-Length'] = len(result)
    else:
        response = HttpResponse(result, content_type='application/vnd.google-earth.kml+xml')
        response['Content-Disposition'] = 'attachment; filename="%s.kml"' % nome

    return response
