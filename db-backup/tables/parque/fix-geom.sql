-- ===========================================================
-- FIX-GEOM.SQL
-- Ajuste de geometria importada de PostGIS 2.5 para 3.4.3
-- Normaliza SRID, valida WKB e reconstrói metadados
-- ===========================================================

-- 1. Garantir que o PostGIS está instalado e ativo
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;

-- 2. Descobrir SRID atual (apenas informativo)
-- SELECT Find_SRID('public', 'parque_atrativo', 'geom');

-- ===========================================================
-- 3. Normalizar o tipo e SRID (ALTER com USING)
-- ⚠️ TROCAR 4674 PELO SRID CORRETO SE FOR DIFERENTE
-- ===========================================================

ALTER TABLE parque_atrativo
ALTER COLUMN geom TYPE geometry(Point, 4674)
USING ST_SetSRID(geom, 4674);


-- ===========================================================
-- 4. Reconstruir geometrias vindas como WKB antigos
-- Força reinterpretação no padrão aceito pelo PostGIS 3.4
-- ===========================================================

UPDATE parque_atrativo
SET geom = ST_SetSRID(
              ST_GeomFromWKB(geom::bytea),
              4674
          )
WHERE geom IS NOT NULL
  AND (
        NOT ST_IsValid(geom)
        OR ST_SRID(geom) != 4674
      );


-- ===========================================================
-- 5. Forçar geometria para 2D (caso tenham vindo com M ou Z)
-- ===========================================================
UPDATE parque_atrativo
SET geom = ST_Force2D(geom)
WHERE geom IS NOT NULL
  AND ST_CoordDim(geom) > 2;


-- ===========================================================
-- 6. Garantir validade topológica
-- ===========================================================
UPDATE parque_atrativo
SET geom = ST_MakeValid(geom)
WHERE geom IS NOT NULL
  AND NOT ST_IsValid(geom);


-- ===========================================================
-- 7. Atualizar metadados de coluna espacial
-- (corrige catalog metadata que veio do PostGIS 2.5)
-- ===========================================================
SELECT Populate_Geometry_Columns();


-- ===========================================================
-- 8. Diagnóstico final
-- ===========================================================
SELECT
    id,
    ST_IsValid(geom) AS valido,
    ST_SRID(geom) AS srid,
    ST_AsText(geom) AS wkt
FROM parque_atrativo
WHERE geom IS NOT NULL;


-- ===========================================================
-- FIM
-- ===========================================================
