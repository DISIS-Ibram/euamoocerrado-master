# PostGIS 3.4 para PostgreSQL 15

# backup completo (bancos + roles + permissões)
docker exec -t postgres15 \
  pg_dumpall -U postgres > dumpall.sql

# Restore completo
docker exec -i postgres15 \
  psql -U postgres < dumpall.sql



# Ver se o Postgis está instalado no servidor
SELECT extname, extversion
FROM pg_extension
WHERE extname = 'postgis';

# Ver se o Postgis está instalando no banco atual
SELECT PostGIS_Version();


# Habilitar o Postgis no banco
CREATE EXTENSION postgis;
CREATE EXTENSION postgis_topology;


# Exemplo DOCKER (PostgresSQL 15 + PostGIS)
services:
  postgres:
    image: postgis/postgis:15-3.4
    container_name: postgres15_postgis
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: gisdb
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:

# Restore do backup em uma máquina Windows usando o PowerShell
# backup feito usando o pg_dumpall 
& "C:\Program Files\PostgreSQL\15\bin\psql.exe" `
  -U postgres `
  -p 5434 `
  -f "C:\Users\daniel.figueiredo\Documents\euamoocerrado\backup_v15__05-02-2026.sql"

