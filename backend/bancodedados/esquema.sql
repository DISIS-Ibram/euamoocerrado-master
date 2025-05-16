--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.14
-- Dumped by pg_dump version 9.5.14

-- Started on 2018-10-14 23:44:37 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 1 (class 3079 OID 12397)
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- TOC entry 3918 (class 0 OID 0)
-- Dependencies: 1
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- TOC entry 3 (class 3079 OID 991362)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 3919 (class 0 OID 0)
-- Dependencies: 3
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 2 (class 3079 OID 1000109)
-- Name: unaccent; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS unaccent WITH SCHEMA public;


--
-- TOC entry 3920 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION unaccent; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION unaccent IS 'text search dictionary that removes accents';


--
-- TOC entry 1438 (class 1255 OID 1000949)
-- Name: create_centroid_parque(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.create_centroid_parque() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            RETURN OLD;
        ELSE
	    NEW.center := ST_PointOnSurface(NEW.geom);
	    RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$;


ALTER FUNCTION public.create_centroid_parque() OWNER TO postgres;

--
-- TOC entry 1443 (class 1255 OID 1000954)
-- Name: obter_id_parque(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obter_id_parque() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            RETURN OLD;
        ELSE
	    NEW.parque_id := obter_parque(NEW.geom);
	    RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$;


ALTER FUNCTION public.obter_id_parque() OWNER TO postgres;

--
-- TOC entry 1445 (class 1255 OID 1003745)
-- Name: obter_id_trilha(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obter_id_trilha() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        IF (TG_OP = 'DELETE') THEN
            RETURN OLD;
        ELSE
	    NEW.trilha_id := obter_trilha(NEW.geom);
	    RETURN NEW;
        END IF;
        RETURN NULL;
    END;
$$;


ALTER FUNCTION public.obter_id_trilha() OWNER TO postgres;

--
-- TOC entry 1442 (class 1255 OID 1000953)
-- Name: obter_parque(public.geometry); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obter_parque(g public.geometry) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    resultado integer;
        mviews RECORD;
BEGIN

    resultado := NULL;
    FOR mviews IN SELECT id FROM parque_parque WHERE ST_intersects(geom, g) limit 1 LOOP

       resultado := mviews.id;
    END LOOP;

    RETURN resultado;
END; $$;


ALTER FUNCTION public.obter_parque(g public.geometry) OWNER TO postgres;

--
-- TOC entry 1444 (class 1255 OID 1003744)
-- Name: obter_trilha(public.geometry); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.obter_trilha(g public.geometry) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    resultado integer;
        mviews RECORD;
BEGIN

    resultado := NULL;
    FOR mviews IN SELECT id FROM trilha_trilha WHERE ST_intersects(st_buffer(geom, 100./110000), g) limit 1 LOOP

       resultado := mviews.id;
    END LOOP;

    RETURN resultado;
END; $$;


ALTER FUNCTION public.obter_trilha(g public.geometry) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 205 (class 1259 OID 992900)
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 992898)
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO postgres;

--
-- TOC entry 3921 (class 0 OID 0)
-- Dependencies: 204
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- TOC entry 207 (class 1259 OID 992910)
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 992908)
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO postgres;

--
-- TOC entry 3922 (class 0 OID 0)
-- Dependencies: 206
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- TOC entry 203 (class 1259 OID 992892)
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 992890)
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_permission_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO postgres;

--
-- TOC entry 3923 (class 0 OID 0)
-- Dependencies: 202
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- TOC entry 209 (class 1259 OID 992918)
-- Name: auth_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(30) NOT NULL,
    last_name character varying(30) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 992928)
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 992926)
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO postgres;

--
-- TOC entry 3924 (class 0 OID 0)
-- Dependencies: 210
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- TOC entry 208 (class 1259 OID 992916)
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO postgres;

--
-- TOC entry 3925 (class 0 OID 0)
-- Dependencies: 208
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- TOC entry 213 (class 1259 OID 992936)
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 992934)
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO postgres;

--
-- TOC entry 3926 (class 0 OID 0)
-- Dependencies: 212
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- TOC entry 216 (class 1259 OID 993025)
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 992996)
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 992994)
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_admin_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO postgres;

--
-- TOC entry 3927 (class 0 OID 0)
-- Dependencies: 214
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- TOC entry 201 (class 1259 OID 992882)
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- TOC entry 200 (class 1259 OID 992880)
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_content_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO postgres;

--
-- TOC entry 3928 (class 0 OID 0)
-- Dependencies: 200
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- TOC entry 199 (class 1259 OID 992871)
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_migrations (
    id integer NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO postgres;

--
-- TOC entry 198 (class 1259 OID 992869)
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO postgres;

--
-- TOC entry 3929 (class 0 OID 0)
-- Dependencies: 198
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- TOC entry 237 (class 1259 OID 993435)
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 993198)
-- Name: especie_imagemespecie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especie_imagemespecie (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    autor character varying(200),
    imagem character varying(100) NOT NULL,
    especie_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.especie_imagemespecie OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 993196)
-- Name: especie_imagemespecie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.especie_imagemespecie_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.especie_imagemespecie_id_seq OWNER TO postgres;

