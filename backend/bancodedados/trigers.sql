-- DROP TRIGGER ocorrencia_in_parque ON public.especie_ocorrencia;

CREATE TRIGGER ocorrencia_in_parque
  BEFORE INSERT OR UPDATE
  ON public.especie_ocorrencia
  FOR EACH ROW
  EXECUTE PROCEDURE public.obter_id_parque();

-- Trigger: ocorrencia_in_trilha on public.especie_ocorrencia

-- DROP TRIGGER ocorrencia_in_trilha ON public.especie_ocorrencia;

CREATE TRIGGER ocorrencia_in_trilha
  BEFORE INSERT OR UPDATE
  ON public.especie_ocorrencia
  FOR EACH ROW
  EXECUTE PROCEDURE public.obter_id_trilha();

