# SI3RC
**Icones**  
Para gerar icone svg automaticamente coloque em src/componentes/elements/icon/svg  

**stylus**
mixen box (all t l r b w h)

###  Executar o servidor de admin fora do dockerfile do projeto

# Criar a imagem
docker build -t eac-admin .

# Executar a imagem
docker run nome-da-imagem
docker run -d -p 8000:8000 nome-da-imagem

# Executar de forma iterativa - acessando a máquina
docker run -it name-da-maquina /bin/bash    # máquina completa
docker run -it nome-da-maquina /bin/sh      # máquina alpine - limitada