--
-- TOC entry 3930 (class 0 OID 0)
-- Dependencies: 231
-- Name: especie_imagemespecie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_imagemespecie_id_seq OWNED BY public.especie_imagemespecie.id;


--
-- TOC entry 234 (class 1259 OID 993206)
-- Name: especie_ocorrencia; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especie_ocorrencia (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    geom public.geometry(Point,4674) NOT NULL,
    foto character varying(100),
    especie_id integer NOT NULL,
    parque_id integer,
    trilha_id integer,
    user_id integer
);


ALTER TABLE public.especie_ocorrencia OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 993204)
-- Name: especie_ocorrencia_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.especie_ocorrencia_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.especie_ocorrencia_id_seq OWNER TO postgres;

--
-- TOC entry 3931 (class 0 OID 0)
-- Dependencies: 233
-- Name: especie_ocorrencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_ocorrencia_id_seq OWNED BY public.especie_ocorrencia.id;


--
-- TOC entry 236 (class 1259 OID 993218)
-- Name: especie_tipoespecie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especie_tipoespecie (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome_cientifico character varying(200) NOT NULL,
    nome character varying(200) NOT NULL,
    descricao text NOT NULL,
    user_id integer,
    categoria character varying(12) NOT NULL
);


ALTER TABLE public.especie_tipoespecie OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 993216)
-- Name: especie_tipoespecie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.especie_tipoespecie_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.especie_tipoespecie_id_seq OWNER TO postgres;

--
-- TOC entry 3932 (class 0 OID 0)
-- Dependencies: 235
-- Name: especie_tipoespecie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_tipoespecie_id_seq OWNED BY public.especie_tipoespecie.id;


--
-- TOC entry 218 (class 1259 OID 993046)
-- Name: parque_atrativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_atrativo (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    descricao text,
    limitacao text,
    geom public.geometry(Point,4674) NOT NULL,
    parque_id integer,
    tipo_atrativo_id integer NOT NULL,
    user_id integer DEFAULT 1
);


ALTER TABLE public.parque_atrativo OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 993044)
-- Name: parque_atrativo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_atrativo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_atrativo_id_seq OWNER TO postgres;

--
-- TOC entry 3933 (class 0 OID 0)
-- Dependencies: 217
-- Name: parque_atrativo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_atrativo_id_seq OWNED BY public.parque_atrativo.id;


--
-- TOC entry 220 (class 1259 OID 993058)
-- Name: parque_benfeitoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_benfeitoria (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    descricao text,
    geom public.geometry(Point,4674) NOT NULL,
    parque_id integer,
    tipo_benfeitoria_id integer NOT NULL,
    user_id integer DEFAULT 1
);


ALTER TABLE public.parque_benfeitoria OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 993056)
-- Name: parque_benfeitoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_benfeitoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_benfeitoria_id_seq OWNER TO postgres;

--
-- TOC entry 3934 (class 0 OID 0)
-- Dependencies: 219
-- Name: parque_benfeitoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_benfeitoria_id_seq OWNED BY public.parque_benfeitoria.id;


--
-- TOC entry 222 (class 1259 OID 993070)
-- Name: parque_contatoparque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_contatoparque (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    endereco character varying(100) NOT NULL,
    email character varying(254),
    telefone character varying(100) NOT NULL,
    parque_id integer NOT NULL,
    user_id integer,
    responsavel character varying(100)
);


ALTER TABLE public.parque_contatoparque OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 993068)
-- Name: parque_contatoparque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_contatoparque_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_contatoparque_id_seq OWNER TO postgres;

--
-- TOC entry 3935 (class 0 OID 0)
-- Dependencies: 221
-- Name: parque_contatoparque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_contatoparque_id_seq OWNED BY public.parque_contatoparque.id;


--
-- TOC entry 224 (class 1259 OID 993079)
-- Name: parque_parque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_parque (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(250),
    tipo character varying(250),
    categoria character varying(250),
    geom public.geometry(MultiPolygon,4674),
    descricao text,
    user_id integer,
    center public.geometry(Point,4674),
    custo_entrada character varying(250),
    periodo_abertura character varying(250),
    regiao_administrativa character varying(250),
    nome_decreto character varying(256)
);


ALTER TABLE public.parque_parque OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 993077)
-- Name: parque_parque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_parque_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_parque_id_seq OWNER TO postgres;

--
-- TOC entry 3936 (class 0 OID 0)
-- Dependencies: 223
-- Name: parque_parque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_parque_id_seq OWNED BY public.parque_parque.id;


--
-- TOC entry 226 (class 1259 OID 993091)
-- Name: parque_tipoatrativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_tipoatrativo (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    icone character varying(100) NOT NULL,
    user_id integer
);


ALTER TABLE public.parque_tipoatrativo OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 993089)
-- Name: parque_tipoatrativo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_tipoatrativo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_tipoatrativo_id_seq OWNER TO postgres;

--
-- TOC entry 3937 (class 0 OID 0)
-- Dependencies: 225
-- Name: parque_tipoatrativo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_tipoatrativo_id_seq OWNED BY public.parque_tipoatrativo.id;


--
-- TOC entry 228 (class 1259 OID 993099)
-- Name: parque_tipobenfeitoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_tipobenfeitoria (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    icone character varying(100) NOT NULL,
    user_id integer
);


