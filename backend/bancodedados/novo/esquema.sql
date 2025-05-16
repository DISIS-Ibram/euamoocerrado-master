--
-- PostgreSQL database dump
--

-- Dumped from database version 11.2 (Debian 11.2-1.pgdg90+1)
-- Dumped by pg_dump version 13.1 (Ubuntu 13.1-1.pgdg18.04+1)

-- Started on 2021-03-16 16:44:56 -03

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

-- DROP DATABASE euamoocerrado;
--
-- TOC entry 4894 (class 1262 OID 16384)
-- Name: euamoocerrado; Type: DATABASE; Schema: -; Owner: postgres
--

-- CREATE DATABASE euamoocerrado WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE = 'en_US.utf8';


-- ALTER DATABASE euamoocerrado OWNER TO postgres;

-- \connect euamoocerrado

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 32768)
-- Name: postgis; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA public;


--
-- TOC entry 4895 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION postgis; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION postgis IS 'PostGIS geometry, geography, and raster spatial types and functions';


--
-- TOC entry 1523 (class 1255 OID 35096)
-- Name: bboxgeometryfrommetadata(character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.bboxgeometryfrommetadata(character varying) RETURNS public.geometry
    LANGUAGE plpgsql STRICT
    AS $_$
DECLARE
	src alias for $1;
	tmp text;

	extentPath character varying;

	substract boolean;
	north numeric;
	south numeric;
	east numeric;
	west numeric;

	ns varchar[];

	m xml;
	app xml;
	doc xml[];

	box geometry;
	geo geometry;

BEGIN    
	ns := ARRAY[ARRAY['gmd', 'http://www.isotc211.org/2005/gmd'], 
	            ARRAY['gco', 'http://www.isotc211.org/2005/gco'], 
	            ARRAY['srv', 'http://www.isotc211.org/2005/srv'] ];
	doc := xpath('/gmd:MD_Metadata/gmd:identificationInfo/*/*/gmd:EX_Extent', XMLPARSE(DOCUMENT src), ns);
	FOREACH m IN ARRAY doc
	LOOP
		IF position('gmd:EX_Extent' in XMLSERIALIZE(DOCUMENT m AS text)) <> -1 THEN
			tmp := '<root xmlns:gmd="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:srv="http://www.isotc211.org/2005/srv">'||regexp_replace(XMLSERIALIZE(DOCUMENT m AS text), 'gmd:', '','g')||'</root>';
		ELSE
			tmp := '<root xmlns="http://www.isotc211.org/2005/gmd" xmlns:gco="http://www.isotc211.org/2005/gco" xmlns:srv="http://www.isotc211.org/2005/srv">'||XMLSERIALIZE(DOCUMENT m AS text)||'</root>';
		END IF;
		IF xpath_exists('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox', tmp::xml, ns) THEN
			substract := FALSE;
			IF xpath_exists('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/extentTypeCode/*', tmp::xml, ns) THEN
				app := xpath('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/extentTypeCode/*/text()', tmp::xml, ns); --gco:Boolean
				IF app::text = '{0}' OR app::text = '{false}' OR app::text = '{FALSE}' THEN
					substract := TRUE;
				END IF;
			END IF;
			
			app := xpath('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/westBoundLongitude/*/text()',  tmp::xml, ns);
			west :=substring(app::text FROM '[0-9.-]+')::numeric;
			app := xpath('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/eastBoundLongitude/*/text()',  tmp::xml, ns);
			east :=substring(app::text FROM '[0-9.-]+')::numeric;
			app := xpath('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/southBoundLatitude/*/text()',  tmp::xml, ns);
			south :=substring(app::text FROM '[0-9.-]+')::numeric;
			app := xpath('/*/EX_Extent/geographicElement/EX_GeographicBoundingBox/northBoundLatitude/*/text()',  tmp::xml, ns);
			north :=substring(app::text FROM '[0-9.-]+')::numeric;
			
			box := st_astext(ST_MakeBox2D(ST_Point(west, south), ST_Point(east, north)));
			IF geo IS NULL THEN
				geo := box;
			ELSE
				IF substract THEN
					geo := ST_Difference(geo, box);
				ELSE
					geo := ST_Union(geo, box);
				END IF;
			END IF;
		ELSE
			CONTINUE;
		END IF;
		IF geo IS NOT NULL THEN
			geo = ST_ENVELOPE(geo);
		END IF;
	END LOOP;
	RETURN geo;
END;
$_$;


ALTER FUNCTION public.bboxgeometryfrommetadata(character varying) OWNER TO postgres;

--
-- TOC entry 1524 (class 1255 OID 35097)
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
-- TOC entry 1525 (class 1255 OID 35098)
-- Name: getisometadata(character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.getisometadata(character varying, character varying) RETURNS text
    LANGUAGE plpgsql STRICT
    AS $_$
DECLARE
    schema_name alias for $1;
    table_name alias for $2;

    rowid integer;
    metadata xml;
    sql text;
    ret text;
BEGIN

    sql := 'SELECT md_file_id FROM iso_metadata_reference WHERE column_name IS NULL AND row_id_value IS NULL AND reference_scope=''table'' AND table_name=''' || table_name || ''' LIMIT 1';
    EXECUTE sql INTO rowid;

    IF rowid IS NULL THEN
	RETURN '';
    END IF;

    sql := 'SELECT metadata FROM iso_metadata WHERE id=' || rowid || ' LIMIT 1 ';
    EXECUTE sql INTO metadata;

    RETURN metadata::text;

END;
$_$;


ALTER FUNCTION public.getisometadata(character varying, character varying) OWNER TO postgres;

--
-- TOC entry 1526 (class 1255 OID 35099)
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
-- TOC entry 1527 (class 1255 OID 35100)
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
-- TOC entry 1528 (class 1255 OID 35101)
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
-- TOC entry 1529 (class 1255 OID 35102)
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

--
-- TOC entry 1530 (class 1255 OID 35103)
-- Name: registerisometadata(character varying, character varying, character varying); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.registerisometadata(character varying, character varying, character varying) RETURNS text
    LANGUAGE plpgsql STRICT
    AS $_$
DECLARE
	schema_name alias for $1;
	table_name_alias alias for $2;
	metadata alias for $3;

	sql text;
	ret text;
	tmp text;
	fid xml;
	pid xml;
	geo geometry;
	ns varchar[];

BEGIN    
	ns := ARRAY[ARRAY['gmd', 'http://www.isotc211.org/2005/gmd']];
	IF position('gmd:fileIdentifier' in metadata) <> -1 THEN
		fid := xpath('//gmd:fileIdentifier/*', XMLPARSE(DOCUMENT metadata), ns);
		pid := xpath('//gmd:parentIdentifier/*', XMLPARSE(DOCUMENT metadata), ns);
	ELSE
		fid := xpath('//fileIdentifier/*', XMLPARSE(DOCUMENT metadata), ns);
		pid := xpath('//parentIdentifier/*', XMLPARSE(DOCUMENT metadata), ns);
	END IF;
	geo := BBoxGeometryFromMetadata(metadata);
	tmp := XMLSERIALIZE(CONTENT pid AS text);
	IF tmp = '{}' THEN
		pid := fid;
	END IF;
	sql := 'SELECT GetIsoMetadata(''' || schema_name || ''', ''' || table_name_alias || ''')';
	EXECUTE sql INTO tmp;
	INSERT INTO iso_metadata(md_scope, metadata, fileid, parentid, geometry)
	       VALUES('undefined', XMLPARSE(DOCUMENT metadata), fid, pid, geo); 
	sql := 'SELECT max(id) FROM iso_metadata';
	EXECUTE sql INTO ret;

	IF tmp <> '' THEN
		UPDATE iso_metadata_reference SET md_file_id = cast(ret AS integer), md_parent_id = cast(ret AS integer) 
		       WHERE reference_scope='table' AND table_name = table_name_alias;
	ELSE 
		INSERT INTO iso_metadata_reference(reference_scope, table_name, md_file_id, md_parent_id)
		       VALUES('table', table_name_alias, cast(ret AS integer), cast(ret AS integer));
	END IF;
	RETURN ret;

END;
$_$;


ALTER FUNCTION public.registerisometadata(character varying, character varying, character varying) OWNER TO postgres;

--
-- TOC entry 1531 (class 1255 OID 35104)
-- Name: update_imr_timestamp_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_imr_timestamp_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN
	   NEW.timestamp = now(); 
	   RETURN NEW;
	END;
	$$;


ALTER FUNCTION public.update_imr_timestamp_column() OWNER TO postgres;

SET default_tablespace = '';

--
-- TOC entry 215 (class 1259 OID 35105)
-- Name: administracao_comentario; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administracao_comentario (
    id integer NOT NULL,
    oficial boolean NOT NULL,
    publico boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    url character varying(200) NOT NULL,
    conteudo text NOT NULL,
    ref_comentario_id integer,
    user_id integer
);


ALTER TABLE public.administracao_comentario OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 35111)
-- Name: administracao_comentario_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administracao_comentario_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administracao_comentario_id_seq OWNER TO postgres;

--
-- TOC entry 4896 (class 0 OID 0)
-- Dependencies: 216
-- Name: administracao_comentario_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administracao_comentario_id_seq OWNED BY public.administracao_comentario.id;


--
-- TOC entry 217 (class 1259 OID 35113)
-- Name: administracao_contact_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administracao_contact_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administracao_contact_id_seq OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 35115)
-- Name: administracao_contact; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administracao_contact (
    id integer DEFAULT nextval('public.administracao_contact_id_seq'::regclass) NOT NULL,
    name character varying(500) NOT NULL,
    email character varying(254) NOT NULL,
    message text,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    user_id integer DEFAULT 1
);


ALTER TABLE public.administracao_contact OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 35124)
-- Name: administracao_texto_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administracao_texto_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administracao_texto_id_seq OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 35126)
-- Name: administracao_textohome; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administracao_textohome (
    id integer DEFAULT nextval('public.administracao_texto_id_seq'::regclass) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    titulo character varying(500) NOT NULL,
    texto text NOT NULL,
    user_id integer,
    identificador character varying(500)
);


ALTER TABLE public.administracao_textohome OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 35133)
-- Name: administracao_textotutorial; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.administracao_textotutorial (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    titulo character varying(500) NOT NULL,
    texto text NOT NULL,
    user_id integer
);


ALTER TABLE public.administracao_textotutorial OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 35139)
-- Name: administracao_textotutorial_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.administracao_textotutorial_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.administracao_textotutorial_id_seq OWNER TO postgres;

--
-- TOC entry 4897 (class 0 OID 0)
-- Dependencies: 222
-- Name: administracao_textotutorial_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.administracao_textotutorial_id_seq OWNED BY public.administracao_textotutorial.id;


--
-- TOC entry 223 (class 1259 OID 35141)
-- Name: auth_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(80) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 35144)
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
-- TOC entry 4898 (class 0 OID 0)
-- Dependencies: 224
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- TOC entry 225 (class 1259 OID 35146)
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_group_permissions (
    id integer NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 35149)
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
-- TOC entry 4899 (class 0 OID 0)
-- Dependencies: 226
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- TOC entry 227 (class 1259 OID 35151)
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
-- TOC entry 228 (class 1259 OID 35154)
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
-- TOC entry 4900 (class 0 OID 0)
-- Dependencies: 228
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- TOC entry 212 (class 1259 OID 34384)
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
-- TOC entry 229 (class 1259 OID 35156)
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_groups (
    id integer NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 35159)
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
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 230
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- TOC entry 231 (class 1259 OID 35161)
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
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 231
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- TOC entry 232 (class 1259 OID 35163)
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auth_user_user_permissions (
    id integer NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 35166)
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
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 233
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- TOC entry 234 (class 1259 OID 35168)
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.authtoken_token (
    key character varying(40) NOT NULL,
    created timestamp with time zone NOT NULL,
    user_id integer NOT NULL
);


ALTER TABLE public.authtoken_token OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 35171)
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
-- TOC entry 236 (class 1259 OID 35178)
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
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 236
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- TOC entry 237 (class 1259 OID 35180)
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO postgres;

--
-- TOC entry 238 (class 1259 OID 35183)
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
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 238
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- TOC entry 239 (class 1259 OID 35185)
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
-- TOC entry 240 (class 1259 OID 35191)
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
-- TOC entry 4906 (class 0 OID 0)
-- Dependencies: 240
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- TOC entry 241 (class 1259 OID 35193)
-- Name: django_session; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO postgres;

--
-- TOC entry 242 (class 1259 OID 35199)
-- Name: especie_imagemespecie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especie_imagemespecie (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    autor character varying(200),
    imagem character varying(100) NOT NULL,
    especie_id integer NOT NULL,
    user_id integer,
    oficial boolean NOT NULL,
    publico boolean NOT NULL
);


ALTER TABLE public.especie_imagemespecie OWNER TO postgres;

--
-- TOC entry 243 (class 1259 OID 35202)
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
-- TOC entry 4907 (class 0 OID 0)
-- Dependencies: 243
-- Name: especie_imagemespecie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_imagemespecie_id_seq OWNED BY public.especie_imagemespecie.id;


--
-- TOC entry 244 (class 1259 OID 35204)
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
    user_id integer,
    oficial boolean NOT NULL,
    publico boolean NOT NULL
);


ALTER TABLE public.especie_ocorrencia OWNER TO postgres;

--
-- TOC entry 245 (class 1259 OID 35211)
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
-- TOC entry 4908 (class 0 OID 0)
-- Dependencies: 245
-- Name: especie_ocorrencia_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_ocorrencia_id_seq OWNED BY public.especie_ocorrencia.id;


--
-- TOC entry 246 (class 1259 OID 35213)
-- Name: especie_tipoespecie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.especie_tipoespecie (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome_cientifico character varying(200) NOT NULL,
    nome character varying(200) NOT NULL,
    descricao text,
    user_id integer,
    categoria character varying(12) NOT NULL,
    link character varying(3000),
    oficial boolean NOT NULL,
    publico boolean NOT NULL,
    cor character varying(7)
);


ALTER TABLE public.especie_tipoespecie OWNER TO postgres;

--
-- TOC entry 247 (class 1259 OID 35219)
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
-- TOC entry 4909 (class 0 OID 0)
-- Dependencies: 247
-- Name: especie_tipoespecie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.especie_tipoespecie_id_seq OWNED BY public.especie_tipoespecie.id;


--
-- TOC entry 248 (class 1259 OID 35221)
-- Name: iso_metadata; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iso_metadata (
    id integer NOT NULL,
    md_scope character varying(64),
    metadata xml,
    fileid xml,
    parentid xml,
    geometry public.geometry
);


ALTER TABLE public.iso_metadata OWNER TO postgres;

--
-- TOC entry 249 (class 1259 OID 35227)
-- Name: iso_metadata_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.iso_metadata_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.iso_metadata_id_seq OWNER TO postgres;

--
-- TOC entry 4910 (class 0 OID 0)
-- Dependencies: 249
-- Name: iso_metadata_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.iso_metadata_id_seq OWNED BY public.iso_metadata.id;


--
-- TOC entry 250 (class 1259 OID 35229)
-- Name: iso_metadata_reference; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.iso_metadata_reference (
    reference_scope character varying(64),
    table_name character varying(256),
    column_name character varying(256),
    row_id_value integer,
    "timestamp" timestamp without time zone DEFAULT statement_timestamp(),
    md_file_id integer DEFAULT 0,
    md_parent_id integer DEFAULT 0
);


ALTER TABLE public.iso_metadata_reference OWNER TO postgres;

--
-- TOC entry 251 (class 1259 OID 35238)
-- Name: linha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.linha (
    id integer NOT NULL,
    geom public.geometry(MultiLineString,4674),
    ben_id integer
);


ALTER TABLE public.linha OWNER TO postgres;

--
-- TOC entry 252 (class 1259 OID 35244)
-- Name: parque_atrativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_atrativo (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    descricao text,
    limitacao text,
    geom public.geometry(Geometry,4674) NOT NULL,
    parque_id integer,
    tipo_atrativo_id integer NOT NULL,
    user_id integer DEFAULT 1
);


ALTER TABLE public.parque_atrativo OWNER TO postgres;

--
-- TOC entry 253 (class 1259 OID 35252)
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
-- TOC entry 4911 (class 0 OID 0)
-- Dependencies: 253
-- Name: parque_atrativo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_atrativo_id_seq OWNED BY public.parque_atrativo.id;


--
-- TOC entry 254 (class 1259 OID 35254)
-- Name: parque_benfeitoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_benfeitoria (
    id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    descricao text,
    geom public.geometry(Geometry,4674) NOT NULL,
    parque_id integer,
    tipo_benfeitoria_id integer NOT NULL,
    user_id integer DEFAULT 1
);


ALTER TABLE public.parque_benfeitoria OWNER TO postgres;

--
-- TOC entry 255 (class 1259 OID 35262)
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
-- TOC entry 4912 (class 0 OID 0)
-- Dependencies: 255
-- Name: parque_benfeitoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_benfeitoria_id_seq OWNED BY public.parque_benfeitoria.id;


--
-- TOC entry 256 (class 1259 OID 35264)
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
-- TOC entry 257 (class 1259 OID 35270)
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
-- TOC entry 4913 (class 0 OID 0)
-- Dependencies: 257
-- Name: parque_contatoparque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_contatoparque_id_seq OWNED BY public.parque_contatoparque.id;


--
-- TOC entry 258 (class 1259 OID 35272)
-- Name: parque_imagemparque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_imagemparque (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    autor character varying(200),
    imagem character varying(100) NOT NULL,
    parque_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.parque_imagemparque OWNER TO postgres;

--
-- TOC entry 259 (class 1259 OID 35275)
-- Name: parque_imagemparque_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_imagemparque_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_imagemparque_id_seq OWNER TO postgres;

--
-- TOC entry 4914 (class 0 OID 0)
-- Dependencies: 259
-- Name: parque_imagemparque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_imagemparque_id_seq OWNED BY public.parque_imagemparque.id;


--
-- TOC entry 260 (class 1259 OID 35277)
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
-- TOC entry 261 (class 1259 OID 35283)
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
-- TOC entry 4915 (class 0 OID 0)
-- Dependencies: 261
-- Name: parque_parque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_parque_id_seq OWNED BY public.parque_parque.id;


--
-- TOC entry 262 (class 1259 OID 35285)
-- Name: parque_tipoatrativo; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_tipoatrativo (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    icone character varying(100) NOT NULL,
    user_id integer,
    tipo_geom character varying(1) NOT NULL
);


ALTER TABLE public.parque_tipoatrativo OWNER TO postgres;

--
-- TOC entry 263 (class 1259 OID 35288)
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
-- TOC entry 4916 (class 0 OID 0)
-- Dependencies: 263
-- Name: parque_tipoatrativo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_tipoatrativo_id_seq OWNED BY public.parque_tipoatrativo.id;


--
-- TOC entry 214 (class 1259 OID 34650)
-- Name: parque_tipobenfeitoria; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_tipobenfeitoria (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    icone character varying(100) NOT NULL,
    user_id integer,
    tipo_geom character varying(1) NOT NULL
);


ALTER TABLE public.parque_tipobenfeitoria OWNER TO postgres;

--
-- TOC entry 264 (class 1259 OID 35290)
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
-- TOC entry 4917 (class 0 OID 0)
-- Dependencies: 264
-- Name: parque_tipobeinfeitoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_tipobeinfeitoria_id_seq OWNED BY public.parque_tipobenfeitoria.id;


--
-- TOC entry 213 (class 1259 OID 34648)
-- Name: parque_tipobenfeitoria_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_tipobenfeitoria_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_tipobenfeitoria_id_seq OWNER TO postgres;

--
-- TOC entry 4918 (class 0 OID 0)
-- Dependencies: 213
-- Name: parque_tipobenfeitoria_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_tipobenfeitoria_id_seq OWNED BY public.parque_tipobenfeitoria.id;


--
-- TOC entry 265 (class 1259 OID 35292)
-- Name: parque_videoyoutubeparque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_videoyoutubeparque (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(250),
    autor character varying(250),
    url character varying(200),
    parque_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.parque_videoyoutubeparque OWNER TO postgres;

--
-- TOC entry 266 (class 1259 OID 35298)
-- Name: parque_videoyoutube_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.parque_videoyoutube_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.parque_videoyoutube_id_seq OWNER TO postgres;

--
-- TOC entry 4919 (class 0 OID 0)
-- Dependencies: 266
-- Name: parque_videoyoutube_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_videoyoutube_id_seq OWNED BY public.parque_videoyoutubeparque.id;


--
-- TOC entry 267 (class 1259 OID 35300)
-- Name: parque_visitanteparque; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.parque_visitanteparque (
    id integer NOT NULL,
    parque_id integer NOT NULL,
    visitante_id integer,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    user_id integer,
    oficial boolean NOT NULL,
    publico boolean NOT NULL
);


ALTER TABLE public.parque_visitanteparque OWNER TO postgres;

--
-- TOC entry 268 (class 1259 OID 35303)
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
-- TOC entry 4920 (class 0 OID 0)
-- Dependencies: 268
-- Name: parque_visitanteparque_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parque_visitanteparque_id_seq OWNED BY public.parque_visitanteparque.id;


--
-- TOC entry 269 (class 1259 OID 35305)
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
-- TOC entry 270 (class 1259 OID 35311)
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
-- TOC entry 4921 (class 0 OID 0)
-- Dependencies: 270
-- Name: parques_distritais_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.parques_distritais_id_seq OWNED BY public.parques_distritais.id;


--
-- TOC entry 271 (class 1259 OID 35313)
-- Name: ponto; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ponto (
    id integer NOT NULL,
    geom public.geometry(MultiPoint,4674),
    ben_id integer
);


ALTER TABLE public.ponto OWNER TO postgres;

--
-- TOC entry 272 (class 1259 OID 35319)
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
-- TOC entry 273 (class 1259 OID 35325)
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
-- TOC entry 274 (class 1259 OID 35329)
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
-- TOC entry 275 (class 1259 OID 35333)
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
-- TOC entry 276 (class 1259 OID 35338)
-- Name: trilha_trilha_parques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_trilha_parques (
    id integer NOT NULL,
    trilha_id integer NOT NULL,
    parque_id integer NOT NULL
);


ALTER TABLE public.trilha_trilha_parques OWNER TO postgres;

--
-- TOC entry 277 (class 1259 OID 35341)
-- Name: sumario_parque; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_parque AS
 SELECT json_agg(foo.result) AS json_agg
   FROM ( SELECT json_build_object('parque_id', parque_parque.id, 'area_km', (public.st_area(public.st_transform(parque_parque.geom, 31983)) / (1000000)::double precision), 'num_trilhas', f.num_trilha, 'num_avistamentos', fo.num_avistamento, 'benfeitorias', boo.benfeitorias, 'atrativos', ats.atrativos, 'num_visitas', vis.visitantes) AS result
           FROM (((((public.parque_parque
             LEFT JOIN ( SELECT trilha_trilha_parques.parque_id AS tid,
                    count(*) AS num_trilha
                   FROM public.trilha_trilha_parques
                  GROUP BY trilha_trilha_parques.parque_id) f ON ((f.tid = parque_parque.id)))
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
-- TOC entry 278 (class 1259 OID 35346)
-- Name: trilha_trilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_trilha (
    id integer NOT NULL,
    created_at timestamp with time zone,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    geom public.geometry(LineString,4674),
    descricao text,
    user_id integer,
    regiao_administrativa character varying(250),
    categoria character varying(2) NOT NULL,
    geom3d public.geometry(LineStringZ,4674),
    sinalizada boolean NOT NULL,
    oficial boolean NOT NULL,
    publico boolean NOT NULL
);


ALTER TABLE public.trilha_trilha OWNER TO postgres;

--
-- TOC entry 279 (class 1259 OID 35352)
-- Name: trilha_visitantetrilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_visitantetrilha (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    trilha_id integer NOT NULL,
    user_id integer,
    visitante_id integer,
    oficial boolean NOT NULL,
    publico boolean NOT NULL
);


ALTER TABLE public.trilha_visitantetrilha OWNER TO postgres;

--
-- TOC entry 280 (class 1259 OID 35355)
-- Name: sumario_trilha; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.sumario_trilha AS
 SELECT json_agg(f.el) AS json_agg
   FROM ( SELECT json_build_object('trilha_id', a.id, 'comprimento', round(((public.st_length(public.st_transform(a.geom, 31983)) / (1000)::double precision))::numeric, 2), 'num_visitantes', b.num_visitantes, 'num_avistamentos', c.num_avistamento) AS el
           FROM ((public.trilha_trilha a
             LEFT JOIN ( SELECT trilha_visitantetrilha.trilha_id,
                    count(*) AS num_visitantes
                   FROM public.trilha_visitantetrilha
                  GROUP BY trilha_visitantetrilha.trilha_id) b ON ((a.id = b.trilha_id)))
             LEFT JOIN ( SELECT foo_1.aid,
                    json_object_agg(foo_1.categoria, foo_1.count) AS num_avistamento
                   FROM ( SELECT especie_ocorrencia.trilha_id AS aid,
                            especie_tipoespecie.categoria,
                            COALESCE(count(especie_tipoespecie.categoria), (0)::bigint, count(especie_tipoespecie.categoria)) AS count
                           FROM public.especie_ocorrencia,
                            public.especie_tipoespecie
                          WHERE ((especie_ocorrencia.especie_id = especie_tipoespecie.id) AND (especie_ocorrencia.trilha_id IS NOT NULL))
                          GROUP BY especie_ocorrencia.trilha_id, especie_tipoespecie.categoria) foo_1
                  GROUP BY foo_1.aid) c ON ((a.id = c.aid)))
          ORDER BY a.id) f;


ALTER TABLE public.sumario_trilha OWNER TO postgres;

--
-- TOC entry 281 (class 1259 OID 35360)
-- Name: trilha_imagemtrilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_imagemtrilha (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    autor character varying(200),
    imagem character varying(100) NOT NULL,
    trilha_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.trilha_imagemtrilha OWNER TO postgres;

--
-- TOC entry 282 (class 1259 OID 35363)
-- Name: trilha_imagemtrilha_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_imagemtrilha_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_imagemtrilha_id_seq OWNER TO postgres;

--
-- TOC entry 4922 (class 0 OID 0)
-- Dependencies: 282
-- Name: trilha_imagemtrilha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_imagemtrilha_id_seq OWNED BY public.trilha_imagemtrilha.id;


--
-- TOC entry 283 (class 1259 OID 35365)
-- Name: trilha_tipoatividade; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_tipoatividade (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    icone character varying(100) NOT NULL,
    user_id integer
);


ALTER TABLE public.trilha_tipoatividade OWNER TO postgres;

--
-- TOC entry 284 (class 1259 OID 35368)
-- Name: trilha_tipoatividade_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_tipoatividade_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_tipoatividade_id_seq OWNER TO postgres;

--
-- TOC entry 4923 (class 0 OID 0)
-- Dependencies: 284
-- Name: trilha_tipoatividade_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_tipoatividade_id_seq OWNED BY public.trilha_tipoatividade.id;


--
-- TOC entry 285 (class 1259 OID 35370)
-- Name: trilha_trilha_3d; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_trilha_3d (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(100) NOT NULL,
    geom3d public.geometry(LineStringZ,4674),
    user_id integer
);


ALTER TABLE public.trilha_trilha_3d OWNER TO postgres;

--
-- TOC entry 286 (class 1259 OID 35376)
-- Name: trilha_trilha_3d_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_trilha_3d_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_trilha_3d_id_seq OWNER TO postgres;

--
-- TOC entry 4924 (class 0 OID 0)
-- Dependencies: 286
-- Name: trilha_trilha_3d_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_trilha_3d_id_seq OWNED BY public.trilha_trilha_3d.id;


--
-- TOC entry 287 (class 1259 OID 35378)
-- Name: trilha_trilha_atividades; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_trilha_atividades (
    id integer NOT NULL,
    trilha_id integer NOT NULL,
    tipoatividade_id integer NOT NULL
);


ALTER TABLE public.trilha_trilha_atividades OWNER TO postgres;

--
-- TOC entry 288 (class 1259 OID 35381)
-- Name: trilha_trilha_atividades_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_trilha_atividades_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_trilha_atividades_id_seq OWNER TO postgres;

--
-- TOC entry 4925 (class 0 OID 0)
-- Dependencies: 288
-- Name: trilha_trilha_atividades_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_trilha_atividades_id_seq OWNED BY public.trilha_trilha_atividades.id;


--
-- TOC entry 289 (class 1259 OID 35383)
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
-- TOC entry 4926 (class 0 OID 0)
-- Dependencies: 289
-- Name: trilha_trilha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_trilha_id_seq OWNED BY public.trilha_trilha.id;


--
-- TOC entry 290 (class 1259 OID 35385)
-- Name: trilha_trilha_parques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_trilha_parques_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_trilha_parques_id_seq OWNER TO postgres;

--
-- TOC entry 4927 (class 0 OID 0)
-- Dependencies: 290
-- Name: trilha_trilha_parques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_trilha_parques_id_seq OWNED BY public.trilha_trilha_parques.id;


--
-- TOC entry 291 (class 1259 OID 35387)
-- Name: trilha_videoyoutubetrilha; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trilha_videoyoutubetrilha (
    id integer NOT NULL,
    created_at timestamp with time zone NOT NULL,
    deleted_at timestamp with time zone,
    nome character varying(250),
    autor character varying(250),
    url character varying(200),
    trilha_id integer NOT NULL,
    user_id integer
);


ALTER TABLE public.trilha_videoyoutubetrilha OWNER TO postgres;

--
-- TOC entry 292 (class 1259 OID 35393)
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
-- TOC entry 4928 (class 0 OID 0)
-- Dependencies: 292
-- Name: trilha_visitantetrilha_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_visitantetrilha_id_seq OWNED BY public.trilha_visitantetrilha.id;


--
-- TOC entry 293 (class 1259 OID 35395)
-- Name: trilha_youtubevideo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trilha_youtubevideo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trilha_youtubevideo_id_seq OWNER TO postgres;

--
-- TOC entry 4929 (class 0 OID 0)
-- Dependencies: 293
-- Name: trilha_youtubevideo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trilha_youtubevideo_id_seq OWNED BY public.trilha_videoyoutubetrilha.id;


--
-- TOC entry 4479 (class 2604 OID 35397)
-- Name: administracao_comentario id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_comentario ALTER COLUMN id SET DEFAULT nextval('public.administracao_comentario_id_seq'::regclass);


--
-- TOC entry 4484 (class 2604 OID 35398)
-- Name: administracao_textotutorial id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_textotutorial ALTER COLUMN id SET DEFAULT nextval('public.administracao_textotutorial_id_seq'::regclass);


--
-- TOC entry 4485 (class 2604 OID 35399)
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- TOC entry 4486 (class 2604 OID 35400)
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- TOC entry 4487 (class 2604 OID 35401)
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- TOC entry 4477 (class 2604 OID 35402)
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- TOC entry 4488 (class 2604 OID 35403)
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- TOC entry 4489 (class 2604 OID 35404)
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- TOC entry 4490 (class 2604 OID 35405)
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- TOC entry 4492 (class 2604 OID 35406)
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- TOC entry 4493 (class 2604 OID 35407)
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- TOC entry 4494 (class 2604 OID 35408)
-- Name: especie_imagemespecie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie ALTER COLUMN id SET DEFAULT nextval('public.especie_imagemespecie_id_seq'::regclass);


--
-- TOC entry 4496 (class 2604 OID 35409)
-- Name: especie_ocorrencia id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia ALTER COLUMN id SET DEFAULT nextval('public.especie_ocorrencia_id_seq'::regclass);


--
-- TOC entry 4497 (class 2604 OID 35410)
-- Name: especie_tipoespecie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie ALTER COLUMN id SET DEFAULT nextval('public.especie_tipoespecie_id_seq'::regclass);


--
-- TOC entry 4498 (class 2604 OID 35411)
-- Name: iso_metadata id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iso_metadata ALTER COLUMN id SET DEFAULT nextval('public.iso_metadata_id_seq'::regclass);


--
-- TOC entry 4504 (class 2604 OID 35412)
-- Name: parque_atrativo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo ALTER COLUMN id SET DEFAULT nextval('public.parque_atrativo_id_seq'::regclass);


--
-- TOC entry 4507 (class 2604 OID 35413)
-- Name: parque_benfeitoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria ALTER COLUMN id SET DEFAULT nextval('public.parque_benfeitoria_id_seq'::regclass);


--
-- TOC entry 4508 (class 2604 OID 35414)
-- Name: parque_contatoparque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque ALTER COLUMN id SET DEFAULT nextval('public.parque_contatoparque_id_seq'::regclass);


--
-- TOC entry 4509 (class 2604 OID 35415)
-- Name: parque_imagemparque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_imagemparque ALTER COLUMN id SET DEFAULT nextval('public.parque_imagemparque_id_seq'::regclass);


--
-- TOC entry 4510 (class 2604 OID 35416)
-- Name: parque_parque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque ALTER COLUMN id SET DEFAULT nextval('public.parque_parque_id_seq'::regclass);


--
-- TOC entry 4511 (class 2604 OID 35417)
-- Name: parque_tipoatrativo id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo ALTER COLUMN id SET DEFAULT nextval('public.parque_tipoatrativo_id_seq'::regclass);


--
-- TOC entry 4478 (class 2604 OID 35418)
-- Name: parque_tipobenfeitoria id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria ALTER COLUMN id SET DEFAULT nextval('public.parque_tipobeinfeitoria_id_seq'::regclass);


--
-- TOC entry 4512 (class 2604 OID 35419)
-- Name: parque_videoyoutubeparque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_videoyoutubeparque ALTER COLUMN id SET DEFAULT nextval('public.parque_videoyoutube_id_seq'::regclass);


--
-- TOC entry 4513 (class 2604 OID 35420)
-- Name: parque_visitanteparque id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque ALTER COLUMN id SET DEFAULT nextval('public.parque_visitanteparque_id_seq'::regclass);


--
-- TOC entry 4514 (class 2604 OID 35421)
-- Name: parques_distritais id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parques_distritais ALTER COLUMN id SET DEFAULT nextval('public.parques_distritais_id_seq'::regclass);


--
-- TOC entry 4518 (class 2604 OID 35422)
-- Name: trilha_imagemtrilha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_imagemtrilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_imagemtrilha_id_seq'::regclass);


--
-- TOC entry 4519 (class 2604 OID 35423)
-- Name: trilha_tipoatividade id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_tipoatividade ALTER COLUMN id SET DEFAULT nextval('public.trilha_tipoatividade_id_seq'::regclass);


--
-- TOC entry 4516 (class 2604 OID 35424)
-- Name: trilha_trilha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_trilha_id_seq'::regclass);


--
-- TOC entry 4520 (class 2604 OID 35425)
-- Name: trilha_trilha_3d id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_3d ALTER COLUMN id SET DEFAULT nextval('public.trilha_trilha_3d_id_seq'::regclass);


--
-- TOC entry 4521 (class 2604 OID 35426)
-- Name: trilha_trilha_atividades id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_atividades ALTER COLUMN id SET DEFAULT nextval('public.trilha_trilha_atividades_id_seq'::regclass);


--
-- TOC entry 4515 (class 2604 OID 35427)
-- Name: trilha_trilha_parques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_parques ALTER COLUMN id SET DEFAULT nextval('public.trilha_trilha_parques_id_seq'::regclass);


--
-- TOC entry 4522 (class 2604 OID 35428)
-- Name: trilha_videoyoutubetrilha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_videoyoutubetrilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_youtubevideo_id_seq'::regclass);


--
-- TOC entry 4517 (class 2604 OID 35429)
-- Name: trilha_visitantetrilha id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha ALTER COLUMN id SET DEFAULT nextval('public.trilha_visitantetrilha_id_seq'::regclass);


--
-- TOC entry 4537 (class 2606 OID 35777)
-- Name: administracao_comentario administracao_comentario_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_comentario
    ADD CONSTRAINT administracao_comentario_pkey PRIMARY KEY (id);


--
-- TOC entry 4539 (class 2606 OID 35779)
-- Name: administracao_contact administracao_contact_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_contact
    ADD CONSTRAINT administracao_contact_pkey PRIMARY KEY (id);


--
-- TOC entry 4542 (class 2606 OID 35781)
-- Name: administracao_textohome administracao_texto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_textohome
    ADD CONSTRAINT administracao_texto_pkey PRIMARY KEY (id);


--
-- TOC entry 4545 (class 2606 OID 35783)
-- Name: administracao_textotutorial administracao_textotutorial_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_textotutorial
    ADD CONSTRAINT administracao_textotutorial_pkey PRIMARY KEY (id);


--
-- TOC entry 4548 (class 2606 OID 35785)
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- TOC entry 4554 (class 2606 OID 35787)
-- Name: auth_group_permissions auth_group_permissions_group_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- TOC entry 4556 (class 2606 OID 35789)
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4550 (class 2606 OID 35791)
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- TOC entry 4559 (class 2606 OID 35793)
-- Name: auth_permission auth_permission_content_type_id_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- TOC entry 4561 (class 2606 OID 35795)
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- TOC entry 4565 (class 2606 OID 35797)
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- TOC entry 4567 (class 2606 OID 35799)
-- Name: auth_user_groups auth_user_groups_user_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- TOC entry 4526 (class 2606 OID 34389)
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- TOC entry 4571 (class 2606 OID 35801)
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- TOC entry 4573 (class 2606 OID 35803)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- TOC entry 4529 (class 2606 OID 35805)
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- TOC entry 4576 (class 2606 OID 35807)
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_pkey PRIMARY KEY (key);


--
-- TOC entry 4578 (class 2606 OID 35809)
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_key UNIQUE (user_id);


--
-- TOC entry 4582 (class 2606 OID 35811)
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- TOC entry 4584 (class 2606 OID 35813)
-- Name: django_content_type django_content_type_app_label_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- TOC entry 4586 (class 2606 OID 35815)
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- TOC entry 4588 (class 2606 OID 35817)
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4591 (class 2606 OID 35819)
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- TOC entry 4596 (class 2606 OID 35821)
-- Name: especie_imagemespecie especie_imagemespecie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemespecie_pkey PRIMARY KEY (id);


--
-- TOC entry 4603 (class 2606 OID 35823)
-- Name: especie_ocorrencia especie_ocorrencia_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_pkey PRIMARY KEY (id);


--
-- TOC entry 4606 (class 2606 OID 35825)
-- Name: especie_tipoespecie especie_tipoespecie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie
    ADD CONSTRAINT especie_tipoespecie_pkey PRIMARY KEY (id);


--
-- TOC entry 4608 (class 2606 OID 35827)
-- Name: iso_metadata iso_metadata_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iso_metadata
    ADD CONSTRAINT iso_metadata_pkey PRIMARY KEY (id);


--
-- TOC entry 4610 (class 2606 OID 35829)
-- Name: linha linha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.linha
    ADD CONSTRAINT linha_pkey PRIMARY KEY (id);


--
-- TOC entry 4617 (class 2606 OID 35831)
-- Name: parque_atrativo parque_atrativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_pkey PRIMARY KEY (id);


--
-- TOC entry 4623 (class 2606 OID 35833)
-- Name: parque_benfeitoria parque_benfeitoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4626 (class 2606 OID 35835)
-- Name: parque_contatoparque parque_contatoparque_parque_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_parque_id_key UNIQUE (parque_id);


--
-- TOC entry 4628 (class 2606 OID 35837)
-- Name: parque_contatoparque parque_contatoparque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_pkey PRIMARY KEY (id);


--
-- TOC entry 4632 (class 2606 OID 35839)
-- Name: parque_imagemparque parque_imagemparque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_imagemparque
    ADD CONSTRAINT parque_imagemparque_pkey PRIMARY KEY (id);


--
-- TOC entry 4636 (class 2606 OID 35841)
-- Name: parque_parque parque_parque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque
    ADD CONSTRAINT parque_parque_pkey PRIMARY KEY (id);


--
-- TOC entry 4639 (class 2606 OID 35843)
-- Name: parque_tipoatrativo parque_tipoatrativo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo
    ADD CONSTRAINT parque_tipoatrativo_pkey PRIMARY KEY (id);


--
-- TOC entry 4533 (class 2606 OID 34655)
-- Name: parque_tipobenfeitoria parque_tipobenfeitoria_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria
    ADD CONSTRAINT parque_tipobenfeitoria_pkey PRIMARY KEY (id);


--
-- TOC entry 4643 (class 2606 OID 35845)
-- Name: parque_videoyoutubeparque parque_videoyoutube_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_videoyoutubeparque
    ADD CONSTRAINT parque_videoyoutube_pkey PRIMARY KEY (id);


--
-- TOC entry 4648 (class 2606 OID 35847)
-- Name: parque_visitanteparque parque_visitanteparque_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_pkey PRIMARY KEY (id);


--
-- TOC entry 4650 (class 2606 OID 35849)
-- Name: parques_distritais parques_distritais_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parques_distritais
    ADD CONSTRAINT parques_distritais_pkey PRIMARY KEY (id);


--
-- TOC entry 4653 (class 2606 OID 35851)
-- Name: ponto ponto_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ponto
    ADD CONSTRAINT ponto_pkey PRIMARY KEY (id);


--
-- TOC entry 4656 (class 2606 OID 35853)
-- Name: regiao_administrativa regiao_administrativa_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.regiao_administrativa
    ADD CONSTRAINT regiao_administrativa_pkey PRIMARY KEY (ra_num);


--
-- TOC entry 4676 (class 2606 OID 35855)
-- Name: trilha_imagemtrilha trilha_imagemtrilha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_imagemtrilha
    ADD CONSTRAINT trilha_imagemtrilha_pkey PRIMARY KEY (id);


--
-- TOC entry 4679 (class 2606 OID 35857)
-- Name: trilha_tipoatividade trilha_tipoatividade_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_tipoatividade
    ADD CONSTRAINT trilha_tipoatividade_pkey PRIMARY KEY (id);


--
-- TOC entry 4683 (class 2606 OID 35859)
-- Name: trilha_trilha_3d trilha_trilha_3d_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_3d
    ADD CONSTRAINT trilha_trilha_3d_pkey PRIMARY KEY (id);


--
-- TOC entry 4687 (class 2606 OID 35861)
-- Name: trilha_trilha_atividades trilha_trilha_atividades_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_atividades
    ADD CONSTRAINT trilha_trilha_atividades_pkey PRIMARY KEY (id);


--
-- TOC entry 4689 (class 2606 OID 35863)
-- Name: trilha_trilha_atividades trilha_trilha_atividades_trilha_id_ee8294f3_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_atividades
    ADD CONSTRAINT trilha_trilha_atividades_trilha_id_ee8294f3_uniq UNIQUE (trilha_id, tipoatividade_id);


--
-- TOC entry 4660 (class 2606 OID 35865)
-- Name: trilha_trilha_parques trilha_trilha_parques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_parques
    ADD CONSTRAINT trilha_trilha_parques_pkey PRIMARY KEY (id);


--
-- TOC entry 4662 (class 2606 OID 35867)
-- Name: trilha_trilha_parques trilha_trilha_parques_trilha_id_a350c3a6_uniq; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_parques
    ADD CONSTRAINT trilha_trilha_parques_trilha_id_a350c3a6_uniq UNIQUE (trilha_id, parque_id);


--
-- TOC entry 4667 (class 2606 OID 35869)
-- Name: trilha_trilha trilha_trilha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha
    ADD CONSTRAINT trilha_trilha_pkey PRIMARY KEY (id);


--
-- TOC entry 4672 (class 2606 OID 35871)
-- Name: trilha_visitantetrilha trilha_visitantetrilha_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_pkey PRIMARY KEY (id);


--
-- TOC entry 4693 (class 2606 OID 35873)
-- Name: trilha_videoyoutubetrilha trilha_youtubevideo_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_videoyoutubetrilha
    ADD CONSTRAINT trilha_youtubevideo_pkey PRIMARY KEY (id);


--
-- TOC entry 4534 (class 1259 OID 35874)
-- Name: administracao_comentario_e123f5bf; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX administracao_comentario_e123f5bf ON public.administracao_comentario USING btree (ref_comentario_id);


--
-- TOC entry 4535 (class 1259 OID 35875)
-- Name: administracao_comentario_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX administracao_comentario_e8701ad4 ON public.administracao_comentario USING btree (user_id);


--
-- TOC entry 4540 (class 1259 OID 35876)
-- Name: administracao_texto_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX administracao_texto_e8701ad4 ON public.administracao_textohome USING btree (user_id);


--
-- TOC entry 4543 (class 1259 OID 35877)
-- Name: administracao_textotutorial_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX administracao_textotutorial_e8701ad4 ON public.administracao_textotutorial USING btree (user_id);


--
-- TOC entry 4546 (class 1259 OID 35878)
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- TOC entry 4551 (class 1259 OID 35879)
-- Name: auth_group_permissions_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_0e939a4f ON public.auth_group_permissions USING btree (group_id);


--
-- TOC entry 4552 (class 1259 OID 35880)
-- Name: auth_group_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_group_permissions_8373b171 ON public.auth_group_permissions USING btree (permission_id);


--
-- TOC entry 4557 (class 1259 OID 35881)
-- Name: auth_permission_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_permission_417f1b1c ON public.auth_permission USING btree (content_type_id);


--
-- TOC entry 4562 (class 1259 OID 35882)
-- Name: auth_user_groups_0e939a4f; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_0e939a4f ON public.auth_user_groups USING btree (group_id);


--
-- TOC entry 4563 (class 1259 OID 35883)
-- Name: auth_user_groups_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_groups_e8701ad4 ON public.auth_user_groups USING btree (user_id);


--
-- TOC entry 4568 (class 1259 OID 35884)
-- Name: auth_user_user_permissions_8373b171; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_8373b171 ON public.auth_user_user_permissions USING btree (permission_id);


--
-- TOC entry 4569 (class 1259 OID 35885)
-- Name: auth_user_user_permissions_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_user_permissions_e8701ad4 ON public.auth_user_user_permissions USING btree (user_id);


--
-- TOC entry 4527 (class 1259 OID 35886)
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- TOC entry 4574 (class 1259 OID 35887)
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX authtoken_token_key_10f0b77e_like ON public.authtoken_token USING btree (key varchar_pattern_ops);


--
-- TOC entry 4579 (class 1259 OID 35888)
-- Name: django_admin_log_417f1b1c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_417f1b1c ON public.django_admin_log USING btree (content_type_id);


--
-- TOC entry 4580 (class 1259 OID 35889)
-- Name: django_admin_log_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_admin_log_e8701ad4 ON public.django_admin_log USING btree (user_id);


--
-- TOC entry 4589 (class 1259 OID 35890)
-- Name: django_session_de54fa62; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_de54fa62 ON public.django_session USING btree (expire_date);


--
-- TOC entry 4592 (class 1259 OID 35891)
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- TOC entry 4593 (class 1259 OID 35892)
-- Name: especie_imagemespecie_d8959b78; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_imagemespecie_d8959b78 ON public.especie_imagemespecie USING btree (especie_id);


--
-- TOC entry 4594 (class 1259 OID 35893)
-- Name: especie_imagemespecie_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_imagemespecie_e8701ad4 ON public.especie_imagemespecie USING btree (user_id);


--
-- TOC entry 4597 (class 1259 OID 35894)
-- Name: especie_ocorrencia_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_309a53b0 ON public.especie_ocorrencia USING btree (parque_id);


--
-- TOC entry 4598 (class 1259 OID 35895)
-- Name: especie_ocorrencia_d8959b78; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_d8959b78 ON public.especie_ocorrencia USING btree (especie_id);


--
-- TOC entry 4599 (class 1259 OID 35896)
-- Name: especie_ocorrencia_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_dc8aef26 ON public.especie_ocorrencia USING btree (trilha_id);


--
-- TOC entry 4600 (class 1259 OID 35897)
-- Name: especie_ocorrencia_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_e8701ad4 ON public.especie_ocorrencia USING btree (user_id);


--
-- TOC entry 4601 (class 1259 OID 35898)
-- Name: especie_ocorrencia_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_ocorrencia_geom_id ON public.especie_ocorrencia USING gist (geom);


--
-- TOC entry 4604 (class 1259 OID 35899)
-- Name: especie_tipoespecie_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX especie_tipoespecie_e8701ad4 ON public.especie_tipoespecie USING btree (user_id);


--
-- TOC entry 4612 (class 1259 OID 35900)
-- Name: parque_atrativo_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_309a53b0 ON public.parque_atrativo USING btree (parque_id);


--
-- TOC entry 4613 (class 1259 OID 35901)
-- Name: parque_atrativo_343eb1f8; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_343eb1f8 ON public.parque_atrativo USING btree (tipo_atrativo_id);


--
-- TOC entry 4614 (class 1259 OID 35902)
-- Name: parque_atrativo_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_e8701ad4 ON public.parque_atrativo USING btree (user_id);


--
-- TOC entry 4615 (class 1259 OID 35903)
-- Name: parque_atrativo_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_atrativo_geom_id ON public.parque_atrativo USING gist (geom);


--
-- TOC entry 4618 (class 1259 OID 35904)
-- Name: parque_benfeitoria_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_309a53b0 ON public.parque_benfeitoria USING btree (parque_id);


--
-- TOC entry 4619 (class 1259 OID 35905)
-- Name: parque_benfeitoria_5027413d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_5027413d ON public.parque_benfeitoria USING btree (tipo_benfeitoria_id);


--
-- TOC entry 4620 (class 1259 OID 35906)
-- Name: parque_benfeitoria_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_e8701ad4 ON public.parque_benfeitoria USING btree (user_id);


--
-- TOC entry 4621 (class 1259 OID 35907)
-- Name: parque_benfeitoria_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_benfeitoria_geom_id ON public.parque_benfeitoria USING gist (geom);


--
-- TOC entry 4624 (class 1259 OID 35908)
-- Name: parque_contatoparque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_contatoparque_e8701ad4 ON public.parque_contatoparque USING btree (user_id);


--
-- TOC entry 4629 (class 1259 OID 35909)
-- Name: parque_imagemparque_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_imagemparque_309a53b0 ON public.parque_imagemparque USING btree (parque_id);


--
-- TOC entry 4630 (class 1259 OID 35910)
-- Name: parque_imagemparque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_imagemparque_e8701ad4 ON public.parque_imagemparque USING btree (user_id);


--
-- TOC entry 4633 (class 1259 OID 35911)
-- Name: parque_parque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_parque_e8701ad4 ON public.parque_parque USING btree (user_id);


--
-- TOC entry 4634 (class 1259 OID 35912)
-- Name: parque_parque_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_parque_geom_id ON public.parque_parque USING gist (geom);


--
-- TOC entry 4637 (class 1259 OID 35913)
-- Name: parque_tipoatrativo_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_tipoatrativo_e8701ad4 ON public.parque_tipoatrativo USING btree (user_id);


--
-- TOC entry 4530 (class 1259 OID 35914)
-- Name: parque_tipobeinfeitoria_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_tipobeinfeitoria_e8701ad4 ON public.parque_tipobenfeitoria USING btree (user_id);


--
-- TOC entry 4531 (class 1259 OID 34694)
-- Name: parque_tipobenfeitoria_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_tipobenfeitoria_e8701ad4 ON public.parque_tipobenfeitoria USING btree (user_id);


--
-- TOC entry 4640 (class 1259 OID 35915)
-- Name: parque_videoyoutube_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_videoyoutube_309a53b0 ON public.parque_videoyoutubeparque USING btree (parque_id);


--
-- TOC entry 4641 (class 1259 OID 35916)
-- Name: parque_videoyoutube_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_videoyoutube_e8701ad4 ON public.parque_videoyoutubeparque USING btree (user_id);


--
-- TOC entry 4644 (class 1259 OID 35917)
-- Name: parque_visitanteparque_23c14f30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_23c14f30 ON public.parque_visitanteparque USING btree (visitante_id);


--
-- TOC entry 4645 (class 1259 OID 35918)
-- Name: parque_visitanteparque_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_309a53b0 ON public.parque_visitanteparque USING btree (parque_id);


--
-- TOC entry 4646 (class 1259 OID 35919)
-- Name: parque_visitanteparque_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX parque_visitanteparque_e8701ad4 ON public.parque_visitanteparque USING btree (user_id);


--
-- TOC entry 4611 (class 1259 OID 35920)
-- Name: sidx_linha_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_linha_geom ON public.linha USING gist (geom);


--
-- TOC entry 4651 (class 1259 OID 35921)
-- Name: sidx_parques_distritais_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_parques_distritais_geom ON public.parques_distritais USING gist (geom);


--
-- TOC entry 4654 (class 1259 OID 35922)
-- Name: sidx_ponto_geom; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX sidx_ponto_geom ON public.ponto USING gist (geom);


--
-- TOC entry 4673 (class 1259 OID 35923)
-- Name: trilha_imagemtrilha_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_imagemtrilha_dc8aef26 ON public.trilha_imagemtrilha USING btree (trilha_id);


--
-- TOC entry 4674 (class 1259 OID 35924)
-- Name: trilha_imagemtrilha_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_imagemtrilha_e8701ad4 ON public.trilha_imagemtrilha USING btree (user_id);


--
-- TOC entry 4677 (class 1259 OID 35925)
-- Name: trilha_tipoatividade_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_tipoatividade_e8701ad4 ON public.trilha_tipoatividade USING btree (user_id);


--
-- TOC entry 4680 (class 1259 OID 35926)
-- Name: trilha_trilha_3d_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_3d_e8701ad4 ON public.trilha_trilha_3d USING btree (user_id);


--
-- TOC entry 4681 (class 1259 OID 35927)
-- Name: trilha_trilha_3d_geom3d_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_3d_geom3d_id ON public.trilha_trilha_3d USING gist (geom3d public.gist_geometry_ops_nd);


--
-- TOC entry 4684 (class 1259 OID 35928)
-- Name: trilha_trilha_atividades_98ef26b6; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_atividades_98ef26b6 ON public.trilha_trilha_atividades USING btree (tipoatividade_id);


--
-- TOC entry 4685 (class 1259 OID 35929)
-- Name: trilha_trilha_atividades_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_atividades_dc8aef26 ON public.trilha_trilha_atividades USING btree (trilha_id);


--
-- TOC entry 4663 (class 1259 OID 35930)
-- Name: trilha_trilha_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_e8701ad4 ON public.trilha_trilha USING btree (user_id);


--
-- TOC entry 4664 (class 1259 OID 35931)
-- Name: trilha_trilha_geom3d_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_geom3d_id ON public.trilha_trilha USING gist (geom3d public.gist_geometry_ops_nd);


--
-- TOC entry 4665 (class 1259 OID 35932)
-- Name: trilha_trilha_geom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_geom_id ON public.trilha_trilha USING gist (geom);


--
-- TOC entry 4657 (class 1259 OID 35933)
-- Name: trilha_trilha_parques_309a53b0; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_parques_309a53b0 ON public.trilha_trilha_parques USING btree (parque_id);


--
-- TOC entry 4658 (class 1259 OID 35934)
-- Name: trilha_trilha_parques_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_trilha_parques_dc8aef26 ON public.trilha_trilha_parques USING btree (trilha_id);


--
-- TOC entry 4668 (class 1259 OID 35935)
-- Name: trilha_visitantetrilha_23c14f30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_23c14f30 ON public.trilha_visitantetrilha USING btree (visitante_id);


--
-- TOC entry 4669 (class 1259 OID 35936)
-- Name: trilha_visitantetrilha_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_dc8aef26 ON public.trilha_visitantetrilha USING btree (trilha_id);


--
-- TOC entry 4670 (class 1259 OID 35937)
-- Name: trilha_visitantetrilha_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_visitantetrilha_e8701ad4 ON public.trilha_visitantetrilha USING btree (user_id);


--
-- TOC entry 4690 (class 1259 OID 35938)
-- Name: trilha_youtubevideo_dc8aef26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_youtubevideo_dc8aef26 ON public.trilha_videoyoutubetrilha USING btree (trilha_id);


--
-- TOC entry 4691 (class 1259 OID 35939)
-- Name: trilha_youtubevideo_e8701ad4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX trilha_youtubevideo_e8701ad4 ON public.trilha_videoyoutubetrilha USING btree (user_id);


--
-- TOC entry 4753 (class 2620 OID 35940)
-- Name: parque_atrativo atrativo_in_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER atrativo_in_parque BEFORE INSERT OR UPDATE ON public.parque_atrativo FOR EACH ROW EXECUTE PROCEDURE public.obter_id_parque();


--
-- TOC entry 4754 (class 2620 OID 35941)
-- Name: parque_benfeitoria benfeitoria_in_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER benfeitoria_in_parque BEFORE INSERT OR UPDATE ON public.parque_benfeitoria FOR EACH ROW EXECUTE PROCEDURE public.obter_id_parque();


--
-- TOC entry 4755 (class 2620 OID 35942)
-- Name: parque_parque centroide_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER centroide_parque BEFORE INSERT OR UPDATE ON public.parque_parque FOR EACH ROW EXECUTE PROCEDURE public.create_centroid_parque();


--
-- TOC entry 4750 (class 2620 OID 35943)
-- Name: especie_ocorrencia ocorrencia_in_parque; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ocorrencia_in_parque BEFORE INSERT OR UPDATE ON public.especie_ocorrencia FOR EACH ROW EXECUTE PROCEDURE public.obter_id_parque();


--
-- TOC entry 4751 (class 2620 OID 35944)
-- Name: especie_ocorrencia ocorrencia_in_trilha; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER ocorrencia_in_trilha BEFORE INSERT OR UPDATE ON public.especie_ocorrencia FOR EACH ROW EXECUTE PROCEDURE public.obter_id_trilha();


--
-- TOC entry 4752 (class 2620 OID 35945)
-- Name: iso_metadata_reference update_imr_timestamp; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_imr_timestamp BEFORE UPDATE ON public.iso_metadata_reference FOR EACH ROW EXECUTE PROCEDURE public.update_imr_timestamp_column();


--
-- TOC entry 4696 (class 2606 OID 35946)
-- Name: administracao_comentario admin_ref_comentario_id_0a25ad8e_fk_administracao_comentario_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_comentario
    ADD CONSTRAINT admin_ref_comentario_id_0a25ad8e_fk_administracao_comentario_id FOREIGN KEY (ref_comentario_id) REFERENCES public.administracao_comentario(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4697 (class 2606 OID 35951)
-- Name: administracao_comentario administracao_comentario_user_id_cd3930d3_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_comentario
    ADD CONSTRAINT administracao_comentario_user_id_cd3930d3_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4698 (class 2606 OID 35956)
-- Name: administracao_textohome administracao_texto_user_id_8d064b34_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_textohome
    ADD CONSTRAINT administracao_texto_user_id_8d064b34_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4699 (class 2606 OID 35961)
-- Name: administracao_textotutorial administracao_textotutorial_user_id_1998c265_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.administracao_textotutorial
    ADD CONSTRAINT administracao_textotutorial_user_id_1998c265_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4700 (class 2606 OID 35966)
-- Name: auth_group_permissions auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permiss_permission_id_84c5c92e_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4701 (class 2606 OID 35971)
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4702 (class 2606 OID 35976)
-- Name: auth_permission auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permiss_content_type_id_2f476e4b_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4703 (class 2606 OID 35981)
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4704 (class 2606 OID 35986)
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4705 (class 2606 OID 35991)
-- Name: auth_user_user_permissions auth_user_user_per_permission_id_1fbb5f2c_fk_auth_permission_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_per_permission_id_1fbb5f2c_fk_auth_permission_id FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4706 (class 2606 OID 35996)
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4707 (class 2606 OID 36001)
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.authtoken_token
    ADD CONSTRAINT authtoken_token_user_id_35299eff_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4708 (class 2606 OID 36006)
-- Name: django_admin_log django_admin_content_type_id_c4bce8eb_fk_django_content_type_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_content_type_id_c4bce8eb_fk_django_content_type_id FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4709 (class 2606 OID 36011)
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4710 (class 2606 OID 36016)
-- Name: especie_imagemespecie especie_imagemesp_especie_id_f03fafe1_fk_especie_tipoespecie_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemesp_especie_id_f03fafe1_fk_especie_tipoespecie_id FOREIGN KEY (especie_id) REFERENCES public.especie_tipoespecie(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4711 (class 2606 OID 36021)
-- Name: especie_imagemespecie especie_imagemespecie_user_id_4d80ed95_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_imagemespecie
    ADD CONSTRAINT especie_imagemespecie_user_id_4d80ed95_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4712 (class 2606 OID 36026)
-- Name: especie_ocorrencia especie_ocorrenci_especie_id_eddfe7e9_fk_especie_tipoespecie_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrenci_especie_id_eddfe7e9_fk_especie_tipoespecie_id FOREIGN KEY (especie_id) REFERENCES public.especie_tipoespecie(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4713 (class 2606 OID 36031)
-- Name: especie_ocorrencia especie_ocorrencia_parque_id_ecd75cca_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_parque_id_ecd75cca_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4714 (class 2606 OID 36036)
-- Name: especie_ocorrencia especie_ocorrencia_trilha_id_8a60328b_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_trilha_id_8a60328b_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4715 (class 2606 OID 36041)
-- Name: especie_ocorrencia especie_ocorrencia_user_id_cf3e26e6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_ocorrencia
    ADD CONSTRAINT especie_ocorrencia_user_id_cf3e26e6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4716 (class 2606 OID 36046)
-- Name: especie_tipoespecie especie_tipoespecie_user_id_36c91987_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.especie_tipoespecie
    ADD CONSTRAINT especie_tipoespecie_user_id_36c91987_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4717 (class 2606 OID 36051)
-- Name: iso_metadata_reference iso_metadata_reference_md_file_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iso_metadata_reference
    ADD CONSTRAINT iso_metadata_reference_md_file_id_fkey FOREIGN KEY (md_file_id) REFERENCES public.iso_metadata(id);


--
-- TOC entry 4718 (class 2606 OID 36056)
-- Name: iso_metadata_reference iso_metadata_reference_md_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.iso_metadata_reference
    ADD CONSTRAINT iso_metadata_reference_md_parent_id_fkey FOREIGN KEY (md_parent_id) REFERENCES public.iso_metadata(id);


--
-- TOC entry 4722 (class 2606 OID 36061)
-- Name: parque_benfeitoria parq_tipo_benfeitoria_id_22213c4c_fk_parque_tipobeinfeitoria_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parq_tipo_benfeitoria_id_22213c4c_fk_parque_tipobeinfeitoria_id FOREIGN KEY (tipo_benfeitoria_id) REFERENCES public.parque_tipobenfeitoria(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4719 (class 2606 OID 36066)
-- Name: parque_atrativo parque_atra_tipo_atrativo_id_3eaf82f7_fk_parque_tipoatrativo_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atra_tipo_atrativo_id_3eaf82f7_fk_parque_tipoatrativo_id FOREIGN KEY (tipo_atrativo_id) REFERENCES public.parque_tipoatrativo(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4720 (class 2606 OID 36071)
-- Name: parque_atrativo parque_atrativo_parque_id_a748e4d9_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_parque_id_a748e4d9_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4721 (class 2606 OID 36076)
-- Name: parque_atrativo parque_atrativo_user_id_b143fb98_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_atrativo
    ADD CONSTRAINT parque_atrativo_user_id_b143fb98_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4723 (class 2606 OID 36081)
-- Name: parque_benfeitoria parque_benfeitoria_parque_id_c3f57df9_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_parque_id_c3f57df9_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4724 (class 2606 OID 36086)
-- Name: parque_benfeitoria parque_benfeitoria_user_id_9c659a6c_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_benfeitoria
    ADD CONSTRAINT parque_benfeitoria_user_id_9c659a6c_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4725 (class 2606 OID 36091)
-- Name: parque_contatoparque parque_contatoparque_parque_id_537a3ee6_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_parque_id_537a3ee6_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4726 (class 2606 OID 36096)
-- Name: parque_contatoparque parque_contatoparque_user_id_78c9593f_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_contatoparque
    ADD CONSTRAINT parque_contatoparque_user_id_78c9593f_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4727 (class 2606 OID 36101)
-- Name: parque_imagemparque parque_imagemparque_parque_id_9a3cc106_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_imagemparque
    ADD CONSTRAINT parque_imagemparque_parque_id_9a3cc106_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4728 (class 2606 OID 36106)
-- Name: parque_imagemparque parque_imagemparque_user_id_d4fc8caf_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_imagemparque
    ADD CONSTRAINT parque_imagemparque_user_id_d4fc8caf_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4729 (class 2606 OID 36111)
-- Name: parque_parque parque_parque_user_id_0508bda6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_parque
    ADD CONSTRAINT parque_parque_user_id_0508bda6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4730 (class 2606 OID 36116)
-- Name: parque_tipoatrativo parque_tipoatrativo_user_id_f8eeba67_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipoatrativo
    ADD CONSTRAINT parque_tipoatrativo_user_id_f8eeba67_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4695 (class 2606 OID 36121)
-- Name: parque_tipobenfeitoria parque_tipobeinfeitoria_user_id_2bcce3fa_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria
    ADD CONSTRAINT parque_tipobeinfeitoria_user_id_2bcce3fa_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4694 (class 2606 OID 34689)
-- Name: parque_tipobenfeitoria parque_tipobenfeitoria_user_id_37291a81_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_tipobenfeitoria
    ADD CONSTRAINT parque_tipobenfeitoria_user_id_37291a81_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4731 (class 2606 OID 36126)
-- Name: parque_videoyoutubeparque parque_videoyoutube_parque_id_8cd2a19c_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_videoyoutubeparque
    ADD CONSTRAINT parque_videoyoutube_parque_id_8cd2a19c_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4732 (class 2606 OID 36131)
-- Name: parque_videoyoutubeparque parque_videoyoutube_user_id_752529a3_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_videoyoutubeparque
    ADD CONSTRAINT parque_videoyoutube_user_id_752529a3_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4733 (class 2606 OID 36136)
-- Name: parque_visitanteparque parque_visitanteparque_parque_id_2efb91df_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_parque_id_2efb91df_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4734 (class 2606 OID 36141)
-- Name: parque_visitanteparque parque_visitanteparque_user_id_3362bb52_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_user_id_3362bb52_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4735 (class 2606 OID 36146)
-- Name: parque_visitanteparque parque_visitanteparque_visitante_id_2a7f5e5d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.parque_visitanteparque
    ADD CONSTRAINT parque_visitanteparque_visitante_id_2a7f5e5d_fk_auth_user_id FOREIGN KEY (visitante_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4742 (class 2606 OID 36151)
-- Name: trilha_imagemtrilha trilha_imagemtrilha_trilha_id_d988427c_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_imagemtrilha
    ADD CONSTRAINT trilha_imagemtrilha_trilha_id_d988427c_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4743 (class 2606 OID 36156)
-- Name: trilha_imagemtrilha trilha_imagemtrilha_user_id_67ace6f1_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_imagemtrilha
    ADD CONSTRAINT trilha_imagemtrilha_user_id_67ace6f1_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4744 (class 2606 OID 36161)
-- Name: trilha_tipoatividade trilha_tipoatividade_user_id_724b4492_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_tipoatividade
    ADD CONSTRAINT trilha_tipoatividade_user_id_724b4492_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4746 (class 2606 OID 36166)
-- Name: trilha_trilha_atividades trilha_tri_tipoatividade_id_707957fc_fk_trilha_tipoatividade_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_atividades
    ADD CONSTRAINT trilha_tri_tipoatividade_id_707957fc_fk_trilha_tipoatividade_id FOREIGN KEY (tipoatividade_id) REFERENCES public.trilha_tipoatividade(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4745 (class 2606 OID 36171)
-- Name: trilha_trilha_3d trilha_trilha_3d_user_id_3db3d135_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_3d
    ADD CONSTRAINT trilha_trilha_3d_user_id_3db3d135_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4747 (class 2606 OID 36176)
-- Name: trilha_trilha_atividades trilha_trilha_atividades_trilha_id_ba7b55fd_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_atividades
    ADD CONSTRAINT trilha_trilha_atividades_trilha_id_ba7b55fd_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4736 (class 2606 OID 36181)
-- Name: trilha_trilha_parques trilha_trilha_parques_parque_id_b0fa9184_fk_parque_parque_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_parques
    ADD CONSTRAINT trilha_trilha_parques_parque_id_b0fa9184_fk_parque_parque_id FOREIGN KEY (parque_id) REFERENCES public.parque_parque(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4737 (class 2606 OID 36186)
-- Name: trilha_trilha_parques trilha_trilha_parques_trilha_id_fa9dda26_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha_parques
    ADD CONSTRAINT trilha_trilha_parques_trilha_id_fa9dda26_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4738 (class 2606 OID 36191)
-- Name: trilha_trilha trilha_trilha_user_id_e1c8ac1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_trilha
    ADD CONSTRAINT trilha_trilha_user_id_e1c8ac1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4739 (class 2606 OID 36196)
-- Name: trilha_visitantetrilha trilha_visitantetrilha_trilha_id_95a169b2_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_trilha_id_95a169b2_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4740 (class 2606 OID 36201)
-- Name: trilha_visitantetrilha trilha_visitantetrilha_user_id_3d2a727d_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_user_id_3d2a727d_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4741 (class 2606 OID 36206)
-- Name: trilha_visitantetrilha trilha_visitantetrilha_visitante_id_d488329b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_visitantetrilha
    ADD CONSTRAINT trilha_visitantetrilha_visitante_id_d488329b_fk_auth_user_id FOREIGN KEY (visitante_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4748 (class 2606 OID 36211)
-- Name: trilha_videoyoutubetrilha trilha_youtubevideo_trilha_id_15a11cc8_fk_trilha_trilha_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_videoyoutubetrilha
    ADD CONSTRAINT trilha_youtubevideo_trilha_id_15a11cc8_fk_trilha_trilha_id FOREIGN KEY (trilha_id) REFERENCES public.trilha_trilha(id) DEFERRABLE INITIALLY DEFERRED;


--
-- TOC entry 4749 (class 2606 OID 36216)
-- Name: trilha_videoyoutubetrilha trilha_youtubevideo_user_id_32893134_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trilha_videoyoutubetrilha
    ADD CONSTRAINT trilha_youtubevideo_user_id_32893134_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


-- Completed on 2021-03-16 17:04:29 -03

--
-- PostgreSQL database dump complete
--

