import os
from flask import Flask, request, send_from_directory, abort, send_file
from PIL import Image
import io

app = Flask(__name__)

MEDIA_FOLDER = os.environ.get('MEDIA_FOLDER', '/data/media')

@app.route('/media/<path:filepath>')
def serve_media(filepath):
    # Segurança: Evitar traversão de diretório
    # Normaliza o caminho para evitar .. e garante que está dentro do MEDIA_FOLDER
    safe_path = os.path.normpath(os.path.join(MEDIA_FOLDER, filepath))
    if not safe_path.startswith(MEDIA_FOLDER + os.sep) and not safe_path.startswith(MEDIA_FOLDER + '/') :
        if MEDIA_FOLDER == safe_path and not filepath.startswith(os.sep):
             # Permite acesso à raiz se MEDIA_FOLDER for o mesmo que safe_path e não houver / no início de filepath
             pass   
        else:
            app.logger.warning(f'Tentativa de acesso inválido: {filepath} resolvido para {safe_path}')
            abort(404) # Ou 403 Forbidden

    directory = os.path.dirname(safe_path)
    filename = os.path.basename(safe_path)

    if not os.path.exists(safe_path):
        app.logger.error(f'Arquivo não encontrado: {safe_path}')
        abort(404)
    
    app.logger.info(f'Servindo arquivo: {safe_path}')
    return send_from_directory(directory, filename)

@app.route('/thumb/')
def serve_thumbnail():
    url_param = request.args.get('url')
    w_param = request.args.get('w', type=int)
    h_param = request.args.get('h', type=int)

    if not url_param:
        app.logger.error('Parâmetro URL ausente para /thumb/')
        abort(400, description="Parâmetro 'url' é obrigatório.")

    if not w_param or not h_param:
        app.logger.error('Parâmetros de largura (w) ou altura (h) ausentes ou inválidos para /thumb/')
        abort(400, description="Parâmetros 'w' e 'h' são obrigatórios e devem ser inteiros.")

    # Segurança: Evitar traversão de diretório no parâmetro url
    # Normaliza o caminho para evitar .. e garante que está dentro do MEDIA_FOLDER
    image_path = os.path.normpath(os.path.join(MEDIA_FOLDER, url_param))
    if not image_path.startswith(MEDIA_FOLDER + os.sep) and not image_path.startswith(MEDIA_FOLDER + '/') :
        if MEDIA_FOLDER == image_path and not url_param.startswith(os.sep):
            pass
        else:
            app.logger.warning(f'Tentativa de acesso inválido em /thumb/: {url_param} resolvido para {image_path}')
            abort(404)

    if not os.path.exists(image_path):
        app.logger.error(f'Arquivo de imagem não encontrado para /thumb/: {image_path}')
        abort(404)

    try:
        img = Image.open(image_path)
        img_format = img.format # Salva o formato original
        
        # Calcula a nova dimensão mantendo a proporção
        original_width, original_height = img.size
        ratio = min(w_param / original_width, h_param / original_height)
        
        new_width = int(original_width * ratio)
        new_height = int(original_height * ratio)
        
        # Garante que não é maior que o solicitado, caso a imagem original seja menor
        new_width = min(new_width, w_param)
        new_height = min(new_height, h_param)

        # Garante que pelo menos uma dimensão seja > 0 se a imagem original também for
        if original_width > 0 and original_height > 0:
            new_width = max(1, new_width)
            new_height = max(1, new_height)
        else: # Imagem inválida ou de tamanho zero
            app.logger.error(f'Imagem com tamanho zero ou inválido: {image_path}')
            abort(500, description="Erro ao processar imagem: tamanho inválido.")

        resized_img = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        img_io = io.BytesIO()
        # Tenta salvar no formato original, senão usa PNG como fallback
        if img_format:
            resized_img.save(img_io, format=img_format, quality=85) # Ajuste a qualidade conforme necessário
        else:
            resized_img.save(img_io, format='PNG', quality=85)
        img_io.seek(0)
        
        content_type = Image.MIME.get(img_format.upper() if img_format else 'PNG', 'image/png')
        app.logger.info(f'Servindo thumbnail para: {image_path} como {content_type}')
        return send_file(img_io, mimetype=content_type)

    except FileNotFoundError:
        app.logger.error(f'Arquivo não encontrado (FileNotFoundError) durante o processamento de /thumb/: {image_path}')
        abort(404)
    except IOError as e:
        app.logger.error(f'Erro de I/O ao abrir ou processar a imagem {image_path} para /thumb/: {e}')
        abort(500, description="Erro ao processar imagem.")
    except Exception as e:
        app.logger.error(f'Erro inesperado ao processar imagem {image_path} para /thumb/: {e}')
        abort(500, description="Erro interno ao gerar thumbnail.")

if __name__ == '__main__':
    # O Flask run usará a porta 5000 por padrão, conforme definido no Dockerfile CMD
    # Para desenvolvimento local fora do Docker, você pode descomentar:
    # app.run(debug=True, host='0.0.0.0', port=5001)
    pass 