ALTER TABLE public.parque_tipobenfeitoria OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 993097)
-- Name: parque_tipobeinfeitoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_tipobeinfeitoria_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_tipobeinfeitoria_id_seq OWNER TO postgres;

--
-- TOC entry 3938 (class 0 OID 0)
-- Dependencies: 227
-- Name: parque_tipobeinfeitoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_tipobeinfeitoria_id_seq OWNED BY public.parque_tipobenfeitoria.id;


--
-- TOC entry 243 (class 1259 OID 1003794)
-- Name: parque_visitanteparque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_visitanteparque (
    id integer NOT NULL,
    parque_id integer NOT NULL,
    visitante_id integer,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer
);


ALTER TABLE public.parque_visitanteparque OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 1003792)
-- Name: parque_visitanteparque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_visitanteparque_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_visitanteparque_id_seq OWNER TO postgres;

--
-- TOC entry 3939 (class 0 OID 0)
-- Dependencies: 242
-- Name: parque_visitanteparque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_visitanteparque_id_seq OWNED BY public.parque_visitanteparque.id;


--
-- TOC entry 239 (class 1259 OID 999555)
-- Name: parques_distritais; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parques_distritais (
    id integer NOT NULL,
    geom public.geometry(MultiPolygon,4674),
    id_parques bigint,
    nomeatual character varying(120),
    tipounid character varying(100),
    catatual character varying(50),
    atolegal character varying(200),
    legiscomp character varying(103),
    planmanejo character varying(100),
    situacao character varying(50),
    qualidade character varying(100),
    nomeprevis character varying(120),
    catprevist character varying(50),
    recat character varying(5),
    area_m2 numeric,
    perimetro_ numeric
);


ALTER TABLE public.parques_distritais OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 999553)
-- Name: parques_distritais_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parques_distritais_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parques_distritais_id_seq OWNER TO postgres;

--
-- TOC entry 3940 (class 0 OID 0)
-- Dependencies: 238
-- Name: parques_distritais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parques_distritais_id_seq OWNED BY public.parques_distritais.id;


--
-- TOC entry 241 (class 1259 OID 1000912)
-- Name: regiao_administrativa; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.regiao_administrativa (
    ra_num integer NOT NULL,
    geom public.geometry(MultiPolygon,4674),
    nome character varying(254),
    ra_prefixo character varying(254)
);


ALTER TABLE public.regiao_administrativa OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 1003866)
-- Name: sumario_par_especie_parque; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_par_especie_parque AS
 SELECT foo.especie_id AS p_id,
    json_agg(foo.elemento) AS el_p
   FROM ( SELECT especie_ocorrencia.especie_id,
            json_build_object('parque_id', especie_ocorrencia.parque_id, 'quantidade', count(*)) AS elemento
           FROM public.especie_ocorrencia
          GROUP BY especie_ocorrencia.especie_id, especie_ocorrencia.parque_id
          ORDER BY especie_ocorrencia.especie_id, especie_ocorrencia.parque_id) foo
  GROUP BY foo.especie_id;


ALTER TABLE public.sumario_par_especie_parque OWNER TO postgres;

--
-- TOC entry 246 (class 1259 OID 1003862)
-- Name: sumario_par_especie_trilha; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_par_especie_trilha AS
 SELECT foo.especie_id AS t_id,
    json_agg(foo.elemento) AS el_t
   FROM ( SELECT especie_ocorrencia.especie_id,
            json_build_object('trilha_id', especie_ocorrencia.trilha_id, 'quantidade', count(*)) AS elemento
           FROM public.especie_ocorrencia
          WHERE (especie_ocorrencia.trilha_id IS NOT NULL)
          GROUP BY especie_ocorrencia.especie_id, especie_ocorrencia.trilha_id
          ORDER BY especie_ocorrencia.especie_id, especie_ocorrencia.trilha_id) foo
  GROUP BY foo.especie_id;


ALTER TABLE public.sumario_par_especie_trilha OWNER TO postgres;

--
-- TOC entry 248 (class 1259 OID 1003870)
-- Name: sumario_especie; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_especie AS
 SELECT json_agg(foo.elemento) AS json_agg
   FROM ( SELECT json_build_object('especie_id', especie_tipoespecie.id, 'avistamento_parque', sumario_par_especie_parque.el_p, 'avistamento_trilha', sumario_par_especie_trilha.el_t) AS elemento
           FROM ((public.especie_tipoespecie
             LEFT JOIN public.sumario_par_especie_parque ON ((especie_tipoespecie.id = sumario_par_especie_parque.p_id)))
             LEFT JOIN public.sumario_par_especie_trilha ON ((especie_tipoespecie.id = sumario_par_especie_trilha.t_id)))) foo;


ALTER TABLE public.sumario_especie OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 993174)
-- Name: trilha_trilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_trilha (
    id integer NOT NULL,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    geom public.geometry(LineString,4674) NOT NULL,
    descricao text,
    parque_id integer,
    user_id integer,
    regiao_administrativa character varying(250)
);


ALTER TABLE public.trilha_trilha OWNER TO postgres;

