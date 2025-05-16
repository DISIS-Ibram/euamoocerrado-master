import os
from euamoocerrado.settings import MEDIA_ROOT, MEDIA_THUMBS_CACHE, MEDIA_URL
from django.http.response import HttpResponse, HttpResponseNotFound,\
    JsonResponse, Http404
from urllib.parse import urlparse
import hashlib
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework import status
import re

import mimetypes
from wand.image import Image
from wand.color import Color

def resize_and_crop(img_path, modified_path, size, crop):
    """
    Resize and crop an image to fit the specified size.
    args:
        img_path: path for the image to resize.
        modified_path: path to store the modified image.
        size: `(width, height)` tuple.
    raises:
        Exception: if can not open the file in img_path of there is problems
            to save the image.
        ValueError: if an invalid `crop_type` is provided.
    """
    # If height is higher we resize vertically, if not we resize horizontally
    with Image(filename=img_path) as img:
        # Get current and desired ratio for the images
        width = 256 if size[0] < 1 or size[0] > img.size[0] else size[0]
        height = 256 if size[1] < 1 or size[1] > img.size[1] else size[1]
        size = (width, height)
        img_ratio = img.size[0] / float(img.size[1])
        #The image is scaled/cropped vertically or horizontally depending on the ratio
        if crop:
            img.crop(width=size[0], height=size[1], gravity='center')
        else :
            if size[0]/img.size[0] > size[1]/img.size[1]:
                size = (size[0], int(size[0]/img_ratio))
            else:
                size = (int(size[1]*img_ratio), size[1])
            img.resize(width=size[0], height=size[1])
        img.save(filename=modified_path)

def thumbnails(request):
    params = request.GET
    try:
        url = params['url']
    except (KeyError, ValueError) as e:
        return HttpResponseNotFound("<h1>É necessário informar a url da imagem.\n Ex url=http://...</h1>")
    try:
        w = params['w']
        w = int(w)
    except (KeyError, ValueError) as e:
        return HttpResponseNotFound("<h1>É necessário informar a largura da imagem.\n Ex.: w=256</h1>")
    try:    
        h = params['h']
        h = int(h)
    except (KeyError, ValueError) as e:
        return HttpResponseNotFound("<h1>É necessário informar a altura da imagem.\n Ex.: &h=256</h1>")  
    
    try:    
        crop = params['crop']
        crop = crop.lower() == 'true'
    except (KeyError, ValueError) as e:
        crop = False
    url_path = request.META['HTTP_HOST']    
    o = urlparse(url)
    # f_path = os.path.join(MEDIA_ROOT[:-len('media/')],o.path[1:])
    filename = re.sub('.*media\/','/',o.path) 
    if filename[0] != '/':
        filename = '/'+filename
    
    f_path = MEDIA_ROOT+filename
    if os.path.isfile(f_path):
        ext = '.png'
        md5_string = url+str(w)+str(h)+str(crop)
        hash_md5 = hashlib.md5()
        hash_md5.update(md5_string.encode('utf-8'))
        f_name = '%s%s' % (hash_md5.hexdigest(), ext)
        new_path = os.path.join(MEDIA_THUMBS_CACHE, f_name)
        
        new_url = 'http://' + url_path + MEDIA_URL + 'cache/' + f_name
        
        if not os.path.isfile(new_path):
            if os.path.splitext(f_path)[1].lower() == '.pdf':
                f_path = f_path + '[0]'
                crop = False
            try:
                resize_and_crop(f_path, new_path, (w,h), crop)
            except:
                with Image(width=w, height=h) as img:
                    img.alpha = True
                    img.background_color = Color('transparent')
                    img.save(filename=new_path)
                
                if '127.0.0.1' in new_url or 'localhost' in new_url:
                    pil_im = Image(new_path)
                    response = HttpResponse(content_type="image/png")
                    pil_im.save(response, "PNG")
                    return response
         
        if '127.0.0.1' in new_url or 'localhost' in new_url:
            with Image(filename=new_path) as img:
                response = HttpResponse(content_type="image/png")
                img.save(response)
                return response
        else:
            return redirect(new_url)
    else:
        return HttpResponseNotFound("<h1>O Arquivo informado não existe</h1>")

svgparque = '<?xml version="1.0" encoding="UTF-8"?>\
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 45 45" >\
   <rect x="0" y="0" width="45" height="45" rx="10" ry="10" style="fill:#COR_FUNDO" />\
   <g class="white" style="transform: scale(0.7); transform-origin: center; ">\
     for_replace\
   </g>\
   <g class="midia"></g>\
<style>\
    .white *{\
    fill:#ffffff !important;\
    }\
</style></svg>'


