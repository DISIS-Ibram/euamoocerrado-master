#!/bin/bash
set -e

echo "Aguardando PostgreSQL iniciar..."
sleep 10  # Dá tempo para o PostgreSQL inicializar completamente

# Verifica se existe arquivo de backup
if [ -f /db-backup/backup_completo.sql ]; then
    echo "Restaurando banco de dados..."
    # Usa o usuário postgres diretamente, sem senha
    # PGPASSWORD=postgres psql -U postgres -d euamoocerrado -f /db-backup/backup_completo.sql
    PGPASSWORD=postgres psql -U postgres -d euamoocerrado -f /db-backup/backup_v15__05-02-2026.sql
    echo "Restauração concluída!"
else
    echo "Nenhum arquivo de backup encontrado em /db-backup/backup_completo.sql"
fi 