--
-- TOC entry 240 (class 1259 OID 1000841)
-- Name: sumario_parque; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_parque AS
 SELECT json_agg(foo.result) AS json_agg
   FROM ( SELECT json_build_object('parque_id', parque_parque.id, 'area_km', (public.st_area(public.st_transform(parque_parque.geom, 31983)) / (1000000)::double precision), 'num_trilhas', f.num_trilha, 'num_avistamentos', fo.num_avistamento, 'benfeitorias', boo.benfeitorias, 'atrativos', ats.atrativos, 'num_visitas', vis.visitantes) AS result
           FROM (((((public.parque_parque
             LEFT JOIN ( SELECT parque_parque_1.id AS tid,
                    count(*) AS num_trilha
                   FROM public.trilha_trilha,
                    public.parque_parque parque_parque_1
                  WHERE (trilha_trilha.parque_id = parque_parque_1.id)
                  GROUP BY parque_parque_1.id) f ON ((f.tid = parque_parque.id)))
             LEFT JOIN ( SELECT foo_1.aid,
                    json_object_agg(foo_1.categoria, foo_1.count) AS num_avistamento
                   FROM ( SELECT especie_ocorrencia.parque_id AS aid,
                            especie_tipoespecie.categoria,
                            COALESCE(count(especie_tipoespecie.categoria), (0)::bigint, count(especie_tipoespecie.categoria)) AS count
                           FROM public.especie_ocorrencia,
                            public.especie_tipoespecie
                          WHERE (especie_ocorrencia.especie_id = especie_tipoespecie.id)
                          GROUP BY especie_ocorrencia.parque_id, especie_tipoespecie.categoria) foo_1
                  GROUP BY foo_1.aid) fo ON ((fo.aid = parque_parque.id)))
             LEFT JOIN ( SELECT foo_1.parque_id AS b_id,
                    json_agg(foo_1.elementos) AS benfeitorias
                   FROM ( SELECT parque_benfeitoria.parque_id,
                            json_build_object('id', parque_tipobenfeitoria.id, 'nome', parque_tipobenfeitoria.nome, 'icone', parque_tipobenfeitoria.icone, 'quantidade', count(*)) AS elementos
                           FROM public.parque_benfeitoria,
                            public.parque_tipobenfeitoria
                          WHERE (parque_benfeitoria.tipo_benfeitoria_id = parque_tipobenfeitoria.id)
                          GROUP BY parque_benfeitoria.parque_id, parque_tipobenfeitoria.id, parque_tipobenfeitoria.nome, parque_tipobenfeitoria.icone
                          ORDER BY parque_benfeitoria.parque_id, parque_tipobenfeitoria.id) foo_1
                  GROUP BY foo_1.parque_id) boo ON ((boo.b_id = parque_parque.id)))
             LEFT JOIN ( SELECT foo_1.parque_id AS at_id,
                    json_agg(foo_1.elementos) AS atrativos
                   FROM ( SELECT parque_atrativo.parque_id,
                            json_build_object('id', parque_tipoatrativo.id, 'nome', parque_tipoatrativo.nome, 'icone', parque_tipoatrativo.icone, 'quantidade', count(*)) AS elementos
                           FROM public.parque_atrativo,
                            public.parque_tipoatrativo
                          WHERE (parque_atrativo.tipo_atrativo_id = parque_tipoatrativo.id)
                          GROUP BY parque_atrativo.parque_id, parque_tipoatrativo.id, parque_tipoatrativo.nome, parque_tipoatrativo.icone
                          ORDER BY parque_atrativo.parque_id, parque_tipoatrativo.id) foo_1
                  GROUP BY foo_1.parque_id) ats ON ((ats.at_id = parque_parque.id)))
             LEFT JOIN ( SELECT parque_visitanteparque.parque_id AS id,
                    count(*) AS visitantes
                   FROM public.parque_visitanteparque
                  GROUP BY parque_visitanteparque.parque_id) vis ON ((vis.id = parque_parque.id)))
          ORDER BY parque_parque.id) foo;


ALTER TABLE public.sumario_parque OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 993172)
-- Name: trilha_trilha_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_trilha_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_trilha_id_seq OWNER TO postgres;

--
-- TOC entry 3941 (class 0 OID 0)
-- Dependencies: 229
-- Name: trilha_trilha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_trilha_id_seq OWNED BY public.trilha_trilha.id;


--
-- TOC entry 245 (class 1259 OID 1003837)
-- Name: trilha_visitantetrilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_visitantetrilha (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    trilha_id integer NOT NULL,
    user_id integer,
    visitante_id integer
);


ALTER TABLE public.trilha_visitantetrilha OWNER TO postgres;

--
-- TOC entry 244 (class 1259 OID 1003835)
-- Name: trilha_visitantetrilha_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_visitantetrilha_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_visitantetrilha_id_seq OWNER TO postgres;

--
-- TOC entry 3942 (class 0 OID 0)
-- Dependencies: 244
-- Name: trilha_visitantetrilha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_visitantetrilha_id_seq OWNED BY public.trilha_visitantetrilha.id;


