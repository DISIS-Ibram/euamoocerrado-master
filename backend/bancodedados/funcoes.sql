
-- Function: public.obter_id_parque()

-- DROP FUNCTION public.obter_id_parque();

CREATE OR REPLACE FUNCTION public.obter_id_parque()
  RETURNS trigger AS
$BODY$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            RETURN OLD;
        ELSE
	    NEW.parque_id := obter_parque(NEW.geom);
	    RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.obter_id_parque()
  OWNER TO postgres;


-- Function: public.obter_trilha(geometry)

-- DROP FUNCTION public.obter_trilha(geometry);

CREATE OR REPLACE FUNCTION public.obter_trilha(g geometry)
  RETURNS integer AS
$BODY$
DECLARE
    resultado integer;
        mviews RECORD;
BEGIN

    resultado := NULL;
    FOR mviews IN SELECT id FROM trilha_trilha WHERE ST_intersects(st_buffer(geom, 100./110000), g) limit 1 LOOP

       resultado := mviews.id;
    END LOOP;

    RETURN resultado;
END; $BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.obter_trilha(geometry)
  OWNER TO postgres;


-- DROP FUNCTION public.obter_id_parque();

CREATE OR REPLACE FUNCTION public.obter_id_trilha()
  RETURNS trigger AS
$BODY$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            RETURN OLD;
        ELSE
	    NEW.trilha_id := obter_trilha(NEW.geom);
	    RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$BODY$
  LANGUAGE plpgsql VOLATILE
  COST 100;
ALTER FUNCTION public.obter_id_trilha()
  OWNER TO postgres;

CREATE TRIGGER ocorrencia_in_trilha
  BEFORE INSERT OR UPDATE
  ON public.especie_ocorrencia
  FOR EACH ROW
  EXECUTE PROCEDURE public.obter_id_trilha();
