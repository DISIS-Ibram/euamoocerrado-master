CREATE SEQUENCE public.administracao_texto_id_seq
  INCREMENT 1
  MINVALUE 1
  MAXVALUE 9223372036854775807
  START 1
  CACHE 1;
ALTER TABLE public.administracao_texto_id_seq
  OWNER TO postgres;
  
CREATE TABLE public.administracao_texto
(
  id integer NOT NULL DEFAULT nextval('administracao_texto_id_seq'::regclass),
  created_at timestamp with time zone NOT NULL,
  deleted_at timestamp with time zone,
  titulo character varying(500) NOT NULL,
  texto text NOT NULL,
  user_id integer,
  CONSTRAINT administracao_texto_pkey PRIMARY KEY (id),
  CONSTRAINT administracao_texto_user_id_8d064b34_fk_auth_user_id FOREIGN KEY (user_id)
      REFERENCES public.auth_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED
)
WITH (
  OIDS=FALSE
);
ALTER TABLE public.administracao_texto
  OWNER TO postgres;

-- Index: public.administracao_texto_e8701ad4

-- DROP INDEX public.administracao_texto_e8701ad4;

CREATE INDEX administracao_texto_e8701ad4
  ON public.administracao_texto
  USING btree
  (user_id);