--
-- TOC entry 3608 (class 2604 OID 992903)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- TOC entry 3609 (class 2604 OID 992913)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- TOC entry 3607 (class 2604 OID 992895)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- TOC entry 3610 (class 2604 OID 992921)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- TOC entry 3611 (class 2604 OID 992931)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- TOC entry 3612 (class 2604 OID 992939)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- TOC entry 3613 (class 2604 OID 992999)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- TOC entry 3606 (class 2604 OID 992885)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- TOC entry 3605 (class 2604 OID 992874)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- TOC entry 3626 (class 2604 OID 993201)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie ALTER COLUMN id SET DEFAULT nextval('public.especie_imagemespecie_id_seq'::regclass);


--
-- TOC entry 3627 (class 2604 OID 993209)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia ALTER COLUMN id SET DEFAULT nextval('public.especie_ocorrencia_id_seq'::regclass);


--
-- TOC entry 3629 (class 2604 OID 993221)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie ALTER COLUMN id SET DEFAULT nextval('public.especie_tipoespecie_id_seq'::regclass);


--
-- TOC entry 3615 (class 2604 OID 993049)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo ALTER COLUMN id SET DEFAULT nextval('public.parque_atrativo_id_seq'::regclass);


--
-- TOC entry 3618 (class 2604 OID 993061)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria ALTER COLUMN id SET DEFAULT nextval('public.parque_benfeitoria_id_seq'::regclass);


--
-- TOC entry 3621 (class 2604 OID 993073)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque ALTER COLUMN id SET DEFAULT nextval('public.parque_contatoparque_id_seq'::regclass);


--
-- TOC entry 3622 (class 2604 OID 993082)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque ALTER COLUMN id SET DEFAULT nextval('public.parque_parque_id_seq'::regclass);


--
-- TOC entry 3623 (class 2604 OID 993094)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo ALTER COLUMN id SET DEFAULT nextval('public.parque_tipoatrativo_id_seq'::regclass);


--
-- TOC entry 3624 (class 2604 OID 993102)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria ALTER COLUMN id SET DEFAULT nextval('public.parque_tipobeinfeitoria_id_seq'::regclass);


--
-- TOC entry 3631 (class 2604 OID 1003797)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque ALTER COLUMN id SET DEFAULT nextval('public.parque_visitanteparque_id_seq'::regclass);


--
-- TOC entry 3630 (class 2604 OID 999558)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parques_distritais ALTER COLUMN id SET DEFAULT nextval('public.parques_distritais_id_seq'::regclass);


--
-- TOC entry 3625 (class 2604 OID 993177)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_trilha_id_seq'::regclass);


--
-- TOC entry 3632 (class 2604 OID 1003840)
-- Name: id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_visitantetrilha_id_seq'::regclass);


--
-- TOC entry 3646 (class 2606 OID 992907)
-- Name: auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 3652 (class 2606 OID 992962)
-- Name: auth_group_permissions_group_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 3654 (class 2606 OID 992915)
-- Name: auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3648 (class 2606 OID 992905)
-- Name: auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 3641 (class 2606 OID 992948)
-- Name: auth_permission_content_type_id_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 3643 (class 2606 OID 992897)
-- Name: auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 3663 (class 2606 OID 992933)
-- Name: auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 3665 (class 2606 OID 992977)
-- Name: auth_user_groups_user_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 3656 (class 2606 OID 992923)
-- Name: auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- TOC entry 3669 (class 2606 OID 992941)
-- Name: auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 3671 (class 2606 OID 992991)
-- Name: auth_user_user_permissions_user_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 3659 (class 2606 OID 993020)
-- Name: auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 3678 (class 2606 OID 993029)
-- Name: authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- TOC entry 3680 (class 2606 OID 993031)
-- Name: authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- TOC entry 3675 (class 2606 OID 993005)
-- Name: django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- TOC entry 3636 (class 2606 OID 992889)
-- Name: django_content_type_app_label_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 3638 (class 2606 OID 992887)
-- Name: django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 3634 (class 2606 OID 992879)
-- Name: django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 3729 (class 2606 OID 993442)
-- Name: django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 3716 (class 2606 OID 993203)
-- Name: especie_imagemespecie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemespecie_pkey PRIMARY KEY (id);


--
-- TOC entry 3723 (class 2606 OID 993214)
-- Name: especie_ocorrencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_pkey PRIMARY KEY (id);


--
-- TOC entry 3726 (class 2606 OID 993226)
-- Name: especie_tipoespecie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie
    ADD CONSTRAINT especie_tipoespecie_pkey PRIMARY KEY (id);


--
-- TOC entry 3686 (class 2606 OID 993054)
-- Name: parque_atrativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_pkey PRIMARY KEY (id);


--
-- TOC entry 3692 (class 2606 OID 993066)
-- Name: parque_benfeitoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3695 (class 2606 OID 993106)
-- Name: parque_contatoparque_parque_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_parque_id_key UNIQUE (parque_id);


--
-- TOC entry 3697 (class 2606 OID 993075)
-- Name: parque_contatoparque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_pkey PRIMARY KEY (id);


--
-- TOC entry 3701 (class 2606 OID 993087)
-- Name: parque_parque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque
    ADD CONSTRAINT parque_parque_pkey PRIMARY KEY (id);


--
-- TOC entry 3704 (class 2606 OID 993096)
-- Name: parque_tipoatrativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo
    ADD CONSTRAINT parque_tipoatrativo_pkey PRIMARY KEY (id);