svgtrilha = '<?xml version="1.0" encoding="UTF-8"?>\
<svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 45 55">\
    <path d="M22 55L15.0718 43L28.9282 43L22 55Z" fill="#COR_FUNDO"/>\
    <circle cx="22.5" cy="22.5" r="22.5" fill="#COR_FUNDO"/>\
   <g class="white" style="transform: scale(0.65) translateY(-9px); transform-origin: center; ">\
     for_replace\
   </g>\
       <g class="midia"></g>\
<style>\
    .white *{\
    fill:#ffffff !important;\
    }\
</style></svg>'

svg_midia = '<path d="M40.6667 7.22222V2.16667C40.6667 1.76944 40.3417 1.44444 39.9444 1.44444H38.7383L37.7778 0H34.8889L33.9283 1.44444H32.7222C32.325 1.44444 32 1.76944 32 2.16667V7.22222C32 7.61944 32.325 7.94444 32.7222 7.94444H39.9444C40.3417 7.94444 40.6667 7.61944 40.6667 7.22222ZM36.3333 2.52778C36.8122 2.52778 37.2714 2.71801 37.6101 3.05661C37.9487 3.39522 38.1389 3.85447 38.1389 4.33333C38.1389 4.8122 37.9487 5.27145 37.6101 5.61005C37.2714 5.94866 36.8122 6.13889 36.3333 6.13889C35.8545 6.13889 35.3952 5.94866 35.0566 5.61005C34.718 5.27145 34.5278 4.8122 34.5278 4.33333C34.5278 3.85447 34.718 3.39522 35.0566 3.05661C35.3952 2.71801 35.8545 2.52778 36.3333 2.52778V2.52778ZM41.3889 3.61111H45V11.1944C45 11.6733 44.8098 12.1326 44.4712 12.4712C44.1326 12.8098 43.6733 13 43.1944 13C42.7156 13 42.2563 12.8098 41.9177 12.4712C41.5791 12.1326 41.3889 11.6733 41.3889 11.1944C41.3888 10.9267 41.4483 10.6622 41.5631 10.4203C41.6778 10.1784 41.845 9.96499 42.0524 9.79562C42.2598 9.62624 42.5022 9.50512 42.7622 9.44102C43.0222 9.37692 43.2932 9.37145 43.5556 9.425V5.77778H41.3889V3.61111ZM38.5 9.425V8.66667H39.9444V11.1944C39.9444 11.6733 39.7542 12.1326 39.4156 12.4712C39.077 12.8098 38.6178 13 38.1389 13C37.66 13 37.2008 12.8098 36.8622 12.4712C36.5236 12.1326 36.3333 11.6733 36.3333 11.1944C36.3333 10.9267 36.3928 10.6622 36.5075 10.4203C36.6223 10.1784 36.7894 9.96499 36.9968 9.79562C37.2042 9.62624 37.4467 9.50512 37.7067 9.44102C37.9667 9.37692 38.2376 9.37145 38.5 9.425V9.425Z" fill="black"/>'

def obter_icone(request):
    params = request.GET
    try:
        url = params['url']
    except (KeyError, ValueError) as e:
        return HttpResponseNotFound("<h1>É necessário informar a url da imagem.\n Ex url=http://...</h1> <ul><li>color - a cor</li><li>icontype - [parque | trilha]</li><li>hasmedia - [true | false]</li>")
    try:
        cor = params['color']
    except (KeyError, ValueError) as e:
        cor = "#896bff"
    
    try:
        icontype = params['icontype']
    except (KeyError, ValueError) as e:
        icontype = 'parque'
    
    
    cor=re.sub('^#','',cor)
    o = urlparse(url)

    svg_final = svgparque
    print(icontype)
    if icontype == 'trilha':
        svg_final = svgtrilha
    
    if 'hasmedia' in params:
        if params['hasmedia'] == 'false':
            hasmedia = False
        else:
            hasmedia = True
    else:
        hasmedia = False
    
    filename = re.sub('.*media\/','/',o.path) 
    if filename[0] != '/':
        filename = '/'+filename
    f_path = MEDIA_ROOT+filename
    conteudo = ''
    if os.path.isfile(f_path):
        conteudo = open(f_path).read()
    #removo <xml > do arquivo importado se tiver
    conteudo = re.sub('<[?]xml.*[?]>','',conteudo) 

    resultado = svg_final.replace('for_replace',conteudo)
    resultado = svg_final.replace('for_replace',conteudo)
    if hasmedia == True:
        resultado = resultado.replace('<g class="midia"></g>','<g class="midia">' + svg_midia + '</g>')

    
    resultado = resultado.replace('COR_FUNDO',cor)
    response = HttpResponse(resultado,
                            content_type='image/svg+xml',
                            charset='utf-8')
    return response