--
-- TOC entry 3707 (class 2606 OID 993104)
-- Name: parque_tipobeinfeitoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria
    ADD CONSTRAINT parque_tipobeinfeitoria_pkey PRIMARY KEY (id);


--
-- TOC entry 3740 (class 2606 OID 1003799)
-- Name: parque_visitanteparque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_pkey PRIMARY KEY (id);


--
-- TOC entry 3732 (class 2606 OID 999560)
-- Name: parques_distritais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parques_distritais
    ADD CONSTRAINT parques_distritais_pkey PRIMARY KEY (id);


--
-- TOC entry 3735 (class 2606 OID 1000916)
-- Name: regiao_administrativa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regiao_administrativa
    ADD CONSTRAINT regiao_administrativa_pkey PRIMARY KEY (ra_num);


--
-- TOC entry 3712 (class 2606 OID 993182)
-- Name: trilha_trilha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha
    ADD CONSTRAINT trilha_trilha_pkey PRIMARY KEY (id);


--
-- TOC entry 3745 (class 2606 OID 1003842)
-- Name: trilha_visitantetrilha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_pkey PRIMARY KEY (id);


--
-- TOC entry 3644 (class 1259 OID 992950)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 3649 (class 1259 OID 992963)
-- Name: auth_group_permissions_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_0e939a4f ON public.auth_group_permissions USING btree (group_id);


--
-- TOC entry 3650 (class 1259 OID 992964)
-- Name: auth_group_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_8373b171 ON public.auth_group_permissions USING btree (permission_id);


--
-- TOC entry 3639 (class 1259 OID 992949)
-- Name: auth_permission_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_417f1b1c ON public.auth_permission USING btree (content_type_id);


--
-- TOC entry 3660 (class 1259 OID 992979)
-- Name: auth_user_groups_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_0e939a4f ON public.auth_user_groups USING btree (group_id);


--
-- TOC entry 3661 (class 1259 OID 992978)
-- Name: auth_user_groups_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_e8701ad4 ON public.auth_user_groups USING btree (user_id);


--
-- TOC entry 3666 (class 1259 OID 992993)
-- Name: auth_user_user_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_8373b171 ON public.auth_user_user_permissions USING btree (permission_id);


--
-- TOC entry 3667 (class 1259 OID 992992)
-- Name: auth_user_user_permissions_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_e8701ad4 ON public.auth_user_user_permissions USING btree (user_id);


--
-- TOC entry 3657 (class 1259 OID 993021)
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- TOC entry 3676 (class 1259 OID 993037)
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- TOC entry 3672 (class 1259 OID 993016)
-- Name: django_admin_log_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_417f1b1c ON public.django_admin_log USING btree (content_type_id);


--
-- TOC entry 3673 (class 1259 OID 993017)
-- Name: django_admin_log_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_e8701ad4 ON public.django_admin_log USING btree (user_id);


--
-- TOC entry 3727 (class 1259 OID 993443)
-- Name: django_session_de54fa62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_de54fa62 ON public.django_session USING btree (expire_date);


--
-- TOC entry 3730 (class 1259 OID 993444)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 3713 (class 1259 OID 993297)
-- Name: especie_imagemespecie_d8959b78; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_imagemespecie_d8959b78 ON public.especie_imagemespecie USING btree (especie_id);


--
-- TOC entry 3714 (class 1259 OID 993303)
-- Name: especie_imagemespecie_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_imagemespecie_e8701ad4 ON public.especie_imagemespecie USING btree (user_id);


--
-- TOC entry 3717 (class 1259 OID 993279)
-- Name: especie_ocorrencia_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_309a53b0 ON public.especie_ocorrencia USING btree (parque_id);


--
-- TOC entry 3718 (class 1259 OID 993273)
-- Name: especie_ocorrencia_d8959b78; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_d8959b78 ON public.especie_ocorrencia USING btree (especie_id);


--
-- TOC entry 3719 (class 1259 OID 993285)
-- Name: especie_ocorrencia_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_dc8aef26 ON public.especie_ocorrencia USING btree (trilha_id);


--
-- TOC entry 3720 (class 1259 OID 993291)
-- Name: especie_ocorrencia_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_e8701ad4 ON public.especie_ocorrencia USING btree (user_id);


--
-- TOC entry 3721 (class 1259 OID 993215)
-- Name: especie_ocorrencia_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_geom_id ON public.especie_ocorrencia USING gist (geom);


--
-- TOC entry 3724 (class 1259 OID 993267)
-- Name: especie_tipoespecie_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_tipoespecie_e8701ad4 ON public.especie_tipoespecie USING btree (user_id);


--
-- TOC entry 3681 (class 1259 OID 993154)
-- Name: parque_atrativo_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_309a53b0 ON public.parque_atrativo USING btree (parque_id);


--
-- TOC entry 3682 (class 1259 OID 993160)
-- Name: parque_atrativo_343eb1f8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_343eb1f8 ON public.parque_atrativo USING btree (tipo_atrativo_id);


--
-- TOC entry 3683 (class 1259 OID 993166)
-- Name: parque_atrativo_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_e8701ad4 ON public.parque_atrativo USING btree (user_id);


--
-- TOC entry 3684 (class 1259 OID 993055)
-- Name: parque_atrativo_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_geom_id ON public.parque_atrativo USING gist (geom);


--
-- TOC entry 3687 (class 1259 OID 993136)
-- Name: parque_benfeitoria_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_309a53b0 ON public.parque_benfeitoria USING btree (parque_id);


--
-- TOC entry 3688 (class 1259 OID 993142)
-- Name: parque_benfeitoria_5027413d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_5027413d ON public.parque_benfeitoria USING btree (tipo_benfeitoria_id);


--
-- TOC entry 3689 (class 1259 OID 993148)
-- Name: parque_benfeitoria_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_e8701ad4 ON public.parque_benfeitoria USING btree (user_id);


--
-- TOC entry 3690 (class 1259 OID 993067)
-- Name: parque_benfeitoria_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_geom_id ON public.parque_benfeitoria USING gist (geom);


--
-- TOC entry 3693 (class 1259 OID 993130)
-- Name: parque_contatoparque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_contatoparque_e8701ad4 ON public.parque_contatoparque USING btree (user_id);


--
-- TOC entry 3698 (class 1259 OID 993112)
-- Name: parque_parque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_parque_e8701ad4 ON public.parque_parque USING btree (user_id);


--
-- TOC entry 3699 (class 1259 OID 993088)
-- Name: parque_parque_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_parque_geom_id ON public.parque_parque USING gist (geom);


--
-- TOC entry 3702 (class 1259 OID 993118)
-- Name: parque_tipoatrativo_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_tipoatrativo_e8701ad4 ON public.parque_tipoatrativo USING btree (user_id);


--
-- TOC entry 3705 (class 1259 OID 993124)
-- Name: parque_tipobeinfeitoria_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_tipobeinfeitoria_e8701ad4 ON public.parque_tipobenfeitoria USING btree (user_id);


--
-- TOC entry 3736 (class 1259 OID 1003811)
-- Name: parque_visitanteparque_23c14f30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_23c14f30 ON public.parque_visitanteparque USING btree (visitante_id);


--
-- TOC entry 3737 (class 1259 OID 1003810)
-- Name: parque_visitanteparque_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_309a53b0 ON public.parque_visitanteparque USING btree (parque_id);


--
-- TOC entry 3738 (class 1259 OID 1003824)
-- Name: parque_visitanteparque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_e8701ad4 ON public.parque_visitanteparque USING btree (user_id);


--
-- TOC entry 3733 (class 1259 OID 999691)
-- Name: sidx_parques_distritais_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_parques_distritais_geom ON public.parques_distritais USING gist (geom);


--
-- TOC entry 3708 (class 1259 OID 993194)
-- Name: trilha_trilha_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_309a53b0 ON public.trilha_trilha USING btree (parque_id);


--
-- TOC entry 3709 (class 1259 OID 993195)
-- Name: trilha_trilha_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_e8701ad4 ON public.trilha_trilha USING btree (user_id);


--
-- TOC entry 3710 (class 1259 OID 993183)
-- Name: trilha_trilha_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_geom_id ON public.trilha_trilha USING gist (geom);


--
-- TOC entry 3741 (class 1259 OID 1003860)
-- Name: trilha_visitantetrilha_23c14f30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_23c14f30 ON public.trilha_visitantetrilha USING btree (visitante_id);


--
-- TOC entry 3742 (class 1259 OID 1003858)
-- Name: trilha_visitantetrilha_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_dc8aef26 ON public.trilha_visitantetrilha USING btree (trilha_id);


--
-- TOC entry 3743 (class 1259 OID 1003859)
-- Name: trilha_visitantetrilha_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_e8701ad4 ON public.trilha_visitantetrilha USING btree (user_id);


--
-- TOC entry 3782 (class 2620 OID 1000956)
-- Name: atrativo_in_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER atrativo_in_parque BEFORE INSERT OR UPDATE ON public.parque_atrativo FOR EACH ROW EXECUTE PROCEDURE public.obter_id_parque();


--
-- TOC entry 3783 (class 2620 OID 1000955)
-- Name: benfeitoria_in_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER benfeitoria_in_parque BEFORE INSERT OR UPDATE ON public.parque_benfeitoria FOR EACH ROW EXECUTE PROCEDURE public.obter_id_parque();


--
-- TOC entry 3784 (class 2620 OID 1000950)
-- Name: centroide_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER centroide_parque BEFORE INSERT OR UPDATE ON public.parque_parque FOR EACH ROW EXECUTE PROCEDURE public.create_centroid_parque();


--
-- TOC entry 3748 (class 2606 OID 992956)
-- Name: auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3747 (class 2606 OID 992951)
-- Name: auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3746 (class 2606 OID 992942)
-- Name: auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3750 (class 2606 OID 992971)
-- Name: auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3749 (class 2606 OID 992966)
-- Name: auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3752 (class 2606 OID 992985)
-- Name: auth_user_user_per_permission_id_1fbb5f2c_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_per_permission_id_1fbb5f2c_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3751 (class 2606 OID 992980)
-- Name: auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3755 (class 2606 OID 993039)
-- Name: authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3753 (class 2606 OID 993006)
-- Name: django_admin_content_type_id_c4bce8eb_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_content_type_id_c4bce8eb_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3754 (class 2606 OID 993011)
-- Name: django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3769 (class 2606 OID 993298)
-- Name: especie_imagemesp_especie_id_f03fafe1_fk_especie_tipoespecie_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemesp_especie_id_f03fafe1_fk_especie_tipoespecie_id FOREIGN KEY (especie_id) REFERENCES public.especie_tipoespecie(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3770 (class 2606 OID 993304)
-- Name: especie_imagemespecie_user_id_4d80ed95_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemespecie_user_id_4d80ed95_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3771 (class 2606 OID 993274)
-- Name: especie_ocorrenci_especie_id_eddfe7e9_fk_especie_tipoespecie_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrenci_especie_id_eddfe7e9_fk_especie_tipoespecie_id FOREIGN KEY (especie_id) REFERENCES public.especie_tipoespecie(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3772 (class 2606 OID 993280)
-- Name: especie_ocorrencia_parque_id_ecd75cca_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_parque_id_ecd75cca_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3773 (class 2606 OID 993286)
-- Name: especie_ocorrencia_trilha_id_8a60328b_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_trilha_id_8a60328b_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3774 (class 2606 OID 993292)
-- Name: especie_ocorrencia_user_id_cf3e26e6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_user_id_cf3e26e6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3775 (class 2606 OID 993268)
-- Name: especie_tipoespecie_user_id_36c91987_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie
    ADD CONSTRAINT especie_tipoespecie_user_id_36c91987_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3760 (class 2606 OID 993143)
-- Name: parq_tipo_benfeitoria_id_22213c4c_fk_parque_tipobeinfeitoria_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parq_tipo_benfeitoria_id_22213c4c_fk_parque_tipobeinfeitoria_id FOREIGN KEY (tipo_benfeitoria_id) REFERENCES public.parque_tipobenfeitoria(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3757 (class 2606 OID 993161)
-- Name: parque_atra_tipo_atrativo_id_3eaf82f7_fk_parque_tipoatrativo_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atra_tipo_atrativo_id_3eaf82f7_fk_parque_tipoatrativo_id FOREIGN KEY (tipo_atrativo_id) REFERENCES public.parque_tipoatrativo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3756 (class 2606 OID 993155)
-- Name: parque_atrativo_parque_id_a748e4d9_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_parque_id_a748e4d9_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3758 (class 2606 OID 993167)
-- Name: parque_atrativo_user_id_b143fb98_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_user_id_b143fb98_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3759 (class 2606 OID 993137)
-- Name: parque_benfeitoria_parque_id_c3f57df9_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_parque_id_c3f57df9_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3761 (class 2606 OID 993149)
-- Name: parque_benfeitoria_user_id_9c659a6c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_user_id_9c659a6c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3762 (class 2606 OID 993125)
-- Name: parque_contatoparque_parque_id_537a3ee6_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_parque_id_537a3ee6_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3763 (class 2606 OID 993131)
-- Name: parque_contatoparque_user_id_78c9593f_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_user_id_78c9593f_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3764 (class 2606 OID 993107)
-- Name: parque_parque_user_id_0508bda6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque
    ADD CONSTRAINT parque_parque_user_id_0508bda6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3765 (class 2606 OID 993113)
-- Name: parque_tipoatrativo_user_id_f8eeba67_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo
    ADD CONSTRAINT parque_tipoatrativo_user_id_f8eeba67_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3766 (class 2606 OID 993119)
-- Name: parque_tipobeinfeitoria_user_id_2bcce3fa_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria
    ADD CONSTRAINT parque_tipobeinfeitoria_user_id_2bcce3fa_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3776 (class 2606 OID 1003800)
-- Name: parque_visitanteparque_parque_id_2efb91df_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_parque_id_2efb91df_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3777 (class 2606 OID 1003825)
-- Name: parque_visitanteparque_user_id_3362bb52_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_user_id_3362bb52_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3778 (class 2606 OID 1003830)
-- Name: parque_visitanteparque_visitante_id_2a7f5e5d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_visitante_id_2a7f5e5d_fk_auth_user_id FOREIGN KEY (visitante_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3767 (class 2606 OID 993184)
-- Name: trilha_trilha_parque_id_a151d559_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha
    ADD CONSTRAINT trilha_trilha_parque_id_a151d559_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3768 (class 2606 OID 993189)
-- Name: trilha_trilha_user_id_e1c8ac1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha
    ADD CONSTRAINT trilha_trilha_user_id_e1c8ac1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3779 (class 2606 OID 1003843)
-- Name: trilha_visitantetrilha_trilha_id_95a169b2_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_trilha_id_95a169b2_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3780 (class 2606 OID 1003848)
-- Name: trilha_visitantetrilha_user_id_3d2a727d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_user_id_3d2a727d_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3781 (class 2606 OID 1003853)
-- Name: trilha_visitantetrilha_visitante_id_d488329b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_visitante_id_d488329b_fk_auth_user_id FOREIGN KEY (visitante_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 3917 (class 0 OID 0)
-- Dependencies: 8
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2018-10-14 23:44:37 -03

--
-- PostgreSQL database dump complete